import React from "react";
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
import { useLanguage } from "@/context/LanguageContext";

// Données des départements et communes du Bénin
const beninData = {
  "Alibori": ["Banikoara", "Gogounou", "Kandi", "Karimama", "Malanville", "Segbana"],
  "Atacora": ["Boukoumbé", "Cobly", "Kérou", "Kouandé", "Matéri", "Natitingou", "Péhunco", "Tanguiéta", "Toucountouna"],
  "Atlantique": ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "Sô-Ava", "Toffo", "Tori-Bossito", "Zè"],
  "Borgou": ["Bembèrèkè", "Kalalé", "N'Dali", "Nikki", "Parakou", "Pèrèrè", "Sinendé", "Tchaourou"],
  "Collines": ["Bantè", "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savalou", "Savè"],
  "Couffo": ["Aplahoué", "Djakotomey", "Dogbo-Tota", "Klouékanmè", "Lalo", "Toviklin"],
  "Donga": ["Bassila", "Copargo", "Djougou", "Ouaké"],
  "Littoral": ["Cotonou"],
  "Mono": ["Athiémè", "Bopa", "Comè", "Grand-Popo", "Houéyogbé", "Lokossa"],
  "Ouémé": ["Adjarra", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Porto-Novo", "Sèmè-Podji"],
  "Plateau": ["Adja-Ouèrè", "Ifangni", "Kétou", "Pobè", "Sakété"],
  "Zou": ["Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", "Ouinhi", "Zagnanado", "Za-Kpota", "Zogbodomey"]
};

const inscriptionSchema = z.object({
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Numéro de téléphone invalide"),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 14 && Number(val) <= 18, {
    message: "L'âge doit être entre 14 et 18 ans",
  }),
  niveau: z.string().min(1, "Veuillez sélectionner votre niveau scolaire"),
  ecole: z.string().min(3, "Veuillez indiquer votre école actuelle"),
  ville: z.string().min(2, "Veuillez indiquer votre ville"),
  departement: z.string().min(2, "Veuillez indiquer votre département"),
  commune: z.string().min(2, "Veuillez indiquer votre commune"),
  motivation: z.string().min(50, "Veuillez écrire au moins 50 caractères"),
});

type InscriptionFormValues = z.infer<typeof inscriptionSchema>;

