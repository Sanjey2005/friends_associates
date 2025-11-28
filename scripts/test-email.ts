import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testEmail() {
    console.log('📧 Testing Email Configuration...');
    console.log(`   User: ${process.env.EMAIL_USER}`);
    // Mask password for security in logs
    const pass = process.env.EMAIL_PASS || '';
    console.log(`   Pass: ${pass.substring(0, 3)}...${pass.substring(pass.length - 3)} (Length: ${pass.length})`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Missing EMAIL_USER or EMAIL_PASS in .env.local');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false // Bypass SSL check for debugging
        },
        debug: true, // Enable debug output
        logger: true  // Log to console
    });

    try {
        console.log('🔄 Attempting to verify connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('🔄 Attempting to send test email...');
        const info = await transporter.sendMail({
            from: `"Test Script" <${process.env.EMAIL_USER}>`,
            to: 'sanjey8105@gmail.com', // Hardcoded target
            subject: 'Test Email from Friends Associates Debugger',
            text: 'If you receive this, your email configuration is working correctly!',
            html: '<b>If you receive this, your email configuration is working correctly!</b>',
        });

        console.log('✅ Message sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Response:', info.response);
    } catch (error: any) {
        console.error('❌ Error occurred:');
        console.error(error);

        if (error.code === 'EAUTH') {
            console.error('\n⚠️  AUTHENTICATION ERROR');
            console.error('   Please check:');
            console.error('   1. EMAIL_USER is the correct Gmail address.');
            console.error('   2. EMAIL_PASS is a valid 16-character App Password (NOT your login password).');
            console.error('   3. 2-Step Verification is enabled on the account.');
        }
    }
}

testEmail();
