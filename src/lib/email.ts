import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production' // Secure in production, bypass in dev if needed
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"Friends Associates" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error: any) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
        if (error.code === 'EAUTH') {
            console.error('Authentication failed. Please check your EMAIL_USER and EMAIL_PASS. If using Gmail, ensure you are using an App Password.');
        }
        // Don't throw in production to avoid crashing the loop, but log it.
        return null;
    }
};
