import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductCards } from "@/lib/product-service";

const ProductHighlight = () => {
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ["home-products"],
    queryFn: () =>
      fetchProductCards({
        activeTexture: "",
        activeGout: "",
        activeRegime: "",
      }),
  });

  const featured = products.slice(0, 3);

  return (
    <section id="products" className="relative bg-muted py-24 overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-dot w-40 h-40 bg-accent top-10 right-[10%]" />
      <div className="decorative-dot w-24 h-24 bg-accent bottom-20 left-[5%]" />
      <div className="decorative-dot w-16 h-16 bg-primary top-1/2 left-[15%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Une gamme pensée pour chaque besoin
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Découvrez nos produits publiés depuis votre dashboard admin.
            </p>
          </div>
        </ScrollReveal>

        {isLoading && <p className="text-center text-muted-foreground">Chargement des produits...</p>}
        {isError && <p className="text-center text-muted-foreground">Impossible de charger les produits.</p>}

        {!isLoading && !isError && (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {featured.map((product, i) => (
              <ScrollReveal key={product.slug} delay={i * 0.08}>
                <Link to={`/products/${product.slug}`} className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="aspect-[4/3] overflow-hidden bg-background">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{product.flavors}</p>
                    <h3 className="font-heading text-lg font-bold text-foreground">{product.name}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors text-[15px]"
          >
            Voir tous les produits
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(40 30% 97%)" />
      </div>
    </section>
  );
};

export default ProductHighlight;
