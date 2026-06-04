"use client";

import { Trophy } from 'lucide-react';

interface Props {
    open: boolean;
    level: number;
    onClose: () => void;
}

export default function LevelUpModal({ open, level, onClose }: Props) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-orange-500/30 bg-zinc-950 p-6 text-center">
                <Trophy className="mx-auto mb-3 h-8 w-8 text-orange-400" />
                <h3 className="text-xl font-semibold text-white">Level Up!</h3>
                <p className="mt-2 text-gray-300">You reached level {level}.</p>
                <button className="mt-5 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600" onClick={onClose}>
                    Continue
                </button>
            </div>
        </div>
    );
}
