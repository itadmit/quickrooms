import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת חבילות קרדיט (Owner only)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const plans = await prisma.memberCreditPlan.findMany({
      where: { ownerId: user.id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching credit plans:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת חבילות הקרדיט' },
      { status: 500 }
    );
  }
}

// POST - יצירת חבילת קרדיט חדשה (Owner only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const body = await request.json();
    const { name, credits } = body;

    if (!name || !credits) {
      return NextResponse.json(
        { error: 'שם וכמות קרדיטים נדרשים' },
        { status: 400 }
      );
    }

    const plan = await prisma.memberCreditPlan.create({
      data: {
        name,
        credits: parseInt(credits),
        ownerId: user.id,
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Error creating credit plan:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת חבילת הקרדיט' },
      { status: 500 }
    );
  }
}

