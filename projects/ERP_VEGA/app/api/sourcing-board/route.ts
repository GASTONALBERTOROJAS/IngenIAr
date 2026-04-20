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

    if (!project_id) {
      return NextResponse.json({ error: 'project_id is required' }, { status: 400 });
    }

    const sourcingBoards = await prisma.sourcingBoard.findMany({
      where: { project_id },
      include: {
        approver: { select: { name: true } },
        project: { select: { project_code: true, project_name: true, is_locked: true } },
        tasks: true,
      },
      orderBy: { version: 'desc' },
    });

    return NextResponse.json(sourcingBoards);
  } catch (error) {
    console.error('GET /api/sourcing-board error:', error);
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
    if (!['admin', 'conversion', 'direction'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    const project = await prisma.project.findUnique({
      where: { project_id: body.project_id },
      include: {
        tower_groups: {
          include: {
            steel_costs: true,
            flanges_costs: true,
            internals_costs: true,
            makers: { include: { supplier: true } },
          },
        },
        logistics_cost: true,
        direct_costs: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const lastBoard = await prisma.sourcingBoard.findFirst({
      where: { project_id: body.project_id },
      orderBy: { version: 'desc' },
    });

    const newVersion = body.outcome === 'rejected' ? (lastBoard?.version || 0) + 1 : lastBoard?.version || 1;

    const snapshot = {
      project_id: project.project_id,
      project_code: project.project_code,
      project_name: project.project_name,
      tower_groups: project.tower_groups,
      logistics_cost: project.logistics_cost,
      direct_costs: project.direct_costs,
      captured_at: new Date().toISOString(),
    };

    const sourcingBoard = await prisma.sourcingBoard.create({
      data: {
        project_id: body.project_id,
        version: newVersion,
        outcome: body.outcome || null,
        conditions_text: body.conditions_text,
        general_comments: body.general_comments,
        approved_by: body.outcome === 'approved' || body.outcome === 'conditionally_approved' ? session.user.id : null,
        snapshot_json: snapshot,
      },
      include: {
        approver: { select: { name: true } },
        project: { select: { project_code: true, project_name: true } },
      },
    });

    if (body.outcome === 'approved') {
      await prisma.project.update({
        where: { project_id: body.project_id },
        data: {
          is_locked: true,
          status: 'approved',
          approved_by: session.user.id,
          approved_at: new Date(),
        },
      });
    } else if (body.outcome === 'conditionally_approved') {
      await prisma.project.update({
        where: { project_id: body.project_id },
        data: { status: 'cond_approved' },
      });
    }

    return NextResponse.json(sourcingBoard, { status: 201 });
  } catch (error) {
    console.error('POST /api/sourcing-board error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}