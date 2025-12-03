import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת התראות של המשתמש
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
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {
      userId: user.id,
      userRole: user.role,
    };

    if (unreadOnly) {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // ספירת התראות שלא נקראו
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        userRole: user.role,
        read: false,
      },
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת ההתראות' },
      { status: 500 }
    );
  }
}

// PUT - עדכון התראה (סימון כנקראה)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'לא מאומת' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    if (markAllAsRead) {
      // סמן את כל ההתראות כנקראו
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          userRole: user.role,
          read: false,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId נדרש' },
        { status: 400 }
      );
    }

    // בדוק שההתראה שייכת למשתמש
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: user.id,
        userRole: user.role,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'התראה לא נמצאה' },
        { status: 404 }
      );
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ notification: updated });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון ההתראה' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת התראה
export async function DELETE(request: NextRequest) {
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
    const notificationId = searchParams.get('id');

    if (!notificationId) {
      return NextResponse.json(
        { error: 'notificationId נדרש' },
        { status: 400 }
      );
    }

    // בדוק שההתראה שייכת למשתמש
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: user.id,
        userRole: user.role,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'התראה לא נמצאה' },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת ההתראה' },
      { status: 500 }
    );
  }
}

