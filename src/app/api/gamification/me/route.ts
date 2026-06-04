import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/gamification/auth';
import { getGamificationProfile, registerUserMeta } from '@/lib/gamification/store';
import { getLevelFromXp } from '@/lib/gamification/xpCalculator';

export async function GET(request: NextRequest) {
    const user = getRequestUser(request);
    if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    registerUserMeta(user.id, user.username);
    const profile = getGamificationProfile(user.id);
    const levelState = getLevelFromXp(profile.xp);
    return NextResponse.json({
        success: true,
        data: {
            ...profile,
            levelState,
        },
    });
}
