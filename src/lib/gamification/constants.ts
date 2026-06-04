import { XpSource } from '@/types/gamification';

export const BASE_LEVEL_XP = 100;
export const LEVEL_MULTIPLIER = 1.5;
export const MAX_LEVEL = 100;

export const XP_REWARDS: Record<XpSource, number> = {
    ctf_solve: 100,
    blog_post: 30,
    blog_like_received: 5,
    forum_topic: 20,
    forum_solution: 50,
    event_participation: 100,
    learning_path_complete: 200,
    daily_login: 10,
    first_ctf_of_day: 25,
    ctf_streak_5: 100,
    mentor_session_complete: 80,
    mentee_program_complete: 120,
    achievement_unlock: 0,
    admin_adjustment: 0,
};

export const CTF_DIFFICULTY_XP: Record<string, number> = {
    easy: 50,
    medium: 150,
    hard: 300,
    expert: 500,
    insane: 500,
};

export const DAILY_BLOG_LIKE_XP_CAP = 100;

export const LOGIN_STREAK_MULTIPLIERS: Record<number, number> = {
    1: 1,
    2: 1.5,
    3: 2,
    4: 2.5,
};

export const getLoginStreakMultiplier = (streak: number): number => {
    if (streak <= 1) return 1;
    if (streak >= 5) return 3;
    return LOGIN_STREAK_MULTIPLIERS[streak] ?? 1;
};
