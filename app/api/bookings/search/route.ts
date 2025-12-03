import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - חיפוש מתקדם בהזמנות
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const roomId = searchParams.get('roomId');
    const memberId = searchParams.get('memberId');
    const status = searchParams.get('status');

    const where: any = {};

    if (user.role === 'OWNER') {
      where.ownerId = user.id;
    } else if (user.role === 'MEMBER') {
      where.memberId = user.id;
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (roomId) {
      where.roomId = roomId;
    }

    if (memberId) {
      where.memberId = memberId;
    }

    if (status) {
      where.paymentStatus = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            images: true,
          },
        },
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rating: {
          select: {
            rating: true,
            review: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    // Filter by query if provided
    let filteredBookings = bookings;
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredBookings = bookings.filter((b) => {
        return (
          b.room.name.toLowerCase().includes(lowerQuery) ||
          b.member?.name.toLowerCase().includes(lowerQuery) ||
          b.guestName?.toLowerCase().includes(lowerQuery) ||
          b.guestEmail?.toLowerCase().includes(lowerQuery)
        );
      });
    }

    return NextResponse.json({ bookings: filteredBookings });
  } catch (error) {
    console.error('Error searching bookings:', error);
    return NextResponse.json(
      { error: 'שגיאה בחיפוש הזמנות' },
      { status: 500 }
    );
  }
}

