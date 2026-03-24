import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import recipe1 from "@/assets/recipe-1.jpg";
import recipe2 from "@/assets/recipe-2.jpg";
import recipe3 from "@/assets/recipe-3.jpg";
import recipe4 from "@/assets/recipe-4.jpg";

const recipes = [
  { image: recipe1, title: "Berry Bliss Smoothie Bowl" },
  { image: recipe2, title: "Golden Turmeric Soup" },
  { image: recipe3, title: "Green Power Smoothie" },
  { image: recipe4, title: "Nutty Energy Bites" },
];

const RecipeGrid = () => {
  return (
    <section id="recipes" className="relative py-24 bg-brand-cream overflow-hidden">
      {/* Curved top */}
      <div className="absolute -top-16 left-0 right-0 h-16 bg-secondary" style={{ borderRadius: "0 0 50% 50%" }} />

      <div className="decorative-dot w-14 h-14 bg-secondary top-20 right-[7%]" />
      <div className="decorative-dot w-8 h-8 bg-accent bottom-16 left-[10%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recipe Inspiration
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Simple, delicious recipes made with NourishLife products. Fuel your
              body with meals you'll actually love.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recipes.map((recipe, i) => (
            <ScrollReveal key={recipe.title} delay={i * 0.1}>
              <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={640}
                    height={640}
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-bold text-foreground mb-2">
                    {recipe.title}
                  </h3>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm hover:gap-3 transition-all duration-200"
                  >
                    View Recipe <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-accent/90 transition-colors text-[15px]"
            >
              Browse All Recipes
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default RecipeGrid;
