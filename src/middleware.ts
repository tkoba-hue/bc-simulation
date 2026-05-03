import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  if (!authHeader.startsWith('Basic ')) {
    return new NextResponse('Invalid authentication scheme', { status: 401 });
  }

  const base64 = authHeader.slice(6);
  const decoded = atob(base64);
  const [user, ...passwordParts] = decoded.split(':');
  const password = passwordParts.join(':');

  const validUser = process.env.BASIC_AUTH_USER || 'bc';
  const validPassword = process.env.BASIC_AUTH_PASSWORD || 'demo';

  if (user !== validUser || password !== validPassword) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    });
  }

  return NextResponse.next();
}
