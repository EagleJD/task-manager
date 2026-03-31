import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_API_PATHS = ['/api/auth/login', '/api/auth/logout'];
const PUBLIC_PATHS = ['/login'];

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Auth API routes always pass through
  if (AUTH_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!token) {
    if (isPublic) return NextResponse.next();
    // API routes: return 401 instead of redirecting
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const secret = getSecret();
  if (!secret) {
    // JWT_SECRET not configured — let requests through in development
    return NextResponse.next();
  }

  try {
    await jwtVerify(token, secret, { algorithms: ['HS256'] });
    // Valid token: redirect away from login page
    if (isPublic) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  } catch {
    // Expired or invalid token
    if (isPublic) return NextResponse.next();
    if (pathname.startsWith('/api/')) {
      const res = NextResponse.json({ error: '인증이 만료되었습니다.' }, { status: 401 });
      res.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
      return res;
    }
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
