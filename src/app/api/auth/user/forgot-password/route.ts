import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import { forgotPasswordSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, FORGOT_PASSWORD_LIMIT } from '@/lib/rate-limit';
import { buildAppUrl, createToken, hashToken } from '@/lib/tokens';

const GENERIC_MESSAGE = 'If an account exists, a password reset link has been sent to the registered email.';

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const rl = rateLimit(`forgot-pass:${ip}`, FORGOT_PASSWORD_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many attempts. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 },
            );
        }

        await dbConnect();
        const raw = await req.json();
        const parsed = parseBody(forgotPasswordSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { email, phone } = parsed.data;
        const user = email ? await User.findOne({ email }) : await User.findOne({ phone });
        if (!user?.email) {
            return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
        }

        const resetToken = createToken();
        user.resetPasswordToken = hashToken(resetToken);
        user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
        await user.save();

        const resetUrl = buildAppUrl('/reset-password', { token: resetToken });
        // Fire and forget email to make reset fast
        sendEmail(
            user.email,
            'Reset your password - Friends Associates',
            `
                <h1>Password Reset Request</h1>
                <p>You requested to reset your password. Please click the link below:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        ).catch((emailError) => {
            console.error('Password reset email error:', emailError);
        });

        return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
