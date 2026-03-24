import { useState, useEffect } from "react";
import { Menu, X, Search, Phone, ShieldCheck } from "lucide-react";
import NutriwellLogo from "./NutriwellLogo";

const navLinks = [
  { label: "Nos Produits", href: "#products" },
  { label: "Conseils Nutritionnels", href: "#info" },
  { label: "Pour les Professionnels", href: "#benefits" },
  { label: "À Propos", href: "#about" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background ${
        scrolled ? "shadow-md py-3 border-b border-accent/40" : "py-4 border-b border-accent/20"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#" className="flex items-center">
          <NutriwellLogo variant="dark" />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-foreground/70 hover:text-primary font-medium transition-colors duration-200 text-[15px]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <a href="#" className="text-foreground/50 hover:text-primary transition-colors" aria-label="Rechercher">
            <Search size={20} />
          </a>
          <a href="#" className="text-foreground/50 hover:text-primary transition-colors" aria-label="Contact">
            <Phone size={20} />
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            <ShieldCheck size={16} />
            Accès Pro
          </a>
        </div>

        <button
          className="lg:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-accent/20 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-foreground/70 hover:text-primary font-medium text-lg"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <a href="#" className="text-foreground/50 hover:text-primary"><Search size={20} /></a>
            <a href="#" className="text-foreground/50 hover:text-primary"><Phone size={20} /></a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
