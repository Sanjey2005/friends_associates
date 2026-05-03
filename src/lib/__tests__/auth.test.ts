// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('auth', () => {
    beforeEach(() => {
        vi.resetModules();
        process.env.JWT_SECRET_USER = 'user-secret-for-tests-user-secret-for-tests';
        process.env.JWT_SECRET_ADMIN = 'admin-secret-for-tests-admin-secret-for-tests';
    });

    it('signs and verifies user tokens with the expected role', async () => {
        const { signUserToken, verifyUserToken, verifyAdminToken } = await import('@/lib/auth');
        const token = await signUserToken({ id: 'user-id', email: 'user@example.com' });

        await expect(verifyUserToken(token)).resolves.toMatchObject({ id: 'user-id', role: 'user' });
        await expect(verifyAdminToken(token)).resolves.toBeNull();
    });

    it('signs and verifies admin tokens with the expected role', async () => {
        const { signAdminToken, verifyAdminToken, verifyUserToken } = await import('@/lib/auth');
        const token = await signAdminToken({ id: 'admin-id', email: 'admin@example.com' });

        await expect(verifyAdminToken(token)).resolves.toMatchObject({ id: 'admin-id', role: 'admin' });
        await expect(verifyUserToken(token)).resolves.toBeNull();
    });
});
