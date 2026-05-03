import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { requireUser } from '@/lib/server-auth';
import { updateProfileSchema, parseBody } from '@/lib/validations';

export async function GET() {
    try {
        await dbConnect();
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        const user = await User.findById(auth.session.id).select('-password');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(updateProfileSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const user = await User.findById(auth.session.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.name = parsed.data.name;
        user.email = parsed.data.email || undefined;
        await user.save();

        const safeUser = await User.findById(user._id).select('-password');
        return NextResponse.json({ message: 'Profile updated successfully', user: safeUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
