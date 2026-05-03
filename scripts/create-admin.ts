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

async function createAdmin() {
    const email = (readArg('email') || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const password = readArg('password') || process.env.ADMIN_PASSWORD || '';

    if (!email || !password) {
        console.error('Usage: npm run admin:create -- --email=admin@example.com --password=StrongPassword123!');
        process.exit(1);
    }

    try {
        await dbConnect();
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log(`Admin updated: ${email}`);
        } else {
            await Admin.create({ email, password: hashedPassword, role: 'admin' });
            console.log(`Admin created: ${email}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Unable to create admin:', error);
        process.exit(1);
    }
}

createAdmin();
