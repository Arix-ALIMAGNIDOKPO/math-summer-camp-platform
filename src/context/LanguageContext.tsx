
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void; // Add this line
  t: (key: string, data?: Record<string, any>) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Hero section
  "dates": {
    fr: "18 - 22 Août 2025",
    en: "August 18 - 22, 2025"
  },
  "hero.title": {
    fr: "Summer Maths Camp",
    en: "Summer Maths Camp"
  },
  "hero.subtitle": {
    fr: "Édition II",
    en: "Edition II"
  },
  "hero.description": {
    fr: "Le Benin Maths Camp 2025, d'une durée de dix jours, propose des activités réparties en deux ateliers distincts : un atelier consacré au camp traditionnel, et un second axé sur la programmation et la robotique.",
    en: "The Benin Maths Camp 2025, lasting ten days, offers activities divided into two distinct workshops: one dedicated to the traditional camp, and a second focused on programming and robotics."
  },
  "register.now": {
    fr: "S'inscrire maintenant",
    en: "Register Now"
  },
  "scroll": {
    fr: "Scroll",
    en: "Scroll"
  },

  // About section
  "about": {
    fr: "À propos",
    en: "About"
  },
  "about.title": {
    fr: "Contexte et Justification",
    en: "Context and Rationale"
  },
  "about.subtitle": {
    fr: "Notre camp d'été intensive en mathématiques est conçu pour les élèves passionnés qui souhaitent approfondir leurs connaissances dans un environnement académique stimulant.",
    en: "Our intensive mathematics summer camp is designed for passionate students who wish to deepen their knowledge in a stimulating academic environment."
  },
  "about.excellence.title": {
    fr: "Un programme d'excellence",
    en: "A Program of Excellence"
  },
  "about.excellence.description": {
    fr: "Le Summer Maths Camp offre un environnement d'apprentissage exceptionnel où les élèves peuvent explorer des concepts mathématiques avancés sous la direction de professionnels et d'experts reconnus dans le domaine.",
    en: "The Summer Maths Camp offers an exceptional learning environment where students can explore advanced mathematical concepts under the guidance of professionals and recognized experts in the field."
  },
  "about.who.title": {
    fr: "Pour qui ?",
    en: "Who is it for?"
  },
  "about.who.description": {
    fr: "Le camp est destiné aux élèves du secondaire (14-18 ans) manifestant un intérêt particulier pour les mathématiques et les sciences, qu'ils soient déjà performants ou simplement curieux d'approfondir leurs connaissances.",
    en: "The camp is designed for high school students (14-18 years old) with a particular interest in mathematics and science, whether they are already high-performing or simply curious to deepen their knowledge."
  },
  "about.vision.title": {
    fr: "Une vision inclusive",
    en: "An Inclusive Vision"
  },
  "about.vision.description": {
    fr: "Nous croyons fermement que le talent mathématique peut se trouver partout. C'est pourquoi nous avons mis en place un système de bourses pour soutenir l'accès à notre programme aux élèves issus de milieux défavorisés.",
    en: "We firmly believe that mathematical talent can be found everywhere. That's why we have implemented a scholarship system to support access to our program for students from disadvantaged backgrounds."
  },
  "about.objectives.title": {
    fr: "Objectifs du Camp",
    en: "Camp Objectives"
  },
  "about.objectives.subtitle": {
    fr: "Notre mission est de créer un environnement où les élèves peuvent explorer, apprendre et grandir à travers les mathématiques.",
    en: "Our mission is to create an environment where students can explore, learn, and grow through mathematics."
  },
  "about.obj1.title": {
    fr: "Renforcer les compétences",
    en: "Strengthen Skills"
  },
  "about.obj1.description": {
    fr: "Approfondir les connaissances mathématiques à travers un programme enrichi et des méthodes pédagogiques innovantes.",
    en: "Deepen mathematical knowledge through an enriched program and innovative teaching methods."
  },
  "about.obj2.title": {
    fr: "Stimuler la curiosité",
    en: "Stimulate Curiosity"
  },
  "about.obj2.description": {
    fr: "Encourager l'exploration de concepts mathématiques et scientifiques avancés à travers des activités interactives.",
    en: "Encourage the exploration of advanced mathematical and scientific concepts through interactive activities."
  },
  "about.obj3.title": {
    fr: "Promouvoir l'égalité",
    en: "Promote Equality"
  },
  "about.obj3.description": {
    fr: "Offrir des bourses aux élèves issus de milieux défavorisés pour garantir l'accès à tous les talents.",
    en: "Offer scholarships to students from disadvantaged backgrounds to ensure access for all talented individuals."
  },
  "about.obj4.title": {
    fr: "Développer l'esprit critique",
    en: "Develop Critical Thinking"
  },
  "about.obj4.description": {
    fr: "Renforcer la capacité d'analyse et de résolution de problèmes complexes à travers des défis variés.",
    en: "Strengthen the ability to analyze and solve complex problems through varied challenges."
  },

  // Program section translations
  "program": {
    fr: "Programme",
    en: "Program"
  },
  "program.title": {
    fr: "Détails du Programme",
    en: "Program Details"
  },
  "program.subtitle": {
    fr: "Un programme soigneusement conçu pour offrir un équilibre parfait entre théorie, pratique et interaction sociale, dans un environnement favorisant l'apprentissage.",
    en: "A carefully designed program offering a perfect balance between theory, practice, and social interaction in an environment conducive to learning."
  },
  "program.session.math": {
    fr: "Session Mathématiques",
    en: "Mathematics Session"
  },
  "program.session.programming": {
    fr: "Session Programmation",
    en: "Programming Session"
  },
  "program.session.math.description": {
    fr: "Pendant cette session, les participants exploreront une variété de thèmes mathématiques à travers des activités engageantes et stimulantes.",
    en: "During this session, participants will explore a variety of mathematical topics through engaging and stimulating activities."
  },
  "program.session.programming.description": {
    fr: "Pendant cette session, les participants découvriront les bases de l'algorithmique et de la programmation à travers des activités ludiques, des jeux, des ateliers de codage et des projets concrets. L'approche pédagogique est progressive, favorisant l'apprentissage actif et la créativité.",
    en: "During this session, participants will discover the basics of algorithms and programming through fun activities, games, coding workshops, and concrete projects. The pedagogical approach is progressive, promoting active learning and creativity."
  },
  "program.themes": {
    fr: "Thèmes abordés :",
    en: "Topics covered:"
  },
  "program.session.math.theme1": {
    fr: "Algèbre et structures algébriques",
    en: "Algebra and algebraic structures"
  },
  "program.session.math.theme2": {
    fr: "Analyse mathématique",
    en: "Mathematical analysis"
  },
  "program.session.math.theme3": {
    fr: "Géométrie avancée",
    en: "Advanced geometry"
  },
  "program.session.math.theme4": {
    fr: "Théorie des nombres",
    en: "Number theory"
  },
  "program.session.programming.theme1": {
    fr: "Algorithmique de base : raisonnement logique, étapes de résolution, pseudocode",
    en: "Basic algorithms: logical reasoning, resolution steps, pseudocode"
  },
  "program.session.programming.theme2": {
    fr: "Initiation à Python : premières instructions, variables, types, opérateurs",
    en: "Introduction to Python: first instructions, variables, types, operators"
  },
  "program.session.programming.theme3": {
    fr: "Structures de contrôle : conditions, boucles, logique de décision",
    en: "Control structures: conditions, loops, decision logic"
  },
  "program.session.programming.theme4": {
    fr: "Fonctions et données : définition de fonctions, listes, dictionnaires",
    en: "Functions and data: function definition, lists, dictionaries"
  },
  "program.session.programming.theme5": {
    fr: "Création de projets : réalisation en équipe d'un projet simple, présentation orale",
    en: "Project creation: team implementation of a simple project, oral presentation"
  },
  "program.activities.workshops": {
    fr: "Ateliers pratiques",
    en: "Practical workshops"
  },
  "program.activities.workshops.time": {
    fr: "9h - 12h",
    en: "9 AM - 12 PM"
  },
  "program.activities.workshops.description": {
    fr: "Sessions interactives pour approfondir des concepts mathématiques avancés à travers des exercices pratiques.",
    en: "Interactive sessions to explore advanced mathematical concepts through practical exercises."
  },
  "program.activities.lectures": {
    fr: "Conférences d'experts",
    en: "Expert lectures"
  },
  "program.activities.lectures.time": {
    fr: "14h - 16h",
    en: "2 PM - 4 PM"
  },
  "program.activities.lectures.description": {
    fr: "Présentations par des professionnels reconnus dans le domaine des mathématiques et des sciences.",
    en: "Presentations by recognized professionals in the field of mathematics and science."
  },
  "program.activities.mentoring": {
    fr: "Sessions de mentorat",
    en: "Mentoring sessions"
  },
  "program.activities.mentoring.time": {
    fr: "16h - 17h30",
    en: "4 PM - 5:30 PM"
  },
  "program.activities.mentoring.description": {
    fr: "Coaching personnalisé en petits groupes pour répondre aux questions et approfondir des sujets spécifiques.",
    en: "Personalized coaching in small groups to answer questions and explore specific topics in depth."
  },
  "program.activities.competitions": {
    fr: "Compétitions mathématiques",
    en: "Mathematical competitions"
  },
  "program.activities.competitions.time": {
    fr: "18h - 20h",
    en: "6 PM - 8 PM"
  },
  "program.activities.competitions.description": {
    fr: "Défis et tournois pour stimuler l'émulation et l'esprit d'équipe entre les participants.",
    en: "Challenges and tournaments to stimulate emulation and team spirit among participants."
  },
  "program.specially.designed": {
    fr: "Un camp spécialement conçu pour les passionnés de mathématiques",
    en: "A camp specially designed for mathematics enthusiasts"
  },
  "program.stats.days": {
    fr: "Jours d'immersion",
    en: "Days of immersion"
  },
  "program.stats.workshops": {
    fr: "Ateliers interactifs",
    en: "Interactive workshops"
  },
  "program.stats.experts": {
    fr: "Experts reconnus",
    en: "Recognized experts"
  },
  "program.stats.participants": {
    fr: "Participants attendus",
    en: "Expected participants"
  },
  
  // Gallery section
  "gallery": {
    fr: "Galerie",
    en: "Gallery"
  },
  "gallery.title": {
    fr: "Retours d'Expérience",
    en: "Experience Feedback"
  },
  "gallery.subtitle": {
    fr: "Découvrez les moments forts des éditions précédentes et les témoignages de nos participants, intervenants et partenaires.",
    en: "Discover the highlights of previous editions and testimonials from our participants, speakers, and partners."
  },
  "gallery.photos": {
    fr: "Photos",
    en: "Photos"
  },
  "gallery.testimonials": {
    fr: "Témoignages",
    en: "Testimonials"
  },
  "gallery.image.alt": {
    fr: "Image du camp {index}",
    en: "Camp image {index}"
  },
  "gallery.preview": {
    fr: "Aperçu de la galerie",
    en: "Gallery preview"
  },
  "gallery.testimonial1.quote": {
    fr: "Le camp de mathématiques a été pour moi une expérience nouvelle et géniale. D'abord accueillis par nos facilitateurs dans une ambiance chaleureuse, nous avons été bien entretenus et bien nourris tout au long de notre séjour à comé à l'occasion du camp. Ce camp m'a personnellement fait gagner beaucoup en connaissances et m'a surtout fait aimer encore plus cette matière qui constitue la bête noire pour nous les apprenants : la mathématique.",
    en: "The mathematics camp was a new and great experience for me. First welcomed by our facilitators in a warm atmosphere, we were well maintained and well fed throughout our stay in Comé for the camp. This camp personally helped me gain a lot of knowledge and made me love even more this subject which is the black beast for us learners: mathematics."
  },
  "gallery.testimonial1.author": {
    fr: "Merveille ADEYANDJOU, Collines, CEG1 Savè",
    en: "Merveille ADEYANDJOU, Collines, CEG1 Savè"
  },
  "gallery.testimonial2.quote": {
    fr: "Je crois que l'objectif de susciter l'amour des Mathématiques chez les enfants à travers les jeux a été un franc succès et c'est vérifiable à travers l'enthousiasme et le degré de participation et les interventions des élèves. Personnellement, n'ayant pas l'habitude des camps, j'ai été agréablement surpris par les activités et la manière dont nous les avons déroulées.",
    en: "I believe that the objective of arousing love for Mathematics in children through games has been a great success and it is verifiable through the enthusiasm and degree of participation and interventions of the students. Personally, not being used to camps, I was pleasantly surprised by the activities and the way we conducted them."
  },
  "gallery.testimonial2.author": {
    fr: "Koffi Benjamin AGBENAGLO, Togo",
    en: "Koffi Benjamin AGBENAGLO, Togo"
  },
  "gallery.testimonial3.quote": {
    fr: "Je voudrais une fois encore remercier tous les organisateurs et les facilitateurs du camp de maths Comé 2024. Que Dieu vous bénisse et vous aide à rendre l'initiative durable.",
    en: "I would like to once again thank all the organizers and facilitators of the Comé 2024 math camp. May God bless you and help you make the initiative sustainable."
  },
  "gallery.testimonial3.author": {
    fr: "Magloire EDEY, Parent",
    en: "Magloire EDEY, Parent"
  },

  // Budget section
  "budget": {
    fr: "Financement",
    en: "Funding"
  },
  "budget.title": {
    fr: "Contribuez à l'Éducation",
    en: "Support Education"
  },
  "budget.description": {
    fr: "Votre soutien permet d'offrir une formation mathématique avancée à des jeunes talents qui n'auraient pas accès à ces concepts dans leur cursus habituel. Chaque contribution compte, quelle que soit sa taille.",
    en: "Your support allows us to provide advanced mathematical training to young talents who would not have access to these concepts in their regular curriculum. Every contribution counts, regardless of its size."
  },
  "budget.total": {
    fr: "Budget total",
    en: "Total Budget"
  },
  "budget.distribution": {
    fr: "Répartition des fonds nécessaires pour l'organisation du Summer Maths Camp - Édition II.",
    en: "Distribution of funds needed for organizing the Summer Maths Camp - Edition II."
  },
  "budget.free": {
    fr: "100% des élèves participants sont boursiers et n'ont aucun frais d'inscription à payer.",
    en: "100% of participating students are scholarship recipients and have no registration fees to pay."
  },
  "budget.accommodation": {
    fr: "Hébergement",
    en: "Accommodation"
  },
  "budget.food": {
    fr: "Restauration",
    en: "Food"
  },
  "budget.transport": {
    fr: "Déplacement",
    en: "Transportation"
  },
  "budget.materials": {
    fr: "Outils & Matériel",
    en: "Tools & Materials"
  },
  "budget.prints": {
    fr: "Supports & Attestations",
    en: "Supplies & Certificates"
  },
  "budget.badges": {
    fr: "Badges",
    en: "Badges"
  },
  "budget.media": {
    fr: "Médiatisation",
    en: "Media Coverage"
  },
  "budget.healthcare": {
    fr: "Soins & Internet",
    en: "Healthcare & Internet"
  },
  "budget.breakdown.title": {
    fr: "Détail du Budget",
    en: "Budget Breakdown"
  },
  "budget.breakdown.description": {
    fr: "Découvrez la répartition complète du budget pour le Summer Maths Camp 2025, destiné à offrir une expérience éducative de qualité à 120 participants.",
    en: "Discover the complete budget breakdown for the 2025 Summer Maths Camp, designed to provide a quality educational experience to 120 participants."
  },
  "budget.category": {
    fr: "Catégorie",
    en: "Category"
  },
  "budget.total.row": {
    fr: "Total général",
    en: "Grand Total"
  },
  "budget.support.title": {
    fr: "Soutenez les Talents Mathématiques",
    en: "Support Mathematical Talents"
  },
  "budget.contribution": {
    fr: "Votre contribution, quelle que soit son montant, permet de transformer la vie d'un jeune talent en lui donnant accès à une éducation mathématique de qualité, totalement gratuite. Aucun frais d'inscription n'est demandé aux participants, seul le transport est à leur charge.",
    en: "Your contribution, regardless of the amount, transforms the life of a young talent by providing access to quality mathematical education, completely free. No registration fees are required from participants; they only cover their transportation."
  },
  "budget.custom.amount": {
    fr: "Montant personnalisé (€)",
    en: "Custom amount (€)"
  },
  "budget.enter.amount": {
    fr: "Entrez votre montant",
    en: "Enter your amount"
  },
  "budget.donate": {
    fr: "Faire un don",
    en: "Donate"
  },
  "budget.donation.note": {
    fr: "100% de votre don est utilisé pour soutenir des élèves talentueux. Transaction sécurisée et confidentielle. Ce programme est entièrement non lucratif. Vous recevrez un reçu par email.",
    en: "100% of your donation is used to support talented students. Secure and confidential transaction. This program is entirely non-profit. You will receive a receipt by email."
  },
  "budget.business.advantages": {
    fr: "Avantages pour les Partenaires Entreprises",
    en: "Benefits for Business Partners"
  },
  "budget.business.description": {
    fr: "Les entreprises qui contribuent bénéficient d'une visibilité sur nos supports de communication, de la mention de leur soutien lors des événements, et d'interactions avec les participants.",
    en: "Contributing companies benefit from visibility on our communication materials, mention of their support during events, and interactions with participants."
  },
  "budget.contact.us": {
    fr: "Contactez-nous pour un partenariat entreprise",
    en: "Contact us for a business partnership"
  },

  // Contact section
  "contact": {
    fr: "Contact",
    en: "Contact"
  },
  "contact.title": {
    fr: "Intéressé(e) ?",
    en: "Interested?"
  },
  "contact.subtitle": {
    fr: "Que vous soyez un futur participant, un parent, un intervenant potentiel ou un partenaire, nous serons ravis d'échanger avec vous sur le Summer Maths Camp.",
    en: "Whether you are a future participant, a parent, a potential speaker, or a partner, we would be delighted to discuss the Summer Maths Camp with you."
  },
  "contact.fullname": {
    fr: "Nom complet",
    en: "Full name"
  },
  "contact.your.name": {
    fr: "Votre nom",
    en: "Your name"
  },
  "contact.email": {
    fr: "Email",
    en: "Email"
  },
  "contact.email.placeholder": {
    fr: "votre.email@exemple.com",
    en: "your.email@example.com"
  },
  "contact.phone": {
    fr: "Téléphone",
    en: "Phone"
  },
  "contact.phone.placeholder": {
    fr: "0140642494",
    en: "0140642494"
  },
  "contact.interested.as": {
    fr: "Je suis intéressé(e) en tant que :",
    en: "I am interested as a:"
  },
  "contact.participant": {
    fr: "Participant",
    en: "Participant"
  },
  "contact.parent": {
    fr: "Parent",
    en: "Parent"
  },
  "contact.speaker": {
    fr: "Intervenant",
    en: "Speaker"
  },
  "contact.partner": {
    fr: "Partenaire",
    en: "Partner"
  },
  "contact.message": {
    fr: "Message",
    en: "Message"
  },
  "contact.message.placeholder": {
    fr: "Votre message ou question...",
    en: "Your message or question..."
  },
  "contact.sending": {
    fr: "Envoi en cours...",
    en: "Sending..."
  },
  "contact.send": {
    fr: "Envoyer",
    en: "Send"
  },
  "contact.success": {
    fr: "Votre message a été envoyé avec succès !",
    en: "Your message has been successfully sent!"
  },
  "contact.error": {
    fr: "Impossible d'envoyer le message. Veuillez réessayer plus tard.",
    en: "Unable to send message. Please try again later."
  },
  "contact.info.title": {
    fr: "Informations de contact",
    en: "Contact Information"
  },
  "contact.info.description": {
    fr: "N'hésitez pas à nous contacter directement pour toute question concernant le Summer Maths Camp - Édition II.",
    en: "Feel free to contact us directly with any questions about the Summer Maths Camp - Edition II."
  },
  "contact.phone.label": {
    fr: "Téléphone",
    en: "Phone"
  },
  "contact.email.label": {
    fr: "Email",
    en: "Email"
  },
  "contact.faq.title": {
    fr: "Foire Aux Questions",
    en: "Frequently Asked Questions"
  },
  "contact.faq1.question": {
    fr: "Comment s'inscrire au Summer Maths Camp ?",
    en: "How to register for the Summer Maths Camp?"
  },
  "contact.faq1.answer": {
    fr: "Les inscriptions se font via le formulaire en ligne. Une fois votre candidature soumise, notre équipe l'examinera et vous contactera pour la suite du processus.",
    en: "Registration is done through the online form. Once your application is submitted, our team will review it and contact you for the next steps."
  },
  "contact.faq2.question": {
    fr: "Quelles sont les conditions d'éligibilité pour une bourse ?",
    en: "What are the eligibility conditions for a scholarship?"
  },
  "contact.faq2.answer": {
    fr: "Les bourses sont attribuées sur critères sociaux et de mérite. Vous pouvez soumettre une demande lors de votre inscription et fournir les justificatifs nécessaires.",
    en: "Scholarships are awarded based on social criteria and merit. You can submit a request during registration and provide the necessary supporting documents."
  },
  "contact.faq3.question": {
    fr: "Les repas et l'hébergement sont-ils inclus ?",
    en: "Are meals and accommodation included?"
  },
  "contact.faq3.answer": {
    fr: "Oui, tous les repas et l'hébergement sont inclus dans les frais d'inscription. Des options spéciales sont disponibles pour les régimes alimentaires particuliers.",
    en: "Yes, all meals and accommodation are included in the registration fees. Special options are available for particular dietary requirements."
  },

  // Footer
  "footer.description": {
    fr: "Un programme intensif pour les jeunes passionnés de mathématiques, offrant une expérience d'apprentissage immersive et stimulante.",
    en: "An intensive program for young math enthusiasts, offering an immersive and stimulating learning experience."
  },
  "footer.rights": {
    fr: "Tous droits réservés.",
    en: "All rights reserved."
  },

  // Navigation
  "nav.about": {
    fr: "À propos",
    en: "About"
  },
  "nav.program": {
    fr: "Programme",
    en: "Program"
  },
  "nav.gallery": {
    fr: "Galerie",
    en: "Gallery"
  },
  "nav.budget": {
    fr: "Budget",
    en: "Budget"
  },
  "nav.contact": {
    fr: "Contact",
    en: "Contact"
  },
  "register": {
    fr: "S'inscrire",
    en: "Register"
  },
  
  // 404 Page
  "404.title": {
    fr: "Oups! La page que vous recherchez semble avoir disparu dans l'univers des mathématiques.",
    en: "Oops! The page you're looking for seems to have disappeared into the mathematical universe."
  },
  "404.button": {
    fr: "Retour à l'accueil",
    en: "Back to Home"
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  toggleLanguage: () => {},
  setLanguage: () => {}, // Add this line
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const t = (key: string, data?: Record<string, any>): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    let text = translations[key][language];
    
    // Replace placeholders with actual data if provided
    if (data) {
      Object.entries(data).forEach(([placeholder, value]) => {
        text = text.replace(`{${placeholder}}`, String(value));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
