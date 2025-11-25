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
