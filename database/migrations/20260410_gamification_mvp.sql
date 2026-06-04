-- Gamification MVP schema
-- PostgreSQL / Supabase compatible

create table if not exists user_gamification (
    user_id text primary key,
    xp bigint not null default 0,
    level int not null default 1 check (level >= 1 and level <= 100),
    streak int not null default 0,
    streak_last_updated timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists achievements (
    id text primary key,
    key text unique not null,
    name text not null,
    description text not null,
    icon text not null,
    tier text not null check (tier in ('common', 'rare', 'epic', 'legendary')),
    category text not null,
    requirements jsonb not null default '{}'::jsonb,
    xp_reward int not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists user_achievements (
    user_id text not null,
    achievement_id text not null references achievements(id) on delete cascade,
    progress int not null default 0,
    earned_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (user_id, achievement_id)
);

create table if not exists xp_history (
    id uuid primary key default gen_random_uuid(),
    user_id text not null,
    amount int not null,
    source text not null,
    description text not null,
    metadata jsonb,
    created_at timestamptz not null default now()
);

create table if not exists leaderboard_snapshots (
    id uuid primary key default gen_random_uuid(),
    metric text not null check (metric in ('overall', 'ctf', 'forum', 'events')),
    period text not null check (period in ('all', 'month', 'week')),
    payload jsonb not null,
    calculated_at timestamptz not null default now()
);

create index if not exists idx_xp_history_user_id_created_at on xp_history (user_id, created_at desc);
create index if not exists idx_xp_history_source_created_at on xp_history (source, created_at desc);
create index if not exists idx_user_achievements_user_id on user_achievements (user_id);
create index if not exists idx_user_achievements_earned_at on user_achievements (earned_at desc);
create index if not exists idx_user_gamification_xp on user_gamification (xp desc);
create index if not exists idx_user_gamification_level on user_gamification (level desc);
create index if not exists idx_leaderboard_snapshots_metric_period_time on leaderboard_snapshots (metric, period, calculated_at desc);

-- Seed 30+ base achievements
insert into achievements (id, key, name, description, icon, tier, category, requirements, xp_reward)
values
('a1','ctf_novice','CTF Novice','Solve 5 CTF challenges','flag','common','ctf','{"type":"ctf_solves","value":5}',40),
('a2','ctf_expert','CTF Expert','Solve 25 CTF challenges','trophy','rare','ctf','{"type":"ctf_solves","value":25}',80),
('a3','ctf_master','CTF Master','Solve 75 CTF challenges','crown','epic','ctf','{"type":"ctf_solves","value":75}',150),
('a4','ctf_legend','CTF Legend','Solve 150 CTF challenges','crown','legendary','ctf','{"type":"ctf_solves","value":150}',300),
('a5','web_hunter','Web Hunter','Solve 20 web challenges','globe','rare','ctf','{"type":"ctf_web_solves","value":20}',70),
('a6','crypto_breaker','Crypto Breaker','Solve 20 crypto challenges','shield','rare','ctf','{"type":"ctf_crypto_solves","value":20}',70),
('a7','reverse_sage','Reverse Sage','Solve 15 reverse challenges','target','epic','ctf','{"type":"ctf_reverse_solves","value":15}',100),
('a8','forensics_eye','Forensics Eye','Solve 15 forensics challenges','eye','rare','ctf','{"type":"ctf_forensics_solves","value":15}',90),
('a9','pwn_engineer','Pwn Engineer','Solve 10 pwn challenges','zap','epic','ctf','{"type":"ctf_pwn_solves","value":10}',120),
('a10','first_blood','First Blood','First solve of a CTF challenge','award','legendary','special','{"type":"first_blood_count","value":1}',180),
('a11','forum_newcomer','Forum Newcomer','Create 5 forum topics','message-square','common','forum','{"type":"forum_topics","value":5}',40),
('a12','forum_helper','Forum Helper','Get 5 accepted solutions','check-circle','rare','forum','{"type":"forum_solutions","value":5}',90),
('a13','forum_guru','Forum Guru','Get 25 accepted solutions','star','epic','forum','{"type":"forum_solutions","value":25}',160),
('a14','liked_author','Liked Author','Receive 100 forum likes','heart','rare','forum','{"type":"forum_likes","value":100}',75),
('a15','blog_writer','Blog Writer','Publish 5 blog posts','file-text','common','learning','{"type":"blog_posts","value":5}',50),
('a16','blog_influencer','Blog Influencer','Get 250 likes on blog posts','thumbs-up','epic','social','{"type":"blog_likes_received","value":250}',140),
('a17','daily_hacker','Daily Hacker','Maintain a 7-day login streak','flame','common','special','{"type":"login_streak","value":7}',60),
('a18','consistent_hacker','Consistent Hacker','Maintain a 30-day login streak','flame','epic','special','{"type":"login_streak","value":30}',180),
('a19','event_joiner','Event Joiner','Attend 3 events','calendar','common','events','{"type":"events_attended","value":3}',50),
('a20','event_veteran','Event Veteran','Attend 15 events','calendar','rare','events','{"type":"events_attended","value":15}',120),
('a21','path_starter','Path Starter','Complete 1 learning path','book-open','common','learning','{"type":"learning_paths_completed","value":1}',50),
('a22','path_master','Path Master','Complete 10 learning paths','book-open','legendary','learning','{"type":"learning_paths_completed","value":10}',260),
('a23','cheatsheet_reader','Cheatsheet Reader','Read 20 cheatsheets','bookmark','common','learning','{"type":"cheatsheets_read","value":20}',40),
('a24','mentor_ally','Mentor Ally','Complete 5 mentorship sessions','users','rare','mentorship','{"type":"mentorship_sessions","value":5}',110),
('a25','mentor_pillar','Mentor Pillar','Complete 30 mentorship sessions','users','legendary','mentorship','{"type":"mentorship_sessions","value":30}',250),
('a26','social_connector','Social Connector','Gain 50 followers','user-plus','rare','social','{"type":"followers","value":50}',100),
('a27','network_builder','Network Builder','Add 20 friends','users','common','social','{"type":"friends_count","value":20}',60),
('a28','bug_hunter','Bug Hunter','Report a confirmed platform bug','bug','legendary','special','{"type":"bugs_reported","value":1}',220),
('a29','rank_climber','Rank Climber','Reach top-100 leaderboard','trending-up','rare','special','{"type":"leaderboard_best_rank","value":100}',95),
('a30','rank_elite','Rank Elite','Reach top-10 leaderboard','trending-up','legendary','special','{"type":"leaderboard_best_rank","value":10}',240)
on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    icon = excluded.icon,
    tier = excluded.tier,
    category = excluded.category,
    requirements = excluded.requirements,
    xp_reward = excluded.xp_reward,
    updated_at = now();
