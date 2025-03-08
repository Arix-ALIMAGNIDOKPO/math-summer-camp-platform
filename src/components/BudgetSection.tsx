
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const BudgetSection = () => {
  const [donationAmount, setDonationAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setDonationAmount("");
      toast({
        title: "Merci pour votre contribution!",
        description: "Votre soutien permet à des jeunes talents au Bénin d'accéder à une éducation mathématique de qualité.",
      });
    }, 1500);
  };

  const handleQuickAmount = (amount: number) => {
    setDonationAmount(amount.toString());
  };

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
          <Chip className="mb-4">Financement</Chip>
          <h2 className="heading-lg mb-6">Contribuez à l'Éducation au Bénin</h2>
          <p className="subheading">
            Votre soutien permet d'offrir une formation mathématique avancée à des jeunes talents béninois 
            qui n'auraient pas accès à ces concepts dans leur cursus habituel. Chaque contribution compte, 
            quelle que soit sa taille.
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
                  Répartition des fonds nécessaires pour l'organisation du Maths Summer Camp au Bénin - Édition II.
                  <span className="block mt-2 font-medium text-primary">100% des élèves participants sont boursiers et n'ont aucun frais d'inscription à payer.</span>
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
              <h3 className="heading-sm mb-6">Impact Sur l'Éducation au Bénin</h3>
              <p className="text-muted-foreground mb-8">
                Notre camp d'été offre un accès entièrement gratuit à une éducation mathématique avancée pour les jeunes talents 
                au Bénin. Les élèves sélectionnés n'ont à couvrir que leurs frais de transport. Ce programme non lucratif
                vise à permettre aux étudiants des milieux défavorisés d'accéder à des concepts mathématiques 
                qu'ils n'auraient pas l'opportunité d'explorer dans leur cursus habituel.
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
        
        <AnimatedSection className="mt-20 max-w-3xl mx-auto">
          <Card className="p-6 sm:p-10 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="heading-sm text-center mb-8">Soutenez les Talents Mathématiques au Bénin</h3>

            <div className="mb-10">
              <p className="mb-6 text-center">
                Votre contribution, quelle que soit son montant, permet de transformer la vie d'un jeune talent 
                béninois en lui donnant accès à une éducation mathématique de qualité, totalement gratuite.
                Aucun frais d'inscription n'est demandé aux participants, seul le transport est à leur charge.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickAmount(10)}
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  10€
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickAmount(25)}
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  25€
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickAmount(50)}
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  50€
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleQuickAmount(100)}
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  100€
                </Button>
              </div>
              
              <form onSubmit={handleDonationSubmit} className="space-y-6">
                <div>
                  <label htmlFor="donation-amount" className="block text-sm font-medium mb-2">
                    Montant personnalisé (€)
                  </label>
                  <Input
                    id="donation-amount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Entrez votre montant"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="bg-white"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-name" className="block text-sm font-medium mb-2">
                        Nom sur la carte
                      </label>
                      <Input id="card-name" className="bg-white" required />
                    </div>
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium mb-2">
                        Numéro de carte
                      </label>
                      <Input id="card-number" className="bg-white" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium mb-2">
                        Date d'expiration
                      </label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/AA" 
                        className="bg-white" 
                        required 
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                        CVV
                      </label>
                      <Input 
                        id="cvv" 
                        type="password" 
                        maxLength={4} 
                        className="bg-white" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg rounded-xl shadow-lg" 
                    disabled={isProcessing || !donationAmount}
                  >
                    {isProcessing ? "Traitement en cours..." : "Faire un don maintenant"}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
                      <path d="M6 7v10" />
                      <path d="M18 7v10" />
                      <path d="M2 11h20" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <circle cx="9" cy="12" r="7" />
                      <circle cx="15" cy="12" r="7" />
                    </svg>
                  </div>
                </div>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  100% de votre don est utilisé pour soutenir des élèves béninois talentueux. 
                  Transaction sécurisée et confidentielle. Ce programme est entièrement non lucratif. 
                  Vous recevrez un reçu par email.
                </p>
              </form>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <h4 className="font-semibold mb-2 text-center">Avantages pour les Partenaires Entreprises</h4>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Les entreprises qui contribuent bénéficient d'une visibilité sur nos supports de communication, 
                de la mention de leur soutien lors des événements, et d'interactions avec les participants.
              </p>
              <Button variant="outline" className="w-full border-primary/20">
                Contactez-nous pour un partenariat entreprise
              </Button>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BudgetSection;
