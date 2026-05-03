import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdminToken, verifyUserToken, type AdminTokenPayload, type UserTokenPayload } from '@/lib/auth';
import { COOKIE_NAMES } from '@/lib/cookies';

type AuthResult<T> =
    | { ok: true; session: T }
    | { ok: false; response: NextResponse };

function unauthorized(message = 'Unauthorized') {
    return NextResponse.json({ error: message }, { status: 401 });
}

export async function getOptionalAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.ADMIN_TOKEN)?.value;
    return token ? verifyAdminToken(token) : null;
}

export async function getOptionalUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAMES.USER_TOKEN)?.value;
    return token ? verifyUserToken(token) : null;
}

export async function requireAdmin(): Promise<AuthResult<AdminTokenPayload>> {
    const admin = await getOptionalAdmin();
    if (!admin) {
        return { ok: false, response: unauthorized() };
    }
    return { ok: true, session: admin };
}

export async function requireUser(): Promise<AuthResult<UserTokenPayload>> {
    const user = await getOptionalUser();
    if (!user) {
        return { ok: false, response: unauthorized('Invalid or missing authentication token') };
    }
    return { ok: true, session: user };
}
