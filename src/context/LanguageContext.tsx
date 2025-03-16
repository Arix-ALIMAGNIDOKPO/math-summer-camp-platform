import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Hero section
  "dates": {
    fr: "15 - 27 Juillet 2025",
    en: "July 15 - 27, 2025"
  },
  "hero.title": {
    fr: "Maths Summer Camp",
    en: "Maths Summer Camp"
  },
  "hero.subtitle": {
    fr: "Édition II",
    en: "Edition II"
  },
  "hero.description": {
    fr: "Un camp d'été intensif en mathématiques pour les élèves du secondaire qui combine ateliers, compétitions et sessions de mentorat avec des experts reconnus.",
    en: "An intensive mathematics summer camp for high school students combining workshops, competitions, and mentoring sessions with recognized experts."
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
    fr: "Le Maths Summer Camp offre un environnement d'apprentissage exceptionnel où les élèves peuvent explorer des concepts mathématiques avancés sous la direction de professionnels et d'experts reconnus dans le domaine.",
    en: "The Maths Summer Camp offers an exceptional learning environment where students can explore advanced mathematical concepts under the guidance of professionals and recognized experts in the field."
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
  "program.week1": {
    fr: "Semaine 1",
    en: "Week 1"
  },
  "program.week2": {
    fr: "Semaine 2",
    en: "Week 2"
  },
  "program.week1.description": {
    fr: "Pendant cette semaine, les participants exploreront une variété de thèmes mathématiques à travers des activités engageantes et stimulantes.",
    en: "During this week, participants will explore a variety of mathematical topics through engaging and stimulating activities."
  },
  "program.week2.description": {
    fr: "Pendant cette semaine, les participants exploreront une variété de thèmes mathématiques à travers des activités engageantes et stimulantes.",
    en: "During this week, participants will explore a variety of mathematical topics through engaging and stimulating activities."
  },
  "program.themes": {
    fr: "Thèmes abordés :",
    en: "Topics covered:"
  },
  "program.week1.theme1": {
    fr: "Algèbre et structures algébriques",
    en: "Algebra and algebraic structures"
  },
  "program.week1.theme2": {
    fr: "Analyse mathématique",
    en: "Mathematical analysis"
  },
  "program.week1.theme3": {
    fr: "Géométrie avancée",
    en: "Advanced geometry"
  },
  "program.week1.theme4": {
    fr: "Théorie des nombres",
    en: "Number theory"
  },
  "program.week2.theme1": {
    fr: "Statistiques et probabilités",
    en: "Statistics and probability"
  },
  "program.week2.theme2": {
    fr: "Mathématiques discrètes",
    en: "Discrete mathematics"
  },
  "program.week2.theme3": {
    fr: "Applications pratiques",
    en: "Practical applications"
  },
  "program.week2.theme4": {
    fr: "Préparation aux olympiades",
    en: "Olympiad preparation"
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
  "program.stats.weeks": {
    fr: "Semaines d'immersion",
    en: "Weeks of immersion"
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
    fr: "Ce camp a complètement transformé ma vision des mathématiques. J'ai découvert des concepts fascinants et fait des rencontres incroyables.",
    en: "This camp completely transformed my view of mathematics. I discovered fascinating concepts and made incredible connections."
  },
  "gallery.testimonial1.author": {
    fr: "Sophie M., 16 ans, participante 2024",
    en: "Sophie M., 16 years old, 2024 participant"
  },
  "gallery.testimonial2.quote": {
    fr: "En tant qu'intervenant, j'ai été impressionné par la curiosité et le talent des jeunes participants. Une expérience enrichissante pour tous.",
    en: "As a speaker, I was impressed by the curiosity and talent of the young participants. An enriching experience for everyone."
  },
  "gallery.testimonial2.author": {
    fr: "Dr. Alexandre Laurent, Professeur de mathématiques",
    en: "Dr. Alexandre Laurent, Mathematics Professor"
  },
  "gallery.testimonial3.quote": {
    fr: "Mon fils est revenu du camp avec une nouvelle passion pour les mathématiques. Les activités variées et l'encadrement de qualité ont fait toute la différence.",
    en: "My son returned from the camp with a new passion for mathematics. The varied activities and quality supervision made all the difference."
  },
  "gallery.testimonial3.author": {
    fr: "Corinne D., parent d'un participant",
    en: "Corinne D., parent of a participant"
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
    fr: "Répartition des fonds nécessaires pour l'organisation du Maths Summer Camp - Édition II.",
    en: "Distribution of funds needed for organizing the Maths Summer Camp - Edition II."
  },
  "budget.free": {
    fr: "100% des élèves participants sont boursiers et n'ont aucun frais d'inscription à payer.",
    en: "100% of participating students are scholarship recipients and have no registration fees to pay."
  },
  "budget.teaching.materials": {
    fr: "Matériel pédagogique",
    en: "Teaching Materials"
  },
  "budget.honorariums": {
    fr: "Honoraires intervenants",
    en: "Speaker Honorariums"
  },
  "budget.transport": {
    fr: "Transport et hébergement",
    en: "Transport & Accommodation"
  },
  "budget.administration": {
    fr: "Administration",
    en: "Administration"
  },
  "budget.impact.title": {
    fr: "Impact Sur l'Éducation",
    en: "Impact On Education"
  },
  "budget.impact.description": {
    fr: "Notre camp d'été offre un accès entièrement gratuit à une éducation mathématique avancée pour les jeunes talents. Les élèves sélectionnés n'ont à couvrir que leurs frais de transport. Ce programme non lucratif vise à permettre aux étudiants des milieux défavorisés d'accéder à des concepts mathématiques qu'ils n'auraient pas l'opportunité d'explorer dans leur cursus habituel.",
    en: "Our summer camp offers completely free access to advanced mathematical education for young talents. Selected students only need to cover their transportation costs. This non-profit program aims to allow students from disadvantaged backgrounds to access mathematical concepts they would not have the opportunity to explore in their regular curriculum."
  },
  "budget.participants": {
    fr: "Participants",
    en: "Participants"
  },
  "budget.speakers": {
    fr: "Intervenants",
    en: "Speakers"
  },
  "budget.partners": {
    fr: "Partenaires",
    en: "Partners"
  },
  "budget.edition1": {
    fr: "Édition I",
    en: "Edition I"
  },
  "budget.objective": {
    fr: "de l'objectif",
    en: "of target"
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
    fr: "Montant personnalisé ($)",
    en: "Custom amount ($)"
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
  "boys": {
    fr: "Garçons",
    en: "Boys"
  },
  "girls": {
    fr: "Filles",
    en: "Girls"
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
    fr: "Que vous soyez un futur participant, un parent, un intervenant potentiel ou un partenaire, nous serons ravis d'échanger avec vous sur le Maths Summer Camp.",
    en: "Whether you are a future participant, a parent, a potential speaker, or a partner, we would be delighted to discuss the Maths Summer Camp with you."
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
    fr: "+33 6 12 34 56 78",
    en: "+33 6 12 34 56 78"
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
  "contact.info.title": {
    fr: "Informations de contact",
    en: "Contact Information"
  },
  "contact.info.description": {
    fr: "N'hésitez pas à nous contacter directement pour toute question concernant le Maths Summer Camp - Édition II.",
    en: "Feel free to contact us directly with any questions about the Maths Summer Camp - Edition II."
  },
  "contact.phone.label": {
    fr: "Téléphone",
    en: "Phone"
  },
  "contact.email.label": {
    fr: "Email",
    en: "Email"
  },
  "contact.address.label": {
    fr: "Adresse",
    en: "Address"
  },
  "contact.faq.title": {
    fr: "Foire Aux Questions",
    en: "Frequently Asked Questions"
  },
  "contact.faq1.question": {
    fr: "Comment s'inscrire au Maths Summer Camp ?",
    en: "How to register for the Maths Summer Camp?"
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
  "nav.register": {
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
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fr' ? 'en' : 'fr'));
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
