import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/cookies';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    clearAdminCookie(response);
    return response;
}
