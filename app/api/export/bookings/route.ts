import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { format } from 'date-fns';

// GET - ייצוא הזמנות ל-CSV
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const bookings = await prisma.booking.findMany({
      where: {
        ownerId: user.id,
        ...(startDate && endDate && {
          startTime: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      include: {
        room: true,
        member: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    // יצירת CSV
    const headers = [
      'תאריך יצירה',
      'חדר',
      'חבר קהילה',
      'אורח',
      'תאריך התחלה',
      'תאריך סיום',
      'שעות',
      'קרדיטים',
      'מחיר',
      'סטטוס תשלום',
      'Check-in',
      'Check-out',
    ];

    const rows = bookings.map((b) => [
      format(new Date(b.createdAt), 'dd/MM/yyyy HH:mm'),
      b.room.name,
      b.member?.name || '',
      b.guestName || '',
      format(new Date(b.startTime), 'dd/MM/yyyy HH:mm'),
      format(new Date(b.endTime), 'dd/MM/yyyy HH:mm'),
      b.hours.toString(),
      b.creditsUsed?.toString() || '',
      b.priceCharged?.toString() || '',
      b.paymentStatus,
      b.checkedIn ? 'כן' : 'לא',
      b.checkedOut ? 'כן' : 'לא',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="bookings-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting bookings:', error);
    return NextResponse.json(
      { error: 'שגיאה בייצוא הזמנות' },
      { status: 500 }
    );
  }
}

