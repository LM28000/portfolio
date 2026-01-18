# Guide de Démarrage Rapide

Bienvenue ! Ce guide vous aidera à démarrer rapidement avec le projet.

## ⚡ Installation en 5 minutes

### Prérequis
- Node.js 18+ installé
- Un terminal
- Un éditeur de code (VS Code recommandé)

### Étapes rapides

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/portfolio.git
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur. 🎉

## 🎯 Premiers pas

### 1. Personnaliser le contenu

Les données du portfolio sont dans `src/data/` :

```
src/data/
├── experiences.ts    # Vos expériences
├── projects.ts       # Vos projets
├── skills.ts         # Vos compétences
└── certifications.ts # Vos certifications
```

### 2. Modifier les informations personnelles

Éditez `src/components/Hero.tsx` et `src/components/About.tsx` pour personnaliser :
- Votre nom
- Votre titre
- Votre description
- Vos coordonnées

### 3. Ajouter vos images

Placez vos images dans `public/images/` :
```
public/images/
├── profile.jpg       # Votre photo de profil
├── projects/         # Screenshots de projets
└── certifications/   # Images de certifications
```

### 4. Configurer les intégrations

#### EmailJS (pour le formulaire de contact)
1. Créez un compte sur [EmailJS](https://www.emailjs.com/)
2. Ajoutez vos clés dans `.env` :
```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### Google Analytics
```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🎨 Personnalisation du style

### Modifier les couleurs

Éditez `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Ajouter des styles personnalisés

Ajoutez vos styles dans `src/index.css`

## 🚀 Build pour production

```bash
# Build optimisé
npm run build

# Tester le build localement
npm run preview
```

Les fichiers seront dans le dossier `dist/`

## 📦 Déploiement rapide

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy --prod
```

### Docker

```bash
# Build et lancer
docker-compose up -d
```

## 🔐 Accès à l'administration

1. Définissez un token dans `.env` :
```env
VITE_ADMIN_TOKEN=votre-token-securise
```

2. Allez sur `/admin`
3. Entrez votre token

## 📝 Commandes utiles

```bash
npm run dev        # Développement
npm run build      # Build production
npm run preview    # Preview du build
npm run lint       # Vérifier le code
```

## 🆘 Problèmes courants

### Port déjà utilisé
```bash
# Changer le port dans vite.config.ts
server: {
  port: 3000
}
```

### Erreurs de dépendances
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Hot reload ne fonctionne pas
```bash
# Redémarrer le serveur
# Ctrl+C puis npm run dev
```

## 📚 Prochaines étapes

1. ✅ Lisez le [README](README.md) complet
2. ✅ Consultez le [guide de contribution](CONTRIBUTING.md)
3. ✅ Explorez la [documentation détaillée](docs/)
4. ✅ Rejoignez les discussions dans les issues

## 💡 Ressources

- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation TailwindCSS](https://tailwindcss.com/)
- [Documentation TypeScript](https://www.typescriptlang.org/)

## 🤝 Besoin d'aide ?

- 💬 Ouvrez une [issue](https://github.com/votre-username/portfolio/issues)
- 📧 Contactez les mainteneurs
- 📖 Consultez la [documentation complète](README.md)

---

**Bon développement ! 🚀**
