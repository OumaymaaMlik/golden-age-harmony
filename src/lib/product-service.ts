import type { Product } from "@/data/products";
import { supabase } from "@/lib/supabase";

export interface ProductCardItem {
  slug: string;
  name: string;
  flavors: string;
  image: string;
  texture: string;
  gout: string;
  regime: string;
  badge?: string;
  badgeColor?: string;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  short_description: string;
  texture: string;
  gout: string;
  regime: string;
  price: string;
  price_per_unit: string;
  badge: string | null;
  badge_color: string | null;
  image: string | null;
  rating: number;
  review_count: number;
}

const toFrenchDate = (dateIso: string | null) => {
  if (!dateIso) return "";
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const buildFlavorsLabel = (count: number) => {
  if (count <= 1) return "1 saveur";
  return `${count} saveurs`;
};

export const fetchProductCards = async (filters: {
  activeTexture?: string;
  activeGout?: string;
  activeRegime?: string;
}): Promise<ProductCardItem[]> => {
  let query = supabase
    .from("products")
    .select("id, slug, name, image, texture, gout, regime, badge, badge_color")
    .eq("is_published", true)
    .order("name", { ascending: true });

  if (filters.activeTexture) query = query.eq("texture", filters.activeTexture);
  if (filters.activeGout) query = query.eq("gout", filters.activeGout);
  if (filters.activeRegime) query = query.eq("regime", filters.activeRegime);

  const { data: products, error } = await query;
  if (error) throw error;

  const productIds = (products ?? []).map((p) => p.id);

  let flavorCountMap = new Map<string, number>();
  if (productIds.length) {
    const { data: flavors, error: flavorsError } = await supabase
      .from("product_flavors")
      .select("product_id")
      .in("product_id", productIds);

    if (flavorsError) throw flavorsError;

    flavorCountMap = (flavors ?? []).reduce((map, row) => {
      const current = map.get(row.product_id) ?? 0;
      map.set(row.product_id, current + 1);
      return map;
    }, new Map<string, number>());
  }

  return (products ?? []).map((product) => {
    const flavorCount = flavorCountMap.get(product.id) ?? 0;
    return {
      slug: product.slug,
      name: product.name,
      flavors: buildFlavorsLabel(flavorCount),
      image: product.image ?? "",
      texture: product.texture,
      gout: product.gout,
      regime: product.regime,
      badge: product.badge ?? undefined,
      badgeColor: product.badge_color ?? undefined,
    };
  });
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data: product, error } = await supabase
    .from("products")
    .select("id, slug, name, category, short_description, texture, gout, regime, price, price_per_unit, badge, badge_color, image, rating, review_count")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle<ProductRow>();

  if (error) throw error;
  if (!product) return null;

  const productId = product.id;

  const [descriptionsRes, benefitsRes, flavorsRes, formatsRes, nutritionRes, usageTipsRes, imagesRes, reviewsRes] = await Promise.all([
    supabase.from("product_descriptions").select("content").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_benefits").select("content").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_flavors").select("name").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_formats").select("label").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase
      .from("product_nutrition")
      .select("nutriment, per_100ml, per_portion")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_usage_tips")
      .select("icon, content")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_reviews")
      .select("reviewer_name, rating, review_text, review_date")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
  ]);

  const allErrors = [
    descriptionsRes.error,
    benefitsRes.error,
    flavorsRes.error,
    formatsRes.error,
    nutritionRes.error,
    usageTipsRes.error,
    imagesRes.error,
    reviewsRes.error,
  ].filter(Boolean);

  if (allErrors.length) {
    throw allErrors[0];
  }

  const images = (imagesRes.data ?? []).map((row) => row.image_url).filter(Boolean);

  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    flavors: (flavorsRes.data ?? []).map((row) => row.name),
    formats: (formatsRes.data ?? []).map((row) => row.label),
    price: product.price,
    pricePerUnit: product.price_per_unit,
    badge: product.badge ?? undefined,
    badgeColor: product.badge_color ?? undefined,
    image: product.image ?? images[0] ?? "",
    images: images.length ? images : [product.image ?? ""],
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.review_count ?? 0),
    shortDescription: product.short_description,
    description: (descriptionsRes.data ?? []).map((row) => row.content),
    benefits: (benefitsRes.data ?? []).map((row) => row.content),
    nutrition: (nutritionRes.data ?? []).map((row) => ({
      nutriment: row.nutriment,
      per100ml: row.per_100ml,
      perPortion: row.per_portion,
    })),
    usageTips: (usageTipsRes.data ?? []).map((row) => ({
      icon: row.icon,
      text: row.content,
    })),
    reviews: (reviewsRes.data ?? []).map((row) => ({
      name: row.reviewer_name,
      rating: row.rating,
      text: row.review_text,
      date: toFrenchDate(row.review_date),
    })),
    texture: product.texture,
    gout: product.gout,
    regime: product.regime,
  };
};

export const fetchRelatedProducts = async (currentSlug: string): Promise<Array<Pick<Product, "slug" | "name" | "image" | "flavors">>> => {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, image")
    .eq("is_published", true)
    .neq("slug", currentSlug)
    .order("updated_at", { ascending: false })
    .limit(4);

  if (error) throw error;

  const productIds = (products ?? []).map((p) => p.id);

  let flavorCountMap = new Map<string, number>();
  if (productIds.length) {
    const { data: flavors, error: flavorsError } = await supabase
      .from("product_flavors")
      .select("product_id")
      .in("product_id", productIds);

    if (flavorsError) throw flavorsError;

    flavorCountMap = (flavors ?? []).reduce((map, row) => {
      const current = map.get(row.product_id) ?? 0;
      map.set(row.product_id, current + 1);
      return map;
    }, new Map<string, number>());
  }

  return (products ?? []).map((product) => {
    const flavorsCount = flavorCountMap.get(product.id) ?? 0;
    const flavorNames = Array.from({ length: flavorsCount }, (_, i) => `saveur-${i + 1}`);

    return {
      slug: product.slug,
      name: product.name,
      image: product.image ?? "",
      flavors: flavorNames,
    };
  });
};
