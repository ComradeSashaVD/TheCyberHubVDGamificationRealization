"use client";

import { Flame } from 'lucide-react';

interface Props {
    streak: number;
}

export default function StreakIndicator({ streak }: Props) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-orange-300">{streak} day streak</span>
        </div>
    );
}
