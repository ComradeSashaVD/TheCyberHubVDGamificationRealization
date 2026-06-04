import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { awardXp, registerUserMeta } from '@/lib/gamification/store';

const schema = z.object({
    userId: z.string().min(1),
    amount: z.number().int().min(-50000).max(50000),
    reason: z.string().min(3).max(250),
});

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    registerUserMeta(parsed.data.userId, parsed.data.userId);
    const data = awardXp(parsed.data.userId, {
        source: 'admin_adjustment',
        amount: parsed.data.amount,
        description: `Admin adjustment: ${parsed.data.reason}`,
        metadata: { reason: parsed.data.reason },
    });
    return NextResponse.json({ success: true, data });
}
