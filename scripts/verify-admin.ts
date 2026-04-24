import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import dbConnect from '../src/lib/db';
import Admin from '../src/models/Admin';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyAdmin() {
    try {
        await dbConnect();
        console.log('Connected to database');

        const email = 'ethirajr.cbe@gmail.com';
        const password = 'Sravan@123';

        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin NOT found');
        } else {
            console.log('Admin found:', admin.email);
            console.log('Hashed Password in DB:', admin.password);

            const isMatch = await bcrypt.compare(password, admin.password);
            console.log('Password match:', isMatch);
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyAdmin();
