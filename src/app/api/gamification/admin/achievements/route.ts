import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ACHIEVEMENTS } from '@/lib/gamification/achievements';

const schema = z.object({
    id: z.string().min(1),
    key: z.string().min(2),
    name: z.string().min(2),
    description: z.string().min(5),
    icon: z.string().min(1),
    tier: z.enum(['common', 'rare', 'epic', 'legendary']),
    category: z.enum(['ctf', 'forum', 'social', 'learning', 'events', 'mentorship', 'special']),
    xpReward: z.number().int().min(0),
    requirementType: z.string().min(2),
    requirementValue: z.number().int().min(1),
    nextKey: z.string().optional(),
});

let runtimeAchievements = [...ACHIEVEMENTS];

export async function GET() {
    return NextResponse.json({ success: true, data: runtimeAchievements });
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    runtimeAchievements.push(parsed.data);
    return NextResponse.json({ success: true, data: parsed.data });
}

export async function PUT(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    runtimeAchievements = runtimeAchievements.map((item) => item.id === parsed.data.id ? parsed.data : item);
    return NextResponse.json({ success: true, data: parsed.data });
}

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }
    runtimeAchievements = runtimeAchievements.filter((item) => item.id !== id);
    return NextResponse.json({ success: true });
}
