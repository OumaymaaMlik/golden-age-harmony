-- Bootstrap admin access after accidental table deletion
-- Run this in Supabase SQL Editor (as project owner/admin SQL role)

begin;

create extension if not exists pgcrypto;

-- Recreate admin registry if missing
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Recreate helper used by RLS policies
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = uid
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_select_self_or_admin" on public.admin_users;
drop policy if exists "admin_users_insert_admin_only" on public.admin_users;
drop policy if exists "admin_users_delete_admin_only" on public.admin_users;

create policy "admin_users_select_self_or_admin"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "admin_users_insert_admin_only"
on public.admin_users
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "admin_users_delete_admin_only"
on public.admin_users
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- IMPORTANT:
-- Replace the UUID below with your own auth.users id if needed.
-- From your error log, this user id was trying to sign in:
insert into public.admin_users (user_id)
values ('48f0aa1f-dfc5-4f4b-89ec-60ef8ebb9a63'::uuid)
on conflict (user_id) do nothing;

commit;
