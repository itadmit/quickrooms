import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת היסטוריית תשלומים של Member
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

    // בדיקה שה-Member שייך ל-Owner
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        ownerId: user.id,
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'חבר קהילה לא נמצא' }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        memberId: memberId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching member transactions:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת תשלומים' },
      { status: 500 }
    );
  }
}

