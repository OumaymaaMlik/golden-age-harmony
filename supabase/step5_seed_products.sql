-- Step 5: Seed initial Nutriwell products from src/data/products.ts
-- Run this AFTER step4_schema_rls.sql

begin;

-- Ensure we update/insert core products first
insert into public.products (
  slug,
  name,
  category,
  short_description,
  texture,
  gout,
  regime,
  price,
  price_per_unit,
  badge,
  badge_color,
  image,
  rating,
  review_count,
  is_published
)
values
  (
    'boisson-fruitee',
    'Nutriwell Boisson Fruitée',
    'Boisson nutritionnelle',
    'Boisson fruitée hyperprotéinée, riche en vitamines et minéraux. Idéale pour compléter les apports nutritionnels au quotidien, avec un goût frais et agréable.',
    'Boisson',
    'Fruité',
    'Standard',
    '12,90 €',
    '3,23 € / bouteille',
    'NOUVEAU',
    'bg-destructive',
    'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop',
    4.5,
    47,
    true
  ),
  (
    'boisson-concentree',
    'Nutriwell Boisson Concentrée',
    'Boisson nutritionnelle',
    'Boisson concentrée hyperprotéinée en petit format, pour un apport nutritionnel maximal en volume réduit.',
    'Boisson',
    'Fruité',
    'Hyperprotéiné',
    '14,50 €',
    '3,63 € / bouteille',
    null,
    null,
    'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop',
    4.3,
    32,
    true
  ),
  (
    'creme-dessert',
    'Nutriwell Crème Dessert',
    'Crème nutritionnelle',
    'Crème dessert onctueuse et gourmande, enrichie en protéines. Un vrai plaisir nutritionnel.',
    'Crème',
    'Vanille',
    'Standard',
    '11,90 €',
    '2,98 € / pot',
    null,
    null,
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop',
    4.7,
    63,
    true
  )
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  short_description = excluded.short_description,
  texture = excluded.texture,
  gout = excluded.gout,
  regime = excluded.regime,
  price = excluded.price,
  price_per_unit = excluded.price_per_unit,
  badge = excluded.badge,
  badge_color = excluded.badge_color,
  image = excluded.image,
  rating = excluded.rating,
  review_count = excluded.review_count,
  is_published = excluded.is_published,
  updated_at = now();

-- Clear child rows for these seeded products to make script rerunnable
with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_descriptions d
using target_products tp
where d.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_benefits b
using target_products tp
where b.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_flavors f
using target_products tp
where f.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_formats f
using target_products tp
where f.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_nutrition n
using target_products tp
where n.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_usage_tips u
using target_products tp
where u.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_images i
using target_products tp
where i.product_id = tp.id;

with target_products as (
  select id from public.products where slug in ('boisson-fruitee', 'boisson-concentree', 'creme-dessert')
)
delete from public.product_reviews r
using target_products tp
where r.product_id = tp.id;

-- Descriptions
insert into public.product_descriptions (product_id, content, sort_order)
select p.id, d.content, d.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'Nutriwell Boisson Fruitée est une boisson nutritionnelle complète, spécialement formulée pour les personnes ayant des besoins nutritionnels accrus. Sa texture légère et son goût fruité en font un complément idéal à tout moment de la journée.', 0),
    ('boisson-fruitee', 'Enrichie en protéines de haute qualité, vitamines et minéraux essentiels, elle contribue au maintien de la masse musculaire et au bon fonctionnement de l''organisme.', 1),
    ('boisson-concentree', 'Nutriwell Boisson Concentrée offre un apport nutritionnel complet dans un format compact de 125ml, idéal pour les personnes ayant peu d''appétit.', 0),
    ('boisson-concentree', 'Sa formule concentrée permet d''obtenir un maximum de nutriments essentiels en un minimum de volume.', 1),
    ('creme-dessert', 'Nutriwell Crème Dessert allie plaisir gustatif et nutrition médicale dans une texture onctueuse et réconfortante.', 0),
    ('creme-dessert', 'Disponible en 5 saveurs gourmandes pour varier les plaisirs au quotidien.', 1)
) as d(slug, content, sort_order)
on p.slug = d.slug;

