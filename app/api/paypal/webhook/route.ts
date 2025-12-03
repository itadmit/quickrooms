import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Webhook מ-PayPal לעדכון סטטוס תשלום
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Verify PayPal webhook signature
    // This is a placeholder - you'll need to verify the webhook
    
    const { event_type, resource } = body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const paymentId = resource.id;
      const transactionId = resource.custom_id; // Should be our transaction ID

      // Update transaction status
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { booking: true },
      });

      if (transaction) {
        await prisma.transaction.update({
          where: { id: transactionId },
          data: {
            paymentStatus: 'COMPLETED',
            paypalId: paymentId,
            paypalData: resource,
          },
        });

        // Update booking status
        if (transaction.bookingId) {
          await prisma.booking.update({
            where: { id: transaction.bookingId },
            data: {
              paymentStatus: 'COMPLETED',
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json(
      { error: 'שגיאה בעיבוד webhook' },
      { status: 500 }
    );
  }
}

