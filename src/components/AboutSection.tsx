
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Card } from "@/components/ui/card";

const AboutSection = () => {
  const objectives = [
    {
      title: "Renforcer les compétences",
      description: "Approfondir les connaissances mathématiques à travers un programme enrichi et des méthodes pédagogiques innovantes.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"></path>
          <line x1="16" y1="3" x2="16" y2="8"></line>
          <line x1="8" y1="3" x2="8" y2="8"></line>
          <line x1="3" y1="8" x2="21" y2="8"></line>
          <path d="m12 12 4 4-4 4"></path>
        </svg>
      )
    },
    {
      title: "Stimuler la curiosité",
      description: "Encourager l'exploration de concepts mathématiques et scientifiques avancés à travers des activités interactives.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    },
    {
      title: "Promouvoir l'égalité",
      description: "Offrir des bourses aux élèves issus de milieux défavorisés pour garantir l'accès à tous les talents.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M2 12h5"></path>
          <path d="M17 12h5"></path>
          <path d="M9 4v16"></path>
          <path d="M15 4v16"></path>
          <path d="M12 18a6 6 0 0 0 0-12"></path>
        </svg>
      )
    },
    {
      title: "Développer l'esprit critique",
      description: "Renforcer la capacité d'analyse et de résolution de problèmes complexes à travers des défis variés.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      )
    }
  ];

  return (
    <section id="about" className="section-padding bg-white relative">
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">À propos</Chip>
          <h2 className="heading-lg mb-6">Contexte et Justification</h2>
          <p className="subheading">
            Notre camp d'été intensive en mathématiques est conçu pour les élèves passionnés qui souhaitent 
            approfondir leurs connaissances dans un environnement académique stimulant.
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="slide-in-right" className="order-2 md:order-1">
            <div className="space-y-8">
              <div>
                <h3 className="heading-sm mb-4">Un programme d'excellence</h3>
                <p className="text-muted-foreground">
                  Le Maths Summer Camp offre un environnement d'apprentissage exceptionnel où les élèves peuvent 
                  explorer des concepts mathématiques avancés sous la direction de professionnels et d'experts 
                  reconnus dans le domaine.
                </p>
              </div>
              <div>
                <h3 className="heading-sm mb-4">Pour qui ?</h3>
                <p className="text-muted-foreground">
                  Le camp est destiné aux élèves du secondaire (14-18 ans) manifestant un intérêt particulier 
                  pour les mathématiques et les sciences, qu'ils soient déjà performants ou simplement curieux 
                  d'approfondir leurs connaissances.
                </p>
              </div>
              <div>
                <h3 className="heading-sm mb-4">Une vision inclusive</h3>
                <p className="text-muted-foreground">
                  Nous croyons fermement que le talent mathématique peut se trouver partout. C'est pourquoi 
                  nous avons mis en place un système de bourses pour soutenir l'accès à notre programme aux élèves 
                  issus de milieux défavorisés.
                </p>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="order-1 md:order-2">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-2/3 aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                  alt="Mathematics equations" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        <div className="mt-32">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">Objectifs du Camp</h2>
            <p className="subheading">
              Notre mission est de créer un environnement où les élèves peuvent explorer, apprendre et grandir à travers les mathématiques.
            </p>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {objectives.map((objective, index) => (
              <AnimatedSection key={index} delay={index * 100} animation="scale-in">
                <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-6">
                    {objective.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{objective.title}</h3>
                  <p className="text-muted-foreground text-sm">{objective.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
