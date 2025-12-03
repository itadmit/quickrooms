import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit-log';

// DELETE - מחיקת Webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: { webhookId: string } }
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

    const { webhookId } = params;

    const webhook = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        ownerId: user.id,
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook לא נמצא' }, { status: 404 });
    }

    await prisma.webhook.delete({
      where: { id: webhookId },
    });

    await createAuditLog({
      userId: user.id,
      userRole: user.role,
      action: 'DELETE_WEBHOOK',
      entityType: 'Webhook',
      entityId: webhookId,
      ownerId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת Webhook' },
      { status: 500 }
    );
  }
}

