// @vitest-environment node

import { describe, expect, it } from 'vitest';

describe('logout route handlers', () => {
    it('clears the user auth cookie', async () => {
        const { POST } = await import('@/app/api/auth/user/logout/route');

        const response = await POST();

        expect(response.status).toBe(200);
        expect(response.headers.get('set-cookie')).toContain('token=');
        expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
        expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    });

    it('clears the admin auth cookie', async () => {
        const { POST } = await import('@/app/api/auth/admin/logout/route');

        const response = await POST();

        expect(response.status).toBe(200);
        expect(response.headers.get('set-cookie')).toContain('admin_token=');
        expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
        expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    });
});
