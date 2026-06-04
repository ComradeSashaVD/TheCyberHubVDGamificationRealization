export type GamificationTier = 'common' | 'rare' | 'epic' | 'legendary';

export type GamificationCategory =
    | 'ctf'
    | 'forum'
    | 'social'
    | 'learning'
    | 'events'
    | 'mentorship'
    | 'special';

export type LeaderboardMetric = 'overall' | 'ctf' | 'forum' | 'events';
export type LeaderboardPeriod = 'all' | 'month' | 'week';

export type XpSource =
    | 'ctf_solve'
    | 'blog_post'
    | 'blog_like_received'
    | 'forum_topic'
    | 'forum_solution'
    | 'event_participation'
    | 'learning_path_complete'
    | 'daily_login'
    | 'first_ctf_of_day'
    | 'ctf_streak_5'
    | 'mentor_session_complete'
    | 'mentee_program_complete'
    | 'achievement_unlock'
    | 'admin_adjustment';

export interface GamificationProfile {
    userId: string;
    xp: number;
    level: number;
    streak: number;
    streakLastUpdated: string | null;
    updatedAt: string;
}

export interface XpHistoryEntry {
    id: string;
    userId: string;
    amount: number;
    source: XpSource;
    description: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
}

export interface AchievementDefinition {
    id: string;
    key: string;
    name: string;
    description: string;
    icon: string;
    tier: GamificationTier;
    category: GamificationCategory;
    xpReward: number;
    requirementType: string;
    requirementValue: number;
    nextKey?: string;
}

export interface UserAchievementProgress {
    achievementId: string;
    progress: number;
    earnedAt: string | null;
}

export interface UserAchievement extends AchievementDefinition {
    progress: number;
    earnedAt: string | null;
    unlocked: boolean;
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    avatar?: string | null;
    level: number;
    xp: number;
    ctfSolved: number;
    forumScore: number;
    eventsCount: number;
    deltaRankWeekly: number;
}

export interface LeaderboardResponse {
    items: LeaderboardEntry[];
    page: number;
    limit: number;
    total: number;
    currentUser?: LeaderboardEntry | null;
}

export interface XpAwardInput {
    source: XpSource;
    amount?: number;
    description?: string;
    metadata?: Record<string, unknown>;
}

export interface XpAwardResult {
    profile: GamificationProfile;
    levelUp: boolean;
    previousLevel: number;
    awardedXp: number;
    unlockedAchievements: UserAchievement[];
}
