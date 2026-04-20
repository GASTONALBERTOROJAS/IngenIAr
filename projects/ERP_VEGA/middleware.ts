import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require a specific role to access
const ROLE_PROTECTED_ROUTES: Array<{ path: string; roles: string[] }> = [
  { path: '/users',         roles: ['admin'] },
  { path: '/reports',       roles: ['admin', 'direction', 'finance'] },
  { path: '/sourcing-board',roles: ['admin', 'conversion', 'direction', 'finance'] },
  { path: '/rfq',           roles: ['admin', 'conversion'] },
  { path: '/contracts',     roles: ['admin', 'purchasing_steel', 'purchasing_flanges'] },
  { path: '/suppliers',     roles: ['admin', 'purchasing_steel', 'purchasing_flanges', 'internals', 'logistics', 'conversion'] },
  { path: '/tasks',         roles: ['admin', 'purchasing_steel', 'purchasing_flanges', 'internals', 'logistics', 'conversion', 'direction', 'finance'] },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — always allow
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Redirect unauthenticated users to login
  if (!token) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const role = token.role as string;

  // Check role-based route protection (dashboard pages only)
  for (const route of ROLE_PROTECTED_ROUTES) {
    if (pathname.startsWith(route.path) && !route.roles.includes(role)) {
      // Redirect to dashboard with insufficient permissions
      return NextResponse.redirect(new URL('/dashboard?error=forbidden', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api/auth).*)'],
};
