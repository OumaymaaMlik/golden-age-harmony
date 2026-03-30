import { useState, useEffect } from "react";
import { Menu, X, MapPin, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import NutriwellLogo from "./NutriwellLogo";

const navLinks = [
  { label: "Nos Produits", href: "/products" },
  { label: "Qui Sommes-Nous", href: "/about" },
  { label: "Nos Recettes et Astuces", href: "/recipes" },

];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return location.pathname === "/";
    return location.pathname === href;
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        window.location.href = href;
      } else {
        const id = href.replace("/#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background ${
        scrolled ? "shadow-md py-3 border-b border-accent/40" : "py-4 border-b border-accent/20"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/" className="flex items-center">
          <NutriwellLogo variant="dark" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className={`font-medium transition-colors duration-200 text-[15px] ${
                  isActive(link.href) ? "text-primary" : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`font-medium transition-colors duration-200 text-[15px] ${
                  isActive(link.href) ? "text-primary font-semibold" : "text-foreground/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-5">
          <Link to="/store-locator" className="text-foreground/50 hover:text-primary transition-colors flex flex-col items-center" aria-label="Trouver une pharmacie">
            <MapPin size={20} />
            <span className="text-xs mt-1">Location</span>
          </Link>
          <Link to="/contact" className="text-foreground/50 hover:text-primary transition-colors flex flex-col items-center" aria-label="Contact">
            <Phone size={20} />
            <span className="text-xs mt-1">Contact</span>
          </Link>
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
          {navLinks.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                className="block text-foreground/70 hover:text-primary font-medium text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="block text-foreground/70 hover:text-primary font-medium text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Link to="/store-locator" className="text-foreground/50 hover:text-primary" onClick={() => setMobileOpen(false)}><MapPin size={20} /></Link>
            <Link to="/contact" className="text-foreground/50 hover:text-primary" onClick={() => setMobileOpen(false)}><Phone size={20} /></Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
