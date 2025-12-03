import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // 1. Revenue (Current Month vs Last Month)
    const currentMonthRevenue = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        ownerId: user.id,
        createdAt: { gte: startOfCurrentMonth, lte: endOfCurrentMonth },
        paymentStatus: 'COMPLETED'
      }
    });

    const lastMonthRevenue = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        ownerId: user.id,
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        paymentStatus: 'COMPLETED'
      }
    });

    const revenue = currentMonthRevenue._sum.amount || 0;
    const revenueLast = lastMonthRevenue._sum.amount || 0;
    const revenueChange = revenueLast === 0 ? 100 : ((revenue - revenueLast) / revenueLast) * 100;

    // 2. Active Bookings (Today)
    const todayBookings = await prisma.booking.count({
      where: {
        ownerId: user.id,
        startTime: { gte: startOfDay(now) },
        endTime: { lte: endOfDay(now) }
      }
    });

    // 3. Occupancy (Simple calculation: Booked Hours Today / Total Available Hours Today)
    // Assuming 10 hours operation per room per day
    const totalRooms = await prisma.meetingRoom.count({ where: { space: { ownerId: user.id } } });
    const potentialHours = totalRooms * 10; 
    
    const bookingsToday = await prisma.booking.findMany({
      where: {
        ownerId: user.id,
        startTime: { gte: startOfDay(now) },
        endTime: { lte: endOfDay(now) }
      },
      select: { hours: true }
    });
    
    const bookedHours = bookingsToday.reduce((acc, curr) => acc + curr.hours, 0);
    const occupancy = potentialHours === 0 ? 0 : Math.round((bookedHours / potentialHours) * 100);

    // 4. New Members (This Month)
    const newMembers = await prisma.member.count({
      where: {
        ownerId: user.id,
        createdAt: { gte: startOfCurrentMonth }
      }
    });

    // 5. Recent Activity (Last 5 Bookings)
    const recentBookings = await prisma.booking.findMany({
      where: { ownerId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        room: true,
        member: { select: { name: true } },
      }
    });

    // Format recent bookings
    const formattedRecentBookings = recentBookings.map(b => ({
      id: b.id,
      user: b.member?.name || b.guestName || 'אורח',
      room: b.room.name,
      date: new Date(b.startTime).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }),
      status: b.paymentStatus === 'COMPLETED' ? 'approved' : 'pending', // Simplification
      amount: b.priceCharged ? `₪${b.priceCharged}` : `${b.creditsUsed} קרדיטים`
    }));

    return NextResponse.json({
      stats: {
        revenue: { value: revenue, change: Math.round(revenueChange) },
        bookings: { value: todayBookings },
        occupancy: { value: occupancy },
        newMembers: { value: newMembers }
      },
      recentBookings: formattedRecentBookings,
      userName: user.name
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

