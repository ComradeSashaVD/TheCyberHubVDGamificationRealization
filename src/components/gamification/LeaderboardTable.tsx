"use client";

import Link from 'next/link';
import { LeaderboardEntry } from '@/types/gamification';

interface Props {
    items: LeaderboardEntry[];
}

export default function LeaderboardTable({ items }: Props) {
    return (
        <div className="rounded-2xl border border-white/10 overflow-hidden">
            <div className="grid grid-cols-12 gap-3 bg-white/[0.04] px-4 py-3 text-xs uppercase text-gray-500">
                <span className="col-span-1">#</span>
                <span className="col-span-5">User</span>
                <span className="col-span-2 text-right">Level</span>
                <span className="col-span-2 text-right">XP</span>
                <span className="col-span-2 text-right">Delta</span>
            </div>
            <div className="divide-y divide-white/5">
                {items.map((entry) => (
                    <div key={entry.userId} className="grid grid-cols-12 gap-3 px-4 py-3 text-sm">
                        <span className="col-span-1 text-gray-400">{entry.rank}</span>
                        <Link className="col-span-5 text-white hover:text-orange-400" href={`/user/${entry.username}`}>
                            {entry.username}
                        </Link>
                        <span className="col-span-2 text-right text-gray-300">{entry.level}</span>
                        <span className="col-span-2 text-right text-orange-400">{entry.xp}</span>
                        <span className="col-span-2 text-right text-gray-400">{entry.deltaRankWeekly}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
