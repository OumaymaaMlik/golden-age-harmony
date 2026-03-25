import { supabase } from "@/lib/supabase";

export interface AdminProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  texture: string;
  gout: string;
  regime: string;
  is_published: boolean;
  updated_at: string;
}

export interface NutritionInput {
  nutriment: string;
  per100ml: string;
  perPortion: string;
}

export interface UsageTipInput {
  icon: string;
  text: string;
}

export interface ReviewInput {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface AdminProductFormInput {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  texture: string;
  gout: string;
  regime: string;
  price: string;
  pricePerUnit: string;
  badge: string;
  badgeColor: string;
  image: string;
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  descriptions: string[];
  benefits: string[];
  flavors: string[];
  formats: string[];
  nutrition: NutritionInput[];
  usageTips: UsageTipInput[];
  images: string[];
  reviews: ReviewInput[];
}

const clean = (value: string) => value.trim();

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const isCurrentUserAdmin = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return false;

  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
};

export const fetchAdminProducts = async (): Promise<AdminProductItem[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, category, texture, gout, regime, is_published, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const updateProductPublishStatus = async (productId: string, nextStatus: boolean) => {
  const { error } = await supabase
    .from("products")
    .update({ is_published: nextStatus })
    .eq("id", productId);

  if (error) throw error;
};

export const fetchAdminProductById = async (productId: string): Promise<AdminProductFormInput> => {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, slug, name, category, short_description, texture, gout, regime, price, price_per_unit, badge, badge_color, image, rating, review_count, is_published")
    .eq("id", productId)
    .single();

  if (productError) throw productError;

  const [descriptionsRes, benefitsRes, flavorsRes, formatsRes, nutritionRes, usageTipsRes, imagesRes, reviewsRes] = await Promise.all([
    supabase.from("product_descriptions").select("content").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_benefits").select("content").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_flavors").select("name").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_formats").select("label").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_nutrition").select("nutriment, per_100ml, per_portion").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_usage_tips").select("icon, content").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_images").select("image_url").eq("product_id", productId).order("sort_order", { ascending: true }),
    supabase.from("product_reviews").select("reviewer_name, rating, review_text, review_date").eq("product_id", productId).order("sort_order", { ascending: true }),
  ]);

  const errors = [
    descriptionsRes.error,
    benefitsRes.error,
    flavorsRes.error,
    formatsRes.error,
    nutritionRes.error,
    usageTipsRes.error,
    imagesRes.error,
    reviewsRes.error,
  ].filter(Boolean);

  if (errors.length) throw errors[0];

  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    shortDescription: product.short_description,
    texture: product.texture,
    gout: product.gout,
    regime: product.regime,
    price: product.price,
    pricePerUnit: product.price_per_unit,
    badge: product.badge ?? "",
    badgeColor: product.badge_color ?? "",
    image: product.image ?? "",
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.review_count ?? 0),
    isPublished: Boolean(product.is_published),
    descriptions: (descriptionsRes.data ?? []).map((x) => x.content),
    benefits: (benefitsRes.data ?? []).map((x) => x.content),
    flavors: (flavorsRes.data ?? []).map((x) => x.name),
    formats: (formatsRes.data ?? []).map((x) => x.label),
    nutrition: (nutritionRes.data ?? []).map((x) => ({
      nutriment: x.nutriment,
      per100ml: x.per_100ml,
      perPortion: x.per_portion,
    })),
    usageTips: (usageTipsRes.data ?? []).map((x) => ({ icon: x.icon, text: x.content })),
    images: (imagesRes.data ?? []).map((x) => x.image_url),
    reviews: (reviewsRes.data ?? []).map((x) => ({
      name: x.reviewer_name,
      rating: x.rating,
      text: x.review_text,
      date: x.review_date ?? "",
    })),
  };
};

