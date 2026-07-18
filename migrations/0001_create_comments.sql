-- Migration 0001: bikin tabel `comments` untuk fitur komentar bertingkat di Gallery
-- Dijalankan di Netlify Database (Postgres, powered by Neon)

create extension if not exists "pgcrypto";

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),

  -- identifier foto galeri, misal "castle-01.jpeg"
  photo_id text not null,

  -- kalau ini balasan, isi id komentar induknya. kalau komentar utama, null.
  -- "on delete cascade" artinya kalau komentar induk dihapus, semua balasannya ikut terhapus.
  parent_id uuid references comments(id) on delete cascade,

  -- data dari akun Google yang login
  user_id text not null,           -- id unik dari Google (disebut "sub")
  user_name text not null,          -- nama tampilan dari Google
  user_avatar_url text,             -- url foto profil dari Google

  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- Biar query "ambil semua komentar untuk 1 foto" cepat
create index if not exists idx_comments_photo_id on comments (photo_id);

-- Biar query "ambil semua balasan dari komentar X" cepat
create index if not exists idx_comments_parent_id on comments (parent_id);
