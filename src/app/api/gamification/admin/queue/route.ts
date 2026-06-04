import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { getRequestUser } from '@/lib/gamification/auth';
import { drainGamificationJobs, enqueueGamificationJob, listGamificationJobs } from '@/lib/gamification/queue';

const schema = z.object({
    type: z.enum(['recalculate_leaderboard', 'bulk_recompute']),
    payload: z.record(z.string(), z.unknown()).optional(),
});

const ensureAdmin = (request: NextRequest) => {
    const user = getRequestUser(request);
    return user && ['admin', 'owner'].includes(user.role);
};

export async function GET(request: NextRequest) {
    if (!ensureAdmin(request)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: listGamificationJobs() });
}

export async function POST(request: NextRequest) {
    if (!ensureAdmin(request)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const job = {
        id: randomUUID(),
        type: parsed.data.type,
        payload: parsed.data.payload,
        createdAt: new Date().toISOString(),
    };
    enqueueGamificationJob(job);
    return NextResponse.json({ success: true, data: job });
}

export async function DELETE(request: NextRequest) {
    if (!ensureAdmin(request)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: drainGamificationJobs() });
}
