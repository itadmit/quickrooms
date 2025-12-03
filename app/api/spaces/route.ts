import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת רשימת כל המתחמים (ציבורי)
export async function GET(request: NextRequest) {
  try {
    const spaces = await prisma.space.findMany({
      include: {
        owner: {
          select: {
            name: true,
            spaceName: true,
          },
        },
        meetingRooms: {
          select: {
            id: true,
            name: true,
            capacity: true,
            images: true,
            creditsPerHour: true,
            pricePerHour: true,
          },
        },
      },
    });

    return NextResponse.json({ spaces });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המתחמים' },
      { status: 500 }
    );
  }
}

// POST - יצירת מתחם חדש (Owner only)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const body = await request.json();
    const { name, address, logo } = body;

    if (!name || !address) {
      return NextResponse.json(
        { error: 'שם וכתובת נדרשים' },
        { status: 400 }
      );
    }

    const space = await prisma.space.create({
      data: {
        name,
        address,
        logo: logo || null,
        ownerId: user.id,
      },
      include: {
        meetingRooms: true,
      },
    });

    return NextResponse.json({ space }, { status: 201 });
  } catch (error) {
    console.error('Error creating space:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת המתחם' },
      { status: 500 }
    );
  }
}

