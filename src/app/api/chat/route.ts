import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import { getOptionalUser, requireAdmin } from '@/lib/server-auth';
import { chatMessageSchema, parseBody } from '@/lib/validations';
import { rateLimit, getClientIp, CHAT_LIMIT } from '@/lib/rate-limit';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const scope = searchParams.get('scope') || 'user';

        if (scope === 'admin') {
            const auth = await requireAdmin();
            if (!auth.ok) return auth.response;

            const chats = await Chat.find()
                .populate({ path: 'userId', model: User, select: 'name email phone' })
                .sort({ lastUpdated: -1 });
            return NextResponse.json(chats);
        }

        const user = await getOptionalUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const chat = await Chat.findOneAndUpdate(
            { userId: user.id },
            { $setOnInsert: { userId: user.id, messages: [] } },
            { new: true, upsert: true },
        );
        return NextResponse.json(chat);
    } catch (error) {
        console.error('Get chat error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const ip = getClientIp(req);
        const rl = rateLimit(`chat:${ip}`, CHAT_LIMIT);
        if (!rl.allowed) {
            return NextResponse.json(
                { error: `Too many messages. Try again in ${rl.retryAfterSeconds} seconds.` },
                { status: 429 },
            );
        }

        await dbConnect();

        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const parsed = parseBody(chatMessageSchema, body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error }, { status: 400 });
        }

        const { text, userId } = parsed.data;
        if (userId) {
            const auth = await requireAdmin();
            if (!auth.ok) return auth.response;

            const userExists = await User.exists({ _id: userId });
            if (!userExists) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const chat = await Chat.findOneAndUpdate(
                { userId },
                {
                    $push: { messages: { $each: [{ sender: 'admin', text, timestamp: new Date() }], $slice: -500 } },
                    $set: { lastUpdated: new Date() },
                },
                { new: true, upsert: true },
            );
            return NextResponse.json(chat);
        }

        const user = await getOptionalUser();
        if (!user) {
            return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
        }

        const chat = await Chat.findOneAndUpdate(
            { userId: user.id },
            {
                $push: { messages: { $each: [{ sender: 'user', text, timestamp: new Date() }], $slice: -500 } },
                $set: { lastUpdated: new Date() },
            },
            { new: true, upsert: true },
        );
        return NextResponse.json(chat);
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
