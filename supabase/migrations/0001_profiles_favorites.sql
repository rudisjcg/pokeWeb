-- Phase 1: user profiles and favorite Pokémon.

create extension if not exists citext with schema extensions;

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    extensions.citext not null unique,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  constraint profiles_username_format check (username::text ~ '^[A-Za-z0-9_]{3,20}$')
);

create table public.favorites (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  pokemon_id  integer not null check (pokemon_id > 0),
  created_at  timestamptz not null default now(),
  primary key (user_id, pokemon_id)
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

-- Profiles are public (usernames and avatars appear on leaderboards later);
-- only the owner may change their own row.
create policy "Profiles are readable by everyone"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "Users update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Favorites are private to their owner.
create policy "Users read their own favorites"
  on public.favorites for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users add their own favorites"
  on public.favorites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users remove their own favorites"
  on public.favorites for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Owners may only edit these columns; id and created_at stay fixed.
revoke update on public.profiles from anon, authenticated;
grant update (username, avatar_url) on public.profiles to authenticated;

-- Creates the profile row when a user signs up. Email sign-ups send the chosen
-- username in their metadata; OAuth sign-ups (Google) have none, so they get a
-- generated one they can change later.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested text := new.raw_user_meta_data ->> 'username';
  generated text := 'user_' || left(replace(new.id::text, '-', ''), 12);
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    case when requested ~ '^[A-Za-z0-9_]{3,20}$' then requested else generated end,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
