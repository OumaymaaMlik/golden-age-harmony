import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";
import productLineup from "@/assets/product-lineup.jpg";

const ProductHighlight = () => {
  return (
    <section id="products" className="relative bg-muted py-24 overflow-hidden">
      {/* Decorative circles */}
      <div className="decorative-dot w-40 h-40 bg-accent top-10 right-[10%]" />
      <div className="decorative-dot w-24 h-24 bg-accent bottom-20 left-[5%]" />
      <div className="decorative-dot w-16 h-16 bg-primary top-1/2 left-[15%]" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="relative">
              <img
                src={productLineup}
                alt="Gamme de produits Nutriwell : compléments nutritionnels et boissons enrichies"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
                width={960}
                height={640}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="lg:pl-8">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Une gamme pensée pour chaque besoin
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Des compléments nutritionnels aux boissons enrichies, chaque produit
                Nutriwell est formulé pour répondre aux besoins des adultes 55+.
                Facile à utiliser, agréable au goût, et validé scientifiquement.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors text-[15px]"
              >
                Trouver mon produit
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(40 30% 97%)" />
      </div>
    </section>
  );
};

export default ProductHighlight;
