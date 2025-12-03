import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// הורדת חשבונית/קבלה
export async function GET(
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

    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: {
        room: {
          include: {
            space: true,
          },
        },
        member: true,
        owner: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
    }

    // בדוק הרשאות
    if (user.role === 'MEMBER' && booking.memberId !== user.id) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
    }
    if (user.role === 'OWNER' && booking.ownerId !== user.id) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 403 });
    }

    // בדוק שהתשלום בוצע
    if (booking.paymentStatus !== 'PAID') {
      return NextResponse.json(
        { error: 'התשלום טרם בוצע' },
        { status: 400 }
      );
    }

    // TODO: כאן תוכל להוסיף אינטגרציה עם PayMe API להורדת חשבונית
    // או ליצור PDF באמצעות ספרייה כמו pdfkit או jspdf
    
    // לעת עתה, נחזיר JSON עם פרטי החשבונית
    const invoiceData = {
      invoiceNumber: `INV-${booking.id.substring(0, 8)}`,
      date: new Date().toISOString(),
      booking: {
        id: booking.id,
        room: booking.room.name,
        space: booking.room.space.name,
        startTime: booking.startTime,
        endTime: booking.endTime,
        hours: booking.hours,
      },
      customer: {
        name: booking.member?.name || booking.guestName,
        email: booking.member?.email || booking.guestEmail,
      },
      seller: {
        name: booking.owner.name,
        businessName: booking.owner.spaceName,
      },
      payment: {
        amount: booking.priceCharged,
        currency: 'ILS',
        method: 'QuickPayment',
        status: booking.paymentStatus,
      },
      // TODO: הוסף מספר עוסק, כתובת, וכו'
    };

    // להורדת PDF בעתיד:
    // const pdf = await generateInvoicePDF(invoiceData);
    // return new NextResponse(pdf, {
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="invoice-${booking.id}.pdf"`,
    //   },
    // });

    return NextResponse.json(invoiceData);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת חשבונית' },
      { status: 500 }
    );
  }
}

