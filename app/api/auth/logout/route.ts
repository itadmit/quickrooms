import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  // Delete the auth cookie
  response.cookies.delete('auth-token');
  
  return response;
}

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Delete the auth cookie
  response.cookies.delete('auth-token');
  
  return response;
}

