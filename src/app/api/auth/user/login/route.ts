import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signUserToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { phone, password } = await req.json();

        if (!phone || !password) {
            return NextResponse.json({ error: 'Phone number and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ phone });
        if (!user || !user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = signUserToken({ id: user._id, email: user.email, role: 'user' });

        const response = NextResponse.json({ message: 'Login successful', user: { name: user.name, phone: user.phone } });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: true, // Always use secure in production
            sameSite: 'none', // Changed from 'lax' to 'none' for cross-site compatibility
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
