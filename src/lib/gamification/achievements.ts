import { AchievementDefinition } from '@/types/gamification';

export const ACHIEVEMENTS: AchievementDefinition[] = [
    { id: 'a1', key: 'ctf_novice', name: 'CTF Novice', description: 'Solve 5 CTF challenges', icon: 'flag', tier: 'common', category: 'ctf', xpReward: 40, requirementType: 'ctf_solves', requirementValue: 5, nextKey: 'ctf_expert' },
    { id: 'a2', key: 'ctf_expert', name: 'CTF Expert', description: 'Solve 25 CTF challenges', icon: 'trophy', tier: 'rare', category: 'ctf', xpReward: 80, requirementType: 'ctf_solves', requirementValue: 25, nextKey: 'ctf_master' },
    { id: 'a3', key: 'ctf_master', name: 'CTF Master', description: 'Solve 75 CTF challenges', icon: 'crown', tier: 'epic', category: 'ctf', xpReward: 150, requirementType: 'ctf_solves', requirementValue: 75, nextKey: 'ctf_legend' },
    { id: 'a4', key: 'ctf_legend', name: 'CTF Legend', description: 'Solve 150 CTF challenges', icon: 'crown', tier: 'legendary', category: 'ctf', xpReward: 300, requirementType: 'ctf_solves', requirementValue: 150 },
    { id: 'a5', key: 'web_hunter', name: 'Web Hunter', description: 'Solve 20 web challenges', icon: 'globe', tier: 'rare', category: 'ctf', xpReward: 70, requirementType: 'ctf_web_solves', requirementValue: 20 },
    { id: 'a6', key: 'crypto_breaker', name: 'Crypto Breaker', description: 'Solve 20 crypto challenges', icon: 'shield', tier: 'rare', category: 'ctf', xpReward: 70, requirementType: 'ctf_crypto_solves', requirementValue: 20 },
    { id: 'a7', key: 'reverse_sage', name: 'Reverse Sage', description: 'Solve 15 reverse challenges', icon: 'target', tier: 'epic', category: 'ctf', xpReward: 100, requirementType: 'ctf_reverse_solves', requirementValue: 15 },
    { id: 'a8', key: 'forensics_eye', name: 'Forensics Eye', description: 'Solve 15 forensics challenges', icon: 'eye', tier: 'rare', category: 'ctf', xpReward: 90, requirementType: 'ctf_forensics_solves', requirementValue: 15 },
    { id: 'a9', key: 'pwn_engineer', name: 'Pwn Engineer', description: 'Solve 10 pwn challenges', icon: 'zap', tier: 'epic', category: 'ctf', xpReward: 120, requirementType: 'ctf_pwn_solves', requirementValue: 10 },
    { id: 'a10', key: 'first_blood', name: 'First Blood', description: 'First solve of a CTF challenge', icon: 'award', tier: 'legendary', category: 'special', xpReward: 180, requirementType: 'first_blood_count', requirementValue: 1 },
    { id: 'a11', key: 'forum_newcomer', name: 'Forum Newcomer', description: 'Create 5 forum topics', icon: 'message-square', tier: 'common', category: 'forum', xpReward: 40, requirementType: 'forum_topics', requirementValue: 5 },
    { id: 'a12', key: 'forum_helper', name: 'Forum Helper', description: 'Get 5 accepted solutions', icon: 'check-circle', tier: 'rare', category: 'forum', xpReward: 90, requirementType: 'forum_solutions', requirementValue: 5 },
    { id: 'a13', key: 'forum_guru', name: 'Forum Guru', description: 'Get 25 accepted solutions', icon: 'star', tier: 'epic', category: 'forum', xpReward: 160, requirementType: 'forum_solutions', requirementValue: 25 },
    { id: 'a14', key: 'liked_author', name: 'Liked Author', description: 'Receive 100 forum likes', icon: 'heart', tier: 'rare', category: 'forum', xpReward: 75, requirementType: 'forum_likes', requirementValue: 100 },
    { id: 'a15', key: 'blog_writer', name: 'Blog Writer', description: 'Publish 5 blog posts', icon: 'file-text', tier: 'common', category: 'learning', xpReward: 50, requirementType: 'blog_posts', requirementValue: 5 },
    { id: 'a16', key: 'blog_influencer', name: 'Blog Influencer', description: 'Get 250 likes on blog posts', icon: 'thumbs-up', tier: 'epic', category: 'social', xpReward: 140, requirementType: 'blog_likes_received', requirementValue: 250 },
    { id: 'a17', key: 'daily_hacker', name: 'Daily Hacker', description: 'Maintain a 7-day login streak', icon: 'flame', tier: 'common', category: 'special', xpReward: 60, requirementType: 'login_streak', requirementValue: 7 },
    { id: 'a18', key: 'consistent_hacker', name: 'Consistent Hacker', description: 'Maintain a 30-day login streak', icon: 'flame', tier: 'epic', category: 'special', xpReward: 180, requirementType: 'login_streak', requirementValue: 30 },
    { id: 'a19', key: 'event_joiner', name: 'Event Joiner', description: 'Attend 3 events', icon: 'calendar', tier: 'common', category: 'events', xpReward: 50, requirementType: 'events_attended', requirementValue: 3 },
    { id: 'a20', key: 'event_veteran', name: 'Event Veteran', description: 'Attend 15 events', icon: 'calendar', tier: 'rare', category: 'events', xpReward: 120, requirementType: 'events_attended', requirementValue: 15 },
    { id: 'a21', key: 'path_starter', name: 'Path Starter', description: 'Complete 1 learning path', icon: 'book-open', tier: 'common', category: 'learning', xpReward: 50, requirementType: 'learning_paths_completed', requirementValue: 1 },
    { id: 'a22', key: 'path_master', name: 'Path Master', description: 'Complete 10 learning paths', icon: 'book-open', tier: 'legendary', category: 'learning', xpReward: 260, requirementType: 'learning_paths_completed', requirementValue: 10 },
    { id: 'a23', key: 'cheatsheet_reader', name: 'Cheatsheet Reader', description: 'Read 20 cheatsheets', icon: 'bookmark', tier: 'common', category: 'learning', xpReward: 40, requirementType: 'cheatsheets_read', requirementValue: 20 },
    { id: 'a24', key: 'mentor_ally', name: 'Mentor Ally', description: 'Complete 5 mentorship sessions', icon: 'users', tier: 'rare', category: 'mentorship', xpReward: 110, requirementType: 'mentorship_sessions', requirementValue: 5 },
    { id: 'a25', key: 'mentor_pillar', name: 'Mentor Pillar', description: 'Complete 30 mentorship sessions', icon: 'users', tier: 'legendary', category: 'mentorship', xpReward: 250, requirementType: 'mentorship_sessions', requirementValue: 30 },
    { id: 'a26', key: 'social_connector', name: 'Social Connector', description: 'Gain 50 followers', icon: 'user-plus', tier: 'rare', category: 'social', xpReward: 100, requirementType: 'followers', requirementValue: 50 },
    { id: 'a27', key: 'network_builder', name: 'Network Builder', description: 'Add 20 friends', icon: 'users', tier: 'common', category: 'social', xpReward: 60, requirementType: 'friends_count', requirementValue: 20 },
    { id: 'a28', key: 'bug_hunter', name: 'Bug Hunter', description: 'Report a confirmed platform bug', icon: 'bug', tier: 'legendary', category: 'special', xpReward: 220, requirementType: 'bugs_reported', requirementValue: 1 },
    { id: 'a29', key: 'rank_climber', name: 'Rank Climber', description: 'Reach top-100 leaderboard', icon: 'trending-up', tier: 'rare', category: 'special', xpReward: 95, requirementType: 'leaderboard_best_rank', requirementValue: 100 },
    { id: 'a30', key: 'rank_elite', name: 'Rank Elite', description: 'Reach top-10 leaderboard', icon: 'trending-up', tier: 'legendary', category: 'special', xpReward: 240, requirementType: 'leaderboard_best_rank', requirementValue: 10 },
];

export type AchievementStats = Record<string, number>;

export const computeProgress = (
    definition: AchievementDefinition,
    stats: AchievementStats,
): number => {
    const currentValue = stats[definition.requirementType] ?? 0;
    return Math.min(definition.requirementValue, currentValue);
};
