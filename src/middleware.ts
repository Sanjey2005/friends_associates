import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminToken, verifyUserToken } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/cookies';

function applySecurityHeaders(response: NextResponse) {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return response;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';
    const isAdminDomain = hostname === 'admin.friendsassociates.org';

    // --- Admin subdomain: redirect root to admin login/dashboard ---
    if (isAdminDomain && pathname === '/') {
        const token = request.cookies.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
        const admin = token ? await verifyAdminToken(token) : null;
        const target = request.nextUrl.clone();
        target.pathname = admin ? '/dashboard/admin' : '/login/admin';
        return NextResponse.redirect(target);
    }

    // --- Protect /dashboard/admin ---
    if (pathname.startsWith('/dashboard/admin')) {
        const token = request.cookies.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
        const admin = token ? await verifyAdminToken(token) : null;
        if (!admin) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/login/admin';
            loginUrl.searchParams.set('redirect', pathname);
            return applySecurityHeaders(NextResponse.redirect(loginUrl));
        }
    }

    // --- Protect /dashboard/user ---
    if (pathname.startsWith('/dashboard/user')) {
        const token = request.cookies.get(COOKIE_NAMES.USER_TOKEN)?.value;
        const user = token ? await verifyUserToken(token) : null;
        if (!user) {
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/login/user';
            loginUrl.searchParams.set('redirect', pathname);
            return applySecurityHeaders(NextResponse.redirect(loginUrl));
        }
    }

    return applySecurityHeaders(NextResponse.next());
}

export const config = {
    // Only run middleware on the root path and dashboard routes.
    // This is intentionally narrow to avoid interfering with static assets,
    // API routes, or any other pages on the main domain.
    matcher: ['/', '/dashboard/:path*'],
};
