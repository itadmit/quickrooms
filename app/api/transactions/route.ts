import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת תשלומים/חריגות
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
    const type = searchParams.get('type'); // 'overuse' or 'all'

    const where: any = {
      ownerId: user.id,
    };

    if (type === 'overuse') {
      // Only transactions with amount > 0 (payments, not credit usage)
      where.amount = {
        gt: 0,
      };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        booking: {
          include: {
            room: {
              select: {
                name: true,
              },
            },
            member: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת התשלומים' },
      { status: 500 }
    );
  }
}

