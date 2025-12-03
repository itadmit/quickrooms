import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';
import crypto from 'crypto';

// GET - קבלת Webhooks
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

    const webhooks = await prisma.webhook.findMany({
      where: {
        ownerId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת Webhooks' },
      { status: 500 }
    );
  }
}

// POST - יצירת Webhook
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

    const { url, events } = await request.json();

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'URL ו-events נדרשים' },
        { status: 400 }
      );
    }

    const secret = crypto.randomBytes(32).toString('hex');

    const webhook = await prisma.webhook.create({
      data: {
        ownerId: user.id,
        url,
        events: JSON.stringify(events),
        secret,
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CREATE_WEBHOOK',
      entityType: 'Webhook',
      entityId: webhook.id,
      ownerId: user.id,
    });

    return NextResponse.json({ webhook }, { status: 201 });
  } catch (error) {
    console.error('Error creating webhook:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת Webhook' },
      { status: 500 }
    );
  }
}