-- Benefits
insert into public.product_benefits (product_id, content, sort_order)
select p.id, b.content, b.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'Hyperprotéinée : 20g de protéines par portion', 0),
    ('boisson-fruitee', 'Sans sucres ajoutés, convient aux diabétiques', 1),
    ('boisson-fruitee', 'Enrichie en 27 vitamines et minéraux', 2),
    ('boisson-fruitee', 'Texture légère et rafraîchissante', 3),
    ('boisson-fruitee', 'Sans gluten, sans lactose', 4),
    ('boisson-concentree', 'Format compact 125ml facile à consommer', 0),
    ('boisson-concentree', '300 kcal par bouteille', 1),
    ('boisson-concentree', 'Riche en protéines et énergie', 2),
    ('boisson-concentree', '3 saveurs gourmandes', 3),
    ('creme-dessert', 'Texture onctueuse et gourmande', 0),
    ('creme-dessert', '5 saveurs disponibles', 1),
    ('creme-dessert', 'Enrichie en protéines', 2),
    ('creme-dessert', 'Prête à consommer', 3)
) as b(slug, content, sort_order)
on p.slug = b.slug;

-- Flavors
insert into public.product_flavors (product_id, name, sort_order)
select p.id, f.name, f.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'Pêche Abricot', 0),
    ('boisson-fruitee', 'Fruits Rouges', 1),
    ('boisson-fruitee', 'Citron', 2),
    ('boisson-fruitee', 'Pomme Verte', 3),
    ('boisson-concentree', 'Vanille', 0),
    ('boisson-concentree', 'Chocolat', 1),
    ('boisson-concentree', 'Café', 2),
    ('creme-dessert', 'Vanille', 0),
    ('creme-dessert', 'Chocolat', 1),
    ('creme-dessert', 'Caramel', 2),
    ('creme-dessert', 'Café', 3),
    ('creme-dessert', 'Praliné', 4)
) as f(slug, name, sort_order)
on p.slug = f.slug;

-- Formats
insert into public.product_formats (product_id, label, sort_order)
select p.id, f.label, f.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'Pack 4 × 200ml', 0),
    ('boisson-fruitee', 'Pack 12 × 200ml', 1),
    ('boisson-concentree', 'Pack 4 × 125ml', 0),
    ('boisson-concentree', 'Pack 12 × 125ml', 1),
    ('creme-dessert', 'Pack 4 × 125g', 0),
    ('creme-dessert', 'Pack 12 × 125g', 1)
) as f(slug, label, sort_order)
on p.slug = f.slug;

-- Nutrition
insert into public.product_nutrition (product_id, nutriment, per_100ml, per_portion, sort_order)
select p.id, n.nutriment, n.per_100ml, n.per_portion, n.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'Énergie', '100 kcal', '200 kcal', 0),
    ('boisson-fruitee', 'Protéines', '10 g', '20 g', 1),
    ('boisson-fruitee', 'Glucides', '12 g', '24 g', 2),
    ('boisson-fruitee', 'Lipides', '3,5 g', '7 g', 3),
    ('boisson-fruitee', 'Fibres', '1,2 g', '2,4 g', 4),
    ('boisson-fruitee', 'Sodium', '0,15 g', '0,30 g', 5),
    ('boisson-concentree', 'Énergie', '240 kcal', '300 kcal', 0),
    ('boisson-concentree', 'Protéines', '10 g', '12,5 g', 1),
    ('boisson-concentree', 'Glucides', '25 g', '31 g', 2),
    ('boisson-concentree', 'Lipides', '11 g', '14 g', 3),
    ('boisson-concentree', 'Fibres', '0 g', '0 g', 4),
    ('boisson-concentree', 'Sodium', '0,12 g', '0,15 g', 5),
    ('creme-dessert', 'Énergie', '150 kcal', '188 kcal', 0),
    ('creme-dessert', 'Protéines', '8 g', '10 g', 1),
    ('creme-dessert', 'Glucides', '18 g', '22,5 g', 2),
    ('creme-dessert', 'Lipides', '5 g', '6,3 g', 3),
    ('creme-dessert', 'Fibres', '0,5 g', '0,6 g', 4),
    ('creme-dessert', 'Sodium', '0,10 g', '0,13 g', 5)
) as n(slug, nutriment, per_100ml, per_portion, sort_order)
on p.slug = n.slug;

