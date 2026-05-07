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

        // Fire and forget email to make registration fast
        sendEmail(
            email,
            'Verify your email - Friends Associates',
            `
                <h1>Welcome to Friends Associates</h1>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="${verificationUrl}">${verificationUrl}</a></p>
                <p>This link will expire in 24 hours.</p>
            `,
        ).catch((emailError) => {
            console.error('Verification email error:', emailError);
        });

        return NextResponse.json(
            { message: 'User registered successfully. Please check your email to verify your account.' },
            { status: 201 },
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
