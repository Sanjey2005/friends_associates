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

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';
    
    // Check if it's the admin subdomain (works for local development too)
    const isAdminDomain = hostname === 'admin.friendsassociates.org' || hostname.startsWith('admin.localhost');

    // 1. Determine Target Path based on Subdomain Routing
    let targetPath = request.nextUrl.pathname;
    
    if (isAdminDomain) {
        if (targetPath === '/') {
            targetPath = '/dashboard/admin';
            url.pathname = targetPath;
        } else if (targetPath === '/login') {
            targetPath = '/login/admin';
            url.pathname = targetPath;
        }
    }

    // 2. Auth Protection Logic
    if (targetPath.startsWith('/dashboard/admin')) {
        const token = request.cookies.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
        const admin = token ? await verifyAdminToken(token) : null;
        if (!admin) {
            // Redirect to the appropriate login page based on domain
            return redirectToLogin(request, isAdminDomain ? '/login' : '/login/admin');
        }
    }

    if (targetPath.startsWith('/dashboard/user')) {
        const token = request.cookies.get(COOKIE_NAMES.USER_TOKEN)?.value;
        const user = token ? await verifyUserToken(token) : null;
        if (!user) {
            return redirectToLogin(request, '/login/user');
        }
    }

    // 3. Apply rewrites if the path was changed by the subdomain router
    let response;
    if (targetPath !== request.nextUrl.pathname) {
        response = NextResponse.rewrite(url);
    } else {
        response = NextResponse.next();
    }

    return applySecurityHeaders(response);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$).*)',
    ],
};
