import { NextRequest, NextResponse } from 'next/server';
import { authenticateOwner, authenticateMember, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, userType } = body;

    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'נדרשים אימייל, סיסמה וסוג משתמש' },
        { status: 400 }
      );
    }

    let user;
    if (userType === 'owner') {
      user = await authenticateOwner(email, password);
    } else if (userType === 'member') {
      user = await authenticateMember(email, password);
    } else {
      return NextResponse.json(
        { error: 'סוג משתמש לא תקין' },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'אימייל או סיסמה שגויים' },
        { status: 401 }
      );
    }

    const token = await generateToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'שגיאה בהתחברות' },
      { status: 500 }
    );
  }
}

