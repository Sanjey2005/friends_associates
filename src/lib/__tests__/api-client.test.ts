import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch, jsonBody } from '@/lib/api-client';

describe('api-client', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sends JSON requests with same-origin credentials', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ ok: true }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            }),
        );

        await expect(apiFetch('/api/example', { method: 'POST', body: jsonBody({ a: 1 }) })).resolves.toEqual({ ok: true });
        const [, init] = fetchMock.mock.calls[0];

        expect(init?.credentials).toBe('same-origin');
        expect(new Headers(init?.headers).get('Content-Type')).toBe('application/json');
    });

    it('throws typed errors using API error messages', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ error: 'Nope' }), {
                status: 401,
                headers: { 'content-type': 'application/json' },
            }),
        );

        await expect(apiFetch('/api/private')).rejects.toMatchObject<ApiError>({
            name: 'ApiError',
            message: 'Nope',
            status: 401,
        });
    });
});
