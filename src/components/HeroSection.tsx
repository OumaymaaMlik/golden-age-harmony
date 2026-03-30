import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import WaveDivider from "./WaveDivider";

const heroImage = "https://ttadnsndjrchvmogxsdz.supabase.co/storage/v1/object/public/bannerheader/attempt1.webp";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Couple joyeux marchant en plein air au soleil"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(0,191,99,0.45) 0%, rgba(0,198,254,0.45) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
        >
          L'harmonie entre nutrition médicale et vitalité naturelle
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-primary-foreground/90 font-body max-w-xl mx-auto mb-10"
        >
          Nutriwell, c'est l'alliance de la science médicale et de la nature fonctionnelle,
          traduite dans une identité visuelle douce, fiable et épurée.
        </motion.p>
      </div>

      <motion.a
        href="#info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors animate-float shadow-lg"
        aria-label="Défiler vers le bas"
      >
        <ChevronDown className="text-primary-foreground" size={24} />
      </motion.a>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider fillColor="hsl(0 0% 100%)" />
      </div>
    </section>
  );
};

export default HeroSection;
