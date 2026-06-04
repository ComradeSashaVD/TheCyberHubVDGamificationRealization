type QueueJob = {
    id: string;
    type: 'recalculate_leaderboard' | 'bulk_recompute';
    payload?: Record<string, unknown>;
    createdAt: string;
};

const queue: QueueJob[] = [];

export const enqueueGamificationJob = (job: QueueJob): void => {
    queue.push(job);
};

export const drainGamificationJobs = (): QueueJob[] => {
    const copy = [...queue];
    queue.length = 0;
    return copy;
};

export const listGamificationJobs = (): QueueJob[] => [...queue];
