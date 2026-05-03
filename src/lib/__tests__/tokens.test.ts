import { describe, expect, it } from 'vitest';
import { createToken, hashToken, tokenLookup } from '@/lib/tokens';

describe('tokens', () => {
    it('creates high-entropy hex tokens', () => {
        expect(createToken()).toMatch(/^[a-f0-9]{64}$/);
        expect(createToken()).not.toBe(createToken());
    });

    it('hashes tokens deterministically without returning the raw token', () => {
        const token = 'raw-reset-token';
        expect(hashToken(token)).toBe(hashToken(token));
        expect(hashToken(token)).not.toBe(token);
    });

    it('builds temporary lookup queries for hashed and legacy raw tokens', () => {
        expect(tokenLookup('resetPasswordToken', 'abc')).toEqual({
            $or: [
                { resetPasswordToken: hashToken('abc') },
                { resetPasswordToken: 'abc' },
            ],
        });
    });
});
