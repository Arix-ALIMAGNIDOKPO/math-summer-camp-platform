
import { useState } from "react";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Chip } from "@/components/ui-custom/Chip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

const ContactSection = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interest: "participant" // Default value
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, interest: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validation côté client
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || !formData.interest) {
        throw new Error('Tous les champs obligatoires doivent être remplis');
      }

      // Nettoyer les données
      const cleanedData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        interest: formData.interest,
        message: formData.message.trim()
      };

      console.log('Sending contact data:', cleanedData);
      
      // For partnership inquiries, send directly to email
      if (cleanedData.interest === "partenaire") {
        const subject = encodeURIComponent('Partnership Inquiry for Summer Maths Camp');
        const body = encodeURIComponent(`Name: ${cleanedData.name}\nPhone: ${cleanedData.phone || 'Non fourni'}\nEmail: ${cleanedData.email}\n\nMessage: ${cleanedData.message}`);
        window.location.href = `mailto:info.imacbenin@gmail.com?subject=${subject}&body=${body}`;
        
        setTimeout(() => {
          setIsSubmitting(false);
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            interest: "participant"
          });
          toast.success(t("contact.success"));
        }, 1000);
        return;
      }
      
      // For other inquiries, send to backend with proper error handling
      const API_URL = import.meta.env.VITE_API_URL || 'https://math-summer-camp-platform-backend.onrender.com';
      console.log('Contact API URL:', API_URL);
      
      // Test de connectivité d'abord
      try {
        const healthCheck = await fetch(`${API_URL}/api/health`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
          },
          signal: AbortSignal.timeout(15000), // 15 secondes timeout
        });
        
        if (!healthCheck.ok) {
          console.warn('Backend health check failed:', healthCheck.status);
        } else {
          const healthData = await healthCheck.json();
          console.log('Backend health check success:', healthData);
        }
      } catch (healthError) {
        console.error('Backend health check error:', healthError);
        // Continue anyway, maybe the health endpoint is not available but the contact endpoint is
      }
      
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        mode: 'cors',
        credentials: 'omit', 
        signal: AbortSignal.timeout(45000), // 45 secondes timeout
        body: JSON.stringify(cleanedData),
      });
      
      console.log('Contact response status:', response.status);
      console.log('Contact response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        let errorMessage = t("contact.error");
        let errorData;
        try {
          errorData = await response.json();
          console.error('Contact error data:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch {
          try {
            const errorText = await response.text();
            console.error('Contact error text:', errorText);
            errorMessage = errorText || errorMessage;
          } catch {
            errorMessage = `Erreur HTTP ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('Contact success:', result);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        interest: "participant"
      });
      
      toast.success(t("contact.success"));
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      
      let errorMessage = t("contact.error");
      
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          errorMessage = 'Délai d\'attente dépassé. Veuillez vérifier votre connexion internet et réessayer.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_FAILED')) {
          errorMessage = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Erreur de configuration du serveur. Veuillez contacter l\'administrateur.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
      
      // Fallback: ouvrir l'email client en cas d'échec
      if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_FAILED')) {
        setTimeout(() => {
          const subject = encodeURIComponent('Contact - Summer Maths Camp');
          const body = encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone || 'Non fourni'}\nIntérêt: ${formData.interest}\n\nMessage: ${formData.message}`);
          
          if (confirm(language === 'fr' 
            ? 'Le serveur semble indisponible. Voulez-vous envoyer votre message par email ?' 
            : 'The server seems unavailable. Would you like to send your message by email?')) {
            window.location.href = `mailto:info.imacbenin@gmail.com?subject=${subject}&body=${body}`;
          }
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white relative overflow-x-hidden">
      <div className="section-container px-4">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <Chip className="mb-4">{t("contact")}</Chip>
          <h2 className="heading-lg mb-6">{t("contact.title")}</h2>
          <p className="subheading">
            {t("contact.subtitle")}
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          <AnimatedSection>
            <Card className="p-4 sm:p-6 md:p-8 shadow-xl border-0">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">{t("contact.fullname")}</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("contact.your.name")} 
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("contact.email.placeholder")} 
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">{t("contact.phone")}</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t("contact.phone.placeholder")} 
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>{t("contact.interested.as")}</Label>
                  <RadioGroup 
                    defaultValue="participant"
                    value={formData.interest}
                    onValueChange={handleRadioChange}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="participant" id="participant" />
                      <Label htmlFor="participant" className="font-normal text-sm">{t("contact.participant")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent" className="font-normal text-sm">{t("contact.parent")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intervenant" id="intervenant" />
                      <Label htmlFor="intervenant" className="font-normal text-sm">{t("contact.speaker")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partenaire" id="partenaire" />
                      <Label htmlFor="partenaire" className="font-normal text-sm">{t("contact.partner")}</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="message">{t("contact.message")}</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contact.message.placeholder")} 
                    rows={4} 
                    className="mt-1"
                  />
                </div>
                
                <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
                  {isSubmitting ? t("contact.sending") : t("contact.send")}
                </Button>
              </form>
            </Card>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-in-right">
            <div className="space-y-6 md:space-y-8">
              <div>
                <h3 className="heading-sm mb-4">{t("contact.info.title")}</h3>
                <p className="text-muted-foreground mb-6">
                  {t("contact.info.description")}
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="rounded-full bg-primary/10 p-2 h-min">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t("contact.phone.label")}</h4>
                      <p className="text-muted-foreground">+2290197240900</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="rounded-full bg-primary/10 p-2 h-min">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{t("contact.email.label")}</h4>
                      <p className="text-muted-foreground">info.imacbenin@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="heading-sm mb-4">{t("contact.faq.title")}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base">{t("contact.faq1.question")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("contact.faq1.answer")}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">{t("contact.faq2.question")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("contact.faq2.answer")}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">{t("contact.faq3.question")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("contact.faq3.answer")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
