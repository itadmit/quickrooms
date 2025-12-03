import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// GET - קבלת Members (Owner only)
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

    const members = await prisma.member.findMany({
      where: { ownerId: user.id },
      include: {
        creditPlan: {
          select: {
            name: true,
            credits: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת ה-Members' },
      { status: 500 }
    );
  }
}

// POST - יצירת Member חדש (Owner only)
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
    const { name, email, username, password, creditPlanId, allowOveruse } = body;

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: 'שם, אימייל, username וסיסמה נדרשים' },
        { status: 400 }
      );
    }

    // Check if email or username already exists
    const existingMember = await prisma.member.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'אימייל או username כבר קיימים' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const member = await prisma.member.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
        ownerId: user.id,
        creditPlanId: creditPlanId || null,
        allowOveruse: allowOveruse || false,
      },
      include: {
        creditPlan: true,
      },
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת ה-Member' },
      { status: 500 }
    );
  }
}

