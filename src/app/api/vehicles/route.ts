import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import { getOptionalUser, requireAdmin } from '@/lib/server-auth';
import { createVehicleSchema, parseBody } from '@/lib/validations';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const scope = searchParams.get('scope');

        if (scope === 'admin') {
            const auth = await requireAdmin();
            if (!auth.ok) return auth.response;

            const vehicles = await Vehicle.find()
                .populate({ path: 'userId', model: User, select: 'name email phone' })
                .sort({ createdAt: -1 });
            return NextResponse.json(vehicles);
        }

        const user = await getOptionalUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vehicles = await Vehicle.find({ userId: user.id }).sort({ createdAt: -1 });
        return NextResponse.json(vehicles);
    } catch (error) {
        console.error('Get vehicles error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(createVehicleSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const vehicle = await Vehicle.create(parsed.data);
        await vehicle.populate({ path: 'userId', model: User, select: 'name email phone' });
        return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
        console.error('Create vehicle error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
