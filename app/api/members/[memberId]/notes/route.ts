import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת הערות על Member
export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const { memberId } = params;

    // בדיקה שה-Member שייך ל-Owner
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        ownerId: user.id,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'חבר קהילה לא נמצא' }, { status: 404 });
    }

    const notes = await prisma.memberNote.findMany({
      where: {
        memberId: memberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching member notes:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הערות' },
      { status: 500 }
    );
  }
}

// POST - הוספת הערה חדשה
export async function POST(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const { memberId } = params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'תוכן ההערה חובה' }, { status: 400 });
    }

    // בדיקה שה-Member שייך ל-Owner
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        ownerId: user.id,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'חבר קהילה לא נמצא' }, { status: 404 });
    }

    const note = await prisma.memberNote.create({
      data: {
        memberId: memberId,
        content: content.trim(),
        createdBy: user.id,
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הערה' },
      { status: 500 }
    );
  }
}

