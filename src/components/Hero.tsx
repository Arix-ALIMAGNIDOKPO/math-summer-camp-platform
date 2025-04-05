
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="gradient-blur left-1/4 top-1/4" />
      <div className="gradient-blur right-1/4 bottom-1/4" />
      
      <div className="section-container px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <AnimatedSection delay={100}>
            <Chip variant="primary" className="mb-6">{t('dates')}</Chip>
            <h1 className="heading-xl">
              {t('hero.title')}
              <span className="block text-primary mt-2">{t('hero.subtitle')}</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={300} className="max-w-2xl mx-auto">
            <p className="subheading">
              {t('hero.description')}
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={500} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all" asChild>
              <Link to="/inscription">{t('register.now')}</Link>
            </Button>
          </AnimatedSection>
          
          <AnimatedSection delay={700} className="pt-16">
            <div className="relative">
              <div className="aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                <a 
                  href="https://youtu.be/1-IJrwTKVzE?si=SoLg5U558vH3Fh-7" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block relative w-full h-full group"
                >
                  <img 
                    src="https://img.youtube.com/vi/1-IJrwTKVzE/maxresdefault.jpg" 
                    alt="Summer Maths Camp Video" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-5 shadow-lg transform transition-transform group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-foreground/60">{t('scroll')}</span>
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
