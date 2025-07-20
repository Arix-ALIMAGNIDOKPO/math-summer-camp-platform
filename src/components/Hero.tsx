
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Background elements */}
      <div className="gradient-blur left-1/4 top-1/4" />
      <div className="gradient-blur right-1/4 bottom-1/4" />
      
      <div className="section-container px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <AnimatedSection delay={100}>
            <Chip variant="primary" className="mb-4 md:mb-6">{t('dates')}</Chip>
            <h1 className={`${isMobile ? 'text-3xl' : 'heading-xl'}`}>
              {t('hero.title')}
              <span className="block text-primary mt-2">{t('hero.subtitle')}</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={300} className="max-w-2xl mx-auto">
            <p className="subheading text-base md:text-lg">
              {t('hero.description')}
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={500} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-6">
            <Button size={isMobile ? "default" : "lg"} className="rounded-full px-6 md:px-8 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" asChild>
              <Link to="/inscription">{t('register.now')}</Link>
            </Button>
          </AnimatedSection>
          
          <AnimatedSection delay={700} className="pt-8 md:pt-16">
            <div className="relative">
              <div className="aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-lg md:rounded-2xl shadow-xl md:shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                <iframe
                  src="https://www.youtube.com/embed/1-IJrwTKVzE?si=SoLg5U558vH3Fh-7&autoplay=0&mute=0&controls=1&rel=0&modestbranding=1" 
                  title="Summer Maths Camp Video"
                  className="w-full h-full border-0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs md:text-sm font-medium text-foreground/60">{t('scroll')}</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8" cy="8" r="3" fill="currentColor" className="animate-fade-in-up"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
