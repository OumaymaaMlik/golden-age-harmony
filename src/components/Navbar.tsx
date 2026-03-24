import { useState, useEffect } from "react";
import { Menu, X, Phone, HeadphonesIcon, ShieldCheck } from "lucide-react";

const navLinks = ["Products", "Recipes", "Health Tips", "About Us"];

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-heading text-secondary-foreground font-bold text-lg">N</span>
          </div>
          <span className="font-heading text-xl font-bold text-primary-foreground">
            NourishLife
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="text-primary-foreground/80 hover:text-secondary font-medium transition-colors duration-200 text-[15px]"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Utility Icons */}
        <div className="hidden md:flex items-center gap-5">
          <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors" aria-label="Support">
            <HeadphonesIcon size={20} />
          </a>
          <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors" aria-label="Contact">
            <Phone size={20} />
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-semibold text-secondary bg-secondary/15 px-3 py-1.5 rounded-full hover:bg-secondary/25 transition-colors"
          >
            <ShieldCheck size={16} />
            Pro Access
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary/98 backdrop-blur-md border-t border-primary-foreground/10 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
              className="block text-primary-foreground/80 hover:text-secondary font-medium text-lg"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="flex items-center gap-4 pt-4 border-t border-primary-foreground/10">
            <a href="#" className="text-primary-foreground/70 hover:text-secondary"><HeadphonesIcon size={20} /></a>
            <a href="#" className="text-primary-foreground/70 hover:text-secondary"><Phone size={20} /></a>
            <a href="#" className="flex items-center gap-1.5 text-sm font-semibold text-secondary">
              <ShieldCheck size={16} /> Pro Access
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
