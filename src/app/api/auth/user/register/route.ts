import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import { registerSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, REGISTER_LIMIT } from '@/lib/rate-limit';
import { buildAppUrl, createToken, hashToken } from '@/lib/tokens';

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const rl = rateLimit(`register:${ip}`, REGISTER_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many registration attempts. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 },
            );
        }

        await dbConnect();
        const raw = await req.json();
        const parsed = parseBody(registerSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { name, email, phone, password } = parsed.data;
        const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            return NextResponse.json({ error: 'A user with this phone number or email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = createToken();
        const verificationUrl = buildAppUrl('/verify-email', { token: verificationToken });

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            isVerified: false,
            verificationToken: hashToken(verificationToken),
            verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        try {
            await sendEmail(
                email,
                'Verify your email - Friends Associates',
                `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #c96442;">Welcome to Friends Associates</h1>
                        <p>Dear ${name},</p>
                        <p>Thank you for registering an account with Friends Associates. Please verify your email address to get started.</p>
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
            console.error('Verification email error:', emailError);
            // Non-fatal, we can still return success but maybe user will use resend verification later
        }

        return NextResponse.json(
            { message: 'User registered successfully. Please check your email to verify your account.' },
            { status: 201 },
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
