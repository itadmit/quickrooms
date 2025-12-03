import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// PUT - עדכון מתחם
export async function PUT(
  request: NextRequest,
  { params }: { params: { spaceId: string } }
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

    const { spaceId } = params;
    const body = await request.json();
    const { name, address, logo } = body;

    // Verify space belongs to owner
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
        ownerId: user.id,
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: 'מתחם לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    const updatedSpace = await prisma.space.update({
      where: { id: spaceId },
      data: {
        name: name || space.name,
        address: address || space.address,
        logo: logo !== undefined ? logo : space.logo,
      },
    });

    return NextResponse.json({ space: updatedSpace });
  } catch (error) {
    console.error('Error updating space:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון המתחם' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת מתחם
export async function DELETE(
  request: NextRequest,
  { params }: { params: { spaceId: string } }
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

    const { spaceId } = params;

    // Verify space belongs to owner
    const space = await prisma.space.findFirst({
      where: {
        id: spaceId,
        ownerId: user.id,
      },
    });

    if (!space) {
      return NextResponse.json(
        { error: 'מתחם לא נמצא או אין הרשאה' },
        { status: 404 }
      );
    }

    await prisma.space.delete({
      where: { id: spaceId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting space:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת המתחם' },
      { status: 500 }
    );
  }
}

