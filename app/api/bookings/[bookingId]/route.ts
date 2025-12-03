import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
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

    // החזרת קרדיטים אם נוכו
    if (booking.creditsUsed && booking.creditsUsed > 0) {
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

