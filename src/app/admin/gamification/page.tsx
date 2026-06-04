'use client';

import { FormEvent, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface Config {
    weekendMultiplier: number;
    globalMultiplier: number;
}

interface Analytics {
    totalUsers: number;
    totalXpAwarded: number;
    totalAchievementsUnlocked: number;
    xpBySource: Record<string, number>;
    topEarners: Array<{ userId: string; username: string; xp: number; level: number }>;
}

export default function AdminGamificationPage() {
    const { addToast } = useToast();
    const [config, setConfig] = useState<Config>({ weekendMultiplier: 2, globalMultiplier: 1 });
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState(0);
    const [reason, setReason] = useState('');
    const [achievements, setAchievements] = useState<unknown[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {
        fetchApi('/api/gamification/admin/config').then((res) => setConfig(res.data)).catch(() => undefined);
        fetchApi('/api/gamification/admin/achievements').then((res) => setAchievements(res.data)).catch(() => undefined);
        fetchApi('/api/gamification/admin/analytics').then((res) => setAnalytics(res.data)).catch(() => undefined);
    }, []);

    const saveConfig = async (e: FormEvent) => {
        e.preventDefault();
        await fetchApi('/api/gamification/admin/config', {
            method: 'PATCH',
            body: JSON.stringify(config),
        });
        addToast({ variant: 'success', title: 'Saved', message: 'Gamification config updated.' });
    };

    const adjustXp = async (e: FormEvent) => {
        e.preventDefault();
        await fetchApi('/api/gamification/admin/adjust-xp', {
            method: 'POST',
            body: JSON.stringify({ userId, amount, reason }),
        });
        addToast({ variant: 'success', title: 'XP updated', message: 'Manual XP adjustment was applied.' });
    };

    return (
        <div className="min-h-screen bg-[var(--color-background)] pt-24 pb-12 px-4">
            <div className="mx-auto max-w-4xl space-y-6">
                <h1 className="text-2xl font-bold text-white">Gamification Admin</h1>
                <form onSubmit={saveConfig} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                    <h2 className="text-lg text-white font-semibold">XP Multipliers</h2>
                    <div className="grid md:grid-cols-2 gap-3">
                        <input type="number" step="0.1" value={config.globalMultiplier} onChange={(e) => setConfig((s) => ({ ...s, globalMultiplier: Number(e.target.value) }))} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white" placeholder="Global multiplier" />
                        <input type="number" step="0.1" value={config.weekendMultiplier} onChange={(e) => setConfig((s) => ({ ...s, weekendMultiplier: Number(e.target.value) }))} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white" placeholder="Weekend multiplier" />
                    </div>
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-white">Save</button>
                </form>

                <form onSubmit={adjustXp} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                    <h2 className="text-lg text-white font-semibold">Manual XP Adjustment</h2>
                    <div className="grid md:grid-cols-3 gap-3">
                        <input value={userId} onChange={(e) => setUserId(e.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white" placeholder="User ID" />
                        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white" placeholder="XP amount" />
                        <input value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-lg border border-white/10 bg-black px-3 py-2 text-white" placeholder="Reason" />
                    </div>
                    <button className="rounded-lg bg-orange-500 px-4 py-2 text-white">Apply</button>
                </form>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h2 className="text-lg text-white font-semibold mb-4">Achievements Catalog ({achievements.length})</h2>
                    {achievements.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-2">
                            {(achievements as Array<{ id: string; name: string; tier: string; category: string; xpReward: number; description: string }>).map((a) => (
                                <div key={a.id} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{a.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{a.description}</p>
                                    </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                                                a.tier === 'legendary' ? 'bg-yellow-400/30 text-yellow-200 border-yellow-400/60' :
                                                a.tier === 'epic'      ? 'bg-purple-400/30 text-purple-200 border-purple-400/60' :
                                                a.tier === 'rare'      ? 'bg-blue-400/30 text-blue-200 border-blue-400/60' :
                                                                         'bg-slate-400/30 text-slate-200 border-slate-400/60'
                                            }`}>{a.tier}</span>
                                        <span className="text-xs text-orange-400 font-medium whitespace-nowrap">+{a.xpReward} XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Loading achievements…</p>
                    )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                    <h2 className="text-lg text-white font-semibold">Analytics</h2>
                    {analytics ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="rounded-xl bg-white/[0.04] p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Users</p>
                                    <p className="text-2xl font-bold text-white">{analytics.totalUsers}</p>
                                </div>
                                <div className="rounded-xl bg-white/[0.04] p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total XP Awarded</p>
                                    <p className="text-2xl font-bold text-orange-400">{analytics.totalXpAwarded.toLocaleString()}</p>
                                </div>
                                <div className="rounded-xl bg-white/[0.04] p-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Achievements Unlocked</p>
                                    <p className="text-2xl font-bold text-white">{analytics.totalAchievementsUnlocked}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-300 mb-2">XP by Source</h3>
                                <div className="space-y-1">
                                    {Object.entries(analytics.xpBySource)
                                        .sort(([, a], [, b]) => b - a)
                                        .map(([source, xp]) => (
                                            <div key={source} className="flex justify-between text-sm rounded-lg px-3 py-1.5 bg-white/[0.03]">
                                                <span className="text-gray-300">{source}</span>
                                                <span className="text-white font-semibold">{xp.toLocaleString()} XP</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-300 mb-2">Top 10 Earners</h3>
                                <div className="space-y-1">
                                    {analytics.topEarners.map((user, i) => (
                                        <div key={user.userId} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400 font-mono w-5 text-right shrink-0">{i + 1}</span>
                                                <span className="text-white font-medium">{user.username}</span>
                                                <span className="text-xs bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">Lv.{user.level}</span>
                                            </div>
                                            <span className="text-orange-400 font-semibold">{user.xp.toLocaleString()} XP</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">Loading analytics…</p>
                    )}
                </div>
            </div>
        </div>
    );
}
