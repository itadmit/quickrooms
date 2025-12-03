import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// PUT - עדכון Member
export async function PUT(
  request: NextRequest,
  { params }: { params: { memberId: string } }
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

    const { memberId } = params;
    const body = await request.json();
    const {
      name,
      email,
      username,
      password,
      creditPlanId,
      allowOveruse,
      creditBalance,
    } = body;

    // Verify member belongs to owner
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        ownerId: user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (password !== undefined) updateData.password = await hashPassword(password);
    if (creditPlanId !== undefined) updateData.creditPlanId = creditPlanId || null;
    if (allowOveruse !== undefined) updateData.allowOveruse = allowOveruse;
    if (creditBalance !== undefined) updateData.creditBalance = parseInt(creditBalance);

    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: updateData,
      include: {
        creditPlan: true,
      },
    });

    return NextResponse.json({ member: updatedMember });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון ה-Member' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת Member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: string } }
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

    const { memberId } = params;

    // Verify member belongs to owner
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        ownerId: user.id,
      },
      include: {
        bookings: {
          where: {
            startTime: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Member לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    // Check if member has future bookings
    if (member.bookings.length > 0) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק Member שיש לו הזמנות עתידיות' },
        { status: 400 }
      );
    }

    await prisma.member.delete({
      where: { id: memberId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת ה-Member' },
      { status: 500 }
    );
  }
}

