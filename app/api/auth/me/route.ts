import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - קבלת פרטי המשתמש המחובר
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

    let userData;
    if (user.role === 'OWNER') {
      userData = await prisma.owner.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          spaceName: true,
        },
      });
    } else if (user.role === 'MEMBER') {
      userData = await prisma.member.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          phone: true,
          creditBalance: true,
          allowOveruse: true,
          ownerId: true,
        },
      });
    }

    if (!userData) {
      return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...userData,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת פרטי המשתמש' },
      { status: 500 }
    );
  }
}

