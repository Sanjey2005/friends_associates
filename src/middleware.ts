import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Edge Middleware — runs before every matched route.
 *
 * Responsibilities:
 *  1. Protect admin dashboard pages — redirect to login if no admin_token.
 *  2. Protect user dashboard pages — redirect to login if no token.
 *  3. Add security headers to all responses.
 *
 * NOTE: We can only check for cookie *existence* here because Edge
 * Runtime doesn't support the `jsonwebtoken` library (it uses Node
 * crypto). Actual token verification still happens in each API route.
 */

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    // ── Security headers ────────────────────────────────────────
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // ── Admin dashboard page guard ──────────────────────────────
    if (pathname.startsWith('/dashboard/admin')) {
        const adminToken = request.cookies.get('admin_token')?.value;
        if (!adminToken) {
            const loginUrl = new URL('/login/admin', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ── User dashboard page guard ───────────────────────────────
    if (pathname.startsWith('/dashboard/user')) {
        const userToken = request.cookies.get('token')?.value;
        if (!userToken) {
            const loginUrl = new URL('/login/user', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return response;
}

/**
 * Matcher — only run middleware on routes that need protection.
 * Static assets, _next, and public files are excluded by default.
 */
export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};
