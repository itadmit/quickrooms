import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - יצירת תשלום PayPal
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
    const { bookingId, amount, currency = 'USD' } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'bookingId ו-amount נדרשים' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        owner: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'הזמנה לא נמצאה' },
        { status: 404 }
      );
    }

    // בדיקת הרשאות:
    // - OWNER יכול ליצור תשלום עבור כל הזמנה שלו
    // - MEMBER יכול ליצור תשלום רק עבור הזמנות שלו
    // - Guest bookings - רק אם יש guestEmail תואם (או דרך webhook)
    if (user.role === 'OWNER') {
      if (booking.ownerId !== user.id) {
        return NextResponse.json(
          { error: 'אין הרשאה ליצור תשלום עבור הזמנה זו' },
          { status: 403 }
        );
      }
    } else if (user.role === 'MEMBER') {
      if (!booking.memberId || booking.memberId !== user.id) {
        return NextResponse.json(
          { error: 'אין הרשאה ליצור תשלום עבור הזמנה זו' },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'גישה נדחתה' },
        { status: 403 }
      );
    }

    // TODO: Integrate with PayPal SDK
    // For now, return mock payment URL
    const paypalClientId = process.env.PAYPAL_CLIENT_ID;
    
    if (!paypalClientId) {
      return NextResponse.json(
        { error: 'PayPal לא מוגדר' },
        { status: 500 }
      );
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        bookingId,
        ownerId: booking.ownerId,
        memberId: booking.memberId,
        guestEmail: booking.guestEmail,
        amount: parseFloat(amount),
        currency,
        paymentStatus: 'PENDING',
      },
    });

    // TODO: Create actual PayPal payment
    // This is a placeholder - you'll need to integrate with PayPal SDK
    const paymentUrl = `https://www.sandbox.paypal.com/checkoutnow?token=MOCK_TOKEN_${transaction.id}`;

    return NextResponse.json({
      transactionId: transaction.id,
      paymentUrl,
      amount,
      currency,
    });
  } catch (error) {
    console.error('Error creating PayPal payment:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת תשלום PayPal' },
      { status: 500 }
    );
  }
}

