// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextResponse } from 'next/server';

const unauthorizedResponse = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

function request(path: string, init?: RequestInit) {
    return new Request(`http://localhost${path}`, init);
}

async function importProtectedRoute(path: string) {
    vi.resetModules();
    vi.doMock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
    vi.doMock('@/lib/server-auth', () => ({
        requireAdmin: vi.fn().mockResolvedValue({ ok: false, response: unauthorizedResponse }),
        requireUser: vi.fn().mockResolvedValue({ ok: false, response: unauthorizedResponse }),
        getOptionalUser: vi.fn().mockResolvedValue(null),
        getOptionalAdmin: vi.fn().mockResolvedValue(null),
    }));
    vi.doMock('@/lib/rate-limit', () => ({
        rateLimit: vi.fn(() => ({ allowed: true, remaining: 5, retryAfterSeconds: 0 })),
        getClientIp: vi.fn(() => '127.0.0.1'),
        CHAT_LIMIT: {},
    }));
    vi.doMock('@/models/User', () => ({ default: {} }));
    vi.doMock('@/models/Vehicle', () => ({ default: {} }));
    vi.doMock('@/models/Policy', () => ({ default: {} }));
    vi.doMock('@/models/Chat', () => ({ default: {} }));

    return import(path);
}

describe('protected route handlers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('requires admin auth for users CRUD', async () => {
        const { GET } = await importProtectedRoute('@/app/api/users/route');

        const response = await GET();

        expect(response.status).toBe(401);
    });

    it('requires admin auth for admin policy scope', async () => {
        const { GET } = await importProtectedRoute('@/app/api/policies/route');

        const response = await GET(request('/api/policies?scope=admin'));

        expect(response.status).toBe(401);
    });

    it('requires user auth for customer policy scope', async () => {
        const { GET } = await importProtectedRoute('@/app/api/policies/route');

        const response = await GET(request('/api/policies'));

        expect(response.status).toBe(401);
    });

    it('requires admin auth for admin vehicle scope', async () => {
        const { GET } = await importProtectedRoute('@/app/api/vehicles/route');

        const response = await GET(request('/api/vehicles?scope=admin'));

        expect(response.status).toBe(401);
    });

    it('requires user auth for customer vehicle scope', async () => {
        const { GET } = await importProtectedRoute('@/app/api/vehicles/route');

        const response = await GET(request('/api/vehicles'));

        expect(response.status).toBe(401);
    });

    it('requires auth before chat messages are created', async () => {
        const { POST } = await importProtectedRoute('@/app/api/chat/route');

        const response = await POST(request('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ text: 'hello' }),
            headers: { 'content-type': 'application/json' },
        }));

        expect(response.status).toBe(401);
    });
});
