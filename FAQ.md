# FAQ - Questions Fréquentes

## 📋 Table des matières

- [Général](#général)
- [Installation](#installation)
- [Configuration](#configuration)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Administration](#administration)
- [Dépannage](#dépannage)

---

## Général

### Qu'est-ce que ce projet ?

C'est un portfolio personnel moderne et complet construit avec React, TypeScript et Vite. Il inclut un système d'administration pour gérer le contenu.

### Est-ce gratuit ?

Oui ! Ce projet est open-source sous licence MIT. Vous pouvez l'utiliser, le modifier et le distribuer librement.

### Puis-je l'utiliser pour mon propre portfolio ?

Absolument ! C'est fait pour ça. Forkez le projet, personnalisez-le et déployez-le.

### Quelles sont les technologies utilisées ?

- **Frontend** : React 18, TypeScript, TailwindCSS
- **Build** : Vite
- **Routing** : React Router
- **Styling** : TailwindCSS
- **Icons** : Lucide React
- **Déploiement** : Docker, Nginx

---

## Installation

### Quelle version de Node.js dois-je utiliser ?

Node.js 18.x ou supérieur est recommandé.

### Puis-je utiliser Yarn ou pnpm ?

Oui ! Le projet fonctionne avec npm, yarn ou pnpm.

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install
```

### L'installation échoue avec des erreurs de dépendances

Essayez :

```bash
# Supprimer le cache
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Ou forcer l'installation
npm install --legacy-peer-deps
```

---

## Configuration

### Dois-je configurer toutes les variables d'environnement ?

Non, seules certaines sont obligatoires :

**Obligatoires** :
- `VITE_ADMIN_TOKEN` - pour l'accès admin

**Optionnelles** :
- `VITE_GA_TRACKING_ID` - Google Analytics
- `VITE_EMAILJS_*` - Formulaire de contact
- `VITE_SUPABASE_*` - Si vous utilisez Supabase

### Comment générer un token admin sécurisé ?

```bash
# Linux/macOS
openssl rand -base64 32

# Ou utilisez un générateur en ligne
# https://randomkeygen.com/
```

### Où mettre les fichiers .env ?

À la racine du projet :
```
portfolio/
├── .env              # Variables locales (ne pas committer)
├── .env.example      # Template (à committer)
└── ...
```

---

## Développement

### Comment démarrer le serveur de développement ?

```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

### Le hot reload ne fonctionne pas

Vérifiez :
1. Que vous êtes dans le bon dossier
2. Que le port n'est pas déjà utilisé
3. Redémarrez le serveur (Ctrl+C puis npm run dev)

### Comment ajouter une nouvelle page ?

1. Créez le composant dans `src/pages/` :
```typescript
// src/pages/NewPage.tsx
export function NewPage() {
  return <div>Ma nouvelle page</div>;
}
```

2. Ajoutez la route dans `src/App.tsx` :
```typescript
<Route path="/new-page" element={<NewPage />} />
```

### Comment modifier le contenu du portfolio ?

Les données sont dans `src/data/` :
- `experiences.ts` - Expériences professionnelles
- `projects.ts` - Projets
- `skills.ts` - Compétences
- `certifications.ts` - Certifications

### Comment changer les couleurs du thème ?

Éditez `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#...',
        100: '#...',
        // ...
      }
    }
  }
}
```

---

## Déploiement

### Sur quelles plateformes puis-je déployer ?

- **Vercel** (recommandé pour le frontend)
- **Netlify**
- **GitHub Pages**
- **Docker** (avec nginx)
- **Tout VPS** (avec nginx)

### Comment déployer sur Vercel ?

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivre les instructions
```

### Les variables d'environnement ne fonctionnent pas en production

Assurez-vous de :
1. Préfixer avec `VITE_`
2. Les ajouter dans votre plateforme de déploiement
3. Rebuild après les avoir ajoutées

### Comment déployer avec Docker ?

```bash
# Développement
docker-compose up -d

# Production
docker-compose -f docker-compose.production.yml up -d
```

---

## Administration

### Comment accéder au panneau admin ?

1. Allez sur `/admin`
2. Entrez votre token admin (défini dans `.env`)

### J'ai oublié mon token admin

Vérifiez votre fichier `.env` :
```env
VITE_ADMIN_TOKEN=votre-token
```

Ou générez-en un nouveau et rebuilez l'application.

### Comment uploader des fichiers CV ?

1. Connectez-vous au panneau admin
2. Cliquez sur "Ajouter un fichier"
3. Sélectionnez votre PDF
4. Cliquez sur "Upload"

### Les fichiers uploadés ne s'affichent pas

Vérifiez :
- Que le dossier `admin-files/` existe et est accessible
- Les permissions du dossier (755)
- Que le serveur PHP est configuré correctement

---

## Dépannage

### Erreur : "Cannot find module"

```bash
npm install
```

### Erreur : "Port 5173 is already in use"

Changez le port dans `vite.config.ts` :
```typescript
server: {
  port: 3000
}
```

Ou tuez le processus :
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Les images ne se chargent pas

Vérifiez :
- Que les images sont dans `public/`
- Le chemin relatif est correct : `/images/photo.jpg`
- Pas de typos dans les noms de fichiers

### Le build échoue

```bash
# Nettoyer et rebuilder
rm -rf dist
npm run build

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

### Erreur de CORS

Si vous utilisez une API séparée, configurez les CORS :

```php
// PHP
header("Access-Control-Allow-Origin: *");
```

```javascript
// Express
app.use(cors({
  origin: 'https://votre-domaine.com'
}));
```

### Les animations ne fonctionnent pas

Vérifiez que :
- TailwindCSS est bien configuré
- Les classes CSS sont bien appliquées
- Le JavaScript est activé

### Le mode sombre ne persiste pas

Vérifiez que localStorage fonctionne :
```javascript
// Dans la console
localStorage.setItem('test', 'test');
console.log(localStorage.getItem('test')); // Doit afficher 'test'
```

---

## Performance

### Comment améliorer les performances ?

1. **Optimiser les images** :
   - Utiliser WebP
   - Compresser les images
   - Lazy loading

2. **Code splitting** :
```typescript
// Lazy load des composants
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
```

3. **Analyser le bundle** :
```bash
npm run build -- --analyze
```

### Le site est lent au chargement

- Vérifiez la taille du bundle (doit être < 500KB)
- Utilisez Lighthouse pour identifier les problèmes
- Activez la compression gzip/brotli
- Utilisez un CDN pour les assets statiques

---

## Sécurité

### Le panneau admin est-il sécurisé ?

Oui, avec un token fort. Pour plus de sécurité :
- Utilisez un token de 32+ caractères
- Activez HTTPS en production
- Changez régulièrement le token
- Limitez l'accès par IP si possible

### Comment sécuriser les variables d'environnement ?

- Ne jamais committer `.env`
- Utiliser `.env.example` pour les templates
- Utiliser des secrets management (GitHub Secrets, etc.)
- Changer les tokens en production

---

## Autre

### Comment contribuer au projet ?

Lisez le [guide de contribution](CONTRIBUTING.md).

### J'ai trouvé un bug, que faire ?

Ouvrez une [issue](https://github.com/votre-username/portfolio/issues) avec :
- Description du bug
- Étapes pour reproduire
- Comportement attendu vs actuel
- Screenshots si applicable

### Comment demander une nouvelle fonctionnalité ?

Ouvrez une [issue](https://github.com/votre-username/portfolio/issues) avec le label `enhancement`.

### Puis-je vous embaucher pour personnaliser le projet ?

Contactez-moi directement via le formulaire de contact du portfolio.

### Où trouver plus de documentation ?

- [README.md](README.md) - Documentation principale
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution
- [Guides d'administration](ADMIN_FILTERS_GUIDE.md)
- [Configuration EmailJS](EMAILJS_SETUP.md)
- [Configuration Google Analytics](GOOGLE_ANALYTICS_SETUP.md)

---

## ❓ Votre question n'est pas listée ?

Ouvrez une issue avec le label `question` ou contactez les mainteneurs !

---

**Dernière mise à jour : Janvier 2026**