-- Usage tips
insert into public.product_usage_tips (product_id, icon, content, sort_order)
select p.id, u.icon, u.content, u.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'clock', 'Consommer de préférence entre les repas ou en collation, 1 à 2 fois par jour.', 0),
    ('boisson-fruitee', 'thermometer', 'Se déguste frais pour un plaisir optimal. Conserver au réfrigérateur après ouverture.', 1),
    ('boisson-fruitee', 'info', 'Agiter avant ouverture. Ne se substitue pas à une alimentation variée et équilibrée.', 2),
    ('boisson-concentree', 'clock', 'Consommer 1 à 3 bouteilles par jour selon les recommandations de votre professionnel de santé.', 0),
    ('boisson-concentree', 'thermometer', 'Servir frais ou à température ambiante.', 1),
    ('boisson-concentree', 'info', 'Bien agiter avant ouverture.', 2),
    ('creme-dessert', 'clock', 'Idéale en dessert ou en collation, 1 à 2 pots par jour.', 0),
    ('creme-dessert', 'thermometer', 'Se déguste fraîche. Conserver au réfrigérateur.', 1),
    ('creme-dessert', 'info', 'Ne pas réchauffer.', 2)
) as u(slug, icon, content, sort_order)
on p.slug = u.slug;

-- Images gallery
insert into public.product_images (product_id, image_url, alt_text, sort_order)
select p.id, i.image_url, i.alt_text, i.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&h=600&fit=crop', 'Nutriwell Boisson Fruitée', 0),
    ('boisson-fruitee', 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop', 'Nutriwell Boisson Fruitée vue 2', 1),
    ('boisson-fruitee', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=600&fit=crop', 'Nutriwell Boisson Fruitée vue 3', 2),
    ('boisson-concentree', 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&h=600&fit=crop', 'Nutriwell Boisson Concentrée', 0),
    ('creme-dessert', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=600&fit=crop', 'Nutriwell Crème Dessert', 0)
) as i(slug, image_url, alt_text, sort_order)
on p.slug = i.slug;

-- Reviews
insert into public.product_reviews (product_id, reviewer_name, rating, review_text, review_date, sort_order)
select p.id, r.reviewer_name, r.rating, r.review_text, r.review_date, r.sort_order
from public.products p
join (
  values
    ('boisson-fruitee', 'Marie', 5, 'Excellent goût fruité, très rafraîchissant. Je le prends chaque matin et ça m''aide vraiment à garder la forme.', '2025-03-12'::date, 0),
    ('boisson-fruitee', 'Jean-Pierre', 4, 'Bon produit, facile à boire. Le format 200ml est pratique à emporter. Je recommande le goût pêche abricot.', '2025-02-28'::date, 1),
    ('boisson-fruitee', 'Françoise', 5, 'Mon médecin me l''a recommandé et je suis ravie. Les saveurs sont naturelles et agréables.', '2025-01-15'::date, 2),
    ('boisson-concentree', 'Claude', 4, 'Très pratique, le petit format est parfait quand on n''a pas faim.', '2025-03-05'::date, 0),
    ('boisson-concentree', 'Monique', 5, 'Le goût chocolat est délicieux !', '2025-02-20'::date, 1),
    ('boisson-concentree', 'André', 4, 'Bien concentré, efficace.', '2025-01-10'::date, 2),
    ('creme-dessert', 'Simone', 5, 'Un vrai régal, le goût caramel est mon préféré !', '2025-03-08'::date, 0),
    ('creme-dessert', 'Robert', 5, 'Enfin un produit médical qui a bon goût.', '2025-02-25'::date, 1),
    ('creme-dessert', 'Hélène', 4, 'Très bon, je le recommande à tous.', '2025-02-03'::date, 2)
) as r(slug, reviewer_name, rating, review_text, review_date, sort_order)
on p.slug = r.slug;

commit;
