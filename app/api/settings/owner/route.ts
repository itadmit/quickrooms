import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET - קבלת הגדרות Owner
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

    // קבלת פרטי המנהל
    const owner = await prisma.owner.findUnique({
      where: { id: user.id },
    });

    if (!owner) {
      return NextResponse.json({ error: 'מנהל לא נמצא' }, { status: 404 });
    }

    // החזרת הגדרות (נשתמש בשדות קיימים או ברירות מחדל)
    const settings = {
      businessName: owner.name || '',
      email: owner.email || '',
      phone: owner.phone || '',
      address: owner.address || '',
      minBookingMinutes: 60,
      timeIntervalMinutes: 30,
      cancellationHours: 24,
      autoApprove: true,
      allowOveruse: owner.allowOveruse || false,
      overuseFeePercent: 20,
      notifyNewBooking: true,
      notifyCancellation: true,
      notifyUpcoming: true,
      paymeSellerId: owner.paymeSellerId || '',
      paymeEnvironment: (owner.paymeEnvironment as 'sandbox' | 'production') || 'sandbox',
      paymeWebhookSecret: owner.paymeWebhookSecret || '',
      paymentEnabled: owner.paymentEnabled || false,
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching owner settings:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הגדרות' },
      { status: 500 }
    );
  }
}

// PUT - עדכון הגדרות Owner
export async function PUT(request: NextRequest) {
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
      businessName,
      email,
      phone,
      address,
      allowOveruse,
      paymeSellerId,
      paymeEnvironment,
      paymeWebhookSecret,
      paymentEnabled,
    } = body;

    // עדכון פרטי המנהל
    await prisma.owner.update({
      where: { id: user.id },
      data: {
        name: businessName,
        email,
        phone,
        address,
        allowOveruse,
        paymeSellerId,
        paymeEnvironment,
        paymeWebhookSecret,
        paymentEnabled,
      },
    });

    // כאן אפשר להוסיף שמירה של הגדרות נוספות בטבלה נפרדת אם נרצה

    return NextResponse.json({ 
      success: true,
      message: 'ההגדרות נשמרו בהצלחה'
    });
  } catch (error) {
    console.error('Error updating owner settings:', error);
    return NextResponse.json(
      { error: 'שגיאה בשמירת הגדרות' },
      { status: 500 }
    );
  }
}

