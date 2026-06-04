import { describe, expect, it } from 'vitest';
import { enqueueGamificationJob, listGamificationJobs, drainGamificationJobs } from '@/lib/gamification/queue';

describe('gamification queue', () => {
    it('enqueues and lists jobs', () => {
        const id = `job-${Date.now()}`;
        enqueueGamificationJob({
            id,
            type: 'recalculate_leaderboard',
            createdAt: new Date().toISOString(),
        });

        const items = listGamificationJobs();
        expect(items.some((x) => x.id === id)).toBe(true);
    });

    it('drains queue and empties it', () => {
        enqueueGamificationJob({
            id: `job-${Date.now()}-drain`,
            type: 'bulk_recompute',
            createdAt: new Date().toISOString(),
        });

        const drained = drainGamificationJobs();
        expect(drained.length).toBeGreaterThan(0);
        expect(listGamificationJobs().length).toBe(0);
    });
});
