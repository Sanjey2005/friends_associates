import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { USER_ROLES, type UserRole } from '@/lib/constants';

export interface AppTokenPayload extends JWTPayload {
    id: string;
    role: UserRole;
    email?: string;
}

export type UserTokenPayload = AppTokenPayload & { role: typeof USER_ROLES.USER };
export type AdminTokenPayload = AppTokenPayload & { role: typeof USER_ROLES.ADMIN };
type SignPayload = Pick<AppTokenPayload, 'id' | 'email'>;

const userSecret = process.env.JWT_SECRET_USER || '';
const adminSecret = process.env.JWT_SECRET_ADMIN || '';

const encoder = new TextEncoder();
const userKey = encoder.encode(userSecret);
const adminKey = encoder.encode(adminSecret);

async function signToken(payload: AppTokenPayload, secret: Uint8Array, expiresIn: string) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(secret);
}

async function verifyToken<T extends AppTokenPayload>(
    token: string,
    secret: Uint8Array,
    expectedRole: UserRole,
) {
    try {
        const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
        if (payload.role !== expectedRole || typeof payload.id !== 'string') {
            return null;
        }
        return payload as T;
    } catch {
        return null;
    }
}

export function signUserToken(payload: SignPayload) {
    return signToken({ ...payload, role: USER_ROLES.USER }, userKey, '1d');
}

export function verifyUserToken(token: string) {
    return verifyToken<UserTokenPayload>(token, userKey, USER_ROLES.USER);
}

export function signAdminToken(payload: SignPayload) {
    return signToken({ ...payload, role: USER_ROLES.ADMIN }, adminKey, '8h');
}

export function verifyAdminToken(token: string) {
    return verifyToken<AdminTokenPayload>(token, adminKey, USER_ROLES.ADMIN);
}
