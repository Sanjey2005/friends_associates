import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { resetPasswordSchema, parseBody } from '@/lib/validations';
import { tokenLookup } from '@/lib/tokens';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const raw = await req.json();
        const parsed = parseBody(resetPasswordSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { token, password } = parsed.data;
        const user = await User.findOne({
            ...tokenLookup('resetPasswordToken', token),
            resetPasswordTokenExpiry: { $gt: new Date() },
        }).select('+resetPasswordToken');

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
