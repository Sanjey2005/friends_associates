import dotenv from 'dotenv';
import path from 'path';
import { sendEmail } from '../src/lib/email';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function readArg(name: string) {
    const prefix = `--${name}=`;
    const value = process.argv.find((arg) => arg.startsWith(prefix));
    return value?.slice(prefix.length);
}

async function testEmail() {
    const to = readArg('to') || process.env.TEST_EMAIL_TO;
    if (!to) {
        console.error('Usage: npm run email:test -- --to=person@example.com');
        process.exit(1);
    }

    try {
        const info = await sendEmail(
            to,
            'Test Email from Friends Associates',
            '<p>Your email configuration is working correctly.</p>',
        );
        console.log(`Email sent: ${info.messageId}`);
        process.exit(0);
    } catch (error) {
        console.error('Unable to send test email:', error);
        process.exit(1);
    }
}

testEmail();
