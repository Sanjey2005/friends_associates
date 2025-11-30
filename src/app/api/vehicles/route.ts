import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import { verifyAdminToken, verifyUserToken } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        const userToken = cookieStore.get('token')?.value;

        const { searchParams } = new URL(req.url);
        const scope = searchParams.get('scope');

        if (scope === 'admin' && adminToken && verifyAdminToken(adminToken)) {
            // Admin: Return all vehicles
            const vehicles = await Vehicle.find().populate({ path: 'userId', model: User, select: 'name email phone' });
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

export async function POST(req: Request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken || !verifyAdminToken(adminToken)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        // body should contain: userId, type, vehicleModel, regNumber, details
        const vehicle = await Vehicle.create(body);
        await vehicle.populate({ path: 'userId', model: User, select: 'name email phone' });
        return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
        console.error('Create vehicle error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
