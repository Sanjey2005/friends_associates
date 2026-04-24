import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import { verifyAdminToken, verifyUserToken } from '@/lib/auth';
import { createVehicleSchema, parseBody } from '@/lib/validations';

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

        const raw = await req.json();

        // Validate input — only whitelisted fields
        const parsed = parseBody(createVehicleSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const validData = parsed.data;

        // Sanitize regNumber: Remove all spaces
        validData.regNumber = validData.regNumber.replace(/\s+/g, '');

        const vehicle = await Vehicle.create(validData);
        await vehicle.populate({ path: 'userId', model: User, select: 'name email phone' });
        return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
        console.error('Create vehicle error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
