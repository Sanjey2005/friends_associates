import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { signAdminToken } from '@/lib/auth';
import { adminLoginSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, LOGIN_LIMIT } from '@/lib/rate-limit';
import { ADMIN_COOKIE_OPTIONS, COOKIE_NAMES } from '@/lib/cookies';

export async function POST(req: Request) {
    try {
        // Rate limiting
        const ip = getClientIp(req);
        const rl = rateLimit(`admin-login:${ip}`, LOGIN_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 }
            );
        }

        await dbConnect();
        const raw = await req.json();

        // Validate input
        const parsed = parseBody(adminLoginSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        const { email, password } = parsed.data;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signAdminToken({ id: admin._id, email: admin.email, role: 'admin' });

        const response = NextResponse.json({ message: 'Login successful', admin: { email: admin.email } });

        // Prevent caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        response.cookies.set(COOKIE_NAMES.ADMIN_TOKEN, token, ADMIN_COOKIE_OPTIONS);

        return response;
    } catch (error) {
        console.error('Admin login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
