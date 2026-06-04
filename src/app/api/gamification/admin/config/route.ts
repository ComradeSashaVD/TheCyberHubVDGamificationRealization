import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const configSchema = z.object({
    weekendMultiplier: z.number().min(1).max(5),
    globalMultiplier: z.number().min(0.1).max(5),
});

let runtimeConfig = {
    weekendMultiplier: 2,
    globalMultiplier: 1,
};

export async function GET() {
    return NextResponse.json({ success: true, data: runtimeConfig });
}

export async function PATCH(request: NextRequest) {
    const body = await request.json().catch(() => null);
    const parsed = configSchema.partial().safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }
    runtimeConfig = { ...runtimeConfig, ...parsed.data };
    return NextResponse.json({ success: true, data: runtimeConfig });
}
