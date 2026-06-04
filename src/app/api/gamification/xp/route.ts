import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestUser } from '@/lib/gamification/auth';
import { awardXp, registerUserMeta } from '@/lib/gamification/store';

// In-memory rate limiter: tracks last award time per "userId:source" key.
// Non-admin awards are throttled to once per 10 seconds for the same source.
// Admin adjustments are not throttled.
const lastAwardTime = new Map<string, number>();
const RATE_LIMIT_MS = 10_000;

const isRateLimited = (userId: string, source: string): boolean => {
    const key = `${userId}:${source}`;
    const last = lastAwardTime.get(key) ?? 0;
    if (Date.now() - last < RATE_LIMIT_MS) return true;
    lastAwardTime.set(key, Date.now());
    return false;
};

const awardSchema = z.object({
    source: z.enum([
        'ctf_solve',
        'blog_post',
        'blog_like_received',
        'forum_topic',
        'forum_solution',
        'event_participation',
        'learning_path_complete',
        'daily_login',
        'first_ctf_of_day',
        'ctf_streak_5',
        'mentor_session_complete',
        'mentee_program_complete',
        'achievement_unlock',
        'admin_adjustment',
    ]),
    amount: z.number().int().min(-10000).max(10000).optional(),
    description: z.string().min(2).max(200).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    userId: z.string().min(1).optional(),
});

export async function POST(request: NextRequest) {
    const requestUser = getRequestUser(request);
    if (!requestUser) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = awardSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const payload = parsed.data;
    const targetUserId = payload.userId ?? requestUser.id;
    const isAdminAction = payload.userId && payload.userId !== requestUser.id;
    if (isAdminAction && !['admin', 'owner'].includes(requestUser.role)) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const exempt = payload.source === 'admin_adjustment' || isAdminAction;
    if (!exempt && isRateLimited(targetUserId, payload.source)) {
        return NextResponse.json(
            { success: false, error: 'Rate limit exceeded. Try again shortly.' },
            { status: 429 },
        );
    }

    registerUserMeta(targetUserId, targetUserId);
    const result = awardXp(targetUserId, {
        source: payload.source,
        amount: payload.amount,
        description: payload.description,
        metadata: payload.metadata,
    });

    return NextResponse.json({ success: true, data: result });
}
