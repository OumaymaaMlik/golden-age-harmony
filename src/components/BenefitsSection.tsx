import { Hospital, Leaf, FlaskConical } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";

const benefits = [
  {
    icon: Hospital,
    title: "Formules validées médicalement",
    description: "Chaque produit est développé en collaboration avec des professionnels de santé et validé cliniquement.",
  },
  {
    icon: Leaf,
    title: "Ingrédients naturels de qualité",
    description: "Nous sélectionnons des ingrédients naturels et de haute qualité pour une nutrition optimale.",
  },
  {
    icon: FlaskConical,
    title: "Fabriqué selon les normes pharmaceutiques",
    description: "Nos produits respectent les standards les plus stricts de fabrication pharmaceutique.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="relative py-24 bg-background overflow-hidden">
      {/* Decorative colored dots */}
      <div className="decorative-dot w-32 h-32 bg-secondary -top-8 left-[20%]" />
      <div className="decorative-dot w-20 h-20 bg-primary top-1/3 right-[5%]" />
      <div className="decorative-dot w-16 h-16 bg-accent bottom-10 left-[8%]" />
      <div className="decorative-dot w-10 h-10 bg-secondary bottom-20 right-[20%]" />

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} delay={i * 0.15}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <b.icon className="text-primary" size={32} />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                  {b.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {b.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(160 40% 5%)" />
      </div>
    </section>
  );
};

export default BenefitsSection;
