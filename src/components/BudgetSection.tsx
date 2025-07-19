import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Card } from "@/components/ui/card";
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
        
        <AnimatedSection className="max-w-3xl mx-auto">
          <Card className="p-4 sm:p-6 md:p-8 border-0 shadow-xl bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="heading-sm text-center mb-6 md:mb-8">{t("budget.support.title")}</h3>

            <div className="mb-8 md:mb-10">
              <p className="mb-6 text-center">
                {t("budget.contribution")}
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 md:mb-8">
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
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="donation-amount" className="block text-sm font-medium mb-2">
                    {t("budget.custom.amount")}
                  </label>
                  <div className="relative">
                    <input
                      id="donation-amount"
                      type="number"
                      min="1"
                      step="1"
                      placeholder={t("budget.enter.amount")}
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">€</span>
                  </div>
                </div>
                
                <Button 
                  onClick={openKkiapayWidget}
                  className="w-full py-4 md:py-6 text-lg rounded-xl shadow-lg bg-[#00B2FF] hover:bg-[#00A0E0]" 
                  disabled={!donationAmount}
                >
                  {t("budget.donate")}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  {t("budget.donation.note")}
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <h4 className="font-semibold mb-2 text-center">{t("budget.business.advantages")}</h4>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {t("budget.business.description")}
              </p>
              <Button variant="outline" className="w-full border-primary/20" asChild>
                <a href="mailto:info.imacbenin@gmail.com">Contactez-nous</a>
              </Button>
            </div>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BudgetSection;