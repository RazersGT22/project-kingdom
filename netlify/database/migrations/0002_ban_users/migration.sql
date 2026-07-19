create table if not exists banned_users (
  user_id text primary key,
  user_email text,
  banned_at timestamptz not null default now(),
  banned_by text
);
