import { NextResponse } from 'next/server';
import type { FilterQuery } from 'mongoose';
import dbConnect from '@/lib/db';
import Policy, { type IPolicy } from '@/models/Policy';
import Vehicle from '@/models/Vehicle';
import User from '@/models/User';
import { getOptionalUser, requireAdmin } from '@/lib/server-auth';
import { createPolicySchema, updatePolicySchema, parseBody } from '@/lib/validations';

interface PolicySearchView {
    userId?: { name?: string; email?: string; phone?: string };
    vehicleId?: { regNumber?: string };
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const scope = searchParams.get('scope');

        if (scope === 'admin') {
            const auth = await requireAdmin();
            if (!auth.ok) return auth.response;

            const expiryFilter = searchParams.get('expiry');
            const search = searchParams.get('search')?.trim();
            const query: FilterQuery<IPolicy> = {};

            if (expiryFilter) {
                const now = new Date();
                if (expiryFilter === 'expired') {
                    query.expiryDate = { $lt: now };
                } else if (expiryFilter === 'active') {
                    query.expiryDate = { $gte: now };
                } else if (expiryFilter === 'soon') {
                    const sevenDaysFromNow = new Date();
                    sevenDaysFromNow.setDate(now.getDate() + 7);
                    query.expiryDate = { $gte: now, $lte: sevenDaysFromNow };
                }
            }

            const policies = await Policy.find(query)
                .populate({ path: 'userId', model: User, select: 'name email phone' })
                .populate({ path: 'vehicleId', model: Vehicle, select: 'type vehicleModel regNumber' })
                .sort({ expiryDate: 1 });

            if (search) {
                const searchLower = search.toLowerCase();
                const filtered = policies.filter((policy) => {
                    const item = policy as unknown as PolicySearchView;
                    return (
                        item.userId?.name?.toLowerCase().includes(searchLower) ||
                        item.userId?.email?.toLowerCase().includes(searchLower) ||
                        item.userId?.phone?.includes(search) ||
                        item.vehicleId?.regNumber?.toLowerCase().includes(searchLower)
                    );
                });
                return NextResponse.json(filtered);
            }

            return NextResponse.json(policies);
        }

        const user = await getOptionalUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const policies = await Policy.find({ userId: user.id })
            .populate({ path: 'vehicleId', model: Vehicle, select: 'type vehicleModel regNumber' })
            .select('vehicleId policyLink expiryDate status');
        return NextResponse.json(policies);
    } catch (error) {
        console.error('Get policies error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(createPolicySchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const vehicle = await Vehicle.findOne({ _id: parsed.data.vehicleId, userId: parsed.data.userId });
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle does not belong to the selected user' }, { status: 400 });
        }

        const policy = await Policy.create(parsed.data);
        await policy.populate({ path: 'userId', model: User, select: 'name email phone' });
        await policy.populate({ path: 'vehicleId', model: Vehicle, select: 'type vehicleModel regNumber' });
        return NextResponse.json(policy, { status: 201 });
    } catch (error) {
        console.error('Create policy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const auth = await requireAdmin();
        if (!auth.ok) return auth.response;

        const raw = await req.json();
        const parsed = parseBody(updatePolicySchema, raw);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { id, policyLink, expiryDate, notes } = parsed.data;
        const updateData: Partial<Pick<IPolicy, 'policyLink' | 'expiryDate' | 'notes'>> = {};
        if (policyLink !== undefined) updateData.policyLink = policyLink || undefined;
        if (expiryDate !== undefined) updateData.expiryDate = new Date(expiryDate);
        if (notes !== undefined) updateData.notes = notes || undefined;

        const policy = await Policy.findByIdAndUpdate(id, updateData, { new: true });
        if (!policy) {
            return NextResponse.json({ error: 'Policy not found' }, { status: 404 });
        }

        return NextResponse.json(policy);
    } catch (error) {
        console.error('Update policy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
