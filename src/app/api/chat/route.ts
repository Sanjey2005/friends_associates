import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import { verifyAdminToken, verifyUserToken } from '@/lib/auth';
import { chatMessageSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, CHAT_LIMIT } from '@/lib/rate-limit';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const userToken = cookieStore.get('token')?.value;
        const adminToken = cookieStore.get('admin_token')?.value;
        const { searchParams } = new URL(req.url);
        const scope = searchParams.get('scope') || 'user';

        if (scope === 'admin') {
            if (adminToken && verifyAdminToken(adminToken)) {
                const chats = await Chat.find().populate({ path: 'userId', model: User, select: 'name email' }).sort({ lastUpdated: -1 });
                return NextResponse.json(chats);
            }
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (userToken) {
            const user = verifyUserToken(userToken);
            if (user && typeof user !== 'string' && 'id' in user) {
                // User: Fetch own chat
                let chat = await Chat.findOne({ userId: user.id });
                if (!chat) {
                    chat = await Chat.create({ userId: user.id, messages: [] });
                }
                return NextResponse.json(chat);
            }
        }

        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } catch (error) {
        console.error('Get chat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Rate limiting
        const ip = getClientIp(req);
        const rl = rateLimit(`chat:${ip}`, CHAT_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many messages. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 }
            );
        }

        await dbConnect();
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        const userToken = cookieStore.get('token')?.value;

        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Validate input
        const parsed = parseBody(chatMessageSchema, body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }
        const { text, userId } = parsed.data;

        const isAdminMessage = Boolean(userId);

        if (!isAdminMessage && userToken) {
            const user = verifyUserToken(userToken);

            if (user && typeof user !== 'string' && 'id' in user) {
                const chat = await Chat.findOneAndUpdate(
                    { userId: user.id },
                    {
                        $push: { messages: { sender: 'user', text, timestamp: new Date() } },
                        $set: { lastUpdated: new Date() }
                    },
                    { new: true, upsert: true }
                );
                return NextResponse.json(chat);
            }

            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        if (isAdminMessage) {
            if (!adminToken || !verifyAdminToken(adminToken)) {
                return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
            }

            const chat = await Chat.findOneAndUpdate(
                { userId },
                {
                    $push: { messages: { sender: 'admin', text, timestamp: new Date() } },
                    $set: { lastUpdated: new Date() }
                },
                { new: true, upsert: true }
            );
            return NextResponse.json(chat);
        }

        return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
    } catch (error: any) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
