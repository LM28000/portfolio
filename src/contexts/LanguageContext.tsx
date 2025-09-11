import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.experience': 'Expérience',
    'nav.education': 'Formation',
    'nav.skills': 'Compétences',
    'nav.projects': 'Projets',
    'nav.interests': 'Centres d\'intérêt',
    'nav.contact': 'Contact',

    // Hero section
    'hero.subtitle': 'Alternant Agentic & RSE chez',
    'hero.description': 'Étudiant en ingénierie logicielle & IA à l\'ESILV',
    'hero.location': 'Levallois-Perret/Nantes, France',
    'hero.phone': '+33 6 19 86 22 97',
    'hero.email': 'louis-marie.perret_du_cray@edu.devinci.fr',
    'hero.linkedin': 'LinkedIn',
    'hero.scrollDown': 'Découvrir mon parcours',

    // About section
    'about.title': 'À propos de moi',
    'about.intro': 'Passionné par la technologie et l\'innovation, je combine expertise technique et conscience environnementale',
    'about.profile.title': 'Profil',
    'about.profile.description': 'Étudiant ingénieur en 3ème année à l\'ESILV, spécialisé en Ingénierie Logicielle & IA. En alternance chez Devoteam depuis 2025, je travaille sur des projets d\'intelligence artificielle et de responsabilité sociétale des entreprises.',
    'about.mission.title': 'Mission',
    'about.mission.description': 'Contribuer au développement de solutions technologiques innovantes tout en intégrant les enjeux du développement durable et de la RSE dans chaque projet.',
    'about.passions.title': 'Passions',
    'about.passions.description': 'Musicien accompli (violon, alto, piano, guitare), pratiquant de sports nautiques, et engagé dans le scoutisme. Passionné par la finance et les cryptomonnaies.',
    'about.stats.apprenticeship': 'Début alternance',
    'about.stats.graduation': 'Diplôme ingénieur',
    'about.stats.english': 'Niveau anglais',
    'about.stats.license': 'Permis de conduire',

    // Experience section
    'experience.title': 'Expérience professionnelle',
    'experience.devoteam.title': 'Alternant Agentic & RSE',
    'experience.devoteam.company': 'Devoteam',
    'experience.devoteam.period': 'Septembre 2024 - Présent',
    'experience.devoteam.location': 'Paris, France',
    'experience.devoteam.description': 'Développement de solutions d\'intelligence artificielle générative et mise en place de stratégies de responsabilité sociétale des entreprises.',
    'experience.devoteam.location.full': 'Levallois-Perret (92)',
    'experience.devoteam.period.full': '2025 - 2028',
    'experience.devoteam.description.full': 'En alternance dans une entreprise de conseil en transformation digitale',
    'experience.devoteam.mission1': 'AI AgentSpace : aide à la mise en place du service et du support associé',
    'experience.devoteam.mission2': 'AI Agentic : création et support d\'agents',
    'experience.devoteam.mission3': 'RSE : déploiement des processus de maîtrise des émissions CO₂e',
    'experience.devinci.title': 'Développeur commercial',
    'experience.devinci.company': 'DeVinci Junior',
    'experience.devinci.location': 'Nantes (44)',
    'experience.devinci.period': '2024 - 2025',
    'experience.devinci.description': 'Junior-Entreprise de l\'école d\'ingénieurs',
    'experience.devinci.mission1': 'Prospection de nouveaux clients',
    'experience.devinci.mission2': 'Rendez-vous clients et présentation de services',
    'experience.devinci.mission3': 'Rédaction de devis et propositions commerciales',
    'experience.devinci.mission4': 'Gestion de projets internes',
    'experience.mainMissions': 'Missions principales :',
    'experience.intro': 'Mon parcours professionnel entre innovation technologique et développement commercial',

    // Education section
    'education.title': 'Formation',
    'education.esilv.title': 'Ingénieur en Logiciel & Intelligence Artificielle',
    'education.esilv.school': 'ESILV - École Supérieure d\'Ingénieurs Léonard de Vinci',
    'education.esilv.period': '2022 - 2025',
    'education.esilv.location': 'Paris La Défense, France',
    'education.esilv.description': 'Formation d\'ingénieur spécialisée en développement logiciel et intelligence artificielle avec une approche pratique et innovante.',
    'education.esilv.institution': 'ESILV',
    'education.esilv.degree': 'Cycle ingénieur majeure Ingénierie Logicielle & IA',
    'education.esilv.location.full': 'Nantes (44)',
    'education.esilv.period.full': '2023 - 2028',
    'education.esilv.description.full': 'Formation d\'ingénieur spécialisée en développement logiciel et intelligence artificielle',
    'education.academie.institution': 'Académie musicale de Liesse',
    'education.academie.degree': 'Bac (mention bien) - Mathématiques & N.S.I.',
    'education.academie.location': 'Précigné (72)',
    'education.academie.period': '2020 - 2023',
    'education.academie.description': 'Formation musicale approfondie parallèlement aux études scientifiques',
    'education.baccalaureat.mention': 'Mention Bien au Baccalauréat',
    'education.intro': 'Mon parcours académique alliant formation d\'ingénieur et passion musicale',

    // Skills section
    'skills.title': 'Compétences techniques',
    'skills.programming': 'Langages de programmation',
    'skills.frameworks': 'Frameworks & Bibliothèques',
    'skills.tools': 'Outils & Technologies',
    'skills.ai': 'Intelligence Artificielle',
    'skills.languages.title': 'Langages & Technologies',
    'skills.systems.title': 'Systèmes & Outils',
    'skills.software.title': 'Logiciels & Design',
    'skills.soft.title': 'Soft Skills',
    'skills.languages.items': 'C#, Python, SQL, HTML, CSS, Bash',
    'skills.systems.items': 'Système UNIX, SSH, Docker, VirtualBox, VMware, KVM',
    'skills.software.items': 'Solidworks, Montage vidéo/son, MAO, Outils bureautique',
    'skills.soft.items': 'Coopération en équipe, Design thinking, Connaissance de soi',
    'skills.intro': 'Un aperçu de mes compétences techniques et humaines développées au cours de mon parcours',
    'skills.specializations.title': 'Spécialisations',
    'skills.specializations.items': 'Intelligence Artificielle, Développement durable, RSE',
    'skills.experiences.title': 'Expériences',
    'skills.experiences.items': 'Hackathon, Projets collaboratifs, Management',
    'skills.languages.label': 'Langues',
    'skills.french': 'Français',
    'skills.english': 'Anglais',
    'skills.native': 'Natif',
    'skills.level.b2': 'B2+',

    // Projects section
    'projects.title': 'Projets',
    'projects.viewCode': 'Voir le code',
    'projects.viewDemo': 'Voir la démo',
    'projects.intro': 'Découvrez mes projets personnels et académiques',
    'projects.achievements': 'Réalisations :',
    'projects.technologies': 'Technologies utilisées :',
    'projects.moreProjects': 'Plus de projets à venir',
    'projects.moreProjectsDesc': 'En cours de formation, je développe constamment de nouveaux projets. N\'hésitez pas à me contacter pour en savoir plus sur mes réalisations récentes.',
    'projects.pix.title': 'Projets d\'Imagination et d\'eXploration (PIX)',
    'projects.pix.category': 'Robotique & Innovation',
    'projects.pix.description': 'Projets académiques axés sur l\'innovation et la créativité technique',
    'projects.pix.detail1': 'Conception d\'un robot hexapode',
    'projects.pix.detail2': 'Construction d\'une maquette d\'immeuble résistant aux séismes',
    'projects.multimedia.title': 'Serveur Multimédia Personnel',
    'projects.multimedia.category': 'Infrastructure & Développement',
    'projects.multimedia.description': 'Projet technique de développement et administration système',
    'projects.multimedia.detail1': 'Développement et administration d\'un serveur personnel multimédia sous Debian',
    'projects.multimedia.detail2': 'Configuration des services, sécurisation et optimisation des performances',
    'projects.technologies.mechanics': 'Mécanique',
    'projects.technologies.electronics': 'Électronique',
    'projects.technologies.programming': 'Programmation',
    'projects.technologies.system': 'Administration système',
    'projects.technologies.networks': 'Réseaux',

    // Interests section
    'interests.title': 'Centres d\'intérêt',
    'interests.technology': 'Technologies émergentes',
    'interests.sustainability': 'Développement durable',
    'interests.innovation': 'Innovation & Entrepreneuriat',
    'interests.music': 'Musique & Arts',
    'interests.intro': 'Mes passions qui enrichissent ma vision et complètent mon profil professionnel',
    'interests.music.title': 'Musique',
    'interests.music.description': 'Violon, alto, piano, guitare, orchestre, chant',
    'interests.music.detail': 'Formation musicale approfondie à l\'Académie de Liesse',
    'interests.finance.title': 'Finance & Cryptomonnaie',
    'interests.finance.description': 'Analyse des marchés financiers et technologies blockchain',
    'interests.finance.detail': 'Veille technologique et investissement responsable',
    'interests.sports.title': 'Sports Nautiques',
    'interests.sports.description': 'Voile et aviron',
    'interests.sports.detail': 'Pratique régulière et participation à des compétitions',
    'interests.scouting.title': 'Scoutisme',
    'interests.scouting.description': 'Engagement associatif et développement personnel',
    'interests.scouting.detail': 'Leadership, travail d\'équipe et valeurs humaines',
    'interests.philosophy.title': 'Ma philosophie',
    'interests.philosophy.description': 'Je crois fermement que la diversité des expériences enrichit la perspective professionnelle. Mes passions musicales développent ma créativité, le sport nautique renforce ma persévérance, et mon engagement scout cultive mes valeurs humaines - autant de qualités précieuses dans le monde de l\'ingénierie.',

    // Contact section
    'contact.title': 'Me contacter',
    'contact.subtitle': 'N\'hésitez pas à me contacter pour toute opportunité ou collaboration',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.phone.label': 'Téléphone',
    'contact.email.label': 'Email',
    'contact.location.label': 'Localisation',
    'contact.linkedin.label': 'LinkedIn',
    'contact.coordinates': 'Mes coordonnées',
    'contact.form.title': 'Envoyez-moi un message',
    'contact.form.name.placeholder': 'Votre nom',
    'contact.form.email.placeholder': 'votre@email.com',
    'contact.form.subject': 'Sujet',
    'contact.form.subject.placeholder': 'Sujet de votre message',
    'contact.form.message.placeholder': 'Votre message...',
    'contact.success.title': 'Message envoyé !',
    'contact.success.description': 'Merci pour votre message. Je vous répondrai dans les plus brefs délais.',
    'contact.availability.title': 'Disponibilité',
    'contact.availability.description': 'Actuellement en alternance chez Devoteam. Disponible pour des discussions sur des projets innovants, des collaborations ou des opportunités futures.',
    'contact.form.sending': 'Envoi en cours...',
    'contact.form.error.config': 'Configuration EmailJS manquante. Veuillez contacter l\'administrateur.',
    'contact.form.error.send': 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.',

    // Footer
    'footer.rights': 'Tous droits réservés.',
    'footer.built': 'Conçu avec React & TypeScript',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.interests': 'Interests',
    'nav.contact': 'Contact',

    // Hero section
    'hero.subtitle': 'Agentic & CSR Apprentice at',
    'hero.description': 'Software & AI Engineering Student at ESILV',
    'hero.location': 'Levallois-Perret/Nantes, France',
    'hero.phone': '+33 6 19 86 22 97',
    'hero.email': 'louis-marie.perret_du_cray@edu.devinci.fr',
    'hero.linkedin': 'LinkedIn',
    'hero.scrollDown': 'Discover my journey',

    // About section
    'about.title': 'About me',
    'about.intro': 'Passionate about technology and innovation, I combine technical expertise with environmental awareness',
    'about.profile.title': 'Profile',
    'about.profile.description': '3rd year engineering student at ESILV, specialized in Software Engineering & AI. Apprentice at Devoteam since 2025, I work on artificial intelligence projects and corporate social responsibility.',
    'about.mission.title': 'Mission',
    'about.mission.description': 'Contribute to the development of innovative technological solutions while integrating sustainable development and CSR issues into each project.',
    'about.passions.title': 'Passions',
    'about.passions.description': 'Accomplished musician (violin, viola, piano, guitar), water sports practitioner, and engaged in scouting. Passionate about finance and cryptocurrencies.',
    'about.stats.apprenticeship': 'Start apprenticeship',
    'about.stats.graduation': 'Engineering degree',
    'about.stats.english': 'English level',
    'about.stats.license': 'Driving license',

    // Experience section
    'experience.title': 'Professional Experience',
    'experience.devoteam.title': 'Agentic & CSR Apprentice',
    'experience.devoteam.company': 'Devoteam',
    'experience.devoteam.period': 'September 2024 - Present',
    'experience.devoteam.location': 'Paris, France',
    'experience.devoteam.description': 'Development of generative artificial intelligence solutions and implementation of corporate social responsibility strategies.',
    'experience.devoteam.location.full': 'Levallois-Perret (92)',
    'experience.devoteam.period.full': '2025 - 2028',
    'experience.devoteam.description.full': 'Apprenticeship in a digital transformation consulting company',
    'experience.devoteam.mission1': 'AI AgentSpace: assistance in setting up the service and associated support',
    'experience.devoteam.mission2': 'AI Agentic: creation and support of agents',
    'experience.devoteam.mission3': 'CSR: deployment of CO₂e emission control processes',
    'experience.devinci.title': 'Commercial Developer',
    'experience.devinci.company': 'DeVinci Junior',
    'experience.devinci.location': 'Nantes (44)',
    'experience.devinci.period': '2024 - 2025',
    'experience.devinci.description': 'Junior-Enterprise of the engineering school',
    'experience.devinci.mission1': 'Prospecting new clients',
    'experience.devinci.mission2': 'Client meetings and service presentations',
    'experience.devinci.mission3': 'Writing quotes and commercial proposals',
    'experience.devinci.mission4': 'Internal project management',
    'experience.mainMissions': 'Main missions:',
    'experience.intro': 'My professional journey between technological innovation and commercial development',

    // Education section
    'education.title': 'Education',
    'education.esilv.title': 'Software & Artificial Intelligence Engineer',
    'education.esilv.school': 'ESILV - École Supérieure d\'Ingénieurs Léonard de Vinci',
    'education.esilv.period': '2022 - 2025',
    'education.esilv.location': 'Paris La Défense, France',
    'education.esilv.description': 'Engineering program specialized in software development and artificial intelligence with a practical and innovative approach.',
    'education.esilv.institution': 'ESILV',
    'education.esilv.degree': 'Engineering program major in Software Engineering & AI',
    'education.esilv.location.full': 'Nantes (44)',
    'education.esilv.period.full': '2023 - 2028',
    'education.esilv.description.full': 'Engineering program specialized in software development and artificial intelligence',
    'education.academie.institution': 'Musical Academy of Liesse',
    'education.academie.degree': 'Baccalauréat (honors) - Mathematics & Computer Science',
    'education.academie.location': 'Précigné (72)',
    'education.academie.period': '2020 - 2023',
    'education.academie.description': 'In-depth musical training alongside scientific studies',
    'education.baccalaureat.mention': 'French High School Diploma with Honors (Mention Bien)',
    'education.intro': 'My academic journey combining engineering education and musical passion',

    // Skills section
    'skills.title': 'Technical Skills',
    'skills.programming': 'Programming Languages',
    'skills.frameworks': 'Frameworks & Libraries',
    'skills.tools': 'Tools & Technologies',
    'skills.ai': 'Artificial Intelligence',
    'skills.languages.title': 'Languages & Technologies',
    'skills.systems.title': 'Systems & Tools',
    'skills.software.title': 'Software & Design',
    'skills.soft.title': 'Soft Skills',
    'skills.languages.items': 'C#, Python, SQL, HTML, CSS, Bash',
    'skills.systems.items': 'UNIX System, SSH, Docker, VirtualBox, VMware, KVM',
    'skills.software.items': 'Solidworks, Video/audio editing, DAW, Office tools',
    'skills.soft.items': 'Team cooperation, Design thinking, Self-knowledge',
    'skills.intro': 'An overview of my technical and human skills developed throughout my journey',
    'skills.specializations.title': 'Specializations',
    'skills.specializations.items': 'Artificial Intelligence, Sustainable Development, CSR',
    'skills.experiences.title': 'Experiences',
    'skills.experiences.items': 'Hackathon, Collaborative projects, Management',
    'skills.languages.label': 'Languages',
    'skills.french': 'French',
    'skills.english': 'English',
    'skills.native': 'Native',
    'skills.level.b2': 'B2+',

    // Projects section
    'projects.title': 'Projects',
    'projects.viewCode': 'View Code',
    'projects.viewDemo': 'View Demo',
    'projects.intro': 'Discover my personal and academic projects',
    'projects.achievements': 'Achievements:',
    'projects.technologies': 'Technologies used:',
    'projects.moreProjects': 'More projects coming',
    'projects.moreProjectsDesc': 'Currently in training, I constantly develop new projects. Feel free to contact me to learn more about my recent achievements.',
    'projects.pix.title': 'Imagination and eXploration Projects (PIX)',
    'projects.pix.category': 'Robotics & Innovation',
    'projects.pix.description': 'Academic projects focused on innovation and technical creativity',
    'projects.pix.detail1': 'Design of a hexapod robot',
    'projects.pix.detail2': 'Construction of an earthquake-resistant building model',
    'projects.multimedia.title': 'Personal Multimedia Server',
    'projects.multimedia.category': 'Infrastructure & Development',
    'projects.multimedia.description': 'Technical project for development and system administration',
    'projects.multimedia.detail1': 'Development and administration of a personal multimedia server under Debian',
    'projects.multimedia.detail2': 'Service configuration, security and performance optimization',
    'projects.technologies.mechanics': 'Mechanics',
    'projects.technologies.electronics': 'Electronics',
    'projects.technologies.programming': 'Programming',
    'projects.technologies.system': 'System administration',
    'projects.technologies.networks': 'Networks',

    // Interests section
    'interests.title': 'Interests',
    'interests.technology': 'Emerging Technologies',
    'interests.sustainability': 'Sustainable Development',
    'interests.innovation': 'Innovation & Entrepreneurship',
    'interests.music': 'Music & Arts',
    'interests.intro': 'My passions that enrich my vision and complement my professional profile',
    'interests.music.title': 'Music',
    'interests.music.description': 'Violin, viola, piano, guitar, orchestra, singing',
    'interests.music.detail': 'In-depth musical training at the Academy of Liesse',
    'interests.finance.title': 'Finance & Cryptocurrency',
    'interests.finance.description': 'Financial market analysis and blockchain technologies',
    'interests.finance.detail': 'Technology watch and responsible investment',
    'interests.sports.title': 'Water Sports',
    'interests.sports.description': 'Sailing and rowing',
    'interests.sports.detail': 'Regular practice and competition participation',
    'interests.scouting.title': 'Scouting',
    'interests.scouting.description': 'Community engagement and personal development',
    'interests.scouting.detail': 'Leadership, teamwork and human values',
    'interests.philosophy.title': 'My philosophy',
    'interests.philosophy.description': 'I firmly believe that diversity of experiences enriches professional perspective. My musical passions develop my creativity, water sports strengthen my perseverance, and my scout commitment cultivates my human values - all precious qualities in the engineering world.',

    // Contact section
    'contact.title': 'Contact me',
    'contact.subtitle': 'Feel free to contact me for any opportunity or collaboration',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.phone.label': 'Phone',
    'contact.email.label': 'Email',
    'contact.location.label': 'Location',
    'contact.linkedin.label': 'LinkedIn',
    'contact.coordinates': 'My contact details',
    'contact.form.title': 'Send me a message',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subject.placeholder': 'Subject of your message',
    'contact.form.message.placeholder': 'Your message...',
    'contact.success.title': 'Message sent!',
    'contact.success.description': 'Thank you for your message. I will reply as soon as possible.',
    'contact.availability.title': 'Availability',
    'contact.availability.description': 'Currently apprentice at Devoteam. Available for discussions about innovative projects, collaborations or future opportunities.',
    'contact.form.sending': 'Sending...',
    'contact.form.error.config': 'EmailJS configuration missing. Please contact the administrator.',
    'contact.form.error.send': 'An error occurred while sending the message. Please try again.',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.built': 'Built with React & TypeScript',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};