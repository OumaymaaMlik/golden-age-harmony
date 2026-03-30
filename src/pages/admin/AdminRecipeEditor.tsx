import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RecipeFormInput, fetchAdminRecipeById, saveAdminRecipe, uploadRecipeImage } from "@/lib/recipe-service";

const emptyForm: RecipeFormInput = {
  slug: "",
  title: "",
  category: "",
  summary: "",
  prepTime: "",
  servings: 1,
  image: "",
  ingredients: [],
  steps: [],
  tips: [],
  nutrition: [],
  isPublished: false,
};

const toLines = (items: string[]) => items.join("\n");
const fromLines = (raw: string) => raw.split("\n").map((line) => line.trim()).filter(Boolean);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const CATEGORY_OPTIONS = ["Petit-déjeuner", "Déjeuner", "Dîner", "Snacks", "Boissons"];

const AdminRecipeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<RecipeFormInput>(emptyForm);
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [tipsText, setTipsText] = useState("");
  const [nutritionText, setNutritionText] = useState("");
  const [saveError, setSaveError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-recipe-editor", id],
    queryFn: () => fetchAdminRecipeById(id as string),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!data) return;
    setForm(data);
    setIngredientsText(toLines(data.ingredients));
    setStepsText(toLines(data.steps));
    setTipsText(toLines(data.tips));
    setNutritionText(toLines(data.nutrition));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: RecipeFormInput) => saveAdminRecipe(payload, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
      await queryClient.invalidateQueries({ queryKey: ["recipes-public"] });
      await queryClient.invalidateQueries({ queryKey: ["recipe-detail"] });
      navigate("/admin/recipes");
    },
  });

  const normalizedPayload = useMemo<RecipeFormInput>(() => {
    return {
      ...form,
      ingredients: fromLines(ingredientsText),
      steps: fromLines(stepsText),
      tips: fromLines(tipsText),
      nutrition: fromLines(nutritionText),
    };
  }, [form, ingredientsText, nutritionText, stepsText, tipsText]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError("");

    if (!form.slug || !form.title || !form.category || !form.summary || !form.prepTime) {
      setSaveError("Les champs slug, titre, categorie, resume et preparation sont obligatoires.");
      return;
    }

    if (!CATEGORY_OPTIONS.includes(form.category)) {
      setSaveError("Veuillez choisir une categorie depuis la liste.");
      return;
    }

    if (!SLUG_PATTERN.test(form.slug)) {
      setSaveError("Slug invalide. Utilisez uniquement a-z, 0-9 et des tirets (ex: smoothie-fruits-rouges).");
      return;
    }

    if (normalizedPayload.ingredients.length === 0 || normalizedPayload.steps.length === 0) {
      setSaveError("Ajoutez au moins un ingredient et une etape de preparation.");
      return;
    }

    try {
      await saveMutation.mutateAsync(normalizedPayload);
    } catch (err) {
      console.error("Recipe save failed:", err);
      const details = err instanceof Error ? err.message : "";

      if (details.includes("recipes_slug_format")) {
        setSaveError("Slug invalide. Utilisez uniquement a-z, 0-9 et des tirets (ex: smoothie-fruits-rouges).");
        return;
      }

      if (details.includes("recipes_slug_key") || details.includes("duplicate key")) {
        setSaveError("Ce slug existe deja. Utilisez un slug unique.");
        return;
      }

      setSaveError(details || "Enregistrement impossible. Verifiez vos donnees puis reessayez.");
    }
  };

  const onUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadingImage(true);

    try {
      const url = await uploadRecipeImage(file, form.slug);
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      setUploadError("Upload image recette impossible.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement de la recette...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {isEdit ? "Modifier la recette" : "Nouvelle recette"}
            </h1>
            <p className="text-muted-foreground">Configurez le detail complet de la recette.</p>
          </div>
          <Link
            to="/admin/recipes"
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Retour liste
          </Link>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Slug</label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value),
                  }))
                }
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">Format: lettres minuscules, chiffres et tirets uniquement.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Titre</label>
              <input
                value={form.title}
                onChange={(e) => {
                  const nextTitle = e.target.value;
                  setForm((prev) => {
                    const previousSlugFromTitle = slugify(prev.title);
                    const shouldAutofillSlug = !prev.slug || prev.slug === previousSlugFromTitle;

                    return {
                      ...prev,
                      title: nextTitle,
                      slug: shouldAutofillSlug ? slugify(nextTitle) : prev.slug,
                    };
                  });
                }}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Categorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              >
                <option value="">Selectionner une categorie</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Temps de preparation</label>
              <input
                value={form.prepTime}
                onChange={(e) => setForm((prev) => ({ ...prev, prepTime: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="20 min"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Portions</label>
              <input
                type="number"
                min={1}
                value={form.servings}
                onChange={(e) => setForm((prev) => ({ ...prev, servings: Number(e.target.value) || 1 }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Image principale URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
              <label className="mt-2 inline-flex cursor-pointer rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">
                {uploadingImage ? "Upload..." : "Uploader image recette"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUploadImage}
                  disabled={uploadingImage}
                />
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">Resume</label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))}
                className="mt-1 min-h-[90px] w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                className="h-4 w-4"
              />
              Publiee
            </label>
          </div>

          <div className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Ingredients (1 ligne = 1 ingredient)</label>
              <textarea
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="mt-1 min-h-[180px] w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Etapes (1 ligne = 1 etape)</label>
              <textarea
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                className="mt-1 min-h-[180px] w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Astuces (1 ligne = 1 astuce)</label>
              <textarea
                value={tipsText}
                onChange={(e) => setTipsText(e.target.value)}
                className="mt-1 min-h-[140px] w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nutrition (1 ligne = 1 info)</label>
              <textarea
                value={nutritionText}
                onChange={(e) => setNutritionText(e.target.value)}
                className="mt-1 min-h-[140px] w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
          </div>

          {saveError && <p className="text-sm text-destructive">{saveError}</p>}
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRecipeEditor;
