import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// GET - קבלת כללי אוטומציה
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

    const rules = await prisma.automationRule.findMany({
      where: {
        ownerId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת כללי אוטומציה' },
      { status: 500 }
    );
  }
}

// POST - יצירת כלל אוטומציה
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

    const { name, trigger, conditions, actions } = await request.json();

    if (!name || !trigger || !actions) {
      return NextResponse.json(
        { error: 'שם, טריגר ופעולות נדרשים' },
        { status: 400 }
      );
    }

    const rule = await prisma.automationRule.create({
      data: {
        ownerId: user.id,
        name,
        trigger,
        conditions: conditions ? JSON.stringify(conditions) : null,
        actions: JSON.stringify(actions),
      },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'CREATE_AUTOMATION_RULE',
      entityType: 'AutomationRule',
      entityId: rule.id,
      ownerId: user.id,
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error('Error creating automation rule:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת כלל אוטומציה' },
      { status: 500 }
    );
  }
}

