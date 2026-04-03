import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import WaveDivider from "./WaveDivider";
import infoCard1 from "@/assets/info-card-1.jpg";
import infoCard2 from "@/assets/info-card-2.jpg";
import infoCard3 from "@/assets/info-card-3.jpg";

const cards = [
  { image: infoCard1, title: "Bien vieillir au quotidien", link: "#" },
  { image: infoCard2, title: "Nutrition simplifiée", link: "#" },
  { image: infoCard3, title: "Le plaisir dans chaque repas", link: "#" },
];

const InfoCardsSection = () => {
  return (
    <section id="info" className="relative py-28 bg-background overflow-hidden">
      {/* Biophilic leaf accent */}
      <div className="absolute top-20 right-[4%] w-24 h-24 opacity-[0.04] animate-gentle-sway pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Votre parcours bien-être commence ici
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Découvrez des conseils validés par des experts pour vous sentir au meilleur de votre forme — de l'activité physique à l'alimentation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <div className="group organic-card overflow-hidden">
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={640}
                    height={512}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-bold mb-3 text-foreground">
                    {card.title}
                  </h3>
                  <a
                    href={card.link}
                    className="inline-flex items-center gap-1.5 text-secondary font-semibold text-sm hover:gap-3 transition-all duration-200"
                  >
                    En savoir plus <ArrowRight size={16} />
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
              className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-secondary/90 hover:shadow-md transition-all duration-200 text-[15px]"
            >
              Découvrir nos conseils
            </a>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider fillColor="hsl(var(--muted))" />
      </div>
    </section>
  );
};

export default InfoCardsSection;
