# Index de la Documentation

Bienvenue dans la documentation complète du projet Portfolio. Cette page vous guide vers toutes les ressources disponibles.

## 📚 Documentation Principale

### Pour Commencer
- **[README.md](../README.md)** - Documentation principale du projet
- **[QUICKSTART.md](../QUICKSTART.md)** - Guide de démarrage rapide (5 minutes)
- **[FAQ.md](../FAQ.md)** - Questions fréquemment posées

### Guides de Contribution
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Guide complet de contribution
- **[CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)** - Code de conduite
- **[ROADMAP.md](../ROADMAP.md)** - Feuille de route du projet

### Architecture & Technique
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Architecture complète du projet
- **[CHANGELOG.md](../CHANGELOG.md)** - Historique des changements

### Sécurité & Licence
- **[SECURITY.md](../SECURITY.md)** - Politique de sécurité
- **[LICENSE](../LICENSE)** - Licence MIT

## 🛠️ Documentation Technique

### Configuration & Setup
- **[.env.example](../.env.example)** - Template de variables d'environnement
- **[EMAILJS_SETUP.md](../EMAILJS_SETUP.md)** - Configuration EmailJS
- **[GOOGLE_ANALYTICS_SETUP.md](../GOOGLE_ANALYTICS_SETUP.md)** - Configuration Google Analytics

### Administration
- **[ADMIN_FILTERS_GUIDE.md](../ADMIN_FILTERS_GUIDE.md)** - Guide des filtres admin
- **[ADMIN_PDF_VIEWER.md](../ADMIN_PDF_VIEWER.md)** - Visionneuse PDF
- **[ADMIN_PREVIEW_GUIDE.md](../ADMIN_PREVIEW_GUIDE.md)** - Guide de prévisualisation
- **[ADMIN_TROUBLESHOOTING.md](../ADMIN_TROUBLESHOOTING.md)** - Dépannage admin
- **[SECURITY_ADMIN.md](../SECURITY_ADMIN.md)** - Sécurité admin
- **[CHANGELOG_ADMIN.md](../CHANGELOG_ADMIN.md)** - Changelog admin

### Déploiement
- **[DEPLOYMENT_ADMIN.md](../DEPLOYMENT_ADMIN.md)** - Guide de déploiement
- **[PORTAINER_SETUP.md](../PORTAINER_SETUP.md)** - Configuration Portainer
- **[PORTAINER_IMPORT.md](../PORTAINER_IMPORT.md)** - Import dans Portainer
- **[PORTAINER_VARIABLES.md](../PORTAINER_VARIABLES.md)** - Variables Portainer
- **[PORTAINER_ENV_GUIDE.md](../PORTAINER_ENV_GUIDE.md)** - Guide variables d'environnement

## 🎨 Ressources Design

### Badges & Visuels
- **[BADGES.md](BADGES.md)** - Collection de badges pour README

## 🔧 Configuration Développeur

### VS Code
- **[.vscode/extensions.json](../.vscode/extensions.json)** - Extensions recommandées
- **[.vscode/settings.json](../.vscode/settings.json)** - Configuration VS Code

### Git & GitHub
- **[.gitignore](../.gitignore)** - Fichiers ignorés par Git
- **[.gitattributes](../.gitattributes)** - Attributs Git

### GitHub Templates
- **[.github/ISSUE_TEMPLATE/bug_report.md](../.github/ISSUE_TEMPLATE/bug_report.md)** - Template rapport de bug
- **[.github/ISSUE_TEMPLATE/feature_request.md](../.github/ISSUE_TEMPLATE/feature_request.md)** - Template demande de fonctionnalité
- **[.github/ISSUE_TEMPLATE/question.md](../.github/ISSUE_TEMPLATE/question.md)** - Template question
- **[.github/pull_request_template.md](../.github/pull_request_template.md)** - Template pull request
- **[.github/workflows/ci-cd.yml](../.github/workflows/ci-cd.yml)** - Pipeline CI/CD

## 📖 Guide par Rôle

### 👨‍💻 Développeur

**Je veux commencer à développer** :
1. Lisez [QUICKSTART.md](../QUICKSTART.md)
2. Configurez votre environnement avec [.env.example](../.env.example)
3. Consultez [ARCHITECTURE.md](../ARCHITECTURE.md)

