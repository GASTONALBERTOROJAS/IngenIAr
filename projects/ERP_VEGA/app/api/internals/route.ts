import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createTowerModelSchema = z.object({
  platform: z.string().min(1),
  hub_height: z.number().positive(),
  sections_qty: z.number().int().positive(),
  base_steel_tons: z.number().positive(),
});

const createInternalsCatalogSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  applies_to_models: z.array(z.string()),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'tower-models') {
      const models = await prisma.towerModel.findMany({
        where: { is_active: true },
        orderBy: { platform: 'asc' },
      });
      return NextResponse.json(models);
    }

    if (type === 'internals') {
      const catalog = await prisma.internalsCatalog.findMany({
        where: { is_active: true },
        include: {
          matrix_entries: {
            where: { is_active: true },
            include: {
              supplier: true,
              tower_model: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json(catalog);
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('GET /api/internals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const body = await request.json();

    if (type === 'tower-models') {
      const validatedData = createTowerModelSchema.parse(body);
      const model = await prisma.towerModel.create({ data: validatedData });
      return NextResponse.json(model, { status: 201 });
    }

    if (type === 'internals') {
      const validatedData = createInternalsCatalogSchema.parse(body);
      const catalog = await prisma.internalsCatalog.create({ data: validatedData });
      return NextResponse.json(catalog, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('POST /api/internals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}