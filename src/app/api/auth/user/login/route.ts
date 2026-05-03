import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signUserToken } from '@/lib/auth';
import { loginSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, LOGIN_LIMIT } from '@/lib/rate-limit';
import { USER_COOKIE_OPTIONS, COOKIE_NAMES } from '@/lib/cookies';

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const rl = rateLimit(`login:${ip}`, LOGIN_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 },
            );
        }

        await dbConnect();
        const raw = await req.json();
        const parsed = parseBody(loginSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { phone, password } = parsed.data;
        const user = await User.findOne({ phone });
        if (!user?.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before signing in.' },
                { status: 403 },
            );
        }

        const token = await signUserToken({ id: String(user._id), email: user.email });
        const response = NextResponse.json({
            message: 'Login successful',
            user: { name: user.name, phone: user.phone, email: user.email },
        });

        response.cookies.set(COOKIE_NAMES.USER_TOKEN, token, USER_COOKIE_OPTIONS);
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
