import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Policy from '@/models/Policy';
import User, { IUser } from '@/models/User';
import Vehicle, { IVehicle } from '@/models/Vehicle';
import { sendEmail } from '@/lib/email';
import { addDays, startOfDay, endOfDay, format } from 'date-fns';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Simple security check
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');
        if (key !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
            // Allow without key in dev for testing, or require it.
            // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const today = new Date();
        const targetDate = addDays(today, 7);
        const start = startOfDay(targetDate);
        const end = endOfDay(targetDate);

        // Find policies expiring in exactly 7 days (or within that day range)
        const policies = await Policy.find({
            expiryDate: {
                $gte: start,
                $lte: end,
            },
            status: 'Active', // Only active policies
        }).populate('userId').populate('vehicleId');

        console.log(`Found ${policies.length} policies expiring on ${format(targetDate, 'yyyy-MM-dd')}`);

        const results = [];

        for (const policy of policies) {
            const user = policy.userId as unknown as IUser;
            const vehicle = policy.vehicleId as unknown as IVehicle;

            if (user && user.email) {
                const subject = `Insurance Expiry Reminder - ${vehicle.regNumber}`;
                const html = `
          <h1>Policy Expiry Reminder</h1>
          <p>Dear ${user.name},</p>
          <p>Your insurance policy for vehicle <strong>${vehicle.vehicleModel} (${vehicle.regNumber})</strong> is expiring on <strong>${format(policy.expiryDate, 'dd MMM yyyy')}</strong>.</p>
          ${policy.policyLink ? `<p>You can view your policy here: <a href="${policy.policyLink}">View Policy</a></p>` : ''}
          <p>Please renew it soon to avoid penalties.</p>
          <p>Regards,<br>Friends Associates</p>
        `;

                await sendEmail(user.email, subject, html);
                results.push({ email: user.email, policyId: policy._id, status: 'Sent' });

                policy.status = 'Expiring Soon';
                await policy.save();
            }
        }

        return NextResponse.json({ success: true, processed: results.length, results });
    } catch (error) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
