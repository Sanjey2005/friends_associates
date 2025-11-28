import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { verifyAdminToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Validate required fields
        const { name, email, phone, vehicleType, insuranceType } = body;
        if (!name || !email || !phone || !vehicleType || !insuranceType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await Lead.create(body);
        return NextResponse.json({ message: 'Quote submitted successfully', lead }, { status: 201 });
    } catch (error) {
        console.error('Lead submission error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Check admin auth
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const leads = await Lead.find().sort({ createdAt: -1 });
        return NextResponse.json(leads);
    } catch (error) {
        console.error('Get leads error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();

        // Check admin auth
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;

        if (!token || !verifyAdminToken(token)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Update lead error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
