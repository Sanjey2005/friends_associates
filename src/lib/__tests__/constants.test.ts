import { describe, expect, it } from 'vitest';
import { BOARD_TYPES, LEAD_STATUSES, POLICY_STATUSES, USER_ROLES, VEHICLE_TYPES } from '@/lib/constants';

describe('shared constants', () => {
    it('keeps shared domain values normalized for models, validation, and UI', () => {
        expect(USER_ROLES).toEqual({ USER: 'user', ADMIN: 'admin' });
        expect(POLICY_STATUSES).toEqual(['Active', 'Expired', 'Expiring Soon']);
        expect(LEAD_STATUSES).toContain("Customer Didn't Pick");
        expect(VEHICLE_TYPES).toEqual(['Bike', 'Car', 'Commercial']);
        expect(BOARD_TYPES).toEqual(['Own Board', 'T Board']);
    });

    it('centralizes auth cookie names', async () => {
        const cookies = await import('@/lib/cookies');

        expect(cookies.COOKIE_NAMES.USER_TOKEN).toBe('token');
        expect(cookies.COOKIE_NAMES.ADMIN_TOKEN).toBe('admin_token');
    });
});
