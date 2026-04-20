import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [projectGroups, steelContracts, flangesContracts] = await Promise.all([
      // Projects grouped by status
      prisma.project.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      // Active steel contracts
      prisma.contract.findMany({
        where: { category: 'steel', status: 'active', is_active: true },
        select: { total_tons: true, consumed_tons: true },
      }),
      // Active flanges contracts
      prisma.contract.findMany({
        where: { category: 'flanges', status: 'active', is_active: true },
        select: { total_tons: true, consumed_tons: true },
      }),
    ]);

    const projectsByStatus = projectGroups.reduce<Record<string, number>>(
      (acc, g) => {
        acc[g.status] = g._count.status;
        return acc;
      },
      {}
    );

    const steelAvailable = steelContracts.reduce(
      (sum, c) => sum + (Number(c.total_tons) - Number(c.consumed_tons)),
      0
    );

    const flangesAvailable = flangesContracts.reduce(
      (sum, c) => sum + (Number(c.total_tons) - Number(c.consumed_tons)),
      0
    );

    return NextResponse.json({
      projectsByStatus,
      activeContracts: {
        steel: steelContracts.length,
        flanges: flangesContracts.length,
      },
      availableTons: {
        steel: Math.max(0, steelAvailable),
        flanges: Math.max(0, flangesAvailable),
      },
    });
  } catch (error) {
    console.error('GET /api/dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