**Je veux contribuer** :
1. Lisez [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Suivez le [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)
3. Consultez la [ROADMAP.md](../ROADMAP.md)

**J'ai un problème** :
1. Consultez [FAQ.md](../FAQ.md)
2. Vérifiez les [issues existantes](https://github.com/USERNAME/REPO/issues)
3. Créez une nouvelle issue avec le template approprié

### 🚀 Déploiement

**Je veux déployer** :
1. Lisez [DEPLOYMENT_ADMIN.md](../DEPLOYMENT_ADMIN.md)
2. Configuration Docker : [docker-compose.yml](../docker-compose.yml)
3. Configuration Portainer : [PORTAINER_SETUP.md](../PORTAINER_SETUP.md)

### 🔐 Administrateur

**Je veux gérer le contenu** :
1. [ADMIN_FILTERS_GUIDE.md](../ADMIN_FILTERS_GUIDE.md)
2. [ADMIN_PDF_VIEWER.md](../ADMIN_PDF_VIEWER.md)
3. [ADMIN_TROUBLESHOOTING.md](../ADMIN_TROUBLESHOOTING.md)

**Je veux sécuriser** :
1. [SECURITY.md](../SECURITY.md)
2. [SECURITY_ADMIN.md](../SECURITY_ADMIN.md)

### 🎨 Designer

**Je veux personnaliser** :
1. Couleurs : [tailwind.config.js](../tailwind.config.js)
2. Styles : [src/index.css](../src/index.css)
3. Composants : [src/components/](../src/components/)

## 📊 Structure des Fichiers de Configuration

```
portfolio/
├── Configuration racine
│   ├── .env.example              # Variables d'environnement
│   ├── .gitignore                # Fichiers Git ignorés
│   ├── .gitattributes            # Attributs Git
│   ├── package.json              # Dépendances npm
│   ├── tsconfig.json             # Configuration TypeScript
│   ├── vite.config.ts            # Configuration Vite
│   ├── tailwind.config.js        # Configuration TailwindCSS
│   ├── postcss.config.js         # Configuration PostCSS
│   └── eslint.config.js          # Configuration ESLint
│
├── Docker
│   ├── Dockerfile                # Image Docker dev
│   ├── Dockerfile.production     # Image Docker prod
│   ├── docker-compose.yml        # Orchestration dev
│   ├── docker-compose.production.yml  # Orchestration prod
│   ├── nginx.conf                # Config Nginx dev
│   └── nginx.production.conf     # Config Nginx prod
│
├── Documentation
│   ├── README.md                 # Documentation principale
│   ├── CONTRIBUTING.md           # Guide contribution
│   ├── QUICKSTART.md             # Démarrage rapide
│   ├── FAQ.md                    # Questions fréquentes
│   ├── ARCHITECTURE.md           # Architecture
│   ├── ROADMAP.md                # Feuille de route
│   ├── CHANGELOG.md              # Historique
│   ├── SECURITY.md               # Sécurité
│   ├── CODE_OF_CONDUCT.md        # Code de conduite
│   └── LICENSE                   # Licence MIT
│
├── Documentation Admin
│   ├── ADMIN_*.md                # Guides admin
│   ├── DEPLOYMENT_ADMIN.md       # Déploiement
│   ├── PORTAINER_*.md            # Portainer
│   ├── EMAILJS_SETUP.md          # EmailJS
│   └── GOOGLE_ANALYTICS_SETUP.md # Analytics
│
├── GitHub
│   ├── .github/workflows/        # GitHub Actions
│   ├── .github/ISSUE_TEMPLATE/   # Templates issues
│   └── .github/pull_request_template.md  # Template PR
│
└── VS Code
    ├── .vscode/extensions.json   # Extensions
    └── .vscode/settings.json     # Configuration
```

## 🔍 Recherche Rapide

### Par Fonctionnalité

| Fonctionnalité | Documentation |
|----------------|---------------|
| Installation | [QUICKSTART.md](../QUICKSTART.md) |
| Configuration | [.env.example](../.env.example) |
| Développement | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| Architecture | [ARCHITECTURE.md](../ARCHITECTURE.md) |
| Déploiement | [DEPLOYMENT_ADMIN.md](../DEPLOYMENT_ADMIN.md) |
| Administration | [ADMIN_FILTERS_GUIDE.md](../ADMIN_FILTERS_GUIDE.md) |
| Sécurité | [SECURITY.md](../SECURITY.md) |
| Dépannage | [FAQ.md](../FAQ.md) |

### Par Technologie

| Technologie | Documentation |
|-------------|---------------|
| React | [ARCHITECTURE.md](../ARCHITECTURE.md) |
| TypeScript | [tsconfig.json](../tsconfig.json) |
| TailwindCSS | [tailwind.config.js](../tailwind.config.js) |
| Vite | [vite.config.ts](../vite.config.ts) |
| Docker | [docker-compose.yml](../docker-compose.yml) |
| Nginx | [nginx.conf](../nginx.conf) |
| EmailJS | [EMAILJS_SETUP.md](../EMAILJS_SETUP.md) |
| Google Analytics | [GOOGLE_ANALYTICS_SETUP.md](../GOOGLE_ANALYTICS_SETUP.md) |

## 🆘 Besoin d'Aide ?

1. **Vérifiez la [FAQ](../FAQ.md)** - La plupart des questions ont déjà une réponse
2. **Recherchez dans les [issues](https://github.com/USERNAME/REPO/issues)** - Votre problème a peut-être déjà été signalé
3. **Consultez la documentation appropriée** - Utilisez l'index ci-dessus
4. **Ouvrez une nouvelle issue** - Si vous ne trouvez pas de solution

## 📝 Contribuer à la Documentation

La documentation peut toujours être améliorée ! Si vous trouvez :
- Des informations manquantes
- Des erreurs ou typos
- Des explications peu claires
- Des guides qui pourraient être ajoutés

N'hésitez pas à :
1. Ouvrir une issue
2. Proposer une pull request
3. Contacter les mainteneurs

## 🔄 Mise à Jour

Cette documentation est mise à jour régulièrement. Dernière mise à jour : **Janvier 2026**

Pour voir l'historique des changements :
- [CHANGELOG.md](../CHANGELOG.md) - Changements du code
- [GitHub Commits](https://github.com/USERNAME/REPO/commits) - Historique Git

## 🌟 Ressources Externes

### Frameworks & Librairies
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

### Outils
- [Docker Docs](https://docs.docker.com/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [VS Code Docs](https://code.visualstudio.com/docs)

### Services
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Google Analytics](https://developers.google.com/analytics)
- [Portainer Docs](https://docs.portainer.io/)

---

**Navigation** : [🏠 Accueil](../README.md) | [🚀 Démarrage Rapide](../QUICKSTART.md) | [🤝 Contribuer](../CONTRIBUTING.md)

**Maintenu avec ❤️ par la communauté**
