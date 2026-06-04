import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api';

export function useStreak() {
    return useQuery({
        queryKey: ['streak'],
        queryFn: () => fetchApi('/api/gamification/streak'),
        staleTime: 10 * 60 * 1000,
    });
}

export function useCheckin() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => fetchApi('/api/gamification/streak', { method: 'POST' }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['streak'] }),
    });
}
