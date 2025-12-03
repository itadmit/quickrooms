import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// POST - המרת הצעת מחיר להזמנה
export async function POST(
  request: NextRequest,
  { params }: { params: { quoteId: string } }
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

    const { quoteId } = params;

    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        ownerId: user.id,
      },
      include: {
        room: true,
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'הצעת מחיר לא נמצאה' }, { status: 404 });
    }

    if (quote.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'לא ניתן להמיר הצעת מחיר שכבר אושרה או נדחתה' },
        { status: 400 }
      );
    }

    if (new Date(quote.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'הצעת המחיר פגה תוקף' },
        { status: 400 }
      );
    }

    // Create booking from quote
    const booking = await prisma.booking.create({
      data: {
        roomId: quote.roomId,
        ownerId: quote.ownerId,
        memberId: quote.memberId,
        guestEmail: quote.guestEmail,
        guestName: quote.guestName,
        startTime: quote.startTime,
        endTime: quote.endTime,
        hours: quote.hours,
        creditsUsed: quote.creditsRequired,
        priceCharged: quote.price,
        paymentStatus: 'COMPLETED',
      },
    });

    // Update quote status
    await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'ACCEPTED',
        convertedToBookingId: booking.id,
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CONVERT_QUOTE_TO_BOOKING',
      entityType: 'Quote',
      entityId: quoteId,
      ownerId: user.id,
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Error converting quote:', error);
    return NextResponse.json(
      { error: 'שגיאה בהמרת הצעת מחיר' },
      { status: 500 }
    );
  }
}

