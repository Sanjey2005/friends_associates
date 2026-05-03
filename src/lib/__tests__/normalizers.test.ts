import { describe, expect, it } from 'vitest';
import { normalizeEmail, normalizePhone, normalizeRegistrationNumber } from '@/lib/normalizers';

describe('normalizers', () => {
    it('normalizes email casing and whitespace', () => {
        expect(normalizeEmail('  Person@Example.COM  ')).toBe('person@example.com');
        expect(normalizeEmail('   ')).toBeUndefined();
    });

    it('normalizes phone whitespace without changing meaningful characters', () => {
        expect(normalizePhone(' 98765 43210 ')).toBe('9876543210');
        expect(normalizePhone('+91 98765 43210')).toBe('+919876543210');
    });

    it('normalizes registration numbers for consistent storage', () => {
        expect(normalizeRegistrationNumber(' tn 38 ab 1234 ')).toBe('TN38AB1234');
    });
});
