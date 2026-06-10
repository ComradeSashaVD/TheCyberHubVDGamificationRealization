import { BASE_LEVEL_XP, LEVEL_MULTIPLIER, MAX_LEVEL, XP_REWARDS } from '@/lib/gamification/constants';
import { XpSource } from '@/types/gamification';

export interface LevelState {
    level: number;
    xpInLevel: number;
    xpToNextLevel: number;
    totalXpForCurrentLevel: number;
    totalXpForNextLevel: number;
    progressPercent: number;
}


export const xpRequiredForLevel = (level: number): number => {
    if (level <= 1) return 0;
    let sum = 0;
    for (let i = 1; i < level; i += 1) {
        sum += Math.floor(BASE_LEVEL_XP * Math.pow(LEVEL_MULTIPLIER, i - 1));
    }
    return sum;
};

export const getLevelFromXp = (xp: number): LevelState => {
    if (!Number.isFinite(xp)) {
        const totalXpForCurrentLevel = xpRequiredForLevel(MAX_LEVEL);
        return {
            level: MAX_LEVEL,
            xpInLevel: 0,
            xpToNextLevel: 0,
            totalXpForCurrentLevel,
            totalXpForNextLevel: totalXpForCurrentLevel,
            progressPercent: 100,
        };
    }
    const safeXp = Math.max(0, xp);
    let level = 1;
    while (level < MAX_LEVEL && safeXp >= xpRequiredForLevel(level + 1)) {
        level += 1;
    }

    const totalXpForCurrentLevel = xpRequiredForLevel(level);
    const totalXpForNextLevel = level === MAX_LEVEL
        ? totalXpForCurrentLevel
        : xpRequiredForLevel(level + 1);
    const xpInLevel = safeXp - totalXpForCurrentLevel;
    const xpToNextLevel = level === MAX_LEVEL
        ? 0
        : Math.max(0, totalXpForNextLevel - safeXp);
    const levelRange = Math.max(1, totalXpForNextLevel - totalXpForCurrentLevel);
    const progressPercent = level === MAX_LEVEL ? 100 : Math.min(100, Math.floor((xpInLevel / levelRange) * 100));

    return {
        level,
        xpInLevel,
        xpToNextLevel,
        totalXpForCurrentLevel,
        totalXpForNextLevel,
        progressPercent,
    };
};

export const calculateXpForSource = (
    source: XpSource,
    inputAmount?: number,
): number => {
    if (typeof inputAmount === 'number') return inputAmount;
    return XP_REWARDS[source] ?? 0;
};
