import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy handler for authentication and routing logic
 * New pattern for Next.js 16+ (replaces deprecated middleware.ts)
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  // Protect /user routes - redirect to login if not authenticated
  if (pathname.startsWith('/user') && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/login', '/register'],
};
