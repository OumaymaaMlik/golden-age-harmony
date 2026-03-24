import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const benefits = [
  {
    icon: Heart,
    title: "Heart-Healthy Formulas",
    description: "Every product supports cardiovascular wellness with essential nutrients your body craves.",
  },
  {
    icon: ShieldCheck,
    title: "Clinically Tested",
    description: "Backed by research and trusted by thousands of health-conscious adults across the country.",
  },
  {
    icon: Sparkles,
    title: "Feel the Difference",
    description: "More energy, better digestion, and a renewed zest for life — results you can actually feel.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Curved top */}
      <div className="absolute -top-16 left-0 right-0 h-16 bg-brand-cream" style={{ borderRadius: "0 0 50% 50%" }} />

      {/* Decorative colored circles */}
      <div className="decorative-dot w-32 h-32 bg-secondary -top-8 left-[20%]" />
      <div className="decorative-dot w-20 h-20 bg-accent top-1/3 right-[5%]" />
      <div className="decorative-dot w-16 h-16 bg-secondary bottom-10 left-[8%]" />
      <div className="decorative-dot w-10 h-10 bg-accent bottom-20 right-[20%]" />

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} delay={i * 0.15}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-6">
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
    </section>
  );
};

export default BenefitsSection;