const replaceChildRows = async (productId: string, input: AdminProductFormInput) => {
  const deleteOps = [
    supabase.from("product_descriptions").delete().eq("product_id", productId),
    supabase.from("product_benefits").delete().eq("product_id", productId),
    supabase.from("product_flavors").delete().eq("product_id", productId),
    supabase.from("product_formats").delete().eq("product_id", productId),
    supabase.from("product_nutrition").delete().eq("product_id", productId),
    supabase.from("product_usage_tips").delete().eq("product_id", productId),
    supabase.from("product_images").delete().eq("product_id", productId),
    supabase.from("product_reviews").delete().eq("product_id", productId),
  ];

  const deleteResults = await Promise.all(deleteOps);
  const deleteError = deleteResults.find((r) => r.error)?.error;
  if (deleteError) throw deleteError;

  const descriptions = input.descriptions.map(clean).filter(Boolean);
  const benefits = input.benefits.map(clean).filter(Boolean);
  const flavors = input.flavors.map(clean).filter(Boolean);
  const formats = input.formats.map(clean).filter(Boolean);
  const images = input.images.map(clean).filter(Boolean);

  const nutrition = input.nutrition.filter((n) => clean(n.nutriment) && clean(n.per100ml) && clean(n.perPortion));
  const usageTips = input.usageTips.filter((u) => clean(u.icon) && clean(u.text));
  const reviews = input.reviews.filter((r) => clean(r.name) && Number(r.rating) >= 1 && Number(r.rating) <= 5 && clean(r.text));

  const insertOps = [
    descriptions.length
      ? supabase.from("product_descriptions").insert(descriptions.map((content, i) => ({ product_id: productId, content, sort_order: i })))
      : Promise.resolve({ error: null }),
    benefits.length
      ? supabase.from("product_benefits").insert(benefits.map((content, i) => ({ product_id: productId, content, sort_order: i })))
      : Promise.resolve({ error: null }),
    flavors.length
      ? supabase.from("product_flavors").insert(flavors.map((name, i) => ({ product_id: productId, name, sort_order: i })))
      : Promise.resolve({ error: null }),
    formats.length
      ? supabase.from("product_formats").insert(formats.map((label, i) => ({ product_id: productId, label, sort_order: i })))
      : Promise.resolve({ error: null }),
    nutrition.length
      ? supabase
          .from("product_nutrition")
          .insert(
            nutrition.map((row, i) => ({
              product_id: productId,
              nutriment: clean(row.nutriment),
              per_100ml: clean(row.per100ml),
              per_portion: clean(row.perPortion),
              sort_order: i,
            })),
          )
      : Promise.resolve({ error: null }),
    usageTips.length
      ? supabase
          .from("product_usage_tips")
          .insert(
            usageTips.map((row, i) => ({
              product_id: productId,
              icon: clean(row.icon),
              content: clean(row.text),
              sort_order: i,
            })),
          )
      : Promise.resolve({ error: null }),
    images.length
      ? supabase
          .from("product_images")
          .insert(images.map((imageUrl, i) => ({ product_id: productId, image_url: imageUrl, sort_order: i })))
      : Promise.resolve({ error: null }),
    reviews.length
      ? supabase
          .from("product_reviews")
          .insert(
            reviews.map((row, i) => ({
              product_id: productId,
              reviewer_name: clean(row.name),
              rating: Number(row.rating),
              review_text: clean(row.text),
              review_date: clean(row.date) || null,
              sort_order: i,
            })),
          )
      : Promise.resolve({ error: null }),
  ];

  const insertResults = await Promise.all(insertOps);
  const insertError = insertResults.find((r) => r.error)?.error;
  if (insertError) throw insertError;
};

export const saveAdminProduct = async (input: AdminProductFormInput, productId?: string) => {
  const payload = {
    slug: clean(input.slug),
    name: clean(input.name),
    category: clean(input.category),
    short_description: clean(input.shortDescription),
    texture: clean(input.texture),
    gout: clean(input.gout),
    regime: clean(input.regime),
    price: clean(input.price),
    price_per_unit: clean(input.pricePerUnit),
    badge: clean(input.badge) || null,
    badge_color: clean(input.badgeColor) || null,
    image: clean(input.image) || null,
    rating: Number(input.rating) || 0,
    review_count: Number(input.reviewCount) || 0,
    is_published: input.isPublished,
  };

  let resolvedId = productId;

  if (resolvedId) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", resolvedId)
      .select("id")
      .single();

    if (error) throw error;
    resolvedId = data.id;
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id").single();
    if (error) throw error;
    resolvedId = data.id;
  }

  await replaceChildRows(resolvedId, input);
  return resolvedId;
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadProductImage = async (
  file: File,
  productSlug: string,
  folder: "main" | "gallery" = "gallery",
) => {
  const safeSlug = clean(productSlug) || "draft-product";
  const timestamp = Date.now();
  const safeFileName = sanitizeFileName(file.name || `image-${timestamp}.jpg`);
  const path = `${safeSlug}/${folder}/${timestamp}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(path, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return data.publicUrl;
};
