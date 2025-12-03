import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET - קבלת הגדרות Member
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'MEMBER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    // קבלת פרטי החבר
    const member = await prisma.member.findUnique({
      where: { id: user.id },
    });

    if (!member) {
      return NextResponse.json({ error: 'חבר לא נמצא' }, { status: 404 });
    }

    // החזרת הגדרות
    const settings = {
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      address: member.address || '',
      notifyBookingConfirmed: true,
      notifyBookingReminder: true,
      reminderMinutes: 30,
      notifyLowCredits: true,
      notifyMonthlyUpdate: false,
      favoriteRooms: [],
      preferredFloors: [],
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching member settings:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הגדרות' },
      { status: 500 }
    );
  }
}

// PUT - עדכון הגדרות Member
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user || user.role !== 'MEMBER') {
      return NextResponse.json({ error: 'גישה נדחתה' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      currentPassword,
      newPassword,
    } = body;

    // אם יש שינוי סיסמה
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'נדרש להזין סיסמה נוכחית' },
          { status: 400 }
        );
      }

      // בדיקת סיסמה נוכחית
      const member = await prisma.member.findUnique({
        where: { id: user.id },
      });

      if (!member) {
        return NextResponse.json({ error: 'חבר לא נמצא' }, { status: 404 });
      }

      const passwordValid = await bcrypt.compare(currentPassword, member.password);
      if (!passwordValid) {
        return NextResponse.json(
          { error: 'סיסמה נוכחית שגויה' },
          { status: 400 }
        );
      }

      // Hash הסיסמה החדשה
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // עדכון עם סיסמה חדשה
      await prisma.member.update({
        where: { id: user.id },
        data: {
          name,
          email,
          phone,
          address,
          password: hashedPassword,
        },
      });
    } else {
      // עדכון ללא שינוי סיסמה
      await prisma.member.update({
        where: { id: user.id },
        data: {
          name,
          email,
          phone,
          address,
        },
      });
    }

    // כאן אפשר להוסיף שמירה של הגדרות התראות בטבלה נפרדת אם נרצה

    return NextResponse.json({ 
      success: true,
      message: 'ההגדרות נשמרו בהצלחה'
    });
  } catch (error) {
    console.error('Error updating member settings:', error);
    return NextResponse.json(
      { error: 'שגיאה בשמירת הגדרות' },
      { status: 500 }
    );
  }
}

