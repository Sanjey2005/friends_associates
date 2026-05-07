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

        try {
            await sendEmail(
                user.email,
                'Reset your password - Friends Associates',
                `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #c96442;">Password Reset Request</h1>
                        <p>We received a request to reset your password. Please click the button below to choose a new password:</p>
                        <p style="margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #c96442; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset My Password</a>
                        </p>
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p><a href="${resetUrl}" style="color: #c96442;">${resetUrl}</a></p>
                        <p>This link will expire in 1 hour.</p>
                        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                        <p style="margin-top: 40px; font-size: 14px; color: #777;">
                            Regards,<br/>
                            Friends Associates Team
                        </p>
                    </div>
                `,
            );
        } catch (emailError) {
            console.error('Password reset email error:', emailError);
        }

        return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
