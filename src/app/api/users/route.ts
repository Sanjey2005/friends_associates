import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth';
import { createUserSchema, updateUserSchema, deleteUserSchema, parseBody } from '@/lib/validations';
import bcrypt from 'bcryptjs';

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

export async function POST(req: Request) {
    try {
        await dbConnect();

        // Admin Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const raw = await req.json();

        // Validate input
        const parsed = parseBody(createUserSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        const { name, phone, email } = parsed.data;

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

        const raw = await req.json();

        // Validate input
        const parsed = parseBody(updateUserSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        // Use _id if id is not present (frontend sends _id)
        const id = parsed.data.id || parsed.data._id;
        const { name, phone, email } = parsed.data;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
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

        // Validate ID format
        const parsed = parseBody(deleteUserSchema, { id });
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
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
