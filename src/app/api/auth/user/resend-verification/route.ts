import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import { forgotPasswordSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, FORGOT_PASSWORD_LIMIT } from '@/lib/rate-limit';
import { buildAppUrl, createToken, hashToken } from '@/lib/tokens';

const GENERIC_MESSAGE = 'If your account needs verification, a new link has been sent to the registered email.';

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const rl = rateLimit(`resend-verification:${ip}`, FORGOT_PASSWORD_LIMIT);
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
        if (!user?.email || user.isVerified) {
            return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
        }

        const verificationToken = createToken();
        user.verificationToken = hashToken(verificationToken);
        user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        const verificationUrl = buildAppUrl('/verify-email', { token: verificationToken });
        try {
            await sendEmail(
                user.email,
                'Verify your email - Friends Associates',
                `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #c96442;">Verify your email</h1>
                        <p>We received a request to resend your verification email.</p>
                        <p style="margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #c96442; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify My Email Address</a>
                        </p>
                        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                        <p><a href="${verificationUrl}" style="color: #c96442;">${verificationUrl}</a></p>
                        <p>This link will expire in 24 hours.</p>
                        <p style="margin-top: 40px; font-size: 14px; color: #777;">
                            Regards,<br/>
                            Friends Associates Team
                        </p>
                    </div>
                `,
            );
        } catch (emailError) {
            console.error('Resend verification email error:', emailError);
        }

        return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
