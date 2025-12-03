import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - דוח שימוש בחדרים
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
        { error: 'startDate ו-endDate נדרשים' },
        { status: 400 }
      );
    }

    // קבלת כל ההזמנות בתקופה
    const bookings = await prisma.booking.findMany({
      where: {
        ownerId: user.id,
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        paymentStatus: 'COMPLETED',
      },
      include: {
        room: true,
      },
    });

    // ניתוח לפי חדר
    const roomStats: Record<string, {
      roomId: string;
      roomName: string;
      totalBookings: number;
      totalHours: number;
      totalRevenue: number;
      totalCredits: number;
      peakHours: Record<number, number>; // hour -> count
    }> = {};

    bookings.forEach((booking) => {
      const roomId = booking.roomId;
      if (!roomStats[roomId]) {
        roomStats[roomId] = {
          roomId,
          roomName: booking.room.name,
          totalBookings: 0,
          totalHours: 0,
          totalRevenue: 0,
          totalCredits: 0,
          peakHours: {},
        };
      }

      roomStats[roomId].totalBookings++;
      roomStats[roomId].totalHours += booking.hours;
      roomStats[roomId].totalRevenue += booking.priceCharged || 0;
      roomStats[roomId].totalCredits += booking.creditsUsed || 0;

      // Peak hours analysis
      const startHour = new Date(booking.startTime).getHours();
      roomStats[roomId].peakHours[startHour] = (roomStats[roomId].peakHours[startHour] || 0) + 1;
    });

    // מציאת שעות שיא
    const rooms = Object.values(roomStats).map((stats) => {
      const peakHour = Object.entries(stats.peakHours).reduce((a, b) =>
        stats.peakHours[parseInt(a[0])] > stats.peakHours[parseInt(b[0])] ? a : b
      )[0];

      return {
        ...stats,
        peakHour: parseInt(peakHour),
        occupancyRate: (stats.totalHours / (24 * 30)) * 100, // Approximate occupancy rate
      };
    });

    // סיכום כללי
    const summary = {
      totalBookings: bookings.length,
      totalHours: rooms.reduce((sum, r) => sum + r.totalHours, 0),
      totalRevenue: rooms.reduce((sum, r) => sum + r.totalRevenue, 0),
      totalCredits: rooms.reduce((sum, r) => sum + r.totalCredits, 0),
      averageOccupancyRate: rooms.reduce((sum, r) => sum + r.occupancyRate, 0) / rooms.length || 0,
    };

    return NextResponse.json({
      summary,
      rooms: rooms.sort((a, b) => b.totalBookings - a.totalBookings),
    });
  } catch (error) {
    console.error('Error generating usage report:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת דוח שימוש' },
      { status: 500 }
    );
  }
}

