import { describe, expect, it } from 'vitest';
import { createLeadSchema, parseBody, registerSchema, updateLeadSchema } from '@/lib/validations';

describe('validations', () => {
    it('requires email for self registration and normalizes identifiers', () => {
        const parsed = parseBody(registerSchema, {
            name: 'Test User',
            email: ' USER@Example.COM ',
            phone: '98765 43210',
            password: 'Strong1!',
        });

        expect(parsed.success).toBe(true);
        if (parsed.success) {
            expect(parsed.data.email).toBe('user@example.com');
            expect(parsed.data.phone).toBe('9876543210');
        }
    });

    it('rejects registration without email', () => {
        const parsed = parseBody(registerSchema, {
            name: 'Test User',
            phone: '9876543210',
            password: 'Strong1!',
        });

        expect(parsed.success).toBe(false);
    });

    it('keeps lead status values aligned with the model enum', () => {
        expect(parseBody(updateLeadSchema, { id: '507f1f77bcf86cd799439011', status: "Customer Didn't Pick" }).success).toBe(true);
        expect(parseBody(updateLeadSchema, { id: '507f1f77bcf86cd799439011', status: 'Customer Didn’t Pick' }).success).toBe(false);
    });

    it('accepts quote leads with normalized public input', () => {
        const parsed = parseBody(createLeadSchema, {
            name: 'Customer',
            email: 'CUSTOMER@EXAMPLE.COM',
            phone: '98765 43210',
            vehicleType: 'Car',
            insuranceType: 'Comprehensive',
        });

        expect(parsed.success).toBe(true);
        if (parsed.success) {
            expect(parsed.data.email).toBe('customer@example.com');
            expect(parsed.data.phone).toBe('9876543210');
        }
    });
});
