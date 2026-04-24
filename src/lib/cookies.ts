/**
 * Centralized cookie configuration for authentication tokens.
 * All cookies use HttpOnly + Secure + SameSite=Lax + Path=/.
 *
 * SameSite is set to 'lax' instead of 'none' — this provides CSRF
 * protection (cookies are not sent on cross-site POST requests) while
 * still allowing normal top-level navigations from external links.
 */

import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: isProduction,     // Secure=true in production (HTTPS), false in dev (localhost HTTP)
    sameSite: 'lax' as const, // CSRF protection — blocks cross-site POST
    path: '/',
};

/** Cookie options for user authentication tokens. Max age = 1 day. */
export const USER_COOKIE_OPTIONS: Partial<ResponseCookie> = {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24, // 1 day (reduced from 7 days)
};

/** Cookie options for admin authentication tokens. Max age = 8 hours. */
export const ADMIN_COOKIE_OPTIONS: Partial<ResponseCookie> = {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 8, // 8 hours (a working day)
};

/** Cookie name constants */
export const COOKIE_NAMES = {
    USER_TOKEN: 'token',
    ADMIN_TOKEN: 'admin_token',
} as const;
