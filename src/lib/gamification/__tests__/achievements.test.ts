import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, computeProgress } from '@/lib/gamification/achievements';

describe('achievements catalog and progress', () => {
    it('contains at least 30 achievements', () => {
        expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(30);
    });

    it('contains all expected rarity tiers', () => {
        const tiers = new Set(ACHIEVEMENTS.map((a) => a.tier));
        expect(tiers.has('common')).toBe(true);
        expect(tiers.has('rare')).toBe(true);
        expect(tiers.has('epic')).toBe(true);
        expect(tiers.has('legendary')).toBe(true);
    });

    it('caps progress at requirement value', () => {
        const definition = ACHIEVEMENTS.find((a) => a.key === 'ctf_novice');
        expect(definition).toBeDefined();
        const progress = computeProgress(definition!, { ctf_solves: 999 });
        expect(progress).toBe(definition!.requirementValue);
    });

    it('returns zero when stat is missing', () => {
        const definition = ACHIEVEMENTS.find((a) => a.key === 'forum_newcomer');
        expect(definition).toBeDefined();
        const progress = computeProgress(definition!, {});
        expect(progress).toBe(0);
    });
});
