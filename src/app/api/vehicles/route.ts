import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Vehicle from '@/models/Vehicle';
import { verifyAdminToken, verifyUserToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        const userToken = cookieStore.get('token')?.value;

        if (adminToken && verifyAdminToken(adminToken)) {
            // Admin: Return all vehicles
            const vehicles = await Vehicle.find().populate('userId', 'name email phone');
            return NextResponse.json(vehicles);
        }

        if (userToken) {
            const user = verifyUserToken(userToken);
            if (user && typeof user !== 'string' && 'id' in user) {
                // User: Return own vehicles
                const vehicles = await Vehicle.find({ userId: user.id });
                return NextResponse.json(vehicles);
            }
        }

        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } catch (error) {
        console.error('Get vehicles error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
