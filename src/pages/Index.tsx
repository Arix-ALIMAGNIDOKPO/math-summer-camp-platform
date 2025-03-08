
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProgramSection from "@/components/ProgramSection";
import GallerySection from "@/components/GallerySection";
import BudgetSection from "@/components/BudgetSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <ProgramSection />
      <GallerySection />
      <BudgetSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
