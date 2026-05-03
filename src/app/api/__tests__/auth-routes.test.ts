// @vitest-environment node

import bcrypt from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUserModel = {
    create: vi.fn(),
    findByIdAndDelete: vi.fn(),
    findOne: vi.fn(),
};

const mockSendEmail = vi.fn();

function jsonRequest(body: unknown) {
    return new Request('http://localhost/api/test', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'content-type': 'application/json' },
    });
}

async function importAuthRoute(path: string) {
    vi.resetModules();
    process.env.JWT_SECRET_USER = 'user-secret-for-tests-user-secret-for-tests';
    process.env.JWT_SECRET_ADMIN = 'admin-secret-for-tests-admin-secret-for-tests';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

    vi.doMock('@/lib/db', () => ({ default: vi.fn().mockResolvedValue(undefined) }));
    vi.doMock('@/lib/email', () => ({ sendEmail: mockSendEmail }));
    vi.doMock('@/lib/rate-limit', () => ({
        rateLimit: vi.fn(() => ({ allowed: true, remaining: 3, retryAfterSeconds: 0 })),
        getClientIp: vi.fn(() => '127.0.0.1'),
        REGISTER_LIMIT: {},
        LOGIN_LIMIT: {},
        FORGOT_PASSWORD_LIMIT: {},
    }));
    vi.doMock('@/models/User', () => ({ default: mockUserModel }));

    return import(path);
}

describe('auth route handlers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('registers self-service users with a hashed verification token', async () => {
        const createdUser = { _id: 'user-id' };
        mockUserModel.findOne.mockResolvedValue(null);
        mockUserModel.create.mockResolvedValue(createdUser);
        mockSendEmail.mockResolvedValue({ messageId: 'mail-id' });
        const { POST } = await importAuthRoute('@/app/api/auth/user/register/route');

        const response = await POST(jsonRequest({
            name: 'Sam User',
            email: 'SAM@example.com',
            phone: '9876543210',
            password: 'Strong1!',
        }));
        const body = await response.json();
        const createdPayload = mockUserModel.create.mock.calls[0][0];

        expect(response.status).toBe(201);
        expect(body.message).toContain('Please check your email');
        expect(createdPayload.email).toBe('sam@example.com');
        expect(createdPayload.verificationToken).toHaveLength(64);
        expect(mockSendEmail).toHaveBeenCalledWith(
            'sam@example.com',
            expect.stringContaining('Verify'),
            expect.stringContaining('/verify-email?token='),
        );
    });

    it('rejects unverified users at login', async () => {
        mockUserModel.findOne.mockResolvedValue({
            _id: 'user-id',
            email: 'user@example.com',
            phone: '9876543210',
            password: await bcrypt.hash('Strong1!', 10),
            isVerified: false,
        });
        const { POST } = await importAuthRoute('@/app/api/auth/user/login/route');

        const response = await POST(jsonRequest({ phone: '9876543210', password: 'Strong1!' }));
        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body.error).toContain('verify your email');
    });

    it('logs in verified users and sets the HttpOnly auth cookie', async () => {
        mockUserModel.findOne.mockResolvedValue({
            _id: 'user-id',
            name: 'Sam User',
            email: 'user@example.com',
            phone: '9876543210',
            password: await bcrypt.hash('Strong1!', 10),
            isVerified: true,
        });
        const { POST } = await importAuthRoute('@/app/api/auth/user/login/route');

        const response = await POST(jsonRequest({ phone: '9876543210', password: 'Strong1!' }));

        expect(response.status).toBe(200);
        expect(response.headers.get('set-cookie')).toContain('token=');
        expect(response.headers.get('set-cookie')).toContain('HttpOnly');
    });

    it('resends verification using a generic response', async () => {
        const save = vi.fn().mockResolvedValue(undefined);
        mockUserModel.findOne.mockResolvedValue({
            email: 'user@example.com',
            isVerified: false,
            save,
        });
        mockSendEmail.mockResolvedValue({ messageId: 'mail-id' });
        const { POST } = await importAuthRoute('@/app/api/auth/user/resend-verification/route');

        const response = await POST(jsonRequest({ email: 'user@example.com' }));
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.message).toContain('If your account needs verification');
        expect(save).toHaveBeenCalled();
        expect(mockSendEmail).toHaveBeenCalled();
    });

    it('verifies users with hashed or legacy plaintext token lookup', async () => {
        const save = vi.fn().mockResolvedValue(undefined);
        const select = vi.fn().mockResolvedValue({ isVerified: false, save });
        mockUserModel.findOne.mockReturnValue({ select });
        const { POST } = await importAuthRoute('@/app/api/auth/user/verify/route');

        const response = await POST(jsonRequest({ token: 'token-value' }));
        const body = await response.json();
        const query = mockUserModel.findOne.mock.calls[0][0];

        expect(response.status).toBe(200);
        expect(body.message).toContain('Email verified');
        expect(query.$or).toHaveLength(2);
        expect(save).toHaveBeenCalled();
    });

    it('keeps forgot-password responses generic and stores only hashed reset tokens', async () => {
        const save = vi.fn().mockResolvedValue(undefined);
        const user = { email: 'user@example.com', save };
        mockUserModel.findOne.mockResolvedValue(user);
        mockSendEmail.mockResolvedValue({ messageId: 'mail-id' });
        const { POST } = await importAuthRoute('@/app/api/auth/user/forgot-password/route');

        const response = await POST(jsonRequest({ email: 'user@example.com' }));
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.message).toContain('If an account exists');
        expect(user).toMatchObject({ resetPasswordToken: expect.stringMatching(/^[a-f0-9]{64}$/) });
        expect(mockSendEmail).toHaveBeenCalledWith(
            'user@example.com',
            expect.stringContaining('Reset'),
            expect.stringContaining('/reset-password?token='),
        );
    });

    it('resets passwords through hashed or legacy plaintext token lookup', async () => {
        const save = vi.fn().mockResolvedValue(undefined);
        const user = { save };
        const select = vi.fn().mockResolvedValue(user);
        mockUserModel.findOne.mockReturnValue({ select });
        const { POST } = await importAuthRoute('@/app/api/auth/user/reset-password/route');

        const response = await POST(jsonRequest({ token: 'token-value', password: 'Newpass1!' }));
        const body = await response.json();
        const query = mockUserModel.findOne.mock.calls[0][0];

        expect(response.status).toBe(200);
        expect(body.message).toContain('Password reset');
        expect(query.$or).toHaveLength(2);
        expect(user).toMatchObject({ resetPasswordToken: undefined, resetPasswordTokenExpiry: undefined });
        expect(save).toHaveBeenCalled();
    });
});
