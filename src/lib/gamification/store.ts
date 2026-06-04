import { randomUUID } from 'crypto';
import { ACHIEVEMENTS, computeProgress } from '@/lib/gamification/achievements';
import { calculateXpForSource, getLevelFromXp } from '@/lib/gamification/xpCalculator';
import {
    GamificationProfile,
    LeaderboardEntry,
    LeaderboardMetric,
    LeaderboardPeriod,
    LeaderboardResponse,
    UserAchievement,
    UserAchievementProgress,
    XpAwardInput,
    XpAwardResult,
    XpHistoryEntry,
} from '@/types/gamification';

type UserStats = Record<string, number>;

const profiles = new Map<string, GamificationProfile>();
const histories = new Map<string, XpHistoryEntry[]>();
const progressMap = new Map<string, UserAchievementProgress[]>();
const statMap = new Map<string, UserStats>();
const usernames = new Map<string, { username: string; avatar?: string | null }>();

// Tracks last CTF solve date and consecutive daily solves per user for bonus detection
const lastCtfSolveDate = new Map<string, string>();
const todayCtfSolves = new Map<string, number>();

const nowIso = () => new Date().toISOString();

const ensureProfile = (userId: string): GamificationProfile => {
    const existing = profiles.get(userId);
    if (existing) return existing;
    const created: GamificationProfile = {
        userId,
        xp: 0,
        level: 1,
        streak: 0,
        streakLastUpdated: null,
        updatedAt: nowIso(),
    };
    profiles.set(userId, created);
    return created;
};

const ensureStats = (userId: string): UserStats => {
    const existing = statMap.get(userId);
    if (existing) return existing;
    const created: UserStats = {};
    statMap.set(userId, created);
    return created;
};

const ensureProgress = (userId: string): UserAchievementProgress[] => {
    const existing = progressMap.get(userId);
    if (existing) return existing;
    const created = ACHIEVEMENTS.map((a) => ({
        achievementId: a.id,
        progress: 0,
        earnedAt: null,
    }));
    progressMap.set(userId, created);
    return created;
};

export const registerUserMeta = (userId: string, username: string, avatar?: string | null): void => {
    usernames.set(userId, { username, avatar });
    ensureProfile(userId);
    ensureProgress(userId);
    ensureStats(userId);
};

const toUserAchievements = (userId: string): UserAchievement[] => {
    const stats = ensureStats(userId);
    const progress = ensureProgress(userId);
    return ACHIEVEMENTS.map((achievement) => {
        const row = progress.find((p) => p.achievementId === achievement.id);
        const computedProgress = computeProgress(achievement, stats);
        if (row && !row.earnedAt) {
            row.progress = computedProgress;
        }
        return {
            ...achievement,
            progress: row?.progress ?? computedProgress,
            earnedAt: row?.earnedAt ?? null,
            unlocked: Boolean(row?.earnedAt),
        };
    });
};

const unlockAchievements = (userId: string): UserAchievement[] => {
    const result: UserAchievement[] = [];
    const progress = ensureProgress(userId);
    const stats = ensureStats(userId);
    for (const a of ACHIEVEMENTS) {
        const row = progress.find((p) => p.achievementId === a.id);
        if (!row) continue;
        const newProgress = computeProgress(a, stats);
        row.progress = newProgress;
        if (!row.earnedAt && newProgress >= a.requirementValue) {
            row.earnedAt = nowIso();
            result.push({
                ...a,
                progress: row.progress,
                earnedAt: row.earnedAt,
                unlocked: true,
            });
        }
    }
    return result;
};

export const awardXp = (userId: string, input: XpAwardInput): XpAwardResult => {
    const profile = ensureProfile(userId);
    const stats = ensureStats(userId);
    const amount = calculateXpForSource(input.source, input.amount);
    const previousLevel = profile.level;
    profile.xp = Math.max(0, profile.xp + amount);
    profile.level = getLevelFromXp(profile.xp).level;
    profile.updatedAt = nowIso();
    profiles.set(userId, profile);

    stats[input.source] = (stats[input.source] ?? 0) + 1;
    if (input.source === 'ctf_solve') {
        stats.ctf_solves = (stats.ctf_solves ?? 0) + 1;

        const today = new Date().toISOString().slice(0, 10);
        const lastDate = lastCtfSolveDate.get(userId);
        const isFirstToday = lastDate !== today;
        lastCtfSolveDate.set(userId, today);

        if (isFirstToday) {
            todayCtfSolves.set(userId, 1);
            // Award first-CTF-of-day bonus by adding XP directly (avoids recursive call)
            const bonusAmount = calculateXpForSource('first_ctf_of_day');
            profile.xp += bonusAmount;
            const bonusEntry: XpHistoryEntry = {
                id: randomUUID(),
                userId,
                amount: bonusAmount,
                source: 'first_ctf_of_day',
                description: 'First CTF solve of the day',
                createdAt: nowIso(),
            };
            histories.set(userId, [bonusEntry, ...(histories.get(userId) ?? [])].slice(0, 500));
        } else {
            const prevCount = todayCtfSolves.get(userId) ?? 1;
            const newCount = prevCount + 1;
            todayCtfSolves.set(userId, newCount);
            // Award ctf_streak_5 bonus on every 5th solve of the day
            if (newCount % 5 === 0) {
                const bonusAmount = calculateXpForSource('ctf_streak_5');
                profile.xp += bonusAmount;
                const bonusEntry: XpHistoryEntry = {
                    id: randomUUID(),
                    userId,
                    amount: bonusAmount,
                    source: 'ctf_streak_5',
                    description: `CTF solve streak: ${newCount} in a day`,
                    createdAt: nowIso(),
                };
                histories.set(userId, [bonusEntry, ...(histories.get(userId) ?? [])].slice(0, 500));
            }
        }
    }
    if (input.source === 'forum_topic') stats.forum_topics = (stats.forum_topics ?? 0) + 1;
    if (input.source === 'forum_solution') stats.forum_solutions = (stats.forum_solutions ?? 0) + 1;
    if (input.source === 'blog_post') stats.blog_posts = (stats.blog_posts ?? 0) + 1;
    profile.level = getLevelFromXp(profile.xp).level;

    if (input.source === 'blog_like_received') stats.blog_likes_received = (stats.blog_likes_received ?? 0) + Math.max(0, amount / 5);
    if (input.source === 'event_participation') stats.events_attended = (stats.events_attended ?? 0) + 1;
    if (input.source === 'learning_path_complete') stats.learning_paths_completed = (stats.learning_paths_completed ?? 0) + 1;
    if (input.source === 'mentor_session_complete') stats.mentorship_sessions = (stats.mentorship_sessions ?? 0) + 1;

    const unlockedAchievements = unlockAchievements(userId);
    if (unlockedAchievements.length > 0) {
        const bonus = unlockedAchievements.reduce((sum, item) => sum + item.xpReward, 0);
        profile.xp += bonus;
        profile.level = getLevelFromXp(profile.xp).level;
        profile.updatedAt = nowIso();
    }

    const logEntry: XpHistoryEntry = {
        id: randomUUID(),
        userId,
        amount,
        source: input.source,
        description: input.description ?? input.source,
        metadata: input.metadata,
        createdAt: nowIso(),
    };
    histories.set(userId, [logEntry, ...(histories.get(userId) ?? [])].slice(0, 500));

    return {
        profile,
        previousLevel,
        levelUp: profile.level > previousLevel,
        awardedXp: amount,
        unlockedAchievements,
    };
};

