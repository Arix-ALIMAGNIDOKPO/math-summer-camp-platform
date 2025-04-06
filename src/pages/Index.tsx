
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
  // Function to handle responsiveness for the main content
  useEffect(() => {
    // Add any specific responsiveness adjustments if needed
    const checkSize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    window.addEventListener('resize', checkSize);
    checkSize(); // Initial check
    
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
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
