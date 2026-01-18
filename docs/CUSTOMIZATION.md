# Guide de Personnalisation

Ce guide vous aide à personnaliser le portfolio pour qu'il reflète votre identité unique.

## 📋 Table des matières

- [Informations personnelles](#informations-personnelles)
- [Contenu](#contenu)
- [Styles et couleurs](#styles-et-couleurs)
- [Images et médias](#images-et-médias)
- [Fonctionnalités](#fonctionnalités)
- [Intégrations](#intégrations)

---

## 👤 Informations personnelles

### 1. Section Hero

**Fichier** : `src/components/Hero.tsx`

```typescript
// Modifiez ces valeurs
const name = "Votre Nom";
const title = "Votre Titre Professionnel";
const description = "Votre description courte";
const ctaText = "Texte du bouton";
```

**Exemple** :
```typescript
const name = "Jean Dupont";
const title = "Développeur Full Stack";
const description = "Passionné par la création d'applications web modernes";
const ctaText = "Voir mes projets";
```

### 2. Section À propos

**Fichier** : `src/components/About.tsx`

Modifiez :
- Votre bio complète
- Vos statistiques (années d'expérience, projets, etc.)
- Vos compétences clés
- Votre localisation

```typescript
const bio = `
  Écrivez votre biographie complète ici.
  Parlez de votre parcours, vos passions, vos objectifs.
`;

const stats = [
  { label: 'Années d\'expérience', value: '5+' },
  { label: 'Projets réalisés', value: '50+' },
  { label: 'Clients satisfaits', value: '30+' },
];
```

### 3. Coordonnées

**Fichier** : `src/components/Contact.tsx`

```typescript
const contactInfo = {
  email: 'votre.email@example.com',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  linkedin: 'https://linkedin.com/in/votre-profil',
  github: 'https://github.com/votre-username',
};
```

---

## 📝 Contenu

### 1. Expériences professionnelles

**Fichier** : `src/data/experiences.ts`

```typescript
export const experiences = [
  {
    id: 1,
    title: 'Titre du poste',
    company: 'Nom de l\'entreprise',
    location: 'Ville, Pays',
    period: 'Date début - Date fin',
    description: 'Description de vos responsabilités et réalisations',
    technologies: ['Tech1', 'Tech2', 'Tech3'],
    achievements: [
      'Réalisation importante 1',
      'Réalisation importante 2',
    ],
  },
  // Ajoutez autant d'expériences que nécessaire
];
```

### 2. Projets

**Fichier** : `src/data/projects.ts`

```typescript
export const projects = [
  {
    id: 1,
    title: 'Nom du projet',
    description: 'Description courte du projet',
    longDescription: 'Description détaillée',
    image: '/images/projects/project1.jpg',
    technologies: ['React', 'Node.js', 'MongoDB'],
    github: 'https://github.com/username/project',
    demo: 'https://project-demo.com',
    features: [
      'Fonctionnalité 1',
      'Fonctionnalité 2',
    ],
    category: 'Web App', // ou 'Mobile', 'Desktop', etc.
  },
  // Ajoutez tous vos projets
];
```

### 3. Compétences

**Fichier** : `src/data/skills.ts`

```typescript
export const skills = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', level: 90, icon: 'react' },
      { name: 'TypeScript', level: 85, icon: 'typescript' },
      { name: 'TailwindCSS', level: 95, icon: 'tailwindcss' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 80, icon: 'nodejs' },
      { name: 'Python', level: 75, icon: 'python' },
    ],
  },
  // Ajoutez toutes vos catégories de compétences
];
```

### 4. Certifications

**Fichier** : `src/data/certifications.ts`

```typescript
export const certifications = [
  {
    id: 1,
    name: 'Nom de la certification',
    issuer: 'Organisme émetteur',
    date: '2024',
    image: '/images/certifications/cert1.jpg',
    credentialId: 'ID-123456',
    url: 'https://certification-url.com',
  },
  // Ajoutez toutes vos certifications
];
```

### 5. Éducation

**Fichier** : `src/data/education.ts` (à créer si nécessaire)

```typescript
export const education = [
  {
    id: 1,
    degree: 'Master en Informatique',
    school: 'Nom de l\'école',
    location: 'Ville, Pays',
    period: '2018 - 2020',
    description: 'Spécialisation, projets importants',
    achievements: [
      'Mention Très Bien',
      'Prix du meilleur projet',
    ],
  },
];
```

---

## 🎨 Styles et couleurs

### 1. Couleurs principales

**Fichier** : `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Personnalisez votre palette de couleurs
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Couleur principale
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          // Vos couleurs secondaires
        },
      },
    },
  },
};
```

**Générateur de palette** : [Tailwind Color Generator](https://uicolors.app/create)

### 2. Typographie

**Fichier** : `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1' }],
        'display': ['3rem', { lineHeight: '1.2' }],
      },
    },
  },
};
```

**Pour utiliser une nouvelle police** :

1. Ajoutez dans `index.html` :
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
```

2. Utilisez dans vos composants :
```typescript
<h1 className="font-sans text-hero">Titre</h1>
```

### 3. Animations personnalisées

**Fichier** : `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};
```

### 4. Styles personnalisés globaux

**Fichier** : `src/index.css`

```css
@layer components {
  /* Bouton personnalisé */
  .btn-custom {
    @apply px-6 py-3 bg-primary-500 text-white rounded-lg
           hover:bg-primary-600 transition-all duration-300
           shadow-lg hover:shadow-xl;
  }

  /* Carte personnalisée */
  .card-custom {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-md
           p-6 transition-all duration-300
           hover:shadow-lg hover:-translate-y-1;
  }

  /* Gradient de texte */
  .text-gradient {
    @apply bg-gradient-to-r from-primary-500 to-secondary-500
           bg-clip-text text-transparent;
  }
}
```

---

## 🖼️ Images et médias

### 1. Structure des images

```
public/images/
├── profile.jpg           # Votre photo de profil (500x500px recommandé)
├── hero-bg.jpg          # Image de fond hero (1920x1080px)
├── projects/            # Screenshots de projets
│   ├── project1.jpg     (1200x675px recommandé)
│   ├── project2.jpg
│   └── ...
├── certifications/      # Images de certifications
│   ├── cert1.jpg
│   └── ...
└── logos/              # Logos de technologies
    ├── react.svg
    └── ...
```

### 2. Optimisation des images

**Recommandations** :
- Format WebP pour la web
- Compression avec [TinyPNG](https://tinypng.com/)
- Résolution adaptée (pas plus de 2000px de largeur)
- Lazy loading activé par défaut

**Exemple de code** :
```typescript
<img
  src="/images/profile.jpg"
  alt="Votre nom"
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

### 3. Favicon et logo

**Fichier** : `public/favicon.ico`

Créez votre favicon avec :
- [Favicon.io](https://favicon.io/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

**Manifest PWA** : `public/manifest.json`

```json
{
  "name": "Votre Nom - Portfolio",
  "short_name": "Portfolio",
  "description": "Portfolio personnel de Votre Nom",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## ⚙️ Fonctionnalités

### 1. Activer/Désactiver des sections

**Fichier** : `src/Portfolio.tsx` ou `src/App.tsx`

```typescript
const sections = {
  hero: true,
  about: true,
  experience: true,
  projects: true,
  skills: true,
  certifications: true,
  interests: true,      // Désactivez si non nécessaire
  notes: false,         // Section notes personnelles
  todos: false,         // Section todos
  contact: true,
};

// Rendu conditionnel
{sections.interests && <Interests />}
{sections.notes && <Notes />}
```

### 2. Multilingue

**Ajouter une nouvelle langue** :

1. Créez le fichier : `src/translations/es.ts`

```typescript
export const es = {
  nav: {
    home: 'Inicio',
    about: 'Sobre mí',
    projects: 'Proyectos',
    contact: 'Contacto',
  },
  hero: {
    greeting: 'Hola, soy',
    // ... autres traductions
  },
};
```

2. Mettez à jour `LanguageContext.tsx` :

```typescript
type Language = 'fr' | 'en' | 'es';

const translations = {
  fr: frTranslations,
  en: enTranslations,
  es: esTranslations,
};
```

### 3. Mode sombre personnalisé

**Fichier** : `src/index.css`

```css
:root {
  /* Mode clair */
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
}

.dark {
  /* Mode sombre */
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
}

/* Utilisation */
.custom-bg {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}
```

---

## 🔌 Intégrations

### 1. Google Analytics

**Fichier** : `.env`

```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Configuration** : Voir [GOOGLE_ANALYTICS_SETUP.md](../GOOGLE_ANALYTICS_SETUP.md)

### 2. EmailJS (Contact Form)

**Fichier** : `.env`

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

**Configuration** : Voir [EMAILJS_SETUP.md](../EMAILJS_SETUP.md)

### 3. Calendly (Prise de RDV)

**Fichier** : `src/components/CalendlyWidget.tsx`

```typescript
const CalendlyWidget = () => {
  const calendlyUrl = 'https://calendly.com/votre-nom/30min';

  return (
    <button onClick={() => window.open(calendlyUrl, '_blank')}>
      Prendre RDV
    </button>
  );
};
```

### 4. Réseaux sociaux

**Fichier** : `src/components/Footer.tsx`

```typescript
const socialLinks = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/votre-profil', icon: LinkedInIcon },
  { name: 'GitHub', url: 'https://github.com/votre-username', icon: GitHubIcon },
  { name: 'Twitter', url: 'https://twitter.com/votre-handle', icon: TwitterIcon },
  { name: 'Email', url: 'mailto:votre.email@example.com', icon: MailIcon },
];
```

---

## 🎯 Checklist de personnalisation

### Informations essentielles
- [ ] Nom et titre dans Hero
- [ ] Bio dans About
- [ ] Coordonnées dans Contact
- [ ] Photo de profil
- [ ] Expériences professionnelles
- [ ] Projets avec screenshots
- [ ] Compétences et niveaux
- [ ] Éducation

### Style et branding
- [ ] Couleurs principales
- [ ] Logo/Favicon
- [ ] Polices de caractères
- [ ] Animations personnalisées
- [ ] Images optimisées

### Fonctionnalités
- [ ] Sections activées/désactivées
- [ ] Langues supportées
- [ ] Mode sombre configuré
- [ ] Intégrations configurées

### Configuration
- [ ] Variables d'environnement
- [ ] Google Analytics
- [ ] EmailJS
- [ ] Token admin
- [ ] SEO metadata

### Contenu
- [ ] Tous les textes traduits
- [ ] Toutes les images ajoutées
- [ ] Liens vérifiés
- [ ] Informations à jour

---

## 💡 Conseils

### Design
- Gardez une cohérence visuelle
- Utilisez un maximum de 3 couleurs principales
- Testez le contraste (WCAG)
- Optimisez pour mobile first

### Contenu
- Soyez concis et percutant
- Utilisez des verbes d'action
- Quantifiez vos réalisations
- Mettez à jour régulièrement

### Performance
- Optimisez toutes les images
- Limitez les animations
- Testez avec Lighthouse
- Activez la compression

### SEO
- Utilisez des titres descriptifs
- Ajoutez des meta descriptions
- Créez un sitemap
- Optimisez les images (alt text)

---

## 🚀 Après personnalisation

1. **Testez localement** : `npm run dev`
2. **Vérifiez le responsive** : Testez sur différents appareils
3. **Validez le build** : `npm run build`
4. **Déployez** : Suivez [DEPLOYMENT_ADMIN.md](../DEPLOYMENT_ADMIN.md)

---

**Besoin d'aide ?** Consultez la [FAQ](../FAQ.md) ou ouvrez une [issue](https://github.com/USERNAME/REPO/issues).

**Partagez votre portfolio !** Une fois personnalisé, n'hésitez pas à montrer votre travail ! 🎉
