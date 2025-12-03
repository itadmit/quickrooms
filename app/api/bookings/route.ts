import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { sendBookingConfirmation } from '@/lib/notifications';

// GET - קבלת הזמנות
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
    const roomId = searchParams.get('roomId');
    const memberId = searchParams.get('memberId');

    let where: any = {};

    if (user.role === 'OWNER') {
      where.ownerId = user.id;
      if (roomId) where.roomId = roomId;
      if (memberId) where.memberId = memberId;
    } else if (user.role === 'MEMBER') {
      where.memberId = user.id;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            capacity: true,
            images: true,
          },
        },
        member: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת ההזמנות' },
      { status: 500 }
    );
  }
}

// POST - יצירת הזמנה חדשה
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      roomId,
      startTime,
      endTime,
      memberId,
      guestEmail,
      guestName,
    } = body;

    if (!roomId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'חדר, זמן התחלה וסיום נדרשים' },
        { status: 400 }
      );
    }

    // אם זה member booking, צריך authentication
    if (memberId) {
      const token = request.cookies.get('auth-token')?.value;
      if (!token) {
        return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
      }

      const user = await verifyToken(token);
      if (!user) {
        return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
      }

      // אם זה MEMBER, צריך לוודא שהוא מזמין לעצמו
      if (user.role === 'MEMBER' && user.id !== memberId) {
        return NextResponse.json(
          { error: 'אין הרשאה ליצור הזמנה עבור member אחר' },
          { status: 403 }
        );
      }
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMinutes = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60));
    const durationHours = durationMinutes / 60; // שעות מדויקות (לא מעוגלות)

    if (durationMinutes <= 0) {
      return NextResponse.json(
        { error: 'זמן סיום חייב להיות אחרי זמן התחלה' },
        { status: 400 }
      );
    }

    // Get room details
    const room = await prisma.meetingRoom.findUnique({
      where: { id: roomId },
      include: {
        space: {
          include: {
            owner: true,
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

    // בדיקת מינימום זמן לפגישה
    const minDuration = room.minDurationMinutes || 60;
    if (durationMinutes < minDuration) {
      return NextResponse.json(
        { error: `מינימום זמן לפגישה הוא ${minDuration} דקות` },
        { status: 400 }
      );
    }

    // בדיקת קפיצות זמן (שהזמנה מתחילה בקפיצות זמן תקינות)
    const timeInterval = room.timeIntervalMinutes || 30;
    const startMinutes = start.getMinutes();
    if (startMinutes % timeInterval !== 0) {
      return NextResponse.json(
        { error: `הזמנה חייבת להתחיל בקפיצות של ${timeInterval} דקות` },
        { status: 400 }
      );
    }

    // Check for double booking
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gt: start } },
            ],
          },
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gte: end } },
            ],
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'החדר תפוס בשעות אלו' },
        { status: 409 }
      );
    }

    let creditsUsed: number | null = null;
    let priceCharged: number | null = null;
    let paymentStatus: 'PENDING' | 'COMPLETED' = 'PENDING';

    // Handle Member booking
    if (memberId) {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      });

      if (!member) {
        return NextResponse.json(
          { error: 'Member לא נמצא' },
          { status: 404 }
        );
      }

      // בדיקה שהחבר שייך ל-owner של החדר
      if (member.ownerId !== room.space.ownerId) {
        return NextResponse.json(
          { error: 'החבר לא שייך לבעל החדר' },
          { status: 403 }
        );
      }

      // חישוב קרדיטים לפי שעות מדויקות (לא מעוגלות)
      const creditsNeeded = Math.ceil(durationHours * room.creditsPerHour);

      if (member.creditBalance >= creditsNeeded) {
        // יש מספיק קרדיטים
        creditsUsed = creditsNeeded;
        paymentStatus = 'COMPLETED';

        // Deduct credits
        await prisma.member.update({
          where: { id: memberId },
          data: {
            creditBalance: {
              decrement: creditsNeeded,
            },
          },
        });
      } else if (member.allowOveruse) {
        // חריגה מותרת - ניכוי הקרדיטים שיש ותשלום על החלק החריג
        creditsUsed = member.creditBalance;
        const overuseCredits = creditsNeeded - member.creditBalance;
        const overuseHours = overuseCredits / room.creditsPerHour;
        priceCharged = Math.ceil(overuseHours * room.pricePerHour * 100) / 100; // עיגול ל-2 ספרות אחרי הנקודה
        paymentStatus = 'PENDING'; // צריך תשלום PayPal

        await prisma.member.update({
          where: { id: memberId },
          data: {
            creditBalance: 0,
          },
        });
      } else {
        return NextResponse.json(
          { error: 'אין מספיק קרדיטים והחריגה לא מותרת' },
          { status: 400 }
        );
      }
    } else if (guestEmail) {
      // Guest booking - full payment required (לפי שעות מדויקות)
      priceCharged = Math.ceil(durationHours * room.pricePerHour * 100) / 100; // עיגול ל-2 ספרות אחרי הנקודה
      paymentStatus = 'PENDING'; // צריך תשלום PayPal לפני אישור
    } else {
      return NextResponse.json(
        { error: 'נדרש memberId או guestEmail' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        roomId,
        ownerId: room.space.ownerId,
        memberId: memberId || null,
        guestEmail: guestEmail || null,
        guestName: guestName || null,
        startTime: start,
        endTime: end,
        hours: Math.ceil(durationMinutes / 60), // שמירה של שעות מעוגלות למעלה לשדה hours (לצורך תצוגה)
        creditsUsed,
        priceCharged,
        paymentStatus,
      },
      include: {
        room: true,
        member: true,
      },
    });

    // שליחת התראה על הזמנה מאושרת (רק ל-Members)
    if (memberId && booking.member) {
      sendBookingConfirmation(booking.id).catch((error) => {
        console.error('Error sending booking confirmation:', error);
        // לא נכשל את ההזמנה אם שליחת ההתראה נכשלה
      });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת ההזמנה' },
      { status: 500 }
    );
  }
}

