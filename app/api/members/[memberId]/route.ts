import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת פרטי Member מפורטים
export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const { memberId } = params;

    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        ownerId: user.id,
      },
      include: {
        creditPlan: {
          select: {
            name: true,
            credits: true,
          },
        },
        bookings: {
          select: {
            id: true,
            creditsUsed: true,
            priceCharged: true,
            paymentStatus: true,
          },
        },
        transactions: {
          select: {
            amount: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'חבר קהילה לא נמצא' }, { status: 404 });
    }

    // חישוב סטטיסטיקות
    const stats = {
      totalBookings: member.bookings.length,
      totalSpent: member.transactions.reduce((sum, t) => sum + t.amount, 0),
      totalCreditsUsed: member.bookings.reduce((sum, b) => sum + (b.creditsUsed || 0), 0),
      activeBookings: member.bookings.filter((b) => b.paymentStatus === 'COMPLETED').length,
    };

    const memberData = {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      username: member.username,
      creditBalance: member.creditBalance,
      allowOveruse: member.allowOveruse,
      createdAt: member.createdAt,
      creditPlan: member.creditPlan,
      stats,
    };

    return NextResponse.json({ member: memberData });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פרטי חבר הקהילה' },
      { status: 500 }
    );
  }
}
