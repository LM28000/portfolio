# Portfolio Personnel - Application Web Full Stack

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)

> Portfolio personnel moderne et interactif construit avec React, TypeScript et Vite, incluant un système d'administration complet.

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Déploiement](#-déploiement)
- [Structure du projet](#-structure-du-projet)
- [Documentation](#-documentation)
- [Contribution](#-contribution)
- [License](#-license)

## 🎯 Aperçu

Ce projet est une application web complète de portfolio personnel offrant une expérience utilisateur moderne et réactive. Il comprend :
- Un portfolio public avec présentation personnelle, expériences, compétences, projets et certifications
- Un système d'administration protégé pour gérer le contenu
- Support multilingue (Français/Anglais)
- Mode sombre/clair
- Intégration avec EmailJS, Google Analytics, et Calendly
- Système de notes et de todos personnels
- Visualisation de CV en PDF
- Génération de QR codes

## ✨ Fonctionnalités

### Portfolio Public
- 🏠 **Page d'accueil** : Présentation avec hero section animée
- 👤 **À propos** : Présentation personnelle et statistiques
- 📅 **Timeline** : Parcours professionnel et éducatif
- 💼 **Expériences** : Détail des expériences professionnelles
- 🛠️ **Compétences** : Graphiques interactifs des compétences techniques
- 🎓 **Certifications** : Liste des certifications obtenues
- 🚀 **Projets** : Showcase des projets réalisés
- 🎨 **Centres d'intérêts** : Hobbies et activités
- 📝 **Notes** : Système de prise de notes personnel
- ✅ **Todo List** : Gestionnaire de tâches
- 📞 **Contact** : Formulaire de contact avec EmailJS et widget Calendly

### Panneau d'administration
- 🔐 **Authentification** : Système de connexion sécurisé
- 📄 **Gestion de fichiers** : Upload, prévisualisation et téléchargement de CV
- 🔍 **Filtres avancés** : Filtrage des fichiers par nom, type, date
- 👁️ **Prévisualisation PDF** : Visionneuse PDF intégrée avec zoom et navigation

### Fonctionnalités techniques
- 🌐 **Multilingue** : Support FR/EN avec contexte React
- 🎨 **Thème dynamique** : Mode clair/sombre avec persistance
- 📱 **Responsive Design** : Optimisé pour tous les appareils
- 📊 **Analytics** : Intégration Google Analytics
- 🎨 **Animations** : Animations fluides avec CSS et React
- 📈 **Diagrammes** : Visualisations avec Mermaid.js
- 🔄 **PWA Ready** : Service Worker pour fonctionnement hors ligne

## 🛠️ Technologies

### Frontend
- **React 18.3.1** - Framework UI
- **TypeScript 5.5.3** - Typage statique
- **Vite 5.4.2** - Build tool ultra-rapide
- **TailwindCSS 3.4.1** - Framework CSS utility-first
- **React Router DOM 7.9.5** - Routing
- **Lucide React** - Icônes modernes

### Librairies & Intégrations
- **EmailJS** - Envoi d'emails depuis le frontend
- **PDF.js** - Visualisation de PDF
- **Mermaid.js** - Génération de diagrammes
- **QRCode.js** - Génération de QR codes
- **Supabase** - Backend as a Service (optionnel)
- **Google Analytics** - Tracking et analytics

### Backend & Infrastructure
- **Node.js** - Serveur API (api-server)
- **PHP** - API de gestion de fichiers (api)
- **Docker** - Containerisation
- **Nginx** - Serveur web et reverse proxy
- **Docker Compose** - Orchestration des conteneurs

## 📦 Installation

### Prérequis
- Node.js >= 18.x
- npm ou yarn
- Docker et Docker Compose (pour déploiement)

### Installation locale

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/portfolio.git
cd portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Créer le fichier de configuration**
```bash
cp .env.example .env
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Administration
VITE_ADMIN_TOKEN=votre-token-securise

# EmailJS (optionnel)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Supabase (optionnel)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Configuration détaillée

Consultez les guides de configuration spécifiques :
- [Configuration EmailJS](EMAILJS_SETUP.md)
- [Configuration Google Analytics](GOOGLE_ANALYTICS_SETUP.md)
- [Configuration Portainer](PORTAINER_SETUP.md)
- [Variables Portainer](PORTAINER_VARIABLES.md)

## 🚀 Utilisation

### Commandes disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de dev avec hot reload

# Build
npm run build        # Compile pour la production

# Preview
npm run preview      # Prévisualise le build de production

# Linting
npm run lint         # Vérifie le code avec ESLint
```

### Accès à l'administration

1. Naviguez vers `/admin`
2. Connectez-vous avec votre token d'administration
3. Gérez vos fichiers CV et contenu

## 🐳 Déploiement

### Déploiement avec Docker

#### Développement
```bash
docker-compose up -d
```

#### Production
```bash
docker-compose -f docker-compose.production.yml up -d
```

### Déploiement avec Portainer

Consultez les guides détaillés :
- [Guide de déploiement](DEPLOYMENT_ADMIN.md)
- [Configuration Portainer](PORTAINER_SETUP.md)
- [Import dans Portainer](PORTAINER_IMPORT.md)

### Plateformes supportées

Le projet peut être déployé sur :
- **Vercel** - Recommandé pour le frontend
- **Netlify** - Alternative frontend
- **Docker/Portainer** - Déploiement complet
- **VPS** - Déploiement personnalisé avec Nginx

## 📁 Structure du projet

```
portfolio/
├── src/
│   ├── admin/              # Composants d'administration
│   │   ├── AdminAuth.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── CustomPDFViewer.tsx
│   ├── components/         # Composants React
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   └── ...
│   ├── contexts/           # Contextes React
│   │   ├── LanguageContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── AdminContext.tsx
│   ├── hooks/              # Hooks personnalisés
│   │   ├── useScrollAnimation.ts
│   │   └── useIntersectionObserver.ts
│   ├── pages/              # Pages de l'application
│   ├── services/           # Services & API
│   ├── types/              # Types TypeScript
│   ├── utils/              # Utilitaires
│   ├── App.tsx             # Composant principal
│   └── main.tsx            # Point d'entrée
├── api/                    # API PHP pour fichiers
│   ├── config.php
│   ├── files.php
│   ├── download.php
│   └── preview.php
├── api-server/             # Serveur Node.js (optionnel)
├── public/                 # Assets statiques
├── admin-files/            # Fichiers uploadés (admin)
├── docker-compose.yml      # Configuration Docker
├── Dockerfile              # Image Docker
├── nginx.conf              # Configuration Nginx
├── package.json            # Dépendances npm
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
└── tsconfig.json           # Configuration TypeScript
```

## 📚 Documentation

Documentation complémentaire disponible :

### Administration
- [Guide des filtres admin](ADMIN_FILTERS_GUIDE.md)
- [Visionneuse PDF admin](ADMIN_PDF_VIEWER.md)
- [Guide de prévisualisation](ADMIN_PREVIEW_GUIDE.md)
- [Dépannage admin](ADMIN_TROUBLESHOOTING.md)
- [Sécurité admin](SECURITY_ADMIN.md)
- [Changelog admin](CHANGELOG_ADMIN.md)

### Déploiement & Configuration
- [Déploiement admin](DEPLOYMENT_ADMIN.md)
- [Configuration Portainer](PORTAINER_SETUP.md)
- [Variables Portainer](PORTAINER_VARIABLES.md)
- [Import Portainer](PORTAINER_IMPORT.md)
- [Guide variables d'environnement](PORTAINER_ENV_GUIDE.md)

### Intégrations
- [Configuration EmailJS](EMAILJS_SETUP.md)
- [Configuration Google Analytics](GOOGLE_ANALYTICS_SETUP.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines

- Suivez les conventions de code existantes
- Ajoutez des tests si applicable
- Mettez à jour la documentation
- Assurez-vous que le linting passe (`npm run lint`)

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Louis-Marie Perret du Cray**

- Portfolio : [Votre URL]
- LinkedIn : [Votre LinkedIn]
- GitHub : [@votre-username](https://github.com/votre-username)

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Mermaid.js](https://mermaid.js.org/)
- Toute la communauté open source

---

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

**Made with ❤️ by Louis-Marie Perret du Cray**
