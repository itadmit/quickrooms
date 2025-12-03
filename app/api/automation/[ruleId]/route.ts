import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// PUT - עדכון כלל אוטומציה
export async function PUT(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
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

    const { ruleId } = params;
    const { enabled } = await request.json();

    const rule = await prisma.automationRule.findFirst({
      where: {
        id: ruleId,
        ownerId: user.id,
      },
    });

    if (!rule) {
      return NextResponse.json({ error: 'כלל לא נמצא' }, { status: 404 });
    }

    const updated = await prisma.automationRule.update({
      where: { id: ruleId },
      data: { enabled },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'UPDATE_AUTOMATION_RULE',
      entityType: 'AutomationRule',
      entityId: ruleId,
      ownerId: user.id,
    });

    return NextResponse.json({ rule: updated });
  } catch (error) {
    console.error('Error updating automation rule:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון כלל אוטומציה' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת כלל אוטומציה
export async function DELETE(
  request: NextRequest,
  { params }: { params: { ruleId: string } }
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

    const { ruleId } = params;

    const rule = await prisma.automationRule.findFirst({
      where: {
        id: ruleId,
        ownerId: user.id,
      },
    });

    if (!rule) {
      return NextResponse.json({ error: 'כלל לא נמצא' }, { status: 404 });
    }

    await prisma.automationRule.delete({
      where: { id: ruleId },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'DELETE_AUTOMATION_RULE',
      entityType: 'AutomationRule',
      entityId: ruleId,
      ownerId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת כלל אוטומציה' },
      { status: 500 }
    );
  }
}

