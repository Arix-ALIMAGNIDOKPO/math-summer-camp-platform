
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ProgramSection = () => {
  const activities = [
    {
      title: "Ateliers pratiques",
      time: "9h - 12h",
      description: "Sessions interactives pour approfondir des concepts mathématiques avancés à travers des exercices pratiques.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      )
    },
    {
      title: "Conférences d'experts",
      time: "14h - 16h",
      description: "Présentations par des professionnels reconnus dans le domaine des mathématiques et des sciences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M12 14c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Z"></path>
          <path d="M12 14v7"></path>
          <path d="M9 18h6"></path>
        </svg>
      )
    },
    {
      title: "Sessions de mentorat",
      time: "16h - 17h30",
      description: "Coaching personnalisé en petits groupes pour répondre aux questions et approfondir des sujets spécifiques.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "Compétitions mathématiques",
      time: "18h - 20h",
      description: "Défis et tournois pour stimuler l'émulation et l'esprit d'équipe entre les participants.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      )
    }
  ];

  const weeks = [
    {
      name: "Semaine 1",
      themes: [
        "Algèbre et structures algébriques",
        "Analyse mathématique",
        "Géométrie avancée",
        "Théorie des nombres"
      ]
    },
    {
      name: "Semaine 2",
      themes: [
        "Statistiques et probabilités",
        "Mathématiques discrètes",
        "Applications pratiques",
        "Préparation aux olympiades"
      ]
    }
  ];

  return (
    <section id="program" className="section-padding bg-gray-50 relative">
      <div className="gradient-blur -left-1/4 top-1/4" />
      
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">Programme</Chip>
          <h2 className="heading-lg mb-6">Détails du Programme</h2>
          <p className="subheading">
            Un programme soigneusement conçu pour offrir un équilibre parfait entre théorie, pratique 
            et interaction sociale, dans un environnement favorisant l'apprentissage.
          </p>
        </AnimatedSection>
        
        <AnimatedSection>
          <Tabs defaultValue="week1" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="week1" className="text-sm rounded-full data-[state=active]:bg-primary">Semaine 1</TabsTrigger>
                <TabsTrigger value="week2" className="text-sm rounded-full data-[state=active]:bg-primary">Semaine 2</TabsTrigger>
              </TabsList>
            </div>
            
            {weeks.map((week, weekIndex) => (
              <TabsContent key={weekIndex} value={`week${weekIndex + 1}`} className="mt-0">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-6">
                    <h3 className="heading-md mb-4">{week.name}</h3>
                    <p className="text-muted-foreground mb-8">
                      Pendant cette semaine, les participants exploreront une variété de thèmes mathématiques 
                      à travers des activités engageantes et stimulantes.
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-lg">Thèmes abordés :</h4>
                      <ul className="space-y-2">
                        {week.themes.map((theme, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 rounded-full bg-primary/10 p-1 flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>{theme}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {activities.map((activity, index) => (
                      <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="bg-primary/5 p-6 flex items-center justify-center sm:w-24">
                              {activity.icon}
                            </div>
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{activity.title}</h4>
                                <Chip variant="outline" className="text-xs">{activity.time}</Chip>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </AnimatedSection>
        
        <AnimatedSection className="mt-20 text-center">
          <div className="glass-effect rounded-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="heading-sm mb-6">Un camp spécialement conçu pour les passionnés de mathématiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              <div className="flex flex-col items-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">2</div>
                <div className="text-sm text-center">Semaines d'immersion</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">30+</div>
                <div className="text-sm text-center">Ateliers interactifs</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-center">Experts reconnus</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-center">Participants attendus</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProgramSection;
