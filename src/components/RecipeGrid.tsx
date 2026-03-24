import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";
import recipe1 from "@/assets/recipe-1.jpg";
import recipe2 from "@/assets/recipe-2.jpg";
import recipe3 from "@/assets/recipe-3.jpg";
import recipe4 from "@/assets/recipe-4.jpg";

const recipes = [
  { image: recipe1, title: "Smoothie bowl aux fruits rouges" },
  { image: recipe2, title: "Soupe dorée au curcuma" },
  { image: recipe3, title: "Smoothie vert énergisant" },
  { image: recipe4, title: "Bouchées énergie aux noix" },
];

const RecipeGrid = () => {
  return (
    <section id="recipes" className="relative py-24 bg-[hsl(40_30%_97%)] overflow-hidden">
      <div className="decorative-dot w-14 h-14 bg-secondary top-20 right-[7%]" />
      <div className="decorative-dot w-8 h-8 bg-primary bottom-16 left-[10%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Des idées pour enrichir votre alimentation
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Des recettes simples et savoureuses réalisées avec les produits Nutriwell.
              Nourrissez votre corps avec des repas que vous aimerez vraiment.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {recipes.map((recipe, i) => (
            <ScrollReveal key={recipe.title} delay={i * 0.1}>
              <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border">
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
                    className="inline-flex items-center gap-1.5 text-secondary font-semibold text-sm hover:gap-3 transition-all duration-200"
                  >
                    Voir la recette <ArrowRight size={14} />
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
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 transition-colors text-[15px]"
            >
              Explorer toutes les recettes
            </a>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(0 0% 100%)" />
      </div>
    </section>
  );
};

export default RecipeGrid;
