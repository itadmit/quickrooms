import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Webhook מ-PayMe לעדכון סטטוס תשלום
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('PayMe Webhook received:', body);

    const {
      transaction_id: transactionId,
      payme_status,
      payme_sale_id,
      payme_transaction_id,
      price,
      currency,
    } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 });
    }

    // מצא את ה-pending payment
    const pendingPayment = await prisma.pendingPayment.findUnique({
      where: { transactionId },
      include: {
        member: true,
        room: {
          include: {
            space: true,
          },
        },
        owner: true,
      },
    });

    // אימות חתימה (אם PayMe מספק)
    const signature = request.headers.get('payme-signature');
    if (signature && pendingPayment?.owner?.paymeWebhookSecret) {
      const expectedSignature = crypto
        .createHmac('sha256', pendingPayment.owner.paymeWebhookSecret)
        .update(JSON.stringify(body))
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    if (!pendingPayment) {
      // אולי זה תשלום להזמנה קיימת (לא pending)
      const booking = await prisma.booking.findUnique({
        where: { id: transactionId },
      });

      if (booking) {
        // עדכן הזמנה קיימת
        if (payme_status === 'success') {
          await prisma.booking.update({
            where: { id: transactionId },
            data: { paymentStatus: 'PAID' },
          });
        }
        return NextResponse.json({ success: true });
      }

      console.error(`Pending payment not found: ${transactionId}`);
      return NextResponse.json({ error: 'Pending payment not found' }, { status: 404 });
    }

    // עדכן סטטוס לפי תוצאת התשלום
    if (payme_status === 'success') {
      // פרס את פרטי ההזמנה
      const bookingData = JSON.parse(pendingPayment.bookingData);
      
      // חשב את הקרדיטים והמחיר
      const startTime = new Date(bookingData.startTime);
      const endTime = new Date(bookingData.endTime);
      const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      const creditsUsed = Math.ceil(durationHours * pendingPayment.room.creditsPerHour);

      // צור את ההזמנה
      const booking = await prisma.booking.create({
        data: {
          roomId: pendingPayment.roomId,
          ownerId: pendingPayment.ownerId,
          memberId: pendingPayment.memberId,
          startTime: startTime,
          endTime: endTime,
          hours: Math.ceil(durationHours),
          creditsUsed: creditsUsed,
          priceCharged: pendingPayment.amount,
          paymentStatus: 'PAID',
        },
      });

      // צור transaction record
      await prisma.transaction.create({
        data: {
          bookingId: booking.id,
          amount: price / 100, // המרה מאגורות לשקלים
          currency: currency || 'ILS',
          paymentStatus: 'COMPLETED',
          ownerId: pendingPayment.ownerId,
          memberId: pendingPayment.memberId,
        },
      });

      // מחק את ה-pending payment
      await prisma.pendingPayment.delete({
        where: { id: pendingPayment.id },
      });

      console.log(`Payment successful, booking created: ${booking.id}`);
    } else if (payme_status === 'error' || payme_status === 'failed') {
      await prisma.pendingPayment.update({
        where: { id: pendingPayment.id },
        data: {
          paymentStatus: 'FAILED',
        },
      });

      console.log(`Payment failed for transaction ${transactionId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint לבדיקה שה-webhook פעיל
export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'PayMe webhook endpoint is active',
  });
}

