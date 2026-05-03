declare module 'nodemailer' {
    export interface SendMailOptions {
        from?: string;
        to: string;
        subject: string;
        html?: string;
        text?: string;
    }

    export interface SentMessageInfo {
        messageId: string;
        response?: string;
    }

    export interface Transporter {
        sendMail(options: SendMailOptions): Promise<SentMessageInfo>;
        verify(): Promise<true>;
    }

    export interface TransportOptions {
        service?: string;
        auth?: {
            user?: string;
            pass?: string;
        };
        tls?: {
            rejectUnauthorized?: boolean;
        };
    }

    const nodemailer: {
        createTransport(options: TransportOptions): Transporter;
    };

    export default nodemailer;
}
