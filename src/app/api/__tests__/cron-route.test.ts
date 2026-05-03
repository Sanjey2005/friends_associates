// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalNodeEnv = process.env.NODE_ENV;

async function importCronRoute() {
    vi.resetModules();
    const query = {
        populate: vi.fn(),
    };
    query.populate.mockReturnValueOnce(query).mockResolvedValueOnce([]);

    vi.doMock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
    vi.doMock('@/lib/email', () => ({ sendEmail: vi.fn(), escapeHtml: (value: string) => value }));
    vi.doMock('@/models/Policy', () => ({ default: { find: vi.fn(() => query) } }));

    return import('@/app/api/cron/reminders/route');
}

describe('cron reminder route', () => {
    beforeEach(() => {
        process.env.NODE_ENV = 'production';
        process.env.CRON_SECRET = 'cron-secret';
    });

    afterEach(() => {
        process.env.NODE_ENV = originalNodeEnv;
        delete process.env.CRON_SECRET;
        vi.clearAllMocks();
    });

    it('rejects requests without the cron secret in production', async () => {
        const { GET } = await importCronRoute();

        const response = await GET(new Request('http://localhost/api/cron/reminders'));

        expect(response.status).toBe(401);
    });

    it('accepts cron auth through the secret header', async () => {
        const { GET } = await importCronRoute();

        const response = await GET(new Request('http://localhost/api/cron/reminders', {
            headers: { 'x-cron-secret': 'cron-secret' },
        }));
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toMatchObject({ success: true, processed: 0 });
    });

    it('keeps the legacy query-param fallback', async () => {
        const { GET } = await importCronRoute();

        const response = await GET(new Request('http://localhost/api/cron/reminders?key=cron-secret'));

        expect(response.status).toBe(200);
    });
});
