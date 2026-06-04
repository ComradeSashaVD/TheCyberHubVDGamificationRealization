"use client"

import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { SkeletonLeaderboard } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import LeaderboardTable from '@/components/gamification/LeaderboardTable';
import { useGamificationLeaderboard } from '@/hooks/useGamification';
import { LeaderboardMetric, LeaderboardPeriod } from '@/types/gamification';

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [metric, setMetric] = useState<LeaderboardMetric>('overall');
    const [period, setPeriod] = useState<LeaderboardPeriod>('all');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useGamificationLeaderboard(metric, period, page, 20);
    const leaderboard = data?.data?.items ?? [];
    const currentUser = data?.data?.currentUser;

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <Trophy className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-400 font-medium tracking-wide">Global Rankings</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
                            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 animate-pulse-slow drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]">Fame</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            The elite hackers of TheCyberHub. Compete in challenges, conquer machines, and carve your name into history.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                        {!isLoading && user && currentUser && (
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                <Trophy className="w-5 h-5 text-orange-400" />
                                <span className="text-white font-medium">Your rank: #{currentUser.rank}</span>
                                <span className="text-gray-400 text-sm">{currentUser.xp} XP</span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <select value={metric} onChange={(e) => { setMetric(e.target.value as LeaderboardMetric); setPage(1); }} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white">
                                <option value="overall">Overall</option>
                                <option value="ctf">CTF</option>
                                <option value="forum">Forum</option>
                                <option value="events">Events</option>
                            </select>
                            <select value={period} onChange={(e) => { setPeriod(e.target.value as LeaderboardPeriod); setPage(1); }} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white">
                                <option value="all">All time</option>
                                <option value="month">Month</option>
                                <option value="week">Week</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? (
                        <SkeletonLeaderboard />
                    ) : leaderboard.length > 0 ? (
                        <div className="space-y-4">
                            <LeaderboardTable items={leaderboard} />
                            <div className="flex items-center justify-end gap-2">
                                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300">Prev</button>
                                <span className="text-sm text-gray-400">Page {page}</span>
                                <button onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300">Next</button>
                            </div>
                        </div>
                    ) : (
                        <EmptyState
                            icon={Trophy}
                            title="No leaderboard data available"
                            description="Complete challenges to appear on the leaderboard."
                            actionLabel="View Challenges"
                            actionHref="/challenges"
                        />
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
