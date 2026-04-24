import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import dbConnect from '../src/lib/db';
import Admin from '../src/models/Admin';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function seedAdmin() {
    try {
        await dbConnect();
        console.log('Connected to database');

        const email = 'ethirajr.cbe@gmail.com';
        const password = 'Sravan@123';

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const admin = await Admin.create({
            email,
            password: hashedPassword,
            role: 'admin',
        });

        console.log('Admin created successfully:', admin.email);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
