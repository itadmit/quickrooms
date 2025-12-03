import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// POST - דירוג הזמנה
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
    const { rating, review } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'דירוג חייב להיות בין 1 ל-5' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
    }

    // בדיקה שהמשתמש הוא זה שביצע את ההזמנה
    if (user.role === 'MEMBER' && booking.memberId !== user.id) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
    }

    // בדיקה אם כבר יש דירוג
    const existing = await prisma.roomRating.findUnique({
      where: { bookingId },
    });

    let ratingRecord;
    if (existing) {
      ratingRecord = await prisma.roomRating.update({
        where: { bookingId },
        data: {
          rating,
          review: review || null,
        },
      });
    } else {
      ratingRecord = await prisma.roomRating.create({
        data: {
          roomId: booking.roomId,
          bookingId,
          memberId: booking.memberId || null,
          rating,
          review: review || null,
        },
      });
    }

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'RATE_BOOKING',
      entityType: 'RoomRating',
      entityId: ratingRecord.id,
      ownerId: booking.ownerId,
    });

    return NextResponse.json({ rating: ratingRecord });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת דירוג' },
      { status: 500 }
    );
  }
}

