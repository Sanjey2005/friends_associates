import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
