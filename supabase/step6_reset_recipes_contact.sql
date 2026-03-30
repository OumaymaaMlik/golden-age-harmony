-- Reset script for Step 6 (recipes + contact reports)
-- WARNING: This script deletes recipes/contact tables and related storage objects.
-- Run this only if you want a clean restart for these modules.

begin;

-- Disable RLS dependencies by dropping policies first.
drop policy if exists "recipes_select_public_or_admin" on public.recipes;
drop policy if exists "recipes_insert_admin_only" on public.recipes;
drop policy if exists "recipes_update_admin_only" on public.recipes;
drop policy if exists "recipes_delete_admin_only" on public.recipes;

drop policy if exists "contact_reports_insert_public" on public.contact_reports;
drop policy if exists "contact_reports_select_admin_only" on public.contact_reports;
drop policy if exists "contact_reports_update_admin_only" on public.contact_reports;
drop policy if exists "contact_reports_delete_admin_only" on public.contact_reports;

-- Storage object policies for recipes/contact files.
drop policy if exists "Recipe images are public read" on storage.objects;
drop policy if exists "Admins can upload recipe images" on storage.objects;
drop policy if exists "Admins can update recipe images" on storage.objects;
drop policy if exists "Admins can delete recipe images" on storage.objects;

drop policy if exists "Admins can read contact attachments" on storage.objects;
drop policy if exists "Public can upload contact attachments" on storage.objects;
drop policy if exists "Admins can update contact attachments" on storage.objects;
drop policy if exists "Admins can delete contact attachments" on storage.objects;

-- Remove trigger tied to recipes table.
drop trigger if exists trg_recipes_set_updated_at on public.recipes;

-- NOTE:
-- Supabase blocks direct DELETE on storage.objects/storage.buckets in SQL Editor.
-- If you want to clear files, do it from Storage UI (or Storage API) manually.
-- We keep buckets in place; step6 schema re-run uses "on conflict do nothing" for buckets.

-- Drop application tables.
drop table if exists public.recipes cascade;
drop table if exists public.contact_reports cascade;

commit;
