import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/gamification/store';

export async function GET() {
    return NextResponse.json({ success: true, data: getAnalytics() });
}
