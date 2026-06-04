"use client";

import { getLevelFromXp } from '@/lib/gamification/xpCalculator';

interface Props {
    xp: number;
}

export default function LevelProgress({ xp }: Props) {
    const state = getLevelFromXp(xp);
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-400">Level {state.level}</p>
                <p className="text-sm text-orange-400">{xp} XP</p>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500" style={{ width: `${state.progressPercent}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
                {state.level >= 100 ? 'Max level reached' : `${state.xpToNextLevel} XP to next level`}
            </p>
        </div>
    );
}
