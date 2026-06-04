import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ACHIEVEMENTS } from '@/lib/gamification/achievements';
import { getRequestUser } from '@/lib/gamification/auth';
import { getUserAchievements } from '@/lib/gamification/store';

const querySchema = z.object({
    category: z.enum(['ctf', 'forum', 'social', 'learning', 'events', 'mentorship', 'special']).optional(),
    status: z.enum(['all', 'earned', 'locked']).optional().default('all'),
});

export async function GET(request: NextRequest) {
    const user = getRequestUser(request);
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const parsed = querySchema.safeParse(params);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    let achievements = getUserAchievements(user.id);
    const { category, status } = parsed.data;
    if (category) achievements = achievements.filter((item) => item.category === category);
    if (status === 'earned') achievements = achievements.filter((item) => item.unlocked);
    if (status === 'locked') achievements = achievements.filter((item) => !item.unlocked);

    return NextResponse.json({
        success: true,
        data: {
            achievements,
            catalogSize: ACHIEVEMENTS.length,
            earnedCount: achievements.filter((item) => item.unlocked).length,
        },
    });
}
