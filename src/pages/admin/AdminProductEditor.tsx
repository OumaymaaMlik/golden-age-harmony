import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminProductFormInput, fetchAdminProductById, saveAdminProduct, uploadProductImage } from "@/lib/admin-service";

const emptyForm: AdminProductFormInput = {
  slug: "",
  name: "",
  category: "",
  shortDescription: "",
  texture: "",
  gout: "",
  regime: "",
  price: "",
  pricePerUnit: "",
  badge: "",
  badgeColor: "",
  image: "",
  rating: 0,
  reviewCount: 0,
  isPublished: false,
  descriptions: [],
  benefits: [],
  flavors: [],
  formats: [],
  nutrition: [],
  usageTips: [],
  images: [],
  reviews: [],
};

const toLines = (items: string[]) => items.join("\n");
const fromLines = (raw: string) => raw.split("\n").map((line) => line.trim()).filter(Boolean);

const CATEGORY_OPTIONS = ["Boisson nutritionnelle", "Crème nutritionnelle", "Poudre nutritionnelle"];
const TEXTURE_OPTIONS = ["Boisson", "Crème", "Poudre", "Gelée", "Purée", "Velouté", "Céréales"];
const GOUT_OPTIONS = ["Vanille", "Chocolat", "Café", "Fruité", "Lacté", "Neutre", "Caramel"];
const REGIME_OPTIONS = ["Standard", "Sans sucre", "Hyperprotéiné", "Rénal"];
const BADGE_OPTIONS = ["", "NOUVEAU", "SANS SUCRE"];
const BADGE_COLOR_OPTIONS = ["", "bg-destructive", "bg-muted-foreground"];

const AdminProductEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<AdminProductFormInput>(emptyForm);
  const [descriptionText, setDescriptionText] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [flavorsText, setFlavorsText] = useState("");
  const [formatsText, setFormatsText] = useState("");
  const [imagesText, setImagesText] = useState("");
  const [nutritionText, setNutritionText] = useState("");
  const [usageText, setUsageText] = useState("");
  const [reviewsText, setReviewsText] = useState("");
  const [saveError, setSaveError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-product-editor", id],
    queryFn: () => fetchAdminProductById(id as string),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!data) return;
    setForm(data);
    setDescriptionText(toLines(data.descriptions));
    setBenefitsText(toLines(data.benefits));
    setFlavorsText(toLines(data.flavors));
    setFormatsText(toLines(data.formats));
    setImagesText(toLines(data.images));
    setNutritionText(
      data.nutrition
        .map((row) => `${row.nutriment} | ${row.per100ml} | ${row.perPortion}`)
        .join("\n"),
    );
    setUsageText(data.usageTips.map((row) => `${row.icon} | ${row.text}`).join("\n"));
    setReviewsText(data.reviews.map((row) => `${row.name} | ${row.rating} | ${row.date} | ${row.text}`).join("\n"));
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (payload: AdminProductFormInput) => saveAdminProduct(payload, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      await queryClient.invalidateQueries({ queryKey: ["products-grid"] });
      await queryClient.invalidateQueries({ queryKey: ["product-detail"] });
      await queryClient.invalidateQueries({ queryKey: ["related-products"] });
      navigate("/admin/products");
    },
  });

  const normalizedPayload = useMemo<AdminProductFormInput>(() => {
    const nutrition = nutritionText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [nutriment = "", per100ml = "", perPortion = ""] = line.split("|").map((part) => part.trim());
        return { nutriment, per100ml, perPortion };
      })
      .filter((row) => row.nutriment && row.per100ml && row.perPortion);

    const usageTips = usageText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [icon = "", text = ""] = line.split("|").map((part) => part.trim());
        return { icon, text };
      })
      .filter((row) => row.icon && row.text);

    const reviews = reviewsText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name = "", ratingRaw = "", date = "", text = ""] = line.split("|").map((part) => part.trim());
        const rating = Number(ratingRaw);
        return {
          name,
          rating: Number.isNaN(rating) ? 0 : rating,
          date,
          text,
        };
      })
      .filter((row) => row.name && row.rating >= 1 && row.rating <= 5 && row.text);

    return {
      ...form,
      descriptions: fromLines(descriptionText),
      benefits: fromLines(benefitsText),
      flavors: fromLines(flavorsText),
      formats: fromLines(formatsText),
      images: fromLines(imagesText),
      nutrition,
      usageTips,
      reviews,
    };
  }, [benefitsText, descriptionText, flavorsText, formatsText, form, imagesText, nutritionText, reviewsText, usageText]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError("");

    if (!form.slug || !form.name || !form.category || !form.shortDescription) {
      setSaveError("Les champs slug, nom, catégorie et description courte sont obligatoires.");
      return;
    }

    if (!CATEGORY_OPTIONS.includes(form.category)) {
      setSaveError("Veuillez choisir une catégorie depuis la liste.");
      return;
    }

    if (!TEXTURE_OPTIONS.includes(form.texture)) {
      setSaveError("Veuillez choisir une texture depuis la liste.");
      return;
    }

    if (!GOUT_OPTIONS.includes(form.gout)) {
      setSaveError("Veuillez choisir un goût depuis la liste.");
      return;
    }

    if (!REGIME_OPTIONS.includes(form.regime)) {
      setSaveError("Veuillez choisir un régime depuis la liste.");
      return;
    }

    if (!BADGE_OPTIONS.includes(form.badge)) {
      setSaveError("Veuillez choisir un badge valide depuis la liste.");
      return;
    }

    if (!BADGE_COLOR_OPTIONS.includes(form.badgeColor)) {
      setSaveError("Veuillez choisir une couleur de badge valide depuis la liste.");
      return;
    }

    try {
      await saveMutation.mutateAsync(normalizedPayload);
    } catch {
      setSaveError("Enregistrement impossible. Vérifiez vos données puis réessayez.");
    }
  };

  const onUploadMainImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploadingMain(true);

    try {
      const url = await uploadProductImage(file, form.slug, "main");
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      setUploadError("Upload image principale impossible.");
    } finally {
      setUploadingMain(false);
      e.target.value = "";
    }
  };

  const onUploadGalleryImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length) return;

    setUploadError("");
    setUploadingGallery(true);

    try {
      const files = Array.from(fileList);
      const urls = await Promise.all(files.map((file) => uploadProductImage(file, form.slug, "gallery")));
      setImagesText((prev) => {
        const existing = prev.trim();
        const added = urls.join("\n");
        return existing ? `${existing}\n${added}` : added;
      });
    } catch {
      setUploadError("Upload des images galerie impossible.");
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {isEdit ? "Modifier le produit" : "Nouveau produit"}
            </h1>
            <p className="text-muted-foreground">Configurez toutes les données produit.</p>
          </div>
          <Link
            to="/admin/products"
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
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nom</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {form.category && !CATEGORY_OPTIONS.includes(form.category) && (
                  <option value={form.category}>{form.category}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Image principale URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
              <label className="mt-2 inline-flex cursor-pointer rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">
                {uploadingMain ? "Upload..." : "Uploader image principale"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUploadMainImage}
                  disabled={uploadingMain}
                />
              </label>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Texture</label>
              <select
                value={form.texture}
                onChange={(e) => setForm((prev) => ({ ...prev, texture: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              >
                <option value="">Sélectionner une texture</option>
                {TEXTURE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {form.texture && !TEXTURE_OPTIONS.includes(form.texture) && (
                  <option value={form.texture}>{form.texture}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Goût</label>
              <select
                value={form.gout}
                onChange={(e) => setForm((prev) => ({ ...prev, gout: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              >
                <option value="">Sélectionner un goût</option>
                {GOUT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {form.gout && !GOUT_OPTIONS.includes(form.gout) && (
                  <option value={form.gout}>{form.gout}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Régime</label>
              <select
                value={form.regime}
                onChange={(e) => setForm((prev) => ({ ...prev, regime: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              >
                <option value="">Sélectionner un régime</option>
                {REGIME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {form.regime && !REGIME_OPTIONS.includes(form.regime) && (
                  <option value={form.regime}>{form.regime}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Prix</label>
              <input
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Prix par unité</label>
              <input
                value={form.pricePerUnit}
                onChange={(e) => setForm((prev) => ({ ...prev, pricePerUnit: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">Aucun badge</option>
                {BADGE_OPTIONS.filter(Boolean).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {form.badge && !BADGE_OPTIONS.includes(form.badge) && (
                  <option value={form.badge}>{form.badge}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Badge color class</label>
              <select
                value={form.badgeColor}
                onChange={(e) => setForm((prev) => ({ ...prev, badgeColor: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">Aucune classe</option>
                {BADGE_COLOR_OPTIONS.filter(Boolean).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {form.badgeColor && !BADGE_COLOR_OPTIONS.includes(form.badgeColor) && (
                  <option value={form.badgeColor}>{form.badgeColor}</option>
                )}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Note (0-5)</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Nombre d'avis</label>
              <input
                type="number"
                min={0}
                value={form.reviewCount}
                onChange={(e) => setForm((prev) => ({ ...prev, reviewCount: Number(e.target.value) }))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground md:col-span-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
              />
              Produit publié
            </label>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">Description courte</label>
              <textarea
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-xl font-bold text-foreground">Listes</h2>
            <p className="text-xs text-muted-foreground">Une ligne = un item.</p>

            <label className="text-sm font-medium text-foreground">Paragraphes description</label>
            <textarea rows={5} value={descriptionText} onChange={(e) => setDescriptionText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />

            <label className="text-sm font-medium text-foreground">Bénéfices</label>
            <textarea rows={5} value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />

            <label className="text-sm font-medium text-foreground">Saveurs</label>
            <textarea rows={4} value={flavorsText} onChange={(e) => setFlavorsText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />

            <label className="text-sm font-medium text-foreground">Formats</label>
            <textarea rows={4} value={formatsText} onChange={(e) => setFormatsText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />

            <label className="text-sm font-medium text-foreground">Images galerie (URLs)</label>
            <textarea rows={4} value={imagesText} onChange={(e) => setImagesText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
            <div>
              <label className="inline-flex cursor-pointer rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">
                {uploadingGallery ? "Upload..." : "Uploader images galerie"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onUploadGalleryImages}
                  disabled={uploadingGallery}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-4 rounded-xl border border-border bg-card p-5">
            <h2 className="font-heading text-xl font-bold text-foreground">Données structurées</h2>
            <label className="text-sm font-medium text-foreground">Nutrition (format: Nutriment | pour100ml | parPortion)</label>
            <textarea rows={6} value={nutritionText} onChange={(e) => setNutritionText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />

            <label className="text-sm font-medium text-foreground">Conseils (format: icon | texte)</label>
            <textarea rows={5} value={usageText} onChange={(e) => setUsageText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />

            <label className="text-sm font-medium text-foreground">Avis (format: nom | note(1-5) | date(YYYY-MM-DD) | texte)</label>
            <textarea rows={6} value={reviewsText} onChange={(e) => setReviewsText(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
          </div>

          {saveError && <p className="text-sm text-destructive">{saveError}</p>}
          {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}

          <div className="flex justify-end gap-3 pb-8">
            <Link
              to="/admin/products"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEditor;
