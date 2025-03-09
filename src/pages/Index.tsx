
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProgramSection from "@/components/ProgramSection";
import GallerySection from "@/components/GallerySection";
import BudgetSection from "@/components/BudgetSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Load KkiaPay script
    const script = document.createElement('script');
    script.src = 'https://cdn.kkiapay.me/k.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Clean up on component unmount
      document.body.removeChild(script);
    };
  }, []);
  
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
      <Toaster />
    </div>
  );
};

export default Index;
