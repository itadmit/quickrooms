import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { format } from 'date-fns';

// GET - ייצוא חברי קהילה ל-CSV
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

    const members = await prisma.member.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        creditPlan: true,
        bookings: {
          select: {
            id: true,
            creditsUsed: true,
            priceCharged: true,
          },
        },
      },
    });

    const headers = [
      'שם',
      'אימייל',
      'טלפון',
      'שם משתמש',
      'יתרת קרדיט',
      'חבילת קרדיט',
      'חריגה מותרת',
      'תאריך הצטרפות',
      'סה"כ הזמנות',
      'סה"כ קרדיטים',
      'סה"כ הוצאות',
    ];

    const rows = members.map((m) => {
      const totalBookings = m.bookings.length;
      const totalCredits = m.bookings.reduce((sum, b) => sum + (b.creditsUsed || 0), 0);
      const totalSpent = m.bookings.reduce((sum, b) => sum + (b.priceCharged || 0), 0);

      return [
        m.name,
        m.email,
        m.phone || '',
        m.username,
        m.creditBalance.toString(),
        m.creditPlan?.name || '',
        m.allowOveruse ? 'כן' : 'לא',
        format(new Date(m.createdAt), 'dd/MM/yyyy'),
        totalBookings.toString(),
        totalCredits.toString(),
        totalSpent.toFixed(2),
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="members-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting members:', error);
    return NextResponse.json(
      { error: 'שגיאה בייצוא חברי קהילה' },
      { status: 500 }
    );
  }
}

