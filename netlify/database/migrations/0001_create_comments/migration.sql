create extension if not exists "pgcrypto";

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  photo_id text not null,
  parent_id uuid references comments(id) on delete cascade,
  user_id text not null,
  user_name text not null,
  user_avatar_url text,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists idx_comments_photo_id on comments (photo_id);
create index if not exists idx_comments_parent_id on comments (parent_id);