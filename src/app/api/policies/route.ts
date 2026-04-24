import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Policy from '@/models/Policy';
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
            // Admin: Return all policies with filters
            const expiryFilter = searchParams.get('expiry'); // 'active', 'expired', 'soon'
            const search = searchParams.get('search');

            let query: any = {};

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

            // In-memory search filter if search param exists
            if (search) {
                const searchLower = search.toLowerCase();
                const filtered = policies.filter((p: any) => {
                    return (
                        p.userId?.name?.toLowerCase().includes(searchLower) ||
                        p.userId?.email?.toLowerCase().includes(searchLower) ||
                        p.userId?.phone?.includes(search) ||
                        p.vehicleId?.regNumber?.toLowerCase().includes(searchLower)
                    );
                });
                return NextResponse.json(filtered);
            }

            return NextResponse.json(policies);
        }

        if (userToken) {
            const user = verifyUserToken(userToken);
            if (user && typeof user !== 'string' && 'id' in user) {
                // User: Return own policies (restricted fields)
                const policies = await Policy.find({ userId: user.id })
                    .populate({ path: 'vehicleId', model: Vehicle, select: 'type vehicleModel regNumber' })
                    .select('vehicleId policyLink expiryDate status'); // Only allowed fields
                return NextResponse.json(policies);
            }
        }

        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } catch (error) {
        console.error('Get policies error:', error);
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
        const policy = await Policy.create(body);
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
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;

        if (!adminToken || !verifyAdminToken(adminToken)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, policyLink, expiryDate, notes } = body;

        if (!id) {
            return NextResponse.json({ error: 'Policy ID required' }, { status: 400 });
        }

        const updateData: any = {};
        if (policyLink !== undefined) updateData.policyLink = policyLink;
        if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
        if (notes !== undefined) updateData.notes = notes;

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
