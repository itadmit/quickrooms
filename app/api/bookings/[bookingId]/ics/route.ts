import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { generateICS } from '@/lib/ics-export';

// GET - ייצוא ICS להזמנה
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

    const { bookingId } = params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        member: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
    }

    // בדיקת הרשאות
    if (user.role === 'MEMBER' && booking.memberId !== user.id) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 403 });
    }

    const icsContent = generateICS(booking);

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="booking-${bookingId}.ics"`,
      },
    });
  } catch (error) {
    console.error('Error generating ICS:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת קובץ ICS' },
      { status: 500 }
    );
  }
}

