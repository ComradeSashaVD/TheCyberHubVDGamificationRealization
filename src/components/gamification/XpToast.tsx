"use client";

import { Zap } from 'lucide-react';

interface Props {
    xp: number;
    reason?: string;
}

export default function XpToast({ xp, reason }: Props) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-orange-500/30 bg-zinc-900/95 px-4 py-3">
            <Zap className="h-4 w-4 text-orange-400" />
            <div>
                <p className="text-sm font-medium text-white">+{xp} XP</p>
                {reason && <p className="text-xs text-gray-400">{reason}</p>}
            </div>
        </div>
    );
}
