import ScrollReveal from "./ScrollReveal";
import NutriwellLogo from "./NutriwellLogo";

const footerLinks = ["Nos Produits", "Conseils Nutritionnels", "Pour les Professionnels", "À Propos", "Contact", "FAQ"];

const Footer = () => {
  return (
    <footer className="relative bg-brand-dark text-primary-foreground py-20 overflow-hidden">
      {/* Decorative shapes */}
      <div className="decorative-dot w-40 h-40 bg-secondary/10 -bottom-10 -right-10" />
      <div className="decorative-dot w-24 h-24 bg-primary/10 top-16 left-[10%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <NutriwellLogo variant="white" />
            </div>
            <p className="text-accent text-lg max-w-md mx-auto">
              La nutrition qui soigne
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-primary-foreground/60 hover:text-accent transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </nav>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="border-t border-primary-foreground/10 pt-8 text-center">
            <p className="text-primary-foreground/40 text-sm">
              © {new Date().getFullYear()} Nutriwell™. Tous droits réservés.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;
