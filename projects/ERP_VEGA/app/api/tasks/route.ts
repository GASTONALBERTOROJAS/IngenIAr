import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const project_id = searchParams.get('project_id');
    const assigned_to = searchParams.get('assigned_to');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (project_id) where.project_id = project_id;
    if (assigned_to) where.assigned_to = assigned_to;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { project_code: true, project_name: true } },
        assignee: { select: { name: true, email: true } },
        creator: { select: { name: true } },
        sourcing_board: { select: { sb_id: true, version: true } },
      },
      orderBy: { due_date: 'asc' },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('GET /api/tasks error:', error);
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

    const task = await prisma.task.create({
      data: {
        project_id: body.project_id,
        sb_id: body.sb_id || null,
        assigned_to: body.assigned_to,
        created_by: session.user.id,
        description: body.description,
        due_date: new Date(body.due_date),
        status: 'pending',
      },
      include: {
        project: { select: { project_code: true, project_name: true } },
        assignee: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}