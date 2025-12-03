import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { rateLimitMiddleware } from './middleware-rate-limit';

export async function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const rateLimitResponse = rateLimitMiddleware(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  const token = request.cookies.get('auth-token')?.value;

  console.log('[Middleware]', request.nextUrl.pathname, 'Token present:', !!token);

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      console.log('[Middleware] No token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const user = await verifyToken(token);
    if (!user) {
      console.log('[Middleware] Invalid token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[Middleware] User verified:', user.role);

    // Check if owner trying to access owner dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard/owner') && user.role !== 'OWNER') {
      console.log('[Middleware] Not owner, redirecting to member dashboard');
      return NextResponse.redirect(new URL('/dashboard/member', request.url));
    }

    // Check if member trying to access member dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard/member') && user.role !== 'MEMBER') {
      console.log('[Middleware] Not member, redirecting to owner dashboard');
      return NextResponse.redirect(new URL('/dashboard/owner', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};

