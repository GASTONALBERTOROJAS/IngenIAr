import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createProjectSchema = z.object({
  project_code: z.string().min(1),
  project_name: z.string().min(1),
  project_country: z.string().min(1),
  exchange_rate: z.number().positive().optional(),
  created_by: z.string().uuid(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const project_country = searchParams.get('project_country');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (project_country) where.project_country = project_country;

    const projects = await prisma.project.findMany({
      where,
      include: {
        creator: { select: { name: true, email: true } },
        approver: { select: { name: true } },
        tower_groups: {
          include: {
            tower_model: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const existingProject = await prisma.project.findUnique({
      where: { project_code: validatedData.project_code },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'Project code already exists' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: validatedData,
      include: {
        creator: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}