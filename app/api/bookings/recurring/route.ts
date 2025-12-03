import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createRecurringBookings } from '@/lib/recurring-bookings';
import { createAuditLog } from '@/lib/audit-log';

// POST - יצירת הזמנות חוזרות
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
    const {
      roomId,
      startTime,
      endTime,
      hours,
      creditsUsed,
      priceCharged,
      pattern, // {type: 'weekly', days: [1,3,5], endDate: Date, occurrences: 10}
    } = body;

    if (!roomId || !startTime || !endTime || !pattern) {
      return NextResponse.json(
        { error: 'נתונים חסרים' },
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

    const baseBooking = {
      roomId,
      ownerId: room.space.ownerId,
      memberId: user.role === 'MEMBER' ? user.id : null,
      guestEmail: user.role === 'MEMBER' ? null : user.email,
      guestName: user.role === 'MEMBER' ? null : user.name,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      hours,
      creditsUsed,
      priceCharged,
    };

    const bookings = await createRecurringBookings(baseBooking, pattern);

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CREATE_RECURRING_BOOKING',
      entityType: 'Booking',
      entityId: bookings[0]?.id,
      ownerId: room.space.ownerId,
    });

    return NextResponse.json({ bookings }, { status: 201 });
  } catch (error) {
    console.error('Error creating recurring bookings:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הזמנות חוזרות' },
      { status: 500 }
    );
  }
}

