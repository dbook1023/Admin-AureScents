-- Enable pgcrypto for UUID generation in Supabase
create extension if not exists "pgcrypto";

create table perfume_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  history text,
  logo_url text,
  website_url text,
  country text,
  is_archived boolean default false,
  created_at timestamp with time zone default now()
);

create table perfumers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  is_archived boolean default false
);

create table perfumes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  perfumer_id uuid references perfumers(id) on delete set null,
  description text,
  image_url text,
  top_notes text,
  middle_notes text,
  base_notes text,
  main_accords text,
  longevity text,
  sillage text,
  gender text,
  category text,
  full_description text,
  short_description text,
  perfumer_bio text,
  perfumer_name text,
  best_time_to_wear text,
  is_archived boolean default false,
  created_at timestamp with time zone default now()
);

create table perfume_notes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  olfactory_character text,
  intensity text,
  season text,
  is_archived boolean default false
);

create table perfume_accords (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  type text,
  status text default 'Curated'
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  signature_scent text,
  personalization_done boolean default false,
  preferred_accords text,
  preferred_notes text,
  email text,
  name text,
  updated_at timestamp with time zone default now(),
  preferred_intensity text,
  preferred_occasion text
);

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,
  role text default 'admin',
  created_at timestamp with time zone default now()
);

create table favorites (
  user_id uuid references auth.users(id) on delete cascade,
  perfume_id uuid references perfumes(id) on delete cascade,
  primary key (user_id, perfume_id)
);

create table recently_viewed (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  perfume_id uuid references perfumes(id) on delete cascade,
  viewed_at timestamp with time zone default now()
);

create table user_journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  content text,
  image_url text,
  created_at timestamp with time zone default now(),
  is_archived boolean default false
);
