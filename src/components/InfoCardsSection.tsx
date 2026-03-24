import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import infoCard1 from "@/assets/info-card-1.jpg";
import infoCard2 from "@/assets/info-card-2.jpg";
import infoCard3 from "@/assets/info-card-3.jpg";

const cards = [
  { image: infoCard1, title: "Active Living at Every Age", link: "#" },
  { image: infoCard2, title: "Nutrition Made Simple", link: "#" },
  { image: infoCard3, title: "Joy in Every Meal", link: "#" },
];

const InfoCardsSection = () => {
  return (
    <section id="info" className="relative py-24 bg-background overflow-hidden">
      {/* Decorative dots */}
      <div className="decorative-dot w-20 h-20 bg-secondary -top-4 right-[5%]" />
      <div className="decorative-dot w-12 h-12 bg-accent bottom-10 left-[3%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Wellness Journey Starts Here
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Discover expert-backed insights to help you feel your best — from staying
              active to eating well, we're here for every step.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {cards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 0.15}>
              <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
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
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                    {card.title}
                  </h3>
                  <a
                    href={card.link}
                    className="inline-flex items-center gap-1.5 text-accent font-semibold text-sm hover:gap-3 transition-all duration-200"
                  >
                    Learn More <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition-colors text-[15px]"
            >
              Explore All Resources
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default InfoCardsSection;
