import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestUser } from '@/lib/gamification/auth';
import { getXpHistory } from '@/lib/gamification/store';

const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(200).default(50),
});

export async function GET(request: NextRequest) {
    const user = getRequestUser(request);
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    const all = getXpHistory(user.id);
    return NextResponse.json({
        success: true,
        data: {
            items: all.slice(0, parsed.data.limit),
            total: all.length,
        },
    });
}
