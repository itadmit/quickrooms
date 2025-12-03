import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const bookingId = params.bookingId;

    // מציאת ההזמנה
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        member: true,
        room: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "ההזמנה לא נמצאה" },
        { status: 404 }
      );
    }

    // בדיקת הרשאות:
    // - OWNER יכול למחוק כל הזמנה שלו
    // - MEMBER יכול למחוק רק הזמנות שלו
    if (user.role === 'OWNER') {
      if (booking.ownerId !== user.id) {
        return NextResponse.json(
          { error: 'אין הרשאה למחוק הזמנה זו' },
          { status: 403 }
        );
      }
    } else if (user.role === 'MEMBER') {
      if (!booking.memberId || booking.memberId !== user.id) {
        return NextResponse.json(
          { error: 'אין הרשאה למחוק הזמנה זו' },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'גישה נדחתה' },
        { status: 403 }
      );
    }

    // בדיקה שטרם עבר הזמן לביטול (24 שעות לפני)
    const now = new Date();
    const bookingTime = new Date(booking.startTime);
    const hoursUntilBooking = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking <= 24) {
      return NextResponse.json(
        { error: "לא ניתן לבטל הזמנה פחות מ-24 שעות לפני המועד" },
        { status: 400 }
      );
    }

    // החזרת קרדיטים אם נוכו (רק אם יש memberId)
    if (booking.creditsUsed && booking.creditsUsed > 0 && booking.memberId) {
      await prisma.member.update({
        where: { id: booking.memberId },
        data: {
          creditBalance: {
            increment: booking.creditsUsed,
          },
        },
      });

      // לא צריך ליצור תנועה - זה רק החזר קרדיטים שכבר נוכו
      // הקרדיטים חוזרים ישירות לחשבון החבר
    }

    // מחיקת ההזמנה
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return NextResponse.json({
      success: true,
      message: "ההזמנה בוטלה בהצלחה והקרדיטים הוחזרו",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "שגיאה במחיקת ההזמנה" },
      { status: 500 }
    );
  }
}

