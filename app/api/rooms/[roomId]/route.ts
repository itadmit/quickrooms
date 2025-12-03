import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת פרטי חדר
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;

    const room = await prisma.meetingRoom.findUnique({
      where: { id: roomId },
      include: {
        space: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'חדר לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת החדר' },
      { status: 500 }
    );
  }
}

// PUT - עדכון חדר
export async function PUT(
  request: NextRequest,
  { params }: { params: { roomId: string } }
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

    const { roomId } = params;
    const body = await request.json();
    const {
      name,
      capacity,
      images,
      creditsPerHour,
      pricePerHour,
      operatingHours,
      minDurationMinutes,
      timeIntervalMinutes,
      amenities,
      specialInstructions,
      description,
      floor,
    } = body;

    // Verify room belongs to owner
    const room = await prisma.meetingRoom.findFirst({
      where: {
        id: roomId,
        space: {
          ownerId: user.id,
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'חדר לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    const updatedRoom = await prisma.meetingRoom.update({
      where: { id: roomId },
      data: {
        name: name !== undefined ? name : room.name,
        capacity: capacity !== undefined ? parseInt(capacity) : room.capacity,
        images: images !== undefined ? images : room.images,
        creditsPerHour:
          creditsPerHour !== undefined
            ? parseInt(creditsPerHour)
            : room.creditsPerHour,
        pricePerHour:
          pricePerHour !== undefined
            ? parseFloat(pricePerHour)
            : room.pricePerHour,
        operatingHours:
          operatingHours !== undefined
            ? operatingHours
            : room.operatingHours,
        minDurationMinutes:
          minDurationMinutes !== undefined
            ? parseInt(minDurationMinutes)
            : room.minDurationMinutes,
        timeIntervalMinutes:
          timeIntervalMinutes !== undefined
            ? parseInt(timeIntervalMinutes)
            : room.timeIntervalMinutes,
        amenities: amenities !== undefined ? amenities : room.amenities,
        specialInstructions: specialInstructions !== undefined ? specialInstructions : room.specialInstructions,
        description: description !== undefined ? description : room.description,
        floor: floor !== undefined ? floor : room.floor,
      },
    });

    return NextResponse.json({ room: updatedRoom });
  } catch (error) {
    console.error('Error updating room:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון החדר' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת חדר
export async function DELETE(
  request: NextRequest,
  { params }: { params: { roomId: string } }
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

    const { roomId } = params;

    // Verify room belongs to owner
    const room = await prisma.meetingRoom.findFirst({
      where: {
        id: roomId,
        space: {
          ownerId: user.id,
        },
      },
      include: {
        bookings: true,
      },
    });

    if (!room) {
      return NextResponse.json(
        { error: 'חדר לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    // Check if room has future bookings
    const futureBookings = room.bookings.filter(
      (b) => new Date(b.startTime) > new Date()
    );

    if (futureBookings.length > 0) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק חדר שיש לו הזמנות עתידיות' },
        { status: 400 }
      );
    }

    await prisma.meetingRoom.delete({
      where: { id: roomId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting room:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת החדר' },
      { status: 500 }
    );
  }
}
