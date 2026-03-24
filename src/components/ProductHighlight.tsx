import ScrollReveal from "./ScrollReveal";
import productLineup from "@/assets/product-lineup.jpg";

const ProductHighlight = () => {
  return (
    <section id="products" className="relative bg-secondary py-24 overflow-hidden">
      {/* Curved top */}
      <div className="absolute -top-16 left-0 right-0 h-16 bg-background" style={{ borderRadius: "0 0 50% 50%" }} />

      {/* Decorative dots */}
      <div className="decorative-dot w-16 h-16 bg-accent top-16 left-[8%]" />
      <div className="decorative-dot w-10 h-10 bg-primary bottom-20 right-[6%]" />
      <div className="decorative-dot w-24 h-24 bg-primary/10 top-1/2 right-[15%]" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div className="relative">
              <img
                src={productLineup}
                alt="NourishLife product lineup including protein powder, vitamins, and health drinks"
                className="rounded-2xl shadow-2xl w-full"
                loading="lazy"
                width={960}
                height={640}
              />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="lg:pl-8">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-secondary-foreground mb-6">
                Products Designed for How You Live
              </h2>
              <p className="text-secondary-foreground/75 text-lg leading-relaxed mb-8">
                From protein-rich shakes to daily vitamins, every NourishLife product
                is formulated with the needs of adults 50+ in mind. Easy to use,
                delicious to taste, and backed by science.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors text-[15px]"
              >
                Find Your Product
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ProductHighlight;
