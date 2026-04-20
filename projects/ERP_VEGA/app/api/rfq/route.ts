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
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (project_id) where.project_id = project_id;
    if (status) where.status = status;

    const rfqs = await prisma.rfqRequest.findMany({
      where,
      include: {
        project: { select: { project_code: true, project_name: true } },
        supplier: { select: { name: true, contact_email: true } },
      },
      orderBy: { sent_at: 'desc' },
    });

    return NextResponse.json(rfqs);
  } catch (error) {
    console.error('GET /api/rfq error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRole = session.user.role;
    if (!['admin', 'conversion'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const rfq = await prisma.rfqRequest.create({
      data: {
        project_id: body.project_id,
        supplier_id: body.supplier_id,
        deadline: new Date(body.deadline),
        status: 'sent',
        notes: body.notes,
      },
      include: {
        project: { select: { project_code: true, project_name: true } },
        supplier: { select: { name: true, contact_email: true } },
      },
    });

    return NextResponse.json(rfq, { status: 201 });
  } catch (error) {
    console.error('POST /api/rfq error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}