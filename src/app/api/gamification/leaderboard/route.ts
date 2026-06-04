import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getRequestUser } from '@/lib/gamification/auth';
import { listLeaderboard } from '@/lib/gamification/store';
import { LeaderboardMetric, LeaderboardPeriod } from '@/types/gamification';

const querySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    metric: z.enum(['overall', 'ctf', 'forum', 'events']).default('overall'),
    period: z.enum(['all', 'month', 'week']).default('all'),
});

export async function GET(request: NextRequest) {
    const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams.entries()));
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const user = getRequestUser(request);
    const { page, limit, metric, period } = parsed.data;
    const data = listLeaderboard(
        page,
        limit,
        metric as LeaderboardMetric,
        period as LeaderboardPeriod,
        user?.id,
    );
    return NextResponse.json({ success: true, data });
}
