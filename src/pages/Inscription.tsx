
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { AnimatedSection } from "@/components/ui-custom/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inscriptionSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 14 && Number(val) <= 18, {
    message: "L'âge doit être entre 14 et 18 ans",
  }),
  ecole: z.string().min(3, "Veuillez indiquer votre école actuelle"),
  ville: z.string().min(2, "Veuillez indiquer votre ville"),
  niveau: z.string().min(1, "Veuillez sélectionner votre niveau scolaire"),
  motivation: z.string().min(50, "Veuillez écrire au moins 50 caractères"),
});

type InscriptionFormValues = z.infer<typeof inscriptionSchema>;

const Inscription = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InscriptionFormValues>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      age: "",
      ecole: "",
      ville: "",
      niveau: "",
      motivation: "",
    },
  });

  const onSubmit = async (data: InscriptionFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simuler un appel API (remplacer par une vraie API en backend)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Données du formulaire:", data);
      
      // Réinitialiser le formulaire
      reset();
      
      // Afficher un message de succès
      toast({
        title: "Inscription envoyée avec succès!",
        description: "Votre candidature a été reçue. Nous vous contacterons bientôt.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Veuillez réessayer plus tard ou nous contacter directement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Retour à l'accueil
              </Link>
            </Button>
            
            <AnimatedSection delay={100}>
              <h1 className="heading-lg mb-2">Inscription au Maths Summer Camp</h1>
              <p className="text-muted-foreground max-w-2xl">
                Remplissez ce formulaire pour soumettre votre candidature au Maths Summer Camp 2025 au Bénin.
                La participation est entièrement gratuite, seuls les frais de transport sont à votre charge.
              </p>
            </AnimatedSection>
          </div>
          
          <Separator className="my-8" />
          
          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="prenom" className="text-sm font-medium">
                    Prénom
                  </label>
                  <Input
                    id="prenom"
                    {...register("prenom")}
                    placeholder="Votre prénom"
                    className={errors.prenom ? "border-destructive" : ""}
                  />
                  {errors.prenom && (
                    <p className="text-xs text-destructive">{errors.prenom.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="nom" className="text-sm font-medium">
                    Nom
                  </label>
                  <Input
                    id="nom"
                    {...register("nom")}
                    placeholder="Votre nom"
                    className={errors.nom ? "border-destructive" : ""}
                  />
                  {errors.nom && (
                    <p className="text-xs text-destructive">{errors.nom.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="votre.email@exemple.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="telephone" className="text-sm font-medium">
                    Téléphone
                  </label>
                  <Input
                    id="telephone"
                    {...register("telephone")}
                    placeholder="+229 XXXXXXXX"
                    className={errors.telephone ? "border-destructive" : ""}
                  />
                  {errors.telephone && (
                    <p className="text-xs text-destructive">{errors.telephone.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium">
                    Âge
                  </label>
                  <Input
                    id="age"
                    type="number"
                    min="14"
                    max="18"
                    {...register("age")}
                    placeholder="Votre âge"
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-xs text-destructive">{errors.age.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ecole" className="text-sm font-medium">
                    École actuelle
                  </label>
                  <Input
                    id="ecole"
                    {...register("ecole")}
                    placeholder="Nom de votre école"
                    className={errors.ecole ? "border-destructive" : ""}
                  />
                  {errors.ecole && (
                    <p className="text-xs text-destructive">{errors.ecole.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ville" className="text-sm font-medium">
                    Ville
                  </label>
                  <Input
                    id="ville"
                    {...register("ville")}
                    placeholder="Votre ville"
                    className={errors.ville ? "border-destructive" : ""}
                  />
                  {errors.ville && (
                    <p className="text-xs text-destructive">{errors.ville.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="niveau" className="text-sm font-medium">
                    Niveau scolaire
                  </label>
                  <select
                    id="niveau"
                    {...register("niveau")}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                      errors.niveau ? "border-destructive" : ""
                    }`}
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    <option value="troisieme">3ème</option>
                    <option value="seconde">2nde</option>
                    <option value="premiere">1ère</option>
                    <option value="terminale">Terminale</option>
                  </select>
                  {errors.niveau && (
                    <p className="text-xs text-destructive">{errors.niveau.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="motivation" className="text-sm font-medium">
                  Lettre de motivation
                </label>
                <Textarea
                  id="motivation"
                  {...register("motivation")}
                  placeholder="Expliquez en quelques lignes pourquoi vous souhaitez participer au Maths Summer Camp et ce que vous espérez y apprendre."
                  className={`min-h-[120px] ${errors.motivation ? "border-destructive" : ""}`}
                />
                {errors.motivation ? (
                  <p className="text-xs text-destructive">{errors.motivation.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Minimum 50 caractères. Décrivez votre intérêt pour les mathématiques et vos objectifs.
                  </p>
                )}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="rounded-full px-8"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Envoi en cours...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={16} />
                      <span>Soumettre ma candidature</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Inscription;