const Inscription = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [availableCommunes, setAvailableCommunes] = useState<string[]>([]);
  const { t, language } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InscriptionFormValues>({
    resolver: zodResolver(inscriptionSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      age: "",
      niveau: "",
      ecole: "",
      ville: "",
      departement: "",
      commune: "",
      motivation: "",
    },
  });

  const watchedDepartment = watch("departement");

  // Mettre à jour les communes quand le département change
  React.useEffect(() => {
    if (watchedDepartment && beninData[watchedDepartment as keyof typeof beninData]) {
      setAvailableCommunes(beninData[watchedDepartment as keyof typeof beninData]);
      setValue("commune", ""); // Reset commune selection
    } else {
      setAvailableCommunes([]);
    }
  }, [watchedDepartment, setValue]);

  const onSubmit = async (data: InscriptionFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }
      
      const result = await response.json();
      
      // Réinitialiser le formulaire
      reset();
      setSelectedDepartment("");
      setAvailableCommunes([]);
      
      // Afficher un message de succès
      toast({
        title: language === 'fr' ? "Inscription envoyée avec succès!" : "Registration successfully sent!",
        description: language === 'fr' 
          ? "Merci pour votre candidature ! Notre équipe examinera votre dossier et vous contactera par email ou téléphone dans les prochains jours pour vous informer de la suite du processus de sélection."
          : "Thank you for your application! Our team will review your file and contact you by email or phone in the coming days to inform you about the next steps in the selection process.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      toast({
        title: language === 'fr' ? "Erreur lors de l'envoi" : "Error sending form",
        description: language === 'fr'
          ? "Veuillez réessayer plus tard ou nous contacter directement."
          : "Please try again later or contact us directly.",
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
                {language === 'fr' ? "Retour à l'accueil" : "Back to home"}
              </Link>
            </Button>
            
            <AnimatedSection delay={100}>
              <h1 className="heading-lg mb-2">
                {language === 'fr' 
                  ? "Inscription au Summer Maths Camp"
                  : "Registration for Summer Maths Camp"}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {language === 'fr' 
                  ? "Remplissez ce formulaire pour soumettre votre candidature au Summer Maths Camp 2025 au Bénin. La participation est entièrement gratuite, seuls les frais de transport sont à votre charge."
                  : "Fill out this form to submit your application for the 2025 Summer Maths Camp in Benin. Participation is completely free, you only need to cover your transportation costs."}
              </p>
            </AnimatedSection>
          </div>
          
          <Separator className="my-8" />
          
          <AnimatedSection delay={200}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="prenom" className="text-sm font-medium">
                    {language === 'fr' ? "Prénom" : "First Name"}
                  </label>
                  <Input
                    id="prenom"
                    {...register("prenom")}
                    placeholder={language === 'fr' ? "Votre prénom" : "Your first name"}
                    className={errors.prenom ? "border-destructive" : ""}
                  />
                  {errors.prenom && (
                    <p className="text-xs text-destructive">{errors.prenom.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="nom" className="text-sm font-medium">
                    {language === 'fr' ? "Nom" : "Last Name"}
                  </label>
                  <Input
                    id="nom"
                    {...register("nom")}
                    placeholder={language === 'fr' ? "Votre nom" : "Your last name"}
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
                    placeholder={language === 'fr' ? "votre.email@exemple.com" : "your.email@example.com"}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="telephone" className="text-sm font-medium">
                    {language === 'fr' ? "Téléphone" : "Phone"}
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
                    {language === 'fr' ? "Âge" : "Age"}
                  </label>
                  <Input
                    id="age"
                    type="number"
                    min="14"
                    max="18"
                    {...register("age")}
                    placeholder={language === 'fr' ? "Votre âge" : "Your age"}
                    className={errors.age ? "border-destructive" : ""}
                  />
                  {errors.age && (
                    <p className="text-xs text-destructive">{errors.age.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="niveau" className="text-sm font-medium">
                    {language === 'fr' ? "Niveau scolaire" : "School Level"}
                  </label>
                  <select
                    id="niveau"
                    {...register("niveau")}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                      errors.niveau ? "border-destructive" : ""
                    }`}
                  >
                    <option value="">
                      {language === 'fr' ? "Sélectionnez votre niveau" : "Select your level"}
                    </option>
                    <option value="quatrieme">
                      {language === 'fr' ? "4ème" : "4th Grade"}
                    </option>
                    <option value="troisieme">
                      {language === 'fr' ? "3ème" : "3rd Grade"}
                    </option>
                    <option value="seconde">
                      {language === 'fr' ? "2nde" : "2nd Grade"}
                    </option>
                    <option value="premiere">
                      {language === 'fr' ? "1ère" : "1st Grade"}
                    </option>
                    <option value="terminale">
                      {language === 'fr' ? "Terminale" : "Final Grade"}
                    </option>
                  </select>
                  {errors.niveau && (
                    <p className="text-xs text-destructive">{errors.niveau.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ecole" className="text-sm font-medium">
                    {language === 'fr' ? "École actuelle" : "Current School"}
                  </label>
                  <Input
                    id="ecole"
                    {...register("ecole")}
                    placeholder={language === 'fr' ? "Nom de votre école" : "Name of your school"}
                    className={errors.ecole ? "border-destructive" : ""}
                  />
                  {errors.ecole && (
                    <p className="text-xs text-destructive">{errors.ecole.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="ville" className="text-sm font-medium">
                    {language === 'fr' ? "Ville" : "City"}
                  </label>
                  <Input
                    id="ville"
                    {...register("ville")}
                    placeholder={language === 'fr' ? "Votre ville" : "Your city"}
                    className={errors.ville ? "border-destructive" : ""}
                  />
                  {errors.ville && (
                    <p className="text-xs text-destructive">{errors.ville.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="departement" className="text-sm font-medium">
                    {language === 'fr' ? "Département" : "Department"}
                  </label>
                  <select
                    id="departement"
                    {...register("departement")}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                      errors.departement ? "border-destructive" : ""
                    }`}
                  >
                    <option value="">
                      {language === 'fr' ? "Sélectionnez votre département" : "Select your department"}
                    </option>
                    {Object.keys(beninData).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.departement && (
                    <p className="text-xs text-destructive">{errors.departement.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="commune" className="text-sm font-medium">
                    {language === 'fr' ? "Commune" : "Commune"}
                  </label>
                  <select
                    id="commune"
                    {...register("commune")}
                    disabled={!watchedDepartment || availableCommunes.length === 0}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                      errors.commune ? "border-destructive" : ""
                    }`}
                  >
                    <option value="">
                      {language === 'fr' ? "Sélectionnez votre commune" : "Select your commune"}
                    </option>
                    {availableCommunes.map((commune) => (
                      <option key={commune} value={commune}>
                        {commune}
                      </option>
                    ))}
                  </select>
                  {errors.commune && (
                    <p className="text-xs text-destructive">{errors.commune.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="motivation" className="text-sm font-medium">
                  {language === 'fr' ? "Lettre de motivation" : "Motivation Letter"}
                </label>
                <Textarea
                  id="motivation"
                  {...register("motivation")}
                  placeholder={language === 'fr' 
                    ? "Expliquez en quelques lignes pourquoi vous souhaitez participer au Summer Maths Camp et ce que vous espérez y apprendre."
                    : "Explain in a few lines why you want to participate in the Summer Maths Camp and what you hope to learn there."}
                  className={`min-h-[120px] ${errors.motivation ? "border-destructive" : ""}`}
                />
                {errors.motivation ? (
                  <p className="text-xs text-destructive">{errors.motivation.message}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr'
                      ? "Minimum 50 caractères. Décrivez votre intérêt pour les mathématiques et vos objectifs."
                      : "Minimum 50 characters. Describe your interest in mathematics and your goals."}
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
                      <span>{language === 'fr' ? "Envoi en cours..." : "Sending..."}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={16} />
                      <span>{language === 'fr' ? "Soumettre ma candidature" : "Submit my application"}</span>
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
