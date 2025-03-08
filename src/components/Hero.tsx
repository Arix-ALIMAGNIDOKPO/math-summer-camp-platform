
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="gradient-blur left-1/4 top-1/4" />
      <div className="gradient-blur right-1/4 bottom-1/4" />
      
      <div className="section-container px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <AnimatedSection delay={100}>
            <Chip variant="primary" className="mb-6">15 - 27 Juillet 2025</Chip>
            <h1 className="heading-xl">
              Maths Summer Camp
              <span className="block text-primary mt-2">Édition II</span>
            </h1>
          </AnimatedSection>
          
          <AnimatedSection delay={300} className="max-w-2xl mx-auto">
            <p className="subheading">
              Un camp d'été intensif en mathématiques pour les élèves du secondaire 
              qui combine ateliers, compétitions et sessions de mentorat avec des experts reconnus.
              <span className="block mt-2 font-medium text-primary">Aucun frais d'inscription - Accès entièrement gratuit</span>
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={500} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
              S'inscrire maintenant
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              En savoir plus
            </Button>
          </AnimatedSection>
          
          <AnimatedSection delay={700} className="pt-16">
            <div className="relative">
              <div className="aspect-video w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="icon" variant="outline" className="w-20 h-20 rounded-full bg-white/90 hover:bg-white hover:scale-105 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </Button>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80" 
                  alt="Maths Summer Camp" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium text-foreground/60">Scroll</span>
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
