import { describe, expect, it } from 'vitest';
import { getLevelFromXp, xpRequiredForLevel, calculateXpForSource } from '@/lib/gamification/xpCalculator';
import { getLoginStreakMultiplier } from '@/lib/gamification/constants';

describe('xpCalculator', () => {
    it('returns level 1 for zero xp', () => {
        const state = getLevelFromXp(0);
        expect(state.level).toBe(1);
        expect(state.xpToNextLevel).toBeGreaterThan(0);
    });

    it('increases required xp by 50% each level', () => {
        const level2Delta = xpRequiredForLevel(2) - xpRequiredForLevel(1);
        const level3Delta = xpRequiredForLevel(3) - xpRequiredForLevel(2);
        expect(level2Delta).toBe(100);
        expect(level3Delta).toBe(150);
    });

    it('caps level at 100', () => {
        const state = getLevelFromXp(Number.POSITIVE_INFINITY);
        expect(state.level).toBe(100);
        expect(state.progressPercent).toBe(100);
    });

    it('moves to level 2 exactly at threshold', () => {
        const level2Start = xpRequiredForLevel(2);
        const state = getLevelFromXp(level2Start);
        expect(state.level).toBe(2);
        expect(state.xpInLevel).toBe(0);
    });

    it('uses default xp reward for source', () => {
        expect(calculateXpForSource('blog_post')).toBe(30);
        expect(calculateXpForSource('forum_solution')).toBe(50);
    });

    it('uses explicit amount override when provided', () => {
        expect(calculateXpForSource('blog_post', 777)).toBe(777);
    });

    it('returns correct login streak multipliers', () => {
        expect(getLoginStreakMultiplier(1)).toBe(1);
        expect(getLoginStreakMultiplier(2)).toBe(1.5);
        expect(getLoginStreakMultiplier(4)).toBe(2.5);
        expect(getLoginStreakMultiplier(8)).toBe(3);
    });
});
