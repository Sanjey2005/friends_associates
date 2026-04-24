/**
 * In-memory rate limiter for Next.js API routes.
 *
 * Uses a sliding-window counter per key (usually IP address).
 * For multi-instance deployments, swap this for a Redis-backed solution.
 */

interface RateLimitEntry {
    count: number;
    resetAt: number; // epoch ms
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean stale entries to avoid memory leaks
const CLEANUP_INTERVAL_MS = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
        if (now > entry.resetAt) {
            store.delete(key);
        }
    }
}

export interface RateLimitConfig {
    /** Maximum number of requests allowed within the window. */
    maxRequests: number;
    /** Window duration in seconds. */
    windowSeconds: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfterSeconds: number;
}

/**
 * Check whether a request identified by `key` is within the rate limit.
 *
 * @param key      Unique identifier — typically the client IP or `${ip}:${route}`.
 * @param config   Rate limit configuration.
 * @returns        Whether the request is allowed and how many attempts remain.
 */
export function rateLimit(key: string, config: RateLimitConfig): RateLimitResult {
    cleanup();

    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const entry = store.get(key);

    // No existing entry or window has expired — allow and start a fresh window
    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: config.maxRequests - 1, retryAfterSeconds: 0 };
    }

    // Within the window
    if (entry.count < config.maxRequests) {
        entry.count += 1;
        return { allowed: true, remaining: config.maxRequests - entry.count, retryAfterSeconds: 0 };
    }

    // Rate limit exceeded
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
}

/**
 * Extract a usable client IP from a Request object.
 * Checks X-Forwarded-For (set by Vercel / reverse proxies) first,
 * then falls back to X-Real-IP, then a fallback string.
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    const realIp = req.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }
    return 'unknown';
}

// ============================================================
// Pre-configured rate limit profiles
// ============================================================

/** Login: 5 attempts per 15 minutes */
export const LOGIN_LIMIT: RateLimitConfig = { maxRequests: 5, windowSeconds: 15 * 60 };

/** Registration: 3 per hour per IP */
export const REGISTER_LIMIT: RateLimitConfig = { maxRequests: 3, windowSeconds: 60 * 60 };

/** Forgot password: 3 per hour per IP */
export const FORGOT_PASSWORD_LIMIT: RateLimitConfig = { maxRequests: 3, windowSeconds: 60 * 60 };

/** Quote / lead submission: 10 per hour per IP */
export const LEAD_SUBMIT_LIMIT: RateLimitConfig = { maxRequests: 10, windowSeconds: 60 * 60 };

/** Chat messages: 30 per minute per user */
export const CHAT_LIMIT: RateLimitConfig = { maxRequests: 30, windowSeconds: 60 };
