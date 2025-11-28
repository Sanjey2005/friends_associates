import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, phone } = await req.json();

        if (!email && !phone) {
            return NextResponse.json({ error: 'Email or Phone is required' }, { status: 400 });
        }

        let user;
        if (email) {
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ phone });
        }

        if (!user) {
            // Don't reveal if user exists
            return NextResponse.json({ message: 'If an account exists, a password reset link has been sent to the registered email.' }, { status: 200 });
        }

        if (!user.email) {
            return NextResponse.json({ error: 'No email found for this user. Please contact admin to reset password.' }, { status: 400 });
        }

        const targetEmail = user.email;

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        await sendEmail(
            targetEmail,
            'Reset your password - Friends Associates',
            `
                <h1>Password Reset Request</h1>
                <p>You requested to reset your password. Please click the link below to verify your email address:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        );

        return NextResponse.json({ message: 'If an account exists, a password reset link has been sent to the registered email.' }, { status: 200 });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
