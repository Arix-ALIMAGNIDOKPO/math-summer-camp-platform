
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const BudgetSection = () => {
  const budgetData = [
    { name: "Matériel pédagogique", value: 15000, color: "#3b82f6" },
    { name: "Honoraires intervenants", value: 25000, color: "#10b981" },
    { name: "Transport et hébergement", value: 30000, color: "#6366f1" },
    { name: "Bourses", value: 20000, color: "#f59e0b" },
    { name: "Administration", value: 10000, color: "#ec4899" },
  ];

  const totalBudget = budgetData.reduce((acc, item) => acc + item.value, 0);

  const impactData = [
    {
      title: "Participants",
      previous: 35,
      target: 50,
      progress: 70,
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
      title: "Bourses attribuées",
      previous: 8,
      target: 15,
      progress: 53,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      title: "Intervenants",
      previous: 6,
      target: 10,
      progress: 60,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      title: "Partenaires",
      previous: 4,
      target: 8,
      progress: 50,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{Number(payload[0].value).toLocaleString()} €</p>
          <p className="text-xs text-muted-foreground">{`${(payload[0].value / totalBudget * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="budget" className="section-padding bg-gray-50 relative">
      <div className="gradient-blur right-1/4 bottom-1/4" />
      
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">Budget</Chip>
          <h2 className="heading-lg mb-6">Budget Estimatif</h2>
          <p className="subheading">
            Transparence et clarté sur l'utilisation des fonds pour assurer une gestion efficace et 
            optimale des ressources.
          </p>
        </AnimatedSection>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="glass-effect p-8 rounded-xl">
              <div className="mb-8">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-semibold text-xl">Budget total</h3>
                  <span className="text-2xl font-display font-bold">{totalBudget.toLocaleString()} €</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Répartition des fonds nécessaires pour l'organisation du Maths Summer Camp - Édition II
                </p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      innerRadius={65}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {budgetData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-in-right">
            <div>
              <h3 className="heading-sm mb-6">Impact Attendu</h3>
              <p className="text-muted-foreground mb-8">
                Nous suivons méticuleusement nos objectifs pour assurer que les investissements produisent 
                un impact significatif sur l'éducation et le développement des jeunes talents.
              </p>
              
              <div className="space-y-8">
                {impactData.map((item, index) => (
                  <AnimatedSection key={index} delay={index * 100} animation="fade-in">
                    <Card className="p-6 border-0 shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <h4 className="font-medium">{item.title}</h4>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.previous} → <span className="font-medium text-primary">{item.target}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress value={item.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Édition I</span>
                          <span>{item.progress}% de l'objectif</span>
                        </div>
                      </div>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
        
        <AnimatedSection className="mt-20 text-center max-w-3xl mx-auto">
          <h3 className="heading-sm mb-6">Devenez Partenaire</h3>
          <p className="text-muted-foreground mb-8">
            Nous proposons différentes modalités de partenariat adaptées à vos objectifs. Investissez dans 
            l'éducation et le développement des futurs talents en mathématiques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="p-6 border border-primary/20">
              <h4 className="font-semibold mb-2">Partenaire Or</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Visibilité maximale pendant l'événement et sur tous les supports de communication.
              </p>
              <div className="font-display font-bold text-2xl text-primary">10 000 €</div>
            </Card>
            <Card className="p-6 border border-primary/20">
              <h4 className="font-semibold mb-2">Partenaire Argent</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Visibilité lors des moments clés du camp et sur les supports principaux.
              </p>
              <div className="font-display font-bold text-2xl text-primary">5 000 €</div>
            </Card>
            <Card className="p-6 border border-primary/20">
              <h4 className="font-semibold mb-2">Partenaire Bronze</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Mention du partenariat sur le site et dans le programme du camp.
              </p>
              <div className="font-display font-bold text-2xl text-primary">2 000 €</div>
            </Card>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BudgetSection;
