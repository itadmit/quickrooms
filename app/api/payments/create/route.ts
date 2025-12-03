import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// יצירת תשלום PayMe לחריגה
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'MEMBER') {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
    }

    const { bookingData, roomId, amount } = await request.json();

    if (!bookingData || !roomId || !amount) {
      return NextResponse.json({ error: 'נתונים חסרים' }, { status: 400 });
    }

    // טען את החדר והמשתמש
    const room = await prisma.meetingRoom.findUnique({
      where: { id: roomId },
      include: {
        space: true,
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'חדר לא נמצא' }, { status: 404 });
    }

    const member = await prisma.member.findUnique({
      where: { id: user.id },
    });

    if (!member) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'אין סכום לתשלום' }, { status: 400 });
    }

    // טען את הגדרות התשלום מה-Owner
    const owner = await prisma.owner.findUnique({
      where: { id: room.space.ownerId },
      select: {
        paymeSellerId: true,
        paymeEnvironment: true,
        paymentEnabled: true,
      },
    });

    if (!owner) {
      return NextResponse.json({ error: 'בעל מתחם לא נמצא' }, { status: 404 });
    }

    if (!owner.paymentEnabled) {
      return NextResponse.json({ error: 'תשלומים לא מופעלים במערכת' }, { status: 400 });
    }

    if (!owner.paymeSellerId) {
      return NextResponse.json({ error: 'הגדרות תשלום לא הושלמו. אנא פנה למנהל המערכת' }, { status: 400 });
    }

    // הכן את הנתונים ל-PayMe
    const paymeData = {
      seller_payme_id: owner.paymeSellerId,
      sale_price: Math.round(amount * 100), // המרה לאגורות
      currency: 'ILS',
      product_name: `הזמנת ${room.name} ב-${room.space.name}`,
      transaction_id: `pending-${user.id}-${Date.now()}`, // ID זמני עד יצירת ההזמנה
      sale_callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
      sale_return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/member/bookings?payment=success&roomId=${roomId}`,
      sale_email: member.email,
      sale_name: member.name,
      sale_mobile: member.phone || '',
      language: 'he',
      capture_buyer: '0',
      sale_type: 'sale',
      sale_payment_method: 'credit-card',
    };

    // שלח בקשה ל-PayMe
    const paymeEnv = (owner.paymeEnvironment || 'sandbox') === 'production' ? 'production' : 'sandbox';
    const paymeResponse = await fetch(`https://${paymeEnv}.payme.io/api/generate-sale`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymeData),
    });

    if (!paymeResponse.ok) {
      const errorData = await paymeResponse.json();
      console.error('PayMe API Error:', errorData);
      
      // טיפול בשגיאות ספציפיות מ-PayMe
      let errorMessage = 'שגיאה ביצירת תשלום';
      if (errorData.status_error_code === 251 || errorData.status_error_details?.includes('מוכר לא נמצא')) {
        errorMessage = 'הגדרות תשלום לא תקינות. אנא פנה למנהל המערכת כדי להשלים את הגדרות PayMe בהגדרות המערכת.';
      } else if (errorData.status_error_details) {
        errorMessage = `שגיאה: ${errorData.status_error_details}`;
      }
      
      return NextResponse.json(
        { error: errorMessage, details: errorData },
        { status: 500 }
      );
    }

    const paymeResult = await paymeResponse.json();

    // שמור את פרטי התשלום הזמניים ב-DB
    const pendingPayment = await prisma.pendingPayment.create({
      data: {
        transactionId: paymeData.transaction_id,
        paymeSaleId: paymeResult.payme_sale_id,
        memberId: user.id,
        roomId: roomId,
        ownerId: room.space.ownerId,
        bookingData: JSON.stringify(bookingData),
        amount: amount,
        currency: 'ILS',
        paymentStatus: 'PENDING',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // תפוגה אחרי 30 דקות
      },
    });

    return NextResponse.json({
      success: true,
      paymentUrl: paymeResult.sale_url,
      paymeSaleId: paymeResult.payme_sale_id,
      transactionId: paymeData.transaction_id,
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת תשלום' },
      { status: 500 }
    );
  }
}

