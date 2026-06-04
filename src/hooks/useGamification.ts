import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';
import { LeaderboardMetric, LeaderboardPeriod, XpSource } from '@/types/gamification';

export const useGamificationProfile = () => useQuery({
    queryKey: ['gamification', 'me'],
    queryFn: () => fetchApi('/api/gamification/me'),
});

export const useGamificationAchievements = (
    category?: string,
    status: 'all' | 'earned' | 'locked' = 'all',
) => useQuery({
    queryKey: ['gamification', 'achievements', category, status],
    queryFn: () => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        params.set('status', status);
        return fetchApi(`/api/gamification/achievements?${params.toString()}`);
    },
});

export const useXpHistory = (limit = 50) => useQuery({
    queryKey: ['gamification', 'history', limit],
    queryFn: () => fetchApi(`/api/gamification/history?limit=${limit}`),
});

export const useAwardXp = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: { source: XpSource; amount?: number; description?: string; metadata?: Record<string, unknown> }) =>
            fetchApi('/api/gamification/xp', { method: 'POST', body: JSON.stringify(payload) }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['gamification'] });
            qc.invalidateQueries({ queryKey: ['leaderboard'] });
        },
    });
};

export const useGamificationLeaderboard = (
    metric: LeaderboardMetric = 'overall',
    period: LeaderboardPeriod = 'all',
    page = 1,
    limit = 20,
) => useQuery({
    queryKey: ['gamification', 'leaderboard', metric, period, page, limit],
    queryFn: () => fetchApi(
        `/api/gamification/leaderboard?metric=${metric}&period=${period}&page=${page}&limit=${limit}`,
        { requireAuth: false },
    ),
});
