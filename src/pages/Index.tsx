import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InfoCardsSection from "@/components/InfoCardsSection";
import ProductHighlight from "@/components/ProductHighlight";
import RecipeGrid from "@/components/RecipeGrid";
import BenefitsSection from "@/components/BenefitsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <InfoCardsSection />
      <ProductHighlight />
      <RecipeGrid />
      <BenefitsSection />
      <Footer />
    </div>
  );
};

export default Index;
