import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit, getRateLimitIdentifier } from './lib/rate-limit';

// Rate limit configuration per endpoint
const rateLimitConfig: Record<string, { interval: number; limit: number }> = {
  '/api/auth/login': { interval: 60, limit: 5 }, // 5 attempts per minute
  '/api/auth/register': { interval: 60, limit: 3 }, // 3 attempts per minute
  '/api/bookings': { interval: 60, limit: 20 }, // 20 requests per minute
  '/api/rooms': { interval: 60, limit: 30 }, // 30 requests per minute
  '/api/spaces': { interval: 60, limit: 30 }, // 30 requests per minute
  '/api/upload': { interval: 60, limit: 10 }, // 10 uploads per minute
  '/api/payments/create': { interval: 60, limit: 10 }, // 10 payment attempts per minute
  default: { interval: 60, limit: 100 }, // 100 requests per minute for other endpoints
};

export function rateLimitMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Find matching rate limit config
  const config = rateLimitConfig[pathname] || rateLimitConfig.default;
  
  const identifier = getRateLimitIdentifier(request);
  const result = rateLimit(identifier, {
    interval: config.interval,
    limit: config.limit,
  });

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'יותר מדי בקשות. אנא נסה שוב מאוחר יותר.',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
        },
      }
    );
  }

  return null; // Continue to next middleware
}

