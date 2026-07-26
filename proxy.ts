import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy handler for authentication and routing logic
 * New pattern for Next.js 16+ (replaces deprecated middleware.ts)
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname === '/dashboard' || pathname.startsWith('/user');

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token && (pathname === '/' || isAuthRoute)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/user/:path*', '/login', '/register'],
};
