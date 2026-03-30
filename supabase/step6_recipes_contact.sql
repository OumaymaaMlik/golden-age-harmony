-- Step 6: Recipes + Contact reports schema and RLS
-- Run this in Supabase SQL Editor after step4.

begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  summary text not null,
  prep_time text not null,
  servings integer not null default 1 check (servings > 0),
  image text,
  ingredients text[] not null default '{}',
  steps text[] not null default '{}',
  tips text[] not null default '{}',
  nutrition text[] not null default '{}',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipes_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

alter table public.recipes add column if not exists slug text;
alter table public.recipes add column if not exists title text;
alter table public.recipes add column if not exists category text;
alter table public.recipes add column if not exists summary text;
alter table public.recipes add column if not exists prep_time text;
alter table public.recipes add column if not exists servings integer;
alter table public.recipes add column if not exists image text;
alter table public.recipes add column if not exists ingredients text[];
alter table public.recipes add column if not exists steps text[];
alter table public.recipes add column if not exists tips text[];
alter table public.recipes add column if not exists nutrition text[];
alter table public.recipes add column if not exists is_published boolean;
alter table public.recipes add column if not exists created_at timestamptz;
alter table public.recipes add column if not exists updated_at timestamptz;

update public.recipes set slug = coalesce(nullif(slug, ''), lower(replace(id::text, '-', '')));
update public.recipes set title = coalesce(nullif(title, ''), 'Recette sans titre');
update public.recipes set category = coalesce(nullif(category, ''), 'Snacks');
update public.recipes set summary = coalesce(nullif(summary, ''), 'Recette Nutriwell');
update public.recipes set prep_time = coalesce(nullif(prep_time, ''), '15 min');
update public.recipes set servings = coalesce(servings, 1);
update public.recipes set ingredients = coalesce(ingredients, '{}');
update public.recipes set steps = coalesce(steps, '{}');
update public.recipes set tips = coalesce(tips, '{}');
update public.recipes set nutrition = coalesce(nutrition, '{}');
update public.recipes set is_published = coalesce(is_published, false);
update public.recipes set created_at = coalesce(created_at, now());
update public.recipes set updated_at = coalesce(updated_at, now());

alter table public.recipes alter column slug set not null;
alter table public.recipes alter column title set not null;
alter table public.recipes alter column category set not null;
alter table public.recipes alter column summary set not null;
alter table public.recipes alter column prep_time set not null;
alter table public.recipes alter column servings set not null;
alter table public.recipes alter column servings set default 1;
alter table public.recipes alter column ingredients set not null;
alter table public.recipes alter column ingredients set default '{}';
alter table public.recipes alter column steps set not null;
alter table public.recipes alter column steps set default '{}';
alter table public.recipes alter column tips set not null;
alter table public.recipes alter column tips set default '{}';
alter table public.recipes alter column nutrition set not null;
alter table public.recipes alter column nutrition set default '{}';
alter table public.recipes alter column is_published set not null;
alter table public.recipes alter column is_published set default false;
alter table public.recipes alter column created_at set not null;
alter table public.recipes alter column created_at set default now();
alter table public.recipes alter column updated_at set not null;
alter table public.recipes alter column updated_at set default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'recipes_slug_format'
      and conrelid = 'public.recipes'::regclass
  ) then
    alter table public.recipes
      add constraint recipes_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'recipes_servings_positive'
      and conrelid = 'public.recipes'::regclass
  ) then
    alter table public.recipes
      add constraint recipes_servings_positive check (servings > 0);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'recipes_slug_key'
      and conrelid = 'public.recipes'::regclass
  ) then
    alter table public.recipes add constraint recipes_slug_key unique (slug);
  end if;
end;
$$;

create index if not exists idx_recipes_published on public.recipes (is_published);
create index if not exists idx_recipes_category on public.recipes (category);
create index if not exists idx_recipes_updated_at on public.recipes (updated_at desc);

create table if not exists public.contact_reports (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  message text not null,
  email text not null,
  profile_type text,
  civility text,
  last_name text not null,
  first_name text not null,
  address text,
  postal_code text,
  city text,
  country text,
  phone_prefix text,
  phone_number text,
  attachment_url text,
  status text not null default 'nouveau' check (status in ('nouveau', 'traite', 'archive')),
  created_at timestamptz not null default now()
);

alter table public.contact_reports add column if not exists subject text;
alter table public.contact_reports add column if not exists message text;
alter table public.contact_reports add column if not exists email text;
alter table public.contact_reports add column if not exists profile_type text;
alter table public.contact_reports add column if not exists civility text;
alter table public.contact_reports add column if not exists last_name text;
alter table public.contact_reports add column if not exists first_name text;
alter table public.contact_reports add column if not exists address text;
alter table public.contact_reports add column if not exists postal_code text;
alter table public.contact_reports add column if not exists city text;
alter table public.contact_reports add column if not exists country text;
alter table public.contact_reports add column if not exists phone_prefix text;
alter table public.contact_reports add column if not exists phone_number text;
alter table public.contact_reports add column if not exists attachment_url text;
alter table public.contact_reports add column if not exists status text;
alter table public.contact_reports add column if not exists created_at timestamptz;
alter table public.contact_reports add column if not exists client_name text;

