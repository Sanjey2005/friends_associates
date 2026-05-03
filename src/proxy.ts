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

function redirectToLogin(request: NextRequest, loginPath: string) {
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = applySecurityHeaders(NextResponse.next());

    if (pathname.startsWith('/dashboard/admin')) {
        const token = request.cookies.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
        const admin = token ? await verifyAdminToken(token) : null;
        if (!admin) {
            return redirectToLogin(request, '/login/admin');
        }
    }

    if (pathname.startsWith('/dashboard/user')) {
        const token = request.cookies.get(COOKIE_NAMES.USER_TOKEN)?.value;
        const user = token ? await verifyUserToken(token) : null;
        if (!user) {
            return redirectToLogin(request, '/login/user');
        }
    }

    return response;
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
