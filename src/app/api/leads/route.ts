import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lead from '@/models/Lead';
import { requireAdmin } from '@/lib/server-auth';
import { createLeadSchema, updateLeadSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, LEAD_SUBMIT_LIMIT } from '@/lib/rate-limit';

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const rl = rateLimit(`lead:${ip}`, LEAD_SUBMIT_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many submissions. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 },
            );
        }

        await dbConnect();
        const raw = await req.json();
        const parsed = parseBody(createLeadSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const lead = await Lead.create(parsed.data);
        return NextResponse.json({ message: 'Quote submitted successfully', lead }, { status: 201 });
    } catch (error) {
        console.error('Lead submission error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

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
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(updateLeadSchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const lead = await Lead.findByIdAndUpdate(parsed.data.id, { status: parsed.data.status }, { new: true });
        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(lead);
    } catch (error) {
        console.error('Update lead error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
