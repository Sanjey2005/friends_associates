import type { NextResponse } from 'next/server';
import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
};

export const USER_COOKIE_OPTIONS: Partial<ResponseCookie> = {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 24,
};

export const ADMIN_COOKIE_OPTIONS: Partial<ResponseCookie> = {
    ...baseCookieOptions,
    maxAge: 60 * 60 * 8,
};

export const COOKIE_NAMES = {
    USER_TOKEN: 'token',
    ADMIN_TOKEN: 'admin_token',
} as const;

export function clearCookie(response: NextResponse, name: string) {
    response.cookies.set(name, '', {
        ...baseCookieOptions,
        maxAge: 0,
        expires: new Date(0),
    });
}

export function clearUserCookie(response: NextResponse) {
    clearCookie(response, COOKIE_NAMES.USER_TOKEN);
}

export function clearAdminCookie(response: NextResponse) {
    clearCookie(response, COOKIE_NAMES.ADMIN_TOKEN);
}
