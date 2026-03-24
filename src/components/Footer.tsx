import ScrollReveal from "./ScrollReveal";

const footerLinks = ["Products", "Recipes", "Health Tips", "About Us", "Contact", "FAQ"];

const Footer = () => {
  return (
    <footer className="relative bg-primary text-primary-foreground py-20 overflow-hidden">
      {/* Curved top */}
      <div className="absolute -top-16 left-0 right-0 h-16 bg-background" style={{ borderRadius: "0 0 50% 50%" }} />

      {/* Decorative shapes */}
      <div className="decorative-dot w-40 h-40 bg-secondary/10 -bottom-10 -right-10" />
      <div className="decorative-dot w-24 h-24 bg-accent/10 top-16 left-[10%]" />

      <div className="container mx-auto px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="font-heading text-secondary-foreground font-bold text-lg">N</span>
              </div>
              <span className="font-heading text-2xl font-bold">NourishLife</span>
            </div>
            <p className="text-primary-foreground/60 text-lg max-w-md mx-auto">
              Premium nutrition for vibrant living at every age.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-primary-foreground/60 hover:text-secondary transition-colors font-medium"
              >
                {link}
              </a>
            ))}
          </nav>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="border-t border-primary-foreground/10 pt-8 text-center">
            <p className="text-primary-foreground/40 text-sm">
              © {new Date().getFullYear()} NourishLife. All rights reserved.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};

export default Footer;
