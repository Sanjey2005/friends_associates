import { NextResponse } from 'next/server';
import { clearUserCookie } from '@/lib/cookies';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    clearUserCookie(response);
    return response;
}
