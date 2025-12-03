import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// GET - קבלת הצעות מחיר
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

    const quotes = await prisma.quote.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        room: true,
        member: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הצעות מחיר' },
      { status: 500 }
    );
  }
}

// POST - יצירת הצעת מחיר
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

    const {
      roomId,
      memberId,
      guestEmail,
      guestName,
      startTime,
      endTime,
      hours,
      creditsRequired,
      price,
      expiresInDays = 7,
    } = await request.json();

    if (!roomId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'נתונים חסרים' },
        { status: 400 }
      );
    }

    const room = await prisma.meetingRoom.findUnique({
      where: { id: roomId },
      include: { space: true },
    });

    if (!room || room.space.ownerId !== user.id) {
      return NextResponse.json({ error: 'חדר לא נמצא' }, { status: 404 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const quote = await prisma.quote.create({
      data: {
        ownerId: user.id,
        roomId,
        memberId: memberId || null,
        guestEmail: guestEmail || null,
        guestName: guestName || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        hours,
        creditsRequired: creditsRequired || null,
        price: price || null,
        expiresAt,
      },
      include: {
        room: true,
        member: true,
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CREATE_QUOTE',
      entityType: 'Quote',
      entityId: quote.id,
      ownerId: user.id,
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הצעת מחיר' },
      { status: 500 }
    );
  }
}

