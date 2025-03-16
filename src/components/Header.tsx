
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MscLogo } from "./ui-custom/MscLogo";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.program'), href: '#program' },
    { label: t('nav.gallery'), href: '#gallery' },
    { label: t('nav.budget'), href: '#budget' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "py-3 glass-effect shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <MscLogo variant={isScrolled ? "compact" : "full"} />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full mr-2" 
            onClick={toggleLanguage}
            title={language === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 font-medium">{language.toUpperCase()}</span>
          </Button>
          
          <Button className="rounded-full" asChild>
            <Link to="/inscription">{t('nav.register')}</Link>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="block md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <div className={cn(
            "w-6 h-0.5 bg-foreground transition-all",
            mobileMenuOpen && "translate-y-1.5 rotate-45"
          )} />
          <div className={cn(
            "w-6 h-0.5 bg-foreground mt-1.5 transition-all",
            mobileMenuOpen && "opacity-0"
          )} />
          <div className={cn(
            "w-6 h-0.5 bg-foreground mt-1.5 transition-all",
            mobileMenuOpen && "-translate-y-1.5 -rotate-45"
          )} />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={cn(
          "absolute top-full left-0 w-full bg-background/90 backdrop-blur border-b border-border shadow-md md:hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="py-4 px-4 space-y-4">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-2 text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full justify-center items-center flex gap-2 rounded-lg"
            onClick={toggleLanguage}
          >
            <Globe className="h-4 w-4" />
            {language === 'fr' ? 'Switch to English' : 'Passer en français'}
          </Button>
          
          <Button className="w-full rounded-full mt-4" asChild>
            <Link to="/inscription" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.register')}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
