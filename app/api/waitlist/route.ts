import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// POST - הוספה לרשימת המתנה
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const body = await request.json();
    const { roomId, preferredDate, preferredStartTime, preferredEndTime } = body;

    if (!roomId || !preferredDate) {
      return NextResponse.json(
        { error: 'roomId ו-preferredDate נדרשים' },
        { status: 400 }
      );
    }

    // בדיקה שהחדר קיים
    const room = await prisma.meetingRoom.findUnique({
      where: { id: roomId },
      include: { space: true },
    });

    if (!room) {
      return NextResponse.json({ error: 'חדר לא נמצא' }, { status: 404 });
    }

    const ownerId = room.space.ownerId;

    const entry = await prisma.waitlistEntry.create({
      data: {
        roomId,
        memberId: user.role === 'MEMBER' ? user.id : null,
        guestEmail: user.role === 'MEMBER' ? null : user.email,
        guestName: user.role === 'MEMBER' ? null : user.name,
        ownerId,
        preferredDate: new Date(preferredDate),
        preferredStartTime,
        preferredEndTime,
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CREATE_WAITLIST',
      entityType: 'WaitlistEntry',
      entityId: entry.id,
      ownerId,
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating waitlist entry:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת רשימת המתנה' },
      { status: 500 }
    );
  }
}

// GET - קבלת רשימת המתנה
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

    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');

    const entries = await prisma.waitlistEntry.findMany({
      where: {
        ownerId: user.id,
        ...(roomId && { roomId }),
        notified: false,
      },
      include: {
        room: true,
        member: true,
      },
      orderBy: {
        preferredDate: 'asc',
      },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת רשימת המתנה' },
      { status: 500 }
    );
  }
}

