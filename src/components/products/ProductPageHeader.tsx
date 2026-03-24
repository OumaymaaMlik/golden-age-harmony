import ScrollReveal from "@/components/ScrollReveal";

const ProductPageHeader = () => (
  <section className="bg-background py-16">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="flex gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="w-3 h-3 rounded-full bg-secondary" />
          <span className="w-3 h-3 rounded-full bg-accent" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 max-w-2xl">
          Nutriwell, la gamme qui prend soin de vous
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          Découvrez notre gamme complète de produits de nutrition médicale, conçue avec soin pour répondre à chaque besoin nutritionnel spécifique.
        </p>
      </ScrollReveal>
    </div>
  </section>
);

export default ProductPageHeader;
