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

    const projects = await prisma.project.findMany({
      where: project_id ? { project_id } : undefined,
      include: {
        tower_groups: {
          include: {
            tower_model: true,
            steel_costs: true,
            flanges_costs: true,
            internals_costs: true,
          },
        },
        logistics_cost: true,
        direct_costs: true,
        sourcing_boards: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const reports = projects.map((project) => {
      const totalSteelCost = project.tower_groups.reduce(
        (sum, group) =>
          sum +
          group.steel_costs.reduce((s, c) => s + Number(c.total_cost), 0),
        0
      );

      const totalFlangesCost = project.tower_groups.reduce(
        (sum, group) =>
          sum +
          group.flanges_costs.reduce((s, c) => s + Number(c.total_cost), 0),
        0
      );

      const totalInternalsCost = project.tower_groups.reduce(
        (sum, group) =>
          sum +
          group.internals_costs.reduce((s, c) => s + Number(c.total_cost), 0),
        0
      );

      const logisticsCost = project.logistics_cost
        ? Number(project.logistics_cost.project_total)
        : 0;

      const directCosts = project.direct_costs.reduce(
        (sum, c) => sum + Number(c.total_cost),
        0
      );

      return {
        project_id: project.project_id,
        project_code: project.project_code,
        project_name: project.project_name,
        status: project.status,
        steel_cost: totalSteelCost,
        flanges_cost: totalFlangesCost,
        internals_cost: totalInternalsCost,
        logistics_cost: logisticsCost,
        direct_costs: directCosts,
        total_cost:
          totalSteelCost +
          totalFlangesCost +
          totalInternalsCost +
          logisticsCost +
          directCosts,
      };
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('GET /api/reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}