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
        // Fire and forget email to make resend fast
        sendEmail(
            user.email,
            'Verify your email - Friends Associates',
            `
                <h1>Verify your email</h1>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>This link will expire in 24 hours.</p>
            `,
        ).catch((emailError) => {
            console.error('Resend verification email error:', emailError);
        });

        return NextResponse.json({ message: GENERIC_MESSAGE }, { status: 200 });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
