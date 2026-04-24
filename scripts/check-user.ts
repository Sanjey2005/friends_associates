import dbConnect from '../src/lib/db';
import User from '../src/models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkUser() {
    try {
        await dbConnect();
        console.log('Connected to database');

        const emailsToCheck = ['sanjey8105@gmail.com', 'sanjey0187@gmail.com'];

        for (const email of emailsToCheck) {
            const user = await User.findOne({ email });
            if (user) {
                console.log(`✅ User found: ${email}`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Phone: ${user.phone}`);
                console.log(`   Name: ${user.name}`);
            } else {
                console.log(`❌ User NOT found: ${email}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('Error checking user:', error);
        process.exit(1);
    }
}

checkUser();
