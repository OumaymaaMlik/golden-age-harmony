import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Shield, Leaf, FlaskConical, Award, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import aboutHero from "@/assets/about-hero.jpg";
import aboutFactory from "@/assets/about-factory.jpg";
import aboutProducts from "@/assets/about-products.jpg";

const benefits = [
  {
    icon: Shield,
    title: "Qualité Certifiée",
    desc: "Chaque produit est testé et validé selon les normes pharmaceutiques les plus strictes.",
  },
  {
    icon: Leaf,
    title: "Ingrédients Naturels",
    desc: "Nous sélectionnons des ingrédients d'origine naturelle, sans compromis sur l'efficacité.",
  },
  {
    icon: FlaskConical,
    title: "Innovation Continue",
    desc: "Notre laboratoire R&D développe des formules à la pointe de la science nutritionnelle.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Biophilic leaf accent */}
      <div className="fixed top-40 right-4 w-20 h-20 opacity-[0.03] animate-gentle-sway pointer-events-none z-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5C50 5 15 30 15 60C15 80 30 95 50 95C70 95 85 80 85 60C85 30 50 5 50 5Z" stroke="hsl(147 100% 37%)" strokeWidth="1.5"/>
          <path d="M50 20V85" stroke="hsl(147 100% 37%)" strokeWidth="1"/>
        </svg>
      </div>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={aboutHero}
            alt="L'équipe Nutriwell réunie"
            className="w-full h-full object-cover"
            width={1920}
            height={800}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsla(147,100%,37%,0.5) 0%, hsla(196,100%,50%,0.5) 100%)",
            }}
          />
        </div>

        {/* Breadcrumb */}
        <div className="absolute top-24 left-6 md:left-12 z-10 text-sm text-primary-foreground/80">
          <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <span className="text-primary-foreground font-semibold">Qui Sommes-Nous</span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground text-center px-6"
        >
          Qui Sommes-Nous
        </motion.h1>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <p className="text-center text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Depuis plus de 20 ans, <strong className="text-foreground">Nutriwell™</strong> s'engage
              à offrir des solutions de nutrition médicale qui allient rigueur scientifique et
              douceur naturelle. Notre mission : accompagner chaque patient vers une meilleure
              qualité de vie grâce à des produits savoureux, équilibrés et cliniquement validés.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Brand Positioning ── */}
      <section className="bg-muted py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  La nutrition qui <span className="text-primary">soigne</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nutriwell est née d'une conviction : la nutrition médicale ne doit pas sacrifier
                  le plaisir au profit de l'efficacité. Chacune de nos formules est conçue pour
                  répondre à des besoins cliniques précis tout en offrant une expérience gustative
                  réconfortante.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notre gamme couvre l'ensemble des besoins nutritionnels — des boissons enrichies
                  aux compléments protéinés, en passant par des textures adaptées à chaque profil
                  de patient.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Reconnue par les professionnels de santé en France et à l'international,
                  Nutriwell est aujourd'hui une référence dans le domaine de la nutrition clinique
                  pour les adultes de plus de 55 ans.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={aboutProducts}
                  alt="Gamme de produits Nutriwell"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
      </section>

      {/* ── Origin / Manufacturing ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
                <img
                  src={aboutFactory}
                  alt="Site de fabrication Nutriwell en France"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  width={800}
                  height={600}
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="order-1 md:order-2">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Fabriqué en <span className="text-secondary">France</span>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nos produits sont entièrement conçus et fabriqués dans notre usine en France,
                  certifiée selon les Bonnes Pratiques de Fabrication (BPF). Chaque étape — de la
                  sélection des matières premières au conditionnement — répond aux plus hauts
                  standards de qualité pharmaceutique.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Cette maîtrise complète de la chaîne de production nous permet de garantir
                  traçabilité, sécurité et excellence à chaque lot. Notre ancrage territorial
                  reflète notre engagement envers une production responsable et durable.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Innovation ── */}
      <section className="bg-muted py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Depuis 2003
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              L'innovation au cœur de notre ADN
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Notre équipe R&D, composée de nutritionnistes, pharmaciens et ingénieurs
              agroalimentaires, travaille en étroite collaboration avec les hôpitaux et centres
              de recherche. Cette synergie nous permet de développer des solutions nutritionnelles
              innovantes, validées cliniquement et adaptées aux besoins réels des patients.
              Avec plus de 80 références et 40 saveurs, Nutriwell repousse les limites de la
              nutrition médicale.
            </p>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
      </section>

      {/* ── Quality Commitment ── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Notre engagement <span className="text-accent">qualité</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              La qualité n'est pas un objectif chez Nutriwell, c'est un prérequis. De la
              sélection rigoureuse de chaque ingrédient à la validation finale en laboratoire,
              nous appliquons un contrôle qualité à chaque étape de notre processus.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nos certifications ISO et BPF témoignent de cet engagement. Chaque lot est tracé,
              chaque formule est testée, et chaque patient mérite la garantie d'un produit sûr,
              efficace et agréable à consommer.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Key Benefits ── */}
      <section className="bg-muted py-20 md:py-28 relative">
        <div className="absolute top-0 left-0 right-0 rotate-180">
          <WaveDivider fillColor="hsl(0 0% 100%)" />
        </div>
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
              Pourquoi choisir <span className="text-primary">Nutriwell</span> ?
            </h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <ScrollReveal key={b.title} delay={i * 0.1}>
                <div className="bg-card rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <b.icon className="text-primary" size={26} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                    {b.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fillColor="hsl(var(--brand-dark))" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
