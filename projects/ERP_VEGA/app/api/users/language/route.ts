import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({
  preferred_language: z.enum(['es', 'en']),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { preferred_language } = schema.parse(body);

    await prisma.user.update({
      where: { user_id: session.user.id },
      data: { preferred_language },
    });

    return NextResponse.json({ preferred_language });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('PATCH /api/users/language error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
