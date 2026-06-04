import { describe, expect, it } from 'vitest';
import {
    awardXp,
    getGamificationProfile,
    getUserAchievements,
    registerUserMeta,
    updateDailyStreak,
    listLeaderboard,
    getXpHistory,
    getAnalytics,
} from '@/lib/gamification/store';

describe('gamification store', () => {
    it('awards xp and can level up', () => {
        registerUserMeta('u_test_1', 'tester');
        const beforeXp = getGamificationProfile('u_test_1').xp;
        const result = awardXp('u_test_1', { source: 'ctf_solve', amount: 500 });
        const after = getGamificationProfile('u_test_1');

        expect(after.xp).toBeGreaterThan(beforeXp);
        expect(result.awardedXp).toBe(500);
        expect(after.level).toBeGreaterThanOrEqual(1);
    });

    it('updates daily streak', () => {
        registerUserMeta('u_test_2', 'streaker');
        const updated = updateDailyStreak('u_test_2');
        expect(updated.streak).toBeGreaterThan(0);
    });

    it('returns full achievements list with progress', () => {
        registerUserMeta('u_test_3', 'achiever');
        const achievements = getUserAchievements('u_test_3');
        expect(achievements.length).toBeGreaterThanOrEqual(30);
        expect(achievements[0]).toHaveProperty('progress');
    });

    it('does not allow total xp to go below zero', () => {
        registerUserMeta('u_test_4', 'negative_case');
        awardXp('u_test_4', { source: 'admin_adjustment', amount: -500 });
        const profile = getGamificationProfile('u_test_4');
        expect(profile.xp).toBe(0);
        expect(profile.level).toBe(1);
    });

    it('unlocks ctf novice after five solves', () => {
        registerUserMeta('u_test_5', 'solver');
        let unlockedNames: string[] = [];
        for (let i = 0; i < 5; i += 1) {
            const result = awardXp('u_test_5', { source: 'ctf_solve', amount: 60 });
            unlockedNames = unlockedNames.concat(result.unlockedAchievements.map((a) => a.key));
        }
        expect(unlockedNames).toContain('ctf_novice');
    });

    it('adds history entries in reverse chronological order', () => {
        registerUserMeta('u_test_6', 'history_user');
        awardXp('u_test_6', { source: 'blog_post' });
        awardXp('u_test_6', { source: 'forum_topic' });
        const history = getXpHistory('u_test_6');
        expect(history.length).toBeGreaterThanOrEqual(2);
        expect(history[0].createdAt >= history[1].createdAt).toBe(true);
    });

    it('returns current user rank when requested', () => {
        registerUserMeta('u_lb_me', 'lb_me');
        awardXp('u_lb_me', { source: 'ctf_solve', amount: 77 });
        const board = listLeaderboard(1, 5, 'overall', 'all', 'u_lb_me');
        expect(board.currentUser?.userId).toBe('u_lb_me');
        expect(board.currentUser?.rank).toBeGreaterThan(0);
    });

    it('awards first_ctf_of_day bonus on first solve of the day', () => {
        registerUserMeta('u_bonus_1', 'bonus_user');
        awardXp('u_bonus_1', { source: 'ctf_solve', amount: 100 });
        const history = getXpHistory('u_bonus_1');
        const sources = history.map((e) => e.source);
        expect(sources).toContain('first_ctf_of_day');
    });

    it('does not award first_ctf_of_day bonus on second solve same day', () => {
        registerUserMeta('u_bonus_2', 'bonus_user_2');
        awardXp('u_bonus_2', { source: 'ctf_solve', amount: 100 });
        awardXp('u_bonus_2', { source: 'ctf_solve', amount: 100 });
        const history = getXpHistory('u_bonus_2');
        const bonusCount = history.filter((e) => e.source === 'first_ctf_of_day').length;
        expect(bonusCount).toBe(1);
    });

    it('awards ctf_streak_5 bonus on 5th solve of the day', () => {
        registerUserMeta('u_streak_5', 'streak_user');
        for (let i = 0; i < 5; i += 1) {
            awardXp('u_streak_5', { source: 'ctf_solve', amount: 50 });
        }
        const history = getXpHistory('u_streak_5');
        const sources = history.map((e) => e.source);
        expect(sources).toContain('ctf_streak_5');
    });

    it('awards ctf_streak_5 again on 10th solve of the day', () => {
        registerUserMeta('u_streak_10', 'streak_user_2');
        for (let i = 0; i < 10; i += 1) {
            awardXp('u_streak_10', { source: 'ctf_solve', amount: 50 });
        }
        const history = getXpHistory('u_streak_10');
        const streakBonuses = history.filter((e) => e.source === 'ctf_streak_5');
        expect(streakBonuses.length).toBe(2);
    });

    it('analytics returns correct user count and positive total xp', () => {
        registerUserMeta('u_analytics_1', 'analytics_user');
        awardXp('u_analytics_1', { source: 'blog_post' });
        const stats = getAnalytics();
        expect(stats.totalUsers).toBeGreaterThan(0);
        expect(stats.totalXpAwarded).toBeGreaterThan(0);
        expect(stats.xpBySource).toHaveProperty('blog_post');
        expect(stats.topEarners.length).toBeGreaterThan(0);
        expect(stats.topEarners[0]).toHaveProperty('xp');
    });

    it('analytics top earners are sorted descending by xp', () => {
        registerUserMeta('u_top_a', 'top_a');
        registerUserMeta('u_top_b', 'top_b');
        awardXp('u_top_a', { source: 'admin_adjustment', amount: 9999 });
        awardXp('u_top_b', { source: 'admin_adjustment', amount: 1 });
        const stats = getAnalytics();
        const xps = stats.topEarners.map((e) => e.xp);
        for (let i = 1; i < xps.length; i += 1) {
            expect(xps[i - 1]).toBeGreaterThanOrEqual(xps[i]);
        }
    });

    it('leaderboard filters by ctf metric correctly', () => {
        registerUserMeta('u_ctf_lb', 'ctf_ranker');
        for (let i = 0; i < 3; i += 1) {
            awardXp('u_ctf_lb', { source: 'ctf_solve', amount: 100 });
        }
        const board = listLeaderboard(1, 50, 'ctf', 'all', 'u_ctf_lb');
        const me = board.currentUser;
        expect(me).toBeDefined();
        expect(me!.ctfSolved).toBe(3);
    });
});
