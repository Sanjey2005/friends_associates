import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Vehicle from '@/models/Vehicle';
import Policy from '@/models/Policy';
import Chat from '@/models/Chat';
import { requireAdmin } from '@/lib/server-auth';
import { createUserSchema, updateUserSchema, deleteUserSchema, parseBody } from '@/lib/validations';

export async function GET() {
    try {
        await dbConnect();
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

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
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(createUserSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { name, phone, email } = parsed.data;
        const duplicateQuery = email ? { $or: [{ phone }, { email }] } : { phone };
        const existingUser = await User.findOne(duplicateQuery);
        if (existingUser) {
            return NextResponse.json({ error: 'A user with this phone number or email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(phone, 10);
        const user = await User.create({
            name,
            phone,
            email: email || undefined,
            password: hashedPassword,
            isVerified: true,
        });

        const safeUser = await User.findById(user._id).select('-password');
        return NextResponse.json({ message: 'User created successfully', user: safeUser }, { status: 201 });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(updateUserSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const id = parsed.data.id || parsed.data._id;
        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { name, phone, email } = parsed.data;
        const duplicateQuery = email
            ? { $or: [{ phone }, { email }], _id: { $ne: id } }
            : { phone, _id: { $ne: id } };
        const existingUser = await User.findOne(duplicateQuery);
        if (existingUser) {
            return NextResponse.json({ error: 'Phone number or email already in use by another user' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { name, phone, email: email || undefined },
            { new: true },
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
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const parsed = parseBody(deleteUserSchema, { id });
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const user = await User.findByIdAndDelete(parsed.data.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Cascade: remove all data belonging to this user
        await Promise.all([
            Vehicle.deleteMany({ userId: parsed.data.id }),
            Policy.deleteMany({ userId: parsed.data.id }),
            Chat.deleteMany({ userId: parsed.data.id }),
        ]);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
