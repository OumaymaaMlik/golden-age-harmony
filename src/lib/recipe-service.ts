import { supabase } from "@/lib/supabase";

export interface RecipeListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  prep_time: string;
  servings: number;
  image: string | null;
  is_published: boolean;
  updated_at: string;
}

export interface RecipeDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  prepTime: string;
  servings: number;
  image: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  nutrition: string[];
}

export interface RecipeFormInput {
  slug: string;
  title: string;
  category: string;
  summary: string;
  prepTime: string;
  servings: number;
  image: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  nutrition: string[];
  isPublished: boolean;
}

const clean = (value: string) => value.trim();

const normalizeSupabaseError = (error: unknown) => {
  const e = error as {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  };

  const code = e?.code ?? "";
  const message = e?.message ?? "";
  const details = e?.details ?? "";
  const hint = e?.hint ?? "";
  const full = [message, details, hint].filter(Boolean).join(" | ");

  if (code === "42703" || /column .* does not exist/i.test(full)) {
    return new Error(
      `Schema recettes incompatible avec le frontend. Executez le script supabase/step6_recipes_contact.sql. Détail: ${full || code}`,
    );
  }

  if (code === "42501" || /row-level security|permission denied/i.test(full)) {
    return new Error(
      `Droits insuffisants pour enregistrer la recette (RLS/Admin). Verifiez que ce compte est admin_users. Détail: ${full || code}`,
    );
  }

  if (code === "23505" || /duplicate key|recipes_slug_key/i.test(full)) {
    return new Error("Ce slug existe déjà. Utilisez un slug unique.");
  }

  if (code === "23514" || /recipes_slug_format/i.test(full)) {
    return new Error("Slug invalide. Utilisez uniquement a-z, 0-9 et des tirets.");
  }

  return new Error(full || "Erreur Supabase inconnue lors de l'enregistrement de la recette.");
};

export const fetchPublishedRecipes = async (category?: string): Promise<RecipeListItem[]> => {
  let query = supabase
    .from("recipes")
    .select("id, slug, title, category, summary, prep_time, servings, image, is_published, updated_at")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  if (category && category !== "Toutes") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
};

export const fetchPublishedRecipeBySlug = async (slug: string): Promise<RecipeDetail | null> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, slug, title, category, summary, prep_time, servings, image, ingredients, steps, tips, nutrition")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
    prepTime: data.prep_time,
    servings: data.servings,
    image: data.image ?? "",
    ingredients: data.ingredients ?? [],
    steps: data.steps ?? [],
    tips: data.tips ?? [],
    nutrition: data.nutrition ?? [],
  };
};

export const fetchAdminRecipes = async (): Promise<RecipeListItem[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, slug, title, category, summary, prep_time, servings, image, is_published, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const fetchAdminRecipeById = async (recipeId: string): Promise<RecipeFormInput> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("slug, title, category, summary, prep_time, servings, image, ingredients, steps, tips, nutrition, is_published")
    .eq("id", recipeId)
    .single();

  if (error) throw error;

  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    summary: data.summary,
    prepTime: data.prep_time,
    servings: data.servings,
    image: data.image ?? "",
    ingredients: data.ingredients ?? [],
    steps: data.steps ?? [],
    tips: data.tips ?? [],
    nutrition: data.nutrition ?? [],
    isPublished: Boolean(data.is_published),
  };
};

export const saveAdminRecipe = async (input: RecipeFormInput, recipeId?: string) => {
  const payload = {
    slug: clean(input.slug),
    title: clean(input.title),
    category: clean(input.category),
    summary: clean(input.summary),
    prep_time: clean(input.prepTime),
    servings: Number(input.servings) || 1,
    image: clean(input.image) || null,
    ingredients: input.ingredients.map(clean).filter(Boolean),
    steps: input.steps.map(clean).filter(Boolean),
    tips: input.tips.map(clean).filter(Boolean),
    nutrition: input.nutrition.map(clean).filter(Boolean),
    is_published: input.isPublished,
  };

  if (recipeId) {
    const { data, error } = await supabase
      .from("recipes")
      .update(payload)
      .eq("id", recipeId)
      .select("id")
      .single();

    if (error) throw normalizeSupabaseError(error);
    return data.id as string;
  }

  const { data, error } = await supabase.from("recipes").insert(payload).select("id").single();
  if (error) throw normalizeSupabaseError(error);
  return data.id as string;
};

export const updateRecipePublishStatus = async (recipeId: string, nextStatus: boolean) => {
  const { error } = await supabase
    .from("recipes")
    .update({ is_published: nextStatus })
    .eq("id", recipeId);

  if (error) throw error;
};

export const deleteRecipe = async (recipeId: string) => {
  const { error } = await supabase.from("recipes").delete().eq("id", recipeId);
  if (error) throw error;
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");

export const uploadRecipeImage = async (file: File, recipeSlug: string) => {
  const safeSlug = clean(recipeSlug) || "draft-recipe";
  const timestamp = Date.now();
  const safeFileName = sanitizeFileName(file.name || `recipe-${timestamp}.jpg`);
  const path = `${safeSlug}/${timestamp}-${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from("recipes")
    .upload(path, file, { upsert: false });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("recipes").getPublicUrl(path);
  return data.publicUrl;
};
