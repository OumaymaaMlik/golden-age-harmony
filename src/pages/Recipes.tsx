import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, ChefHat, Sparkles, Heart, Award, Leaf } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import ScrollReveal from "@/components/ScrollReveal";

import heroImg from "@/assets/recipes-hero.jpg";
import smoothieImg from "@/assets/recipe-smoothie.jpg";
import soupImg from "@/assets/recipe-soup.jpg";
import saladImg from "@/assets/recipe-salad.jpg";
import oatsImg from "@/assets/recipe-oats.jpg";
import salmonImg from "@/assets/recipe-salmon.jpg";
import toastImg from "@/assets/recipe-toast.jpg";

const filters = ["Toutes", "Petit-déjeuner", "Déjeuner", "Snacks", "Boissons"];

interface RecipeCard {
  type: "recipe";
  slug: string;
  title: string;
  category: string;
  time: string;
  servings: number;
  image: string;
}

interface PromoCard {
  type: "promo";
  icon: typeof Sparkles;
  title: string;
  desc: string;
  color: "primary" | "secondary" | "accent";
}

type GridItem = RecipeCard | PromoCard;

const gridItems: GridItem[] = [
  { type: "recipe", slug: "smoothie-proteine-fruits-rouges", title: "Smoothie Protéiné aux Fruits Rouges", category: "Boissons", time: "5 min", servings: 1, image: smoothieImg },
  { type: "recipe", slug: "veloute-legumes-enrichi", title: "Velouté de Légumes Enrichi", category: "Déjeuner", time: "25 min", servings: 2, image: soupImg },
  { type: "promo", icon: Sparkles, title: "Boostez vos recettes", desc: "Ajoutez Nutriwell Boisson Fruitée à vos smoothies pour un apport protéiné complet.", color: "primary" },
  { type: "recipe", slug: "salade-fruits-vitaminee", title: "Salade de Fruits Vitaminée", category: "Snacks", time: "10 min", servings: 2, image: saladImg },
  { type: "promo", icon: Heart, title: "Astuce bien-être", desc: "Un petit-déjeuner riche en protéines aide à maintenir votre énergie toute la matinée.", color: "secondary" },
  { type: "recipe", slug: "overnight-oats-superfruits", title: "Overnight Oats aux Superfruits", category: "Petit-déjeuner", time: "10 min + repos", servings: 1, image: oatsImg },
  { type: "promo", icon: Leaf, title: "Le saviez-vous ?", desc: "Les fibres alimentaires favorisent une digestion saine et un confort intestinal durable.", color: "accent" },
  { type: "recipe", slug: "pave-saumon-grille-legumes", title: "Pavé de Saumon Grillé & Légumes", category: "Déjeuner", time: "30 min", servings: 2, image: salmonImg },
  { type: "recipe", slug: "toast-avocat-oeuf-poche", title: "Toast Avocat & Œuf Poché", category: "Petit-déjeuner", time: "15 min", servings: 1, image: toastImg },
];

const benefitsStrip = [
  { icon: Award, text: "Recettes validées par nos nutritionnistes" },
  { icon: Clock, text: "Préparation rapide, moins de 30 min" },
  { icon: Users, text: "Adaptées aux besoins des seniors" },
];

const colorMap = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
};

const Recipes = () => {
  const [active, setActive] = useState("Toutes");

  const filtered = gridItems.filter((item) => {
    if (active === "Toutes") return true;
    if (item.type === "promo") return true;
    return item.category === active;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Table de recettes saines" className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(147,100%,37%,0.5) 0%, hsla(196,100%,50%,0.5) 100%)" }} />
        </div>

        <div className="absolute top-24 left-6 md:left-12 z-10 text-sm text-primary-foreground/80">
          <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-primary-foreground font-semibold">Nos Recettes et Astuces</span>
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
          >
            Nos Recettes et Astuces
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-primary-foreground/90 max-w-xl mx-auto"
          >
            Des idées gourmandes et nutritives pour prendre soin de vous au quotidien.
          </motion.p>
        </div>


      </section>

      {/* ── Filter Bar ── */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  active === f
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recipe Grid ── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) =>
              item.type === "recipe" ? (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width={512}
                        height={512}
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        {item.category}
                      </span>
                      <h3 className="font-heading text-base font-bold text-foreground mt-1 mb-3">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {item.servings} pers.</span>
                      </div>
                      <Link to={`/recipes/${item.slug}`} className="text-secondary text-sm font-semibold hover:underline">
                        Voir la recette →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ) : (
                /* ── Promo Card ── */
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div className={`${colorMap[item.color]} rounded-2xl p-8 flex flex-col justify-center h-full min-h-[280px]`}>
                    <item.icon className="text-primary-foreground mb-4" size={32} />
                    <h3 className="font-heading text-xl font-bold text-primary-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-primary-foreground/90 text-sm leading-relaxed mb-5">
                      {item.desc}
                    </p>
                    <a href="#" className="text-primary-foreground text-sm font-semibold underline underline-offset-4">
                      En savoir plus →
                    </a>
                  </div>
                </ScrollReveal>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Benefits Strip ── */}
      <section className="bg-muted py-14">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {benefitsStrip.map((b, i) => (
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

export default Recipes;
