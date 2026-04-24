import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
    await dbConnect();

    // Admin Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await verifyAdminToken(token);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Admin Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, phone, email } = await req.json();

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
        }

        // Check if phone already exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return NextResponse.json({ error: 'User with this phone number already exists' }, { status: 400 });
        }

        // Default password is the phone number
        const hashedPassword = await bcrypt.hash(phone, 10);

        const user = await User.create({
            name,
            phone,
            email: email || undefined, // Optional
            password: hashedPassword,
            isVerified: true, // Admin created users are verified
        });

        return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, name, phone, email } = await req.json();

        if (!id || !name || !phone) {
            return NextResponse.json({ error: 'ID, Name and Phone are required' }, { status: 400 });
        }

        // Check if phone exists for OTHER users
        const existingUser = await User.findOne({ phone, _id: { $ne: id } });
        if (existingUser) {
            return NextResponse.json({ error: 'Phone number already in use by another user' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { name, phone, email: email || undefined },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