update public.contact_reports set subject = coalesce(nullif(subject, ''), 'Sans sujet');
update public.contact_reports set message = coalesce(nullif(message, ''), '');
update public.contact_reports set email = coalesce(nullif(email, ''), 'unknown@example.com');
update public.contact_reports set last_name = coalesce(nullif(last_name, ''), 'Inconnu');
update public.contact_reports set first_name = coalesce(nullif(first_name, ''), 'Inconnu');
update public.contact_reports set status = coalesce(nullif(status, ''), 'nouveau');
update public.contact_reports set created_at = coalesce(created_at, now());
update public.contact_reports
set client_name = coalesce(nullif(client_name, ''), nullif(trim(concat(coalesce(first_name, ''), ' ', coalesce(last_name, ''))), ''), 'Inconnu');

alter table public.contact_reports alter column subject set not null;
alter table public.contact_reports alter column message set not null;
alter table public.contact_reports alter column email set not null;
alter table public.contact_reports alter column last_name set not null;
alter table public.contact_reports alter column first_name set not null;
alter table public.contact_reports alter column status set not null;
alter table public.contact_reports alter column status set default 'nouveau';
alter table public.contact_reports alter column created_at set not null;
alter table public.contact_reports alter column created_at set default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_reports_status_check'
      and conrelid = 'public.contact_reports'::regclass
  ) then
    alter table public.contact_reports
      add constraint contact_reports_status_check check (status in ('nouveau', 'traite', 'archive'));
  end if;
end;
$$;

create index if not exists idx_contact_reports_created_at on public.contact_reports (created_at desc);
create index if not exists idx_contact_reports_status on public.contact_reports (status);

drop trigger if exists trg_recipes_set_updated_at on public.recipes;
create trigger trg_recipes_set_updated_at
before update on public.recipes
for each row
execute function public.set_updated_at();

alter table public.recipes enable row level security;
alter table public.contact_reports enable row level security;

drop policy if exists "recipes_select_public_or_admin" on public.recipes;
drop policy if exists "recipes_insert_admin_only" on public.recipes;
drop policy if exists "recipes_update_admin_only" on public.recipes;
drop policy if exists "recipes_delete_admin_only" on public.recipes;

drop policy if exists "contact_reports_insert_public" on public.contact_reports;
drop policy if exists "contact_reports_select_admin_only" on public.contact_reports;
drop policy if exists "contact_reports_update_admin_only" on public.contact_reports;
drop policy if exists "contact_reports_delete_admin_only" on public.contact_reports;

create policy "recipes_select_public_or_admin"
on public.recipes
for select
to anon, authenticated
using (is_published = true or public.is_admin(auth.uid()));

create policy "recipes_insert_admin_only"
on public.recipes
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "recipes_update_admin_only"
on public.recipes
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "recipes_delete_admin_only"
on public.recipes
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "contact_reports_insert_public"
on public.contact_reports
for insert
to anon, authenticated
with check (status = 'nouveau');

create policy "contact_reports_select_admin_only"
on public.contact_reports
for select
to authenticated
using (public.is_admin(auth.uid()));

create policy "contact_reports_update_admin_only"
on public.contact_reports
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "contact_reports_delete_admin_only"
on public.contact_reports
for delete
to authenticated
using (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values ('recipes', 'recipes', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('contact-reports', 'contact-reports', false)
on conflict (id) do nothing;

drop policy if exists "Recipe images are public read" on storage.objects;
drop policy if exists "Admins can upload recipe images" on storage.objects;
drop policy if exists "Admins can update recipe images" on storage.objects;
drop policy if exists "Admins can delete recipe images" on storage.objects;

drop policy if exists "Admins can read contact attachments" on storage.objects;
drop policy if exists "Public can upload contact attachments" on storage.objects;
drop policy if exists "Admins can update contact attachments" on storage.objects;
drop policy if exists "Admins can delete contact attachments" on storage.objects;

create policy "Recipe images are public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'recipes');

create policy "Admins can upload recipe images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'recipes' and public.is_admin(auth.uid()));

create policy "Admins can update recipe images"
on storage.objects
for update
to authenticated
using (bucket_id = 'recipes' and public.is_admin(auth.uid()))
with check (bucket_id = 'recipes' and public.is_admin(auth.uid()));

create policy "Admins can delete recipe images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'recipes' and public.is_admin(auth.uid()));

create policy "Admins can read contact attachments"
on storage.objects
for select
to authenticated
using (bucket_id = 'contact-reports' and public.is_admin(auth.uid()));

create policy "Public can upload contact attachments"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'contact-reports');

create policy "Admins can update contact attachments"
on storage.objects
for update
to authenticated
using (bucket_id = 'contact-reports' and public.is_admin(auth.uid()))
with check (bucket_id = 'contact-reports' and public.is_admin(auth.uid()));

create policy "Admins can delete contact attachments"
on storage.objects
for delete
to authenticated
using (bucket_id = 'contact-reports' and public.is_admin(auth.uid()));

commit;
