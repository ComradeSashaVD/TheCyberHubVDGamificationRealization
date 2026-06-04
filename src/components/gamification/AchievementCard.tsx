"use client";

import { UserAchievement } from '@/types/gamification';

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    legendary: { bg: 'rgba(250,204,21,0.2)',  text: '#fef08a', border: 'rgba(250,204,21,0.6)' },
    epic:      { bg: 'rgba(192,132,252,0.2)', text: '#e9d5ff', border: 'rgba(192,132,252,0.6)' },
    rare:      { bg: 'rgba(96,165,250,0.2)',  text: '#bfdbfe', border: 'rgba(96,165,250,0.6)'  },
    common:    { bg: 'rgba(148,163,184,0.2)', text: '#e2e8f0', border: 'rgba(148,163,184,0.5)' },
};

interface Props {
    achievement: UserAchievement;
}

export default function AchievementCard({ achievement }: Props) {
    const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.requirementValue) * 100));
    const tierColor = TIER_COLORS[achievement.tier] ?? TIER_COLORS.common;

    return (
        <div className={`rounded-xl border p-4 ${achievement.unlocked ? 'border-orange-500/40 bg-orange-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="font-medium text-white">{achievement.name}</p>
                    <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full border shrink-0"
                    style={{ background: tierColor.bg, color: tierColor.text, borderColor: tierColor.border }}
                >
                    {achievement.tier}
                </span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-orange-500 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-gray-400">
                {achievement.progress}/{achievement.requirementValue} • +{achievement.xpReward} XP
            </p>
        </div>
    );
}
