
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();
  
  const objectives = [
    {
      title: t("about.obj1.title"),
      description: t("about.obj1.description"),
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
      title: t("about.obj2.title"),
      description: t("about.obj2.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      )
    },
    {
      title: t("about.obj3.title"),
      description: t("about.obj3.description"),
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
      title: t("about.obj4.title"),
      description: t("about.obj4.description"),
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
          <Chip className="mb-4">{t("about")}</Chip>
          <h2 className="heading-lg mb-6">{t("about.title")}</h2>
          <p className="subheading">
            {t("about.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="slide-in-right" className="order-2 md:order-1">
            <div className="space-y-8">
              <div>
                <h3 className="heading-sm mb-4">{t("about.excellence.title")}</h3>
                <p className="text-muted-foreground">
                  {t("about.excellence.description")}
                </p>
              </div>
              <div>
                <h3 className="heading-sm mb-4">{t("about.who.title")}</h3>
                <p className="text-muted-foreground">
                  {t("about.who.description")}
                </p>
              </div>
              <div>
                <h3 className="heading-sm mb-4">{t("about.vision.title")}</h3>
                <p className="text-muted-foreground">
                  {t("about.vision.description")}
                </p>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="order-1 md:order-2">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/lovable-uploads/2d79b957-cbf5-4cb7-85d6-23daea9e1950.png" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-2/3 aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src="/lovable-uploads/e415b9ca-7127-4c2d-8b77-ee94195c17f0.png" 
                  alt="Mathematics equations" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        <div className="mt-32">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-lg mb-6">{t("about.objectives.title")}</h2>
            <p className="subheading">
              {t("about.objectives.subtitle")}
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
