create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.content_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube', 'linkedin')),
  title text not null,
  caption text not null,
  post_type text not null check (post_type in ('image', 'video', 'carousel', 'reel', 'story')),
  status text not null check (status in ('draft', 'scheduled', 'published', 'backlog')),
  scheduled_for timestamptz,
  published_at timestamptz,
  impression_count integer not null default 0,
  engagement_rate numeric(5, 2) not null default 0,
  like_count integer not null default 0,
  comment_count integer not null default 0,
  share_count integer not null default 0,
  reach_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.competitor_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  name text not null,
  handle text not null,
  platform text not null check (platform in ('instagram', 'tiktok', 'youtube', 'linkedin')),
  follower_count integer not null default 0,
  follower_growth_rate numeric(6, 2) not null default 0,
  monthly_follower_change integer not null default 0,
  avg_engagement_rate numeric(5, 2) not null default 0,
  avg_engagement_count integer not null default 0,
  total_posts integer not null default 0,
  avg_posts_per_week numeric(5, 2) not null default 0,
  response_time_hours numeric(6, 2) not null default 0,
  top_post_engage integer not null default 0,
  top_post_caption text not null default '',
  last_updated timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.competitor_metrics_history (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitor_metrics (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  captured_at timestamptz not null default timezone('utc', now()),
  follower_count integer not null default 0,
  follower_growth_rate numeric(6, 2) not null default 0,
  monthly_follower_change integer not null default 0,
  avg_engagement_rate numeric(5, 2) not null default 0,
  avg_engagement_count integer not null default 0,
  total_posts integer not null default 0,
  avg_posts_per_week numeric(5, 2) not null default 0,
  response_time_hours numeric(6, 2) not null default 0,
  top_post_engage integer not null default 0,
  top_post_caption text not null default '',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.content_posts
  add column if not exists user_id uuid references auth.users (id) on delete cascade;

create index if not exists content_posts_user_id_idx on public.content_posts (user_id);
create index if not exists content_posts_platform_idx on public.content_posts (platform);
create index if not exists content_posts_status_idx on public.content_posts (status);
create index if not exists content_posts_scheduled_for_idx on public.content_posts (scheduled_for);
create index if not exists content_posts_published_at_idx on public.content_posts (published_at);
create index if not exists competitor_metrics_user_id_idx on public.competitor_metrics (user_id);
create index if not exists competitor_metrics_platform_idx on public.competitor_metrics (platform);
create index if not exists competitor_metrics_followers_idx on public.competitor_metrics (follower_count);
create index if not exists competitor_metrics_history_competitor_id_idx on public.competitor_metrics_history (competitor_id);
create index if not exists competitor_metrics_history_user_id_idx on public.competitor_metrics_history (user_id);
create index if not exists competitor_metrics_history_captured_at_idx on public.competitor_metrics_history (captured_at);

drop trigger if exists content_posts_set_updated_at on public.content_posts;
drop trigger if exists competitor_metrics_set_updated_at on public.competitor_metrics;

create trigger content_posts_set_updated_at
before update on public.content_posts
for each row
execute function public.set_updated_at();

create trigger competitor_metrics_set_updated_at
before update on public.competitor_metrics
for each row
execute function public.set_updated_at();

alter table public.content_posts enable row level security;
alter table public.competitor_metrics enable row level security;
alter table public.competitor_metrics_history enable row level security;

drop policy if exists "Users can read their own posts" on public.content_posts;
drop policy if exists "Users can create their own posts" on public.content_posts;
drop policy if exists "Users can update their own posts" on public.content_posts;
drop policy if exists "Users can delete their own posts" on public.content_posts;
drop policy if exists "Users can read their own competitors" on public.competitor_metrics;
drop policy if exists "Users can create their own competitors" on public.competitor_metrics;
drop policy if exists "Users can update their own competitors" on public.competitor_metrics;
drop policy if exists "Users can delete their own competitors" on public.competitor_metrics;
drop policy if exists "Users can read their own competitor history" on public.competitor_metrics_history;
drop policy if exists "Users can create their own competitor history" on public.competitor_metrics_history;
drop policy if exists "Users can delete their own competitor history" on public.competitor_metrics_history;

create policy "Users can read their own posts"
on public.content_posts
for select
using (auth.uid() = user_id);

create policy "Users can create their own posts"
on public.content_posts
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on public.content_posts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
on public.content_posts
for delete
using (auth.uid() = user_id);

create policy "Users can read their own competitors"
on public.competitor_metrics
for select
using (auth.uid() = user_id);

create policy "Users can create their own competitors"
on public.competitor_metrics
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own competitors"
on public.competitor_metrics
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own competitors"
on public.competitor_metrics
for delete
using (auth.uid() = user_id);

create policy "Users can read their own competitor history"
on public.competitor_metrics_history
for select
using (auth.uid() = user_id);

create policy "Users can create their own competitor history"
on public.competitor_metrics_history
for insert
with check (auth.uid() = user_id);

create policy "Users can delete their own competitor history"
on public.competitor_metrics_history
for delete
using (auth.uid() = user_id);