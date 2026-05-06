export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

function getErrorMessage(data: unknown, fallback: string) {
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
        return data.error;
    }
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        return data.message;
    }
    return fallback;
}

export function errorMessage(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return fallback;
}

export async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    const body = init.body;

    if (body !== undefined && !(body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    // CSRF mitigation: browsers cannot set this header on cross-origin requests
    headers.set('X-Requested-With', 'XMLHttpRequest');

    const response = await fetch(input, {
        credentials: 'same-origin',
        cache: 'no-store',
        ...init,
        headers,
        body,
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
        throw new ApiError(getErrorMessage(data, 'Request failed'), response.status, data);
    }

    return data as T;
}

export function jsonBody(data: unknown) {
    return JSON.stringify(data);
}
