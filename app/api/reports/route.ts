import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת דוחות ו-Analytics
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

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'נדרשים startDate ו-endDate' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get all bookings for the owner in date range
    const bookings = await prisma.booking.findMany({
      where: {
        ownerId: user.id,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: {
        room: true,
        member: true,
      },
    });

    // Calculate totals
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.priceCharged || 0),
      0
    );
    const totalCreditsUsed = bookings.reduce(
      (sum, b) => sum + (b.creditsUsed || 0),
      0
    );

    // Get overuse payments (bookings with priceCharged > 0)
    const overusePayments = bookings
      .filter((b) => b.priceCharged && b.priceCharged > 0)
      .reduce((sum, b) => sum + (b.priceCharged || 0), 0);

    // Member stats
    const memberMap = new Map<string, { name: string; credits: number; payments: number }>();
    bookings.forEach((booking) => {
      if (booking.member) {
        const existing = memberMap.get(booking.member.id) || {
          name: booking.member.name,
          credits: 0,
          payments: 0,
        };
        existing.credits += booking.creditsUsed || 0;
        existing.payments += booking.priceCharged || 0;
        memberMap.set(booking.member.id, existing);
      }
    });

    const memberStats = Array.from(memberMap.entries()).map(([memberId, data]) => ({
      memberId,
      memberName: data.name,
      creditsUsed: data.credits,
      overusePayments: data.payments,
    }));

    // Room stats
    const roomMap = new Map<string, { name: string; bookings: number; revenue: number }>();
    bookings.forEach((booking) => {
      const existing = roomMap.get(booking.roomId) || {
        name: booking.room.name,
        bookings: 0,
        revenue: 0,
      };
      existing.bookings += 1;
      existing.revenue += booking.priceCharged || 0;
      roomMap.set(booking.roomId, existing);
    });

    const roomStats = Array.from(roomMap.entries()).map(([roomId, data]) => ({
      roomId,
      roomName: data.name,
      bookingsCount: data.bookings,
      revenue: data.revenue,
    }));

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      totalCreditsUsed,
      overusePayments,
      memberStats,
      roomStats,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הדוחות' },
      { status: 500 }
    );
  }
}

