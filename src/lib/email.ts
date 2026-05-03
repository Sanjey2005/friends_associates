import nodemailer, { type Transporter } from 'nodemailer';

let cachedTransporter: Transporter | null = null;

function getTransporter() {
    if (cachedTransporter) {
        return cachedTransporter;
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        throw new Error('EMAIL_USER and EMAIL_PASS are required to send email');
    }

    cachedTransporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user, pass },
        tls: {
            rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
    });

    return cachedTransporter;
}

export function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

export async function sendEmail(to: string, subject: string, html: string) {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
        from: `"Friends Associates" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });

    return info;
}
