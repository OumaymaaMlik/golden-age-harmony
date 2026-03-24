import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-couple.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Happy older couple walking outdoors in golden sunlight"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-primary/30 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
        >
          Nourish Your Best Years
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-primary-foreground/85 font-body max-w-xl mx-auto mb-10"
        >
          Premium nutrition crafted for the moments that matter most. Feel stronger, 
          live fuller, every single day.
        </motion.p>
      </div>

      {/* Scroll Button */}
      <motion.a
        href="#info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-2 border-primary-foreground/50 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors animate-float"
        aria-label="Scroll down"
      >
        <ChevronDown className="text-primary-foreground" size={24} />
      </motion.a>

      {/* Decorative dots */}
      <div className="decorative-dot w-4 h-4 bg-secondary top-[20%] left-[8%]" />
      <div className="decorative-dot w-6 h-6 bg-accent top-[30%] right-[10%]" />
      <div className="decorative-dot w-3 h-3 bg-secondary bottom-[25%] left-[15%]" />
    </section>
  );
};

export default HeroSection;
