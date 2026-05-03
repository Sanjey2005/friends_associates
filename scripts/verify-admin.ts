import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import dbConnect from '../src/lib/db';
import Admin from '../src/models/Admin';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function readArg(name: string) {
    const prefix = `--${name}=`;
    const value = process.argv.find((arg) => arg.startsWith(prefix));
    return value?.slice(prefix.length);
}

async function verifyAdmin() {
    const email = (readArg('email') || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const password = readArg('password') || process.env.ADMIN_PASSWORD || '';

    if (!email || !password) {
        console.error('Usage: npm run admin:verify -- --email=admin@example.com --password=StrongPassword123!');
        process.exit(1);
    }

    try {
        await dbConnect();
        const admin = await Admin.findOne({ email });
        const isMatch = Boolean(admin && await bcrypt.compare(password, admin.password));
        console.log(isMatch ? `Admin credentials valid: ${email}` : `Admin credentials invalid: ${email}`);
        process.exit(isMatch ? 0 : 1);
    } catch (error) {
        console.error('Unable to verify admin:', error);
        process.exit(1);
    }
}

verifyAdmin();
