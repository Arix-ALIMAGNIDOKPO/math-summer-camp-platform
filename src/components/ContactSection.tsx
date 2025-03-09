
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

const ContactSection = () => {
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
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success("Votre message a été envoyé avec succès !");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          interest: "participant"
        });
      } else {
        const errorData = await response.json();
        toast.error(`Erreur: ${errorData.message || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Impossible d'envoyer le message. Veuillez réessayer plus tard.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white relative">
      <div className="section-container">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <Chip className="mb-4">Contact</Chip>
          <h2 className="heading-lg mb-6">Intéressé(e) ?</h2>
          <p className="subheading">
            Que vous soyez un futur participant, un parent, un intervenant potentiel ou un partenaire, 
            nous serons ravis d'échanger avec vous sur le Maths Summer Camp.
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <AnimatedSection>
            <Card className="p-8 shadow-xl border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom" 
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com" 
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78" 
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Je suis intéressé(e) en tant que :</Label>
                  <RadioGroup 
                    defaultValue="participant"
                    value={formData.interest}
                    onValueChange={handleRadioChange}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="participant" id="participant" />
                      <Label htmlFor="participant" className="font-normal">Participant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parent" id="parent" />
                      <Label htmlFor="parent" className="font-normal">Parent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="intervenant" id="intervenant" />
                      <Label htmlFor="intervenant" className="font-normal">Intervenant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partenaire" id="partenaire" />
                      <Label htmlFor="partenaire" className="font-normal">Partenaire</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message ou question..." 
                    rows={4} 
                    className="mt-1"
                  />
                </div>
                
                <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
                  {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                </Button>
              </form>
            </Card>
          </AnimatedSection>
          
          <AnimatedSection animation="slide-in-right">
            <div className="space-y-8">
              <div>
                <h3 className="heading-sm mb-4">Informations de contact</h3>
                <p className="text-muted-foreground mb-6">
                  N'hésitez pas à nous contacter directement pour toute question concernant 
                  le Maths Summer Camp - Édition II.
                </p>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="rounded-full bg-primary/10 p-2 h-min">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Téléphone</h4>
                      <p className="text-muted-foreground">+33 (0)1 23 45 67 89</p>
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
                      <h4 className="font-medium text-sm">Email</h4>
                      <p className="text-muted-foreground">contact@mathssummercamp.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="rounded-full bg-primary/10 p-2 h-min">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Adresse</h4>
                      <p className="text-muted-foreground">
                        123 Avenue des Sciences<br />
                        75000 Paris, France
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="heading-sm mb-4">Foire Aux Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-base">Comment s'inscrire au Maths Summer Camp ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Les inscriptions se font via le formulaire en ligne. Une fois votre candidature soumise, 
                      notre équipe l'examinera et vous contactera pour la suite du processus.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Quelles sont les conditions d'éligibilité pour une bourse ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Les bourses sont attribuées sur critères sociaux et de mérite. Vous pouvez soumettre 
                      une demande lors de votre inscription et fournir les justificatifs nécessaires.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-base">Les repas et l'hébergement sont-ils inclus ?</h4>
                    <p className="text-sm text-muted-foreground">
                      Oui, tous les repas et l'hébergement sont inclus dans les frais d'inscription. 
                      Des options spéciales sont disponibles pour les régimes alimentaires particuliers.
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
