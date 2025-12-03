import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// DELETE - מחיקת חבילת קרדיט
export async function DELETE(
  request: NextRequest,
  { params }: { params: { planId: string } }
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

    const { planId } = params;

    // Check if plan belongs to owner
    const plan = await prisma.memberCreditPlan.findFirst({
      where: {
        id: planId,
        ownerId: user.id,
      },
      include: {
        members: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'חבילת קרדיט לא נמצאה' },
        { status: 404 }
      );
    }

    // Check if plan has members
    if (plan.members.length > 0) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק חבילה שיש לה Members משויכים' },
        { status: 400 }
      );
    }

    await prisma.memberCreditPlan.delete({
      where: { id: planId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting credit plan:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת חבילת הקרדיט' },
      { status: 500 }
    );
  }
}

