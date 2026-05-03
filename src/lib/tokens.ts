import crypto from 'crypto';

export function createToken() {
    return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function tokenLookup(field: string, token: string) {
    return {
        $or: [
            { [field]: hashToken(token) },
            { [field]: token },
        ],
    };
}

export function buildAppUrl(path: string, params: Record<string, string>) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_APP_URL is required to build email links');
    }

    const url = new URL(path, baseUrl);
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }
    return url.toString();
}
