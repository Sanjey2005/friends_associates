import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { verifyAdminToken, verifyUserToken } from '@/lib/auth';

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
                const chats = await Chat.find().populate('userId', 'name email').sort({ lastUpdated: -1 });
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
        await dbConnect();
        const cookieStore = await cookies();
        const adminToken = cookieStore.get('admin_token')?.value;
        const userToken = cookieStore.get('token')?.value;

        console.log('=== Chat POST Request ===');
        console.log('Admin token exists:', !!adminToken);
        console.log('User token exists:', !!userToken);

        let body;
        try {
            body = await req.json();
            console.log('Request body:', JSON.stringify(body));
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { text, userId } = body;
        const trimmedText = typeof text === 'string' ? text.trim() : '';

        if (!trimmedText) {
            console.log('Error: Message text is invalid:', text);
            return NextResponse.json({ error: 'Message text is required and must be a non-empty string' }, { status: 400 });
        }

        const isAdminMessage = Boolean(userId);

        if (!isAdminMessage && userToken) {
            console.log('Verifying user token...');
            const user = verifyUserToken(userToken);
            console.log('User verification result:', user ? 'valid' : 'invalid');

            if (user && typeof user !== 'string' && 'id' in user) {
                console.log('User sending message. User ID:', user.id);
                const chat = await Chat.findOneAndUpdate(
                    { userId: user.id },
                    {
                        $push: { messages: { sender: 'user', text: trimmedText, timestamp: new Date() } },
                        $set: { lastUpdated: new Date() }
                    },
                    { new: true, upsert: true }
                );
                console.log('User message sent successfully. Chat ID:', chat._id);
                return NextResponse.json(chat);
            }

            console.log('Error: Invalid user token structure');
            return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
        }

        if (isAdminMessage) {
            if (!adminToken || !verifyAdminToken(adminToken)) {
                console.log('Error: Admin message without valid admin token');
                return NextResponse.json({ error: 'Admin authentication required' }, { status: 401 });
            }

            console.log('Admin sending message to user:', userId);
            const chat = await Chat.findOneAndUpdate(
                { userId },
                {
                    $push: { messages: { sender: 'admin', text: trimmedText, timestamp: new Date() } },
                    $set: { lastUpdated: new Date() }
                },
                { new: true, upsert: true }
            );
            console.log('Admin message sent successfully');
            return NextResponse.json(chat);
        }

        console.log('Error: No valid authentication token found');
        return NextResponse.json({ error: 'No authentication token provided' }, { status: 401 });
    } catch (error: any) {
        console.error('Send message error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({
            error: 'Internal server error',
            details: error.message
        }, { status: 500 });
    }
}
