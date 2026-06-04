import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/gamification/auth';
import { getGamificationProfile, updateDailyStreak } from '@/lib/gamification/store';
import { getLoginStreakMultiplier, XP_REWARDS } from '@/lib/gamification/constants';
import { awardXp } from '@/lib/gamification/store';

export async function GET(request: NextRequest) {
    const user = getRequestUser(request);
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ success: true, data: getGamificationProfile(user.id) });
}

export async function POST(request: NextRequest) {
    const user = getRequestUser(request);
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updated = updateDailyStreak(user.id);
    const multiplier = getLoginStreakMultiplier(updated.streak);
    const awarded = Math.floor(XP_REWARDS.daily_login * multiplier);
    const result = awardXp(user.id, {
        source: 'daily_login',
        amount: awarded,
        description: `Daily check-in (x${multiplier})`,
    });
    return NextResponse.json({ success: true, data: { ...result, streak: updated.streak } });
}
