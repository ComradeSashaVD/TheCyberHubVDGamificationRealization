"use client";

import { useMemo, useState } from 'react';
import AchievementCard from '@/components/gamification/AchievementCard';
import LevelProgress from '@/components/gamification/LevelProgress';
import StreakIndicator from '@/components/gamification/StreakIndicator';
import { useGamificationAchievements, useGamificationProfile } from '@/hooks/useGamification';
import { UserAchievement } from '@/types/gamification';

export default function GamificationTab() {
    const [category, setCategory] = useState<string>('');
    const [status, setStatus] = useState<'all' | 'earned' | 'locked'>('all');
    const { data: profileData } = useGamificationProfile();
    const { data: achievementsData } = useGamificationAchievements(category || undefined, status);

    const achievements = useMemo(
        () => ((achievementsData?.data?.achievements ?? []) as UserAchievement[]),
        [achievementsData],
    );
    const profile = profileData?.data;

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <LevelProgress xp={profile?.xp ?? 0} />
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-sm text-gray-400 mb-2">Daily streak</p>
                    <StreakIndicator streak={profile?.streak ?? 0} />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-gray-200">
                    <option value="">All categories</option>
                    <option value="ctf">CTF</option>
                    <option value="forum">Forum</option>
                    <option value="social">Social</option>
                    <option value="learning">Learning</option>
                    <option value="events">Events</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="special">Special</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | 'earned' | 'locked')} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-sm text-gray-200">
                    <option value="all">All statuses</option>
                    <option value="earned">Earned</option>
                    <option value="locked">Locked</option>
                </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </div>
        </div>
    );
}
