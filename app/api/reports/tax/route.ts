import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { format } from 'date-fns';

// GET - דוח מס (מע"מ)
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
    const vatRate = parseFloat(searchParams.get('vatRate') || '17'); // Default 17% VAT

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate ו-endDate נדרשים' },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        ownerId: user.id,
        paymentStatus: 'COMPLETED',
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        booking: {
          include: {
            room: true,
          },
        },
      },
    });

    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const vatAmount = totalRevenue * (vatRate / 100);
    const revenueBeforeVat = totalRevenue - vatAmount;

    const report = {
      period: {
        startDate,
        endDate,
      },
      summary: {
        totalRevenue: totalRevenue.toFixed(2),
        revenueBeforeVat: revenueBeforeVat.toFixed(2),
        vatRate: `${vatRate}%`,
        vatAmount: vatAmount.toFixed(2),
        totalTransactions: transactions.length,
      },
      transactions: transactions.map((t) => ({
        date: format(new Date(t.createdAt), 'dd/MM/yyyy'),
        amount: t.amount.toFixed(2),
        room: t.booking?.room.name || 'N/A',
        description: t.paymentStatus,
      })),
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating tax report:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת דוח מס' },
      { status: 500 }
    );
  }
}

