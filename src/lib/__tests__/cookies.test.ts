// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { NextResponse } from 'next/server';
import { clearAdminCookie, clearUserCookie, COOKIE_NAMES } from '@/lib/cookies';

describe('cookie helpers', () => {
    it('clears the user auth cookie with HttpOnly options', () => {
        const response = NextResponse.json({ ok: true });

        clearUserCookie(response);

        const header = response.headers.get('set-cookie') || '';
        expect(header).toContain(`${COOKIE_NAMES.USER_TOKEN}=`);
        expect(header).toContain('Max-Age=0');
        expect(header).toContain('HttpOnly');
        expect(header).toContain('SameSite=lax');
    });

    it('clears the admin auth cookie with HttpOnly options', () => {
        const response = NextResponse.json({ ok: true });

        clearAdminCookie(response);

        const header = response.headers.get('set-cookie') || '';
        expect(header).toContain(`${COOKIE_NAMES.ADMIN_TOKEN}=`);
        expect(header).toContain('Max-Age=0');
        expect(header).toContain('HttpOnly');
        expect(header).toContain('SameSite=lax');
    });
});
