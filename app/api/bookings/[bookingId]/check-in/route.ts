import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// POST - Check-in להזמנה
export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const { bookingId } = params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
    }

    // בדיקת הרשאות
    if (user.role === 'MEMBER' && booking.memberId !== user.id) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
    }

    if (booking.checkedIn) {
      return NextResponse.json({ error: 'כבר בוצע check-in' }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        checkedIn: true,
        checkedInAt: new Date(),
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CHECK_IN',
      entityType: 'Booking',
      entityId: bookingId,
      ownerId: booking.ownerId,
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Error checking in:', error);
    return NextResponse.json(
      { error: 'שגיאה ב-check-in' },
      { status: 500 }
    );
  }
}

// POST - Check-out להזמנה
export async function PUT(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const { bookingId } = params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
    }

    if (!booking.checkedIn) {
      return NextResponse.json({ error: 'לא בוצע check-in' }, { status: 400 });
    }

    if (booking.checkedOut) {
      return NextResponse.json({ error: 'כבר בוצע check-out' }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        checkedOut: true,
        checkedOutAt: new Date(),
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CHECK_OUT',
      entityType: 'Booking',
      entityId: bookingId,
      ownerId: booking.ownerId,
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Error checking out:', error);
    return NextResponse.json(
      { error: 'שגיאה ב-check-out' },
      { status: 500 }
    );
  }
}

