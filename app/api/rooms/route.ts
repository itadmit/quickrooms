import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת חדרים לפי spaceId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get('spaceId');

    if (!spaceId) {
      return NextResponse.json(
        { error: 'spaceId נדרש' },
        { status: 400 }
      );
    }

    const rooms = await prisma.meetingRoom.findMany({
      where: { spaceId },
      include: {
        space: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת החדרים' },
      { status: 500 }
    );
  }
}

// POST - יצירת חדר חדש (Owner only)
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
    const {
      name,
      capacity,
      images,
      creditsPerHour,
      pricePerHour,
      spaceId,
      operatingHours,
      minDurationMinutes,
      timeIntervalMinutes,
      amenities,
      specialInstructions,
      description,
      floor,
    } = body;

    if (!name || !capacity || !creditsPerHour || !pricePerHour || !spaceId) {
      return NextResponse.json(
        { error: 'כל השדות נדרשים' },
        { status: 400 }
      );
    }

    // Verify space belongs to owner
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
        ownerId: user.id,
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: 'מתחם לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    const room = await prisma.meetingRoom.create({
      data: {
        name,
        capacity: parseInt(capacity),
        images: images || "",
        creditsPerHour: parseInt(creditsPerHour),
        pricePerHour: parseFloat(pricePerHour),
        spaceId,
        operatingHours: operatingHours || null,
        minDurationMinutes: minDurationMinutes ? parseInt(minDurationMinutes) : 60,
        timeIntervalMinutes: timeIntervalMinutes ? parseInt(timeIntervalMinutes) : 30,
        amenities: amenities || null,
        specialInstructions: specialInstructions || null,
        description: description || null,
        floor: floor || null,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת החדר' },
      { status: 500 }
    );
  }
}

