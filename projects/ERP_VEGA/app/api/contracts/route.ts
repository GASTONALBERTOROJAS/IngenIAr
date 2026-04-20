import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';

const createContractSchema = z.object({
  supplier_id: z.string().uuid(),
  category: z.string(),
  total_tons: z.number().positive(),
  base_price_per_ton: z.number().positive(),
  currency: z.string().default('EUR'),
  valid_from: z.string().datetime(),
  valid_to: z.string().datetime(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const supplier_id = searchParams.get('supplier_id');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = { is_active: true };
    if (category) where.category = category;
    if (supplier_id) where.supplier_id = supplier_id;
    if (status) where.status = status;

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        supplier: true,
        conditions: { where: { is_active: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error('GET /api/contracts error:', error);
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
    if (!['admin', 'purchasing_steel', 'purchasing_flanges'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createContractSchema.parse(body);

    const contract = await prisma.contract.create({
      data: {
        ...validatedData,
        valid_from: new Date(validatedData.valid_from),
        valid_to: new Date(validatedData.valid_to),
      },
      include: {
        supplier: true,
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('POST /api/contracts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}