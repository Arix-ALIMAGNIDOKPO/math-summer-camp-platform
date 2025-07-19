import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const BudgetSection = () => {
  const { t, language } = useLanguage();
  const [donationAmount, setDonationAmount] = useState<string>("25");
  
  const handleQuickAmount = (amount: number) => {
    setDonationAmount(amount.toString());
  };

  const openKkiapayWidget = () => {
    if (!donationAmount || isNaN(parseInt(donationAmount))) {
      toast.error(language === 'fr' ? "Veuillez entrer un montant valide" : "Please enter a valid amount");
      return;
    }
    
    toast.success(language === 'fr' ? 
      "Le traitement des dons se ferait ici dans un environnement de production" : 
      "Donation processing would happen here in a production environment");
  };

  // Updated budget data based on the provided information
  const budgetData = [
    { 
      name: t("budget.accommodation"), 
      value: 2160865, 
      color: "#3b82f6" 
    },
    { 
      name: t("budget.food"), 
      value: 9723692, 
      color: "#10b981" 
    },
    { 
      name: t("budget.transport"), 
      value: 4141154, 
      color: "#6366f1" 
    },
    { 
      name: t("budget.materials"), 
      value: 370663, 
      color: "#ec4899" 
    },
    { 
      name: t("budget.prints"), 
      value: 247109, 
      color: "#f59e0b" 
    },
    { 
      name: t("budget.badges"), 
      value: 61777, 
      color: "#14b8a6" 
    },
    { 
      name: t("budget.media"), 
      value: 617773, 
      color: "#8b5cf6" 
    },
    { 
      name: t("budget.healthcare"), 
      value: 1896707, 
      color: "#06b6d4" 
    },
  ];

  const totalBudget = 15512750; // Total budget in FCFA

  // Custom tooltip component for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{Number(payload[0].value).toLocaleString()} FCFA</p>
          <p className="text-xs text-muted-foreground">{`${(payload[0].value / totalBudget * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Format currency based on the current language
  const formatCurrency = (amount: number): string => {
    if (language === 'fr') {
      return `${amount.toLocaleString()} FCFA`;
    } else {
      // Convert to USD for English display
      const usdAmount = Math.round(amount / 630); // Approximate conversion
      return `$${usdAmount.toLocaleString()}`;
    }
  };

  return (
    <section id="budget" className="section-padding bg-gray-50 relative overflow-x-hidden">
      <div className="gradient-blur right-1/4 bottom-1/4" />
      
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">{t("budget")}</Chip>
          <h2 className="heading-lg mb-6">{t("budget.title")}</h2>
          <p className="subheading">
            {t("budget.description")}
          </p>
        </AnimatedSection>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <AnimatedSection>
            <div className="glass-effect p-6 md:p-8 rounded-xl">
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={50}
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
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 text-xs md:text-sm">
                {budgetData.map((item, index) => (
                  <div key={index} className="flex items-center gap-1 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-in-right">
            <div className="space-y-6">
              <h3 className="heading-sm mb-4">{t("budget.support.title")}</h3>
              <p className="text-muted-foreground">
                {t("budget.contribution")}
              </p>
            </div>
          </AnimatedSection>
        </div>
        
      </div>
    </section>
  );
};

export default BudgetSection;
