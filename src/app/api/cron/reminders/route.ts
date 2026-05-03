import { NextResponse } from 'next/server';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';
import dbConnect from '@/lib/db';
import Policy from '@/models/Policy';
import { sendEmail, escapeHtml } from '@/lib/email';
import type { IUser } from '@/models/User';
import type { IVehicle } from '@/models/Vehicle';

function isAuthorizedCron(req: Request) {
    const secret = process.env.CRON_SECRET;
    if (process.env.NODE_ENV !== 'production' && !secret) {
        return true;
    }

    const provided = req.headers.get('x-cron-secret') || new URL(req.url).searchParams.get('key');
    return Boolean(secret && provided === secret);
}

export async function GET(req: Request) {
    try {
        if (!isAuthorizedCron(req)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const targetDate = addDays(new Date(), 7);
        const start = startOfDay(targetDate);
        const end = endOfDay(targetDate);

        const policies = await Policy.find({
            expiryDate: { $gte: start, $lte: end },
            status: 'Active',
        }).populate('userId').populate('vehicleId');

        const results: { email: string; policyId: string; status: 'Sent' | 'Skipped' }[] = [];

        for (const policy of policies) {
            const user = policy.userId as unknown as IUser;
            const vehicle = policy.vehicleId as unknown as IVehicle;
            if (!user?.email || !vehicle) {
                results.push({ email: user?.email || 'missing-email', policyId: String(policy._id), status: 'Skipped' });
                continue;
            }

            const vehicleLabel = `${escapeHtml(vehicle.vehicleModel)} (${escapeHtml(vehicle.regNumber)})`;
            const policyLink = policy.policyLink
                ? `<p>You can view your policy here: <a href="${policy.policyLink}">View Policy</a></p>`
                : '';

            await sendEmail(
                user.email,
                `Insurance Expiry Reminder - ${vehicle.regNumber}`,
                `
                    <h1>Policy Expiry Reminder</h1>
                    <p>Dear ${escapeHtml(user.name)},</p>
                    <p>Your insurance policy for vehicle <strong>${vehicleLabel}</strong> is expiring on <strong>${format(policy.expiryDate, 'dd MMM yyyy')}</strong>.</p>
                    ${policyLink}
                    <p>Please renew it soon to avoid penalties.</p>
                    <p>Regards,<br>Friends Associates</p>
                `,
            );

            results.push({ email: user.email, policyId: String(policy._id), status: 'Sent' });
            policy.status = 'Expiring Soon';
            await policy.save();
        }

        return NextResponse.json({ success: true, processed: results.length, results });
    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
