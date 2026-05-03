import dotenv from 'dotenv';
import path from 'path';
import dbConnect from '../src/lib/db';
import User from '../src/models/User';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function readArg(name: string) {
    const prefix = `--${name}=`;
    const value = process.argv.find((arg) => arg.startsWith(prefix));
    return value?.slice(prefix.length);
}

async function checkUser() {
    const email = readArg('email')?.trim().toLowerCase();
    const phone = readArg('phone')?.trim();

    if (!email && !phone) {
        console.error('Usage: npm run user:check -- --email=person@example.com');
        process.exit(1);
    }

    try {
        await dbConnect();
        const user = await User.findOne(email ? { email } : { phone }).select('name email phone isVerified');
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        console.log(JSON.stringify({
            id: String(user._id),
            name: user.name,
            email: user.email,
            phone: user.phone,
            isVerified: user.isVerified,
        }, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Unable to check user:', error);
        process.exit(1);
    }
}

checkUser();