export const updateDailyStreak = (userId: string): GamificationProfile => {
    const profile = ensureProfile(userId);
    const today = new Date().toISOString().slice(0, 10);
    const last = profile.streakLastUpdated?.slice(0, 10);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    if (last === today) return profile;
    if (last === yesterday) profile.streak += 1;
    else profile.streak = 1;
    profile.streakLastUpdated = nowIso();
    profile.updatedAt = nowIso();
    return profile;
};

export const getGamificationProfile = (userId: string): GamificationProfile => ensureProfile(userId);
export const getXpHistory = (userId: string): XpHistoryEntry[] => histories.get(userId) ?? [];
export const getUserAchievements = (userId: string): UserAchievement[] => toUserAchievements(userId);

export const listLeaderboard = (
    page: number,
    limit: number,
    metric: LeaderboardMetric,
    _period: LeaderboardPeriod,
    currentUserId?: string,
): LeaderboardResponse => {
    const entries: LeaderboardEntry[] = Array.from(profiles.values()).map((profile) => {
        const stats = statMap.get(profile.userId) ?? {};
        const username = usernames.get(profile.userId)?.username ?? `user_${profile.userId.slice(0, 6)}`;
        return {
            rank: 0,
            userId: profile.userId,
            username,
            avatar: usernames.get(profile.userId)?.avatar ?? null,
            level: profile.level,
            xp: profile.xp,
            ctfSolved: stats.ctf_solves ?? 0,
            forumScore: (stats.forum_topics ?? 0) * 2 + (stats.forum_solutions ?? 0) * 5,
            eventsCount: stats.events_attended ?? 0,
            deltaRankWeekly: 0,
        };
    });

    const scoreFor = (entry: LeaderboardEntry): number => {
        if (metric === 'ctf') return entry.ctfSolved;
        if (metric === 'forum') return entry.forumScore;
        if (metric === 'events') return entry.eventsCount;
        return entry.xp;
    };

    entries.sort((a, b) => scoreFor(b) - scoreFor(a));
    entries.forEach((e, i) => { e.rank = i + 1; });
    const total = entries.length;
    const offset = Math.max(0, (page - 1) * limit);
    const items = entries.slice(offset, offset + limit);
    const currentUser = currentUserId ? entries.find((e) => e.userId === currentUserId) ?? null : undefined;
    return { items, page, limit, total, currentUser };
};

export interface GamificationAnalytics {
    totalUsers: number;
    totalXpAwarded: number;
    totalAchievementsUnlocked: number;
    xpBySource: Record<string, number>;
    topEarners: Array<{ userId: string; username: string; xp: number; level: number }>;
}

export const getAnalytics = (): GamificationAnalytics => {
    let totalXpAwarded = 0;
    let totalAchievementsUnlocked = 0;
    const xpBySource: Record<string, number> = {};

    for (const userHistories of histories.values()) {
        for (const entry of userHistories) {
            totalXpAwarded += Math.max(0, entry.amount);
            xpBySource[entry.source] = (xpBySource[entry.source] ?? 0) + Math.max(0, entry.amount);
        }
    }

    for (const progress of progressMap.values()) {
        totalAchievementsUnlocked += progress.filter((p) => p.earnedAt !== null).length;
    }

    const topEarners = Array.from(profiles.values())
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 10)
        .map((p) => ({
            userId: p.userId,
            username: usernames.get(p.userId)?.username ?? p.userId,
            xp: p.xp,
            level: p.level,
        }));

    return {
        totalUsers: profiles.size,
        totalXpAwarded,
        totalAchievementsUnlocked,
        xpBySource,
        topEarners,
    };
};
