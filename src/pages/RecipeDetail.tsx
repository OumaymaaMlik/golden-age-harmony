import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, Printer, ChefHat, Flame, Award, Leaf, Heart, Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

import heroImg from "@/assets/recipe-detail-hero.jpg";
import productThumb from "@/assets/nutriwell-product-thumb.jpg";
import smoothieImg from "@/assets/recipe-smoothie.jpg";
import soupImg from "@/assets/recipe-soup.jpg";
import saladImg from "@/assets/recipe-salad.jpg";

/* ── Recipe data store ── */
const recipesData: Record<string, {
  title: string;
  category: string;
  prepTime: string;
  totalTime: string;
  servings: number;
  heroImage: string;
  nutrition: { calories: number; protein: string; carbs: string; fat: string; perServing: string };
  product: { name: string; slug: string };
  ingredients: string[];
  steps: string[];
  tip: { title: string; text: string };
}> = {
  "smoothie-proteine-fruits-rouges": {
    title: "Smoothie Protéiné aux Fruits Rouges",
    category: "Boissons",
    prepTime: "5 min",
    totalTime: "5 min",
    servings: 1,
    heroImage: heroImg,
    nutrition: { calories: 245, protein: "18g", carbs: "32g", fat: "4g", perServing: "1 verre (350 ml)" },
    product: { name: "Nutriwell Boisson Fruitée", slug: "nutriwell-boisson-fruitee" },
    ingredients: [
      "1 sachet Nutriwell Boisson Fruitée (saveur fruits rouges)",
      "150 ml de lait demi-écrémé froid",
      "100 g de framboises fraîches ou surgelées",
      "50 g de myrtilles",
      "1 banane mûre",
      "1 cuillère à soupe de flocons d'avoine",
      "1 cuillère à café de miel (facultatif)",
      "Quelques glaçons",
    ],
    steps: [
      "Préparez la base Nutriwell : diluez le sachet de Boisson Fruitée dans le lait froid et mélangez bien.",
      "Ajoutez les fruits : placez les framboises, les myrtilles et la banane dans un blender.",
      "Versez la préparation Nutriwell sur les fruits, ajoutez les flocons d'avoine et le miel si désiré.",
      "Mixez à vitesse élevée pendant 30 secondes jusqu'à obtenir une texture lisse et onctueuse.",
      "Servez immédiatement dans un grand verre avec quelques glaçons et décorez de fruits frais.",
    ],
    tip: {
      title: "Astuce gourmande",
      text: "Pour une version encore plus onctueuse, remplacez le lait par du yaourt grec nature. Vous pouvez également ajouter une cuillère de beurre de cacahuète pour un apport supplémentaire en protéines et en bonnes graisses.",
    },
  },
  "veloute-legumes-enrichi": {
    title: "Velouté de Légumes Enrichi",
    category: "Déjeuner",
    prepTime: "10 min",
    totalTime: "25 min",
    servings: 2,
    heroImage: heroImg,
    nutrition: { calories: 190, protein: "14g", carbs: "22g", fat: "5g", perServing: "1 bol (300 ml)" },
    product: { name: "Nutriwell Boisson Concentrée", slug: "nutriwell-boisson-concentree" },
    ingredients: [
      "1 sachet Nutriwell Boisson Concentrée",
      "2 carottes pelées et coupées",
      "1 courgette en rondelles",
      "1 pomme de terre moyenne",
      "1 oignon émincé",
      "500 ml de bouillon de légumes",
      "1 cuillère à soupe d'huile d'olive",
      "Sel, poivre, muscade",
    ],
    steps: [
      "Faites revenir l'oignon dans l'huile d'olive pendant 3 minutes.",
      "Ajoutez les légumes coupés et le bouillon, portez à ébullition.",
      "Laissez mijoter 15 minutes jusqu'à ce que les légumes soient tendres.",
      "Mixez finement, puis incorporez le sachet Nutriwell hors du feu.",
      "Rectifiez l'assaisonnement et servez chaud avec un filet d'huile d'olive.",
    ],
    tip: {
      title: "Conseil nutrition",
      text: "Ce velouté enrichi apporte une portion complète de protéines tout en restant léger. Idéal pour un déjeuner rapide ou un dîner réconfortant.",
    },
  },
};

/* ── Default fallback ── */
const defaultRecipe = recipesData["smoothie-proteine-fruits-rouges"];

const similarRecipes = [
  { slug: "veloute-legumes-enrichi", title: "Velouté de Légumes Enrichi", image: soupImg },
  { slug: "salade-fruits-vitaminee", title: "Salade de Fruits Vitaminée", image: saladImg },
  { slug: "smoothie-proteine-fruits-rouges", title: "Smoothie Protéiné aux Fruits Rouges", image: smoothieImg },
];

const benefits = [
  { icon: Award, text: "Recettes validées par nos nutritionnistes" },
  { icon: Clock, text: "Préparation rapide, moins de 30 min" },
  { icon: Users, text: "Adaptées aux besoins des seniors" },
];

const RecipeDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const recipe = (slug && recipesData[slug]) || defaultRecipe;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Breadcrumb — more breathing room ── */}
      <section className="pt-24 pb-4">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-all duration-200">Accueil</Link>
            <span className="text-muted-foreground/40">›</span>
            <Link to="/recipes" className="hover:text-primary transition-all duration-200">Nos Recettes</Link>
            <span className="text-muted-foreground/40">›</span>
            <span className="text-foreground font-medium truncate max-w-[240px]">{recipe.title}</span>
          </nav>
        </div>
      </section>

      {/* ── Main Recipe Section (two-col) — improved spacing & hero ── */}
      <section className="py-10 lg:py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left – Hero Image — premium shadow & rounded corners */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={recipe.heroImage}
                alt={recipe.title}
                className="w-full h-full min-h-[420px] max-h-[740px] object-cover rounded-3xl shadow-xl"
                width={800}
                height={1024}
              />
            </motion.div>

            {/* Right – Content — refined typography & spacing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col"
            >
              {/* Category indicator */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-10 h-1 rounded-full bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-widest text-secondary">{recipe.category}</span>
              </div>

              {/* Title + print — larger title */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {recipe.title}
                </h1>
                <button
                  onClick={() => window.print()}
                  className="flex-shrink-0 p-2.5 rounded-xl border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  aria-label="Imprimer la recette"
                >
                  <Printer size={20} />
                </button>
              </div>

              {/* Quick info strip — pill background per item */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {[
                  { icon: Users, label: `${recipe.servings} pers.` },
                  { icon: Clock, label: `Prépa : ${recipe.prepTime}` },
                  { icon: ChefHat, label: `Total : ${recipe.totalTime}` },
                ].map((info) => (
                  <span
                    key={info.label}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium text-foreground/70"
                  >
                    <info.icon size={16} className="text-primary" />
                    {info.label}
                  </span>
                ))}
              </div>

              {/* Nutrition block — warm background, bolder values */}
              <div className="bg-secondary/10 border border-secondary/25 rounded-2xl p-5 mb-8">
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-4">Valeurs nutritionnelles</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Calories", value: `${recipe.nutrition.calories}`, unit: "kcal", icon: Flame },
                    { label: "Protéines", value: recipe.nutrition.protein, unit: "" },
                    { label: "Glucides", value: recipe.nutrition.carbs, unit: "" },
                    { label: "Lipides", value: recipe.nutrition.fat, unit: "" },
                  ].map((n) => (
                    <div key={n.label} className="text-center py-2">
                      <p className="text-2xl font-bold text-foreground leading-none">{n.value}</p>
                      {n.unit && <p className="text-xs text-muted-foreground mt-0.5">{n.unit}</p>}
                      <p className="text-xs font-medium text-secondary mt-1">{n.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3 pt-3 border-t border-secondary/15">
                  Par portion : {recipe.nutrition.perServing}
                </p>
              </div>

              {/* Associated product — improved hover */}
              <Link
                to={`/products/${recipe.product.slug}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-muted hover:bg-muted/70 hover:shadow-sm transition-all duration-200 mb-8 group"
              >
                <img src={productThumb} alt={recipe.product.name} className="w-14 h-14 rounded-xl object-cover" width={56} height={56} loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Préparée avec</p>
                  <p className="text-sm font-bold text-foreground group-hover:text-primary transition-all duration-200 truncate">{recipe.product.name}</p>
                </div>
                <span className="text-primary text-sm font-bold group-hover:translate-x-0.5 transition-transform duration-200">Voir →</span>
              </Link>

              {/* Ingredients — more spacing */}
              <div className="mb-8">
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
                  <Leaf size={20} className="text-secondary" /> Ingrédients
                </h2>
                <ul className="space-y-2.5">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
                      <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation steps — better step badges */}
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2.5">
                  <ChefHat size={20} className="text-secondary" /> Préparation
                </h2>
                <ol className="space-y-5">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground/80 leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tip Block — editorial callout with left accent border ── */}
      <ScrollReveal>
        <section className="bg-secondary/8 py-14">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto flex items-start gap-5 bg-card rounded-2xl p-6 border-l-4 border-secondary shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/15 flex items-center justify-center">
                <Lightbulb size={22} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{recipe.tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{recipe.tip.text}</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Similar Recipes — equal-height cards with hover zoom ── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">Découvrez aussi</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {similarRecipes
              .filter((r) => r.slug !== slug)
              .slice(0, 3)
              .map((r, i) => (
                <ScrollReveal key={r.slug} delay={i * 0.1}>
                  <Link
                    to={`/recipes/${r.slug}`}
                    className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-all duration-200 flex-1">
                        {r.title}
                      </h3>
                      <span className="text-secondary text-xs font-bold mt-3 inline-block group-hover:translate-x-1 transition-transform duration-200">
                        Voir la recette →
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
          </div>
          <div className="text-center">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-bold text-sm hover:bg-secondary/90 hover:shadow-md transition-all duration-200"
            >
              Voir toutes les recettes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits Strip — more padding & polish ── */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {benefits.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <b.icon className="text-primary" size={24} />
                  </div>
                  <p className="text-sm font-bold text-foreground">{b.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecipeDetail;
