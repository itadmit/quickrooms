import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - מפת חום שימוש בחדרים
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

    const bookings = await prisma.booking.findMany({
      where: {
        ownerId: user.id,
        startTime: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        paymentStatus: 'COMPLETED',
      },
    });

    // Create heatmap data structure
    const heatmapData: Record<string, Record<number, number>> = {};
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Initialize
    days.forEach((day) => {
      heatmapData[day] = {};
      hours.forEach((hour) => {
        heatmapData[day][hour] = 0;
      });
    });

    // Count bookings per day/hour
    bookings.forEach((booking) => {
      const start = new Date(booking.startTime);
      const end = new Date(booking.endTime);
      const dayOfWeek = start.getDay();
      const dayName = days[dayOfWeek];

      let current = new Date(start);
      while (current < end) {
        const hour = current.getHours();
        heatmapData[dayName][hour] = (heatmapData[dayName][hour] || 0) + 1;
        current.setHours(current.getHours() + 1);
      }
    });

    // Normalize to 0-1 range (intensity)
    const maxCount = Math.max(
      ...Object.values(heatmapData).flatMap((day) => Object.values(day))
    );

    Object.keys(heatmapData).forEach((day) => {
      Object.keys(heatmapData[day]).forEach((hour) => {
        const hourNum = parseInt(hour);
        heatmapData[day][hourNum] =
          maxCount > 0 ? heatmapData[day][hourNum] / maxCount : 0;
      });
    });

    return NextResponse.json({
      heatmap: {
        days,
        hours,
        data: heatmapData,
      },
    });
  } catch (error) {
    console.error('Error generating heatmap:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת מפת חום' },
      { status: 500 }
    );
  }
}

