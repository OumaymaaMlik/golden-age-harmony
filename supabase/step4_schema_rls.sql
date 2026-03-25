-- Step 4: Supabase schema + RLS for Nutriwell dynamic products
-- Run this in Supabase SQL Editor.

begin;

create extension if not exists pgcrypto;

-- Admin registry (maps auth users to admin role)
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Helper function for policies
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

-- Main product table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  short_description text not null,
  texture text not null,
  gout text not null,
  regime text not null,
  price text not null,
  price_per_unit text not null,
  badge text,
  badge_color text,
  image text,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create index if not exists idx_products_published on public.products (is_published);
create index if not exists idx_products_texture on public.products (texture);
create index if not exists idx_products_gout on public.products (gout);
create index if not exists idx_products_regime on public.products (regime);
create index if not exists idx_products_name on public.products (name);

-- Long description paragraphs
create table if not exists public.product_descriptions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_descriptions_product on public.product_descriptions (product_id, sort_order);

-- Flavor chips
create table if not exists public.product_flavors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id, name)
);
create index if not exists idx_product_flavors_product on public.product_flavors (product_id, sort_order);

-- Format chips
create table if not exists public.product_formats (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id, label)
);
create index if not exists idx_product_formats_product on public.product_formats (product_id, sort_order);

-- Benefits checklist
create table if not exists public.product_benefits (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_benefits_product on public.product_benefits (product_id, sort_order);

-- Nutrition table rows
create table if not exists public.product_nutrition (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  nutriment text not null,
  per_100ml text not null,
  per_portion text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_nutrition_product on public.product_nutrition (product_id, sort_order);

-- Usage tips rows
create table if not exists public.product_usage_tips (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  icon text not null default 'info',
  content text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_usage_tips_product on public.product_usage_tips (product_id, sort_order);

-- Product gallery images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_images_product on public.product_images (product_id, sort_order);

-- Reviews
create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  reviewer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  review_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_reviews_product on public.product_reviews (product_id, sort_order);

-- Keep updated_at fresh on products
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_set_updated_at on public.products;
create trigger trg_products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

-- Enable RLS
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.product_descriptions enable row level security;
alter table public.product_flavors enable row level security;
alter table public.product_formats enable row level security;
alter table public.product_benefits enable row level security;
alter table public.product_nutrition enable row level security;
alter table public.product_usage_tips enable row level security;
alter table public.product_images enable row level security;
alter table public.product_reviews enable row level security;

-- Remove old policies (safe re-run)
drop policy if exists "admin_users_select_self_or_admin" on public.admin_users;
drop policy if exists "admin_users_insert_admin_only" on public.admin_users;
drop policy if exists "admin_users_delete_admin_only" on public.admin_users;

drop policy if exists "products_select_public_or_admin" on public.products;
drop policy if exists "products_insert_admin_only" on public.products;
drop policy if exists "products_update_admin_only" on public.products;
drop policy if exists "products_delete_admin_only" on public.products;

drop policy if exists "product_descriptions_select_public_or_admin" on public.product_descriptions;
drop policy if exists "product_descriptions_insert_admin_only" on public.product_descriptions;
drop policy if exists "product_descriptions_update_admin_only" on public.product_descriptions;
drop policy if exists "product_descriptions_delete_admin_only" on public.product_descriptions;

drop policy if exists "product_flavors_select_public_or_admin" on public.product_flavors;
drop policy if exists "product_flavors_insert_admin_only" on public.product_flavors;
drop policy if exists "product_flavors_update_admin_only" on public.product_flavors;
drop policy if exists "product_flavors_delete_admin_only" on public.product_flavors;

drop policy if exists "product_formats_select_public_or_admin" on public.product_formats;
drop policy if exists "product_formats_insert_admin_only" on public.product_formats;
drop policy if exists "product_formats_update_admin_only" on public.product_formats;
drop policy if exists "product_formats_delete_admin_only" on public.product_formats;

drop policy if exists "product_benefits_select_public_or_admin" on public.product_benefits;
drop policy if exists "product_benefits_insert_admin_only" on public.product_benefits;
drop policy if exists "product_benefits_update_admin_only" on public.product_benefits;
drop policy if exists "product_benefits_delete_admin_only" on public.product_benefits;

drop policy if exists "product_nutrition_select_public_or_admin" on public.product_nutrition;
drop policy if exists "product_nutrition_insert_admin_only" on public.product_nutrition;
drop policy if exists "product_nutrition_update_admin_only" on public.product_nutrition;
drop policy if exists "product_nutrition_delete_admin_only" on public.product_nutrition;

drop policy if exists "product_usage_tips_select_public_or_admin" on public.product_usage_tips;
drop policy if exists "product_usage_tips_insert_admin_only" on public.product_usage_tips;
drop policy if exists "product_usage_tips_update_admin_only" on public.product_usage_tips;
drop policy if exists "product_usage_tips_delete_admin_only" on public.product_usage_tips;

drop policy if exists "product_images_select_public_or_admin" on public.product_images;
drop policy if exists "product_images_insert_admin_only" on public.product_images;
drop policy if exists "product_images_update_admin_only" on public.product_images;
drop policy if exists "product_images_delete_admin_only" on public.product_images;

drop policy if exists "product_reviews_select_public_or_admin" on public.product_reviews;
drop policy if exists "product_reviews_insert_admin_only" on public.product_reviews;
drop policy if exists "product_reviews_update_admin_only" on public.product_reviews;
drop policy if exists "product_reviews_delete_admin_only" on public.product_reviews;

-- admin_users policies
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

-- products policies
create policy "products_select_public_or_admin"
on public.products
for select
to anon, authenticated
using (is_published = true or public.is_admin(auth.uid()));

create policy "products_insert_admin_only"
on public.products
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "products_update_admin_only"
on public.products
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "products_delete_admin_only"
on public.products
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Child table policy template: public can read only children of published products;
-- admins can read all and write all.

create policy "product_descriptions_select_public_or_admin"
on public.product_descriptions
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_descriptions.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_descriptions_insert_admin_only"
on public.product_descriptions
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_descriptions_update_admin_only"
on public.product_descriptions
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_descriptions_delete_admin_only"
on public.product_descriptions
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_flavors_select_public_or_admin"
on public.product_flavors
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_flavors.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_flavors_insert_admin_only"
on public.product_flavors
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_flavors_update_admin_only"
on public.product_flavors
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_flavors_delete_admin_only"
on public.product_flavors
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_formats_select_public_or_admin"
on public.product_formats
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_formats.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_formats_insert_admin_only"
on public.product_formats
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_formats_update_admin_only"
on public.product_formats
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_formats_delete_admin_only"
on public.product_formats
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_benefits_select_public_or_admin"
on public.product_benefits
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_benefits.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_benefits_insert_admin_only"
on public.product_benefits
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_benefits_update_admin_only"
on public.product_benefits
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_benefits_delete_admin_only"
on public.product_benefits
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_nutrition_select_public_or_admin"
on public.product_nutrition
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_nutrition.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_nutrition_insert_admin_only"
on public.product_nutrition
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_nutrition_update_admin_only"
on public.product_nutrition
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_nutrition_delete_admin_only"
on public.product_nutrition
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_usage_tips_select_public_or_admin"
on public.product_usage_tips
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_usage_tips.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_usage_tips_insert_admin_only"
on public.product_usage_tips
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_usage_tips_update_admin_only"
on public.product_usage_tips
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_usage_tips_delete_admin_only"
on public.product_usage_tips
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_images_select_public_or_admin"
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_images_insert_admin_only"
on public.product_images
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_images_update_admin_only"
on public.product_images
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_images_delete_admin_only"
on public.product_images
for delete
to authenticated
using (public.is_admin(auth.uid()));

create policy "product_reviews_select_public_or_admin"
on public.product_reviews
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products p
    where p.id = product_reviews.product_id
      and (p.is_published = true or public.is_admin(auth.uid()))
  )
);
create policy "product_reviews_insert_admin_only"
on public.product_reviews
for insert
to authenticated
with check (public.is_admin(auth.uid()));
create policy "product_reviews_update_admin_only"
on public.product_reviews
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
create policy "product_reviews_delete_admin_only"
on public.product_reviews
for delete
to authenticated
using (public.is_admin(auth.uid()));

-- Optional: storage bucket + policies for product images
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "Product images are public read" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;

create policy "Product images are public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'products');

create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'products' and public.is_admin(auth.uid()));

create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'products' and public.is_admin(auth.uid()))
with check (bucket_id = 'products' and public.is_admin(auth.uid()));

create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'products' and public.is_admin(auth.uid()));

commit;
