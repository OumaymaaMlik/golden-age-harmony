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

      {/* ── Breadcrumb ── */}
      <section className="pt-20 pb-2">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span>›</span>
            <Link to="/recipes" className="hover:text-primary transition-colors">Nos Recettes</Link>
            <span>›</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{recipe.title}</span>
          </nav>
        </div>
      </section>

      {/* ── Main Recipe Section (two-col) ── */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left – Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <img
                src={recipe.heroImage}
                alt={recipe.title}
                className="w-full h-full min-h-[400px] max-h-[700px] object-cover rounded-2xl shadow-lg"
                width={800}
                height={1024}
              />
            </motion.div>

            {/* Right – Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col"
            >
              {/* Category indicator */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-1 rounded-full bg-secondary" />
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">{recipe.category}</span>
              </div>

              {/* Title + print */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {recipe.title}
                </h1>
                <button
                  onClick={() => window.print()}
                  className="flex-shrink-0 p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label="Imprimer la recette"
                >
                  <Printer size={18} />
                </button>
              </div>

              {/* Quick info strip */}
              <div className="flex flex-wrap items-center gap-5 mb-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Users size={16} className="text-primary" /> {recipe.servings} pers.</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-primary" /> Prépa : {recipe.prepTime}</span>
                <span className="flex items-center gap-1.5"><ChefHat size={16} className="text-primary" /> Total : {recipe.totalTime}</span>
              </div>

              {/* Nutrition block */}
              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent-foreground/60 mb-3">Valeurs nutritionnelles</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Calories", value: `${recipe.nutrition.calories} kcal`, icon: Flame },
                    { label: "Protéines", value: recipe.nutrition.protein },
                    { label: "Glucides", value: recipe.nutrition.carbs },
                    { label: "Lipides", value: recipe.nutrition.fat },
                  ].map((n) => (
                    <div key={n.label} className="text-center">
                      <p className="text-lg font-bold text-foreground">{n.value}</p>
                      <p className="text-xs text-muted-foreground">{n.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">Par portion : {recipe.nutrition.perServing}</p>
              </div>

              {/* Associated product */}
              <Link
                to={`/products/${recipe.product.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors mb-6 group"
              >
                <img src={productThumb} alt={recipe.product.name} className="w-12 h-12 rounded-lg object-cover" width={48} height={48} loading="lazy" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Préparée avec</p>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{recipe.product.name}</p>
                </div>
                <span className="text-primary text-sm font-semibold">Voir →</span>
              </Link>

              {/* Ingredients */}
              <div className="mb-6">
                <h2 className="font-heading text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Leaf size={18} className="text-secondary" /> Ingrédients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation steps */}
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <ChefHat size={18} className="text-secondary" /> Préparation
                </h2>
                <ol className="space-y-4">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-sm text-foreground/80 leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Tip Block ── */}
      <ScrollReveal>
        <section className="bg-accent/10 py-10">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center">
                <Lightbulb size={20} className="text-secondary" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground mb-1">{recipe.tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{recipe.tip.text}</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Similar Recipes ── */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">Découvrez aussi</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
            {similarRecipes
              .filter((r) => r.slug !== slug)
              .slice(0, 3)
              .map((r, i) => (
                <ScrollReveal key={r.slug} delay={i * 0.1}>
                  <Link to={`/recipes/${r.slug}`} className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" width={400} height={300} />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
                      <span className="text-secondary text-xs font-semibold mt-2 inline-block">Voir la recette →</span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
          </div>
          <div className="text-center">
            <Link to="/recipes" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/90 transition-colors">
              Voir toutes les recettes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits Strip ── */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {benefits.map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <b.icon className="text-primary" size={22} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{b.text}</p>
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
