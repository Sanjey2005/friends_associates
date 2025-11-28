import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, phone, password } = await req.json();

        if (!name || !phone || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this phone number already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await User.create({
            name,
            email: email || undefined,
            phone,
            password: hashedPassword,
            isVerified: false,
            verificationToken,
            verificationTokenExpiry
        });

        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

        await sendEmail(
            email,
            'Verify your email - Friends Associates',
            `
                <h1>Welcome to Friends Associates</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verifyUrl}">${verifyUrl}</a>
                <p>This link will expire in 24 hours.</p>
            `
        );

        return NextResponse.json({ message: 'User registered successfully. Please check your email to verify your account.' }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
