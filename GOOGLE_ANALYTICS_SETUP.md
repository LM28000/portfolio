# Configuration Google Analytics

## 📊 Google Analytics est maintenant intégré à votre portfolio !

### 🔧 Configuration requise

1. **Créer un compte Google Analytics :**
   - Allez sur [analytics.google.com](https://analytics.google.com)
   - Créez un nouveau compte et une nouvelle propriété
   - Choisissez "Web" comme plateforme
   - Obtenez votre ID de suivi (format : `G-XXXXXXXXXX`)

2. **Configurer les variables d'environnement :**
   - Ouvrez le fichier `.env` à la racine du projet
   - Remplacez la ligne `VITE_GA_TRACKING_ID=` par votre ID de suivi :
     ```
     VITE_GA_TRACKING_ID=G-VOTRE-ID-ICI
     ```

3. **Redémarrer le serveur de développement :**
   ```bash
   npm run dev
   ```

### 📈 Événements trackés automatiquement

Votre portfolio track maintenant les événements suivants :

1. **Navigation :** Chaque clic sur les liens du menu
2. **Changement de langue :** Français ↔ Anglais
3. **Changement de thème :** Mode sombre ↔ Mode clair
4. **Soumission du formulaire de contact**

### 🎯 Événements disponibles pour extension future

Vous pouvez facilement ajouter ces événements supplémentaires :

```typescript
import { trackPortfolioEvent } from '../utils/analytics';

// Téléchargement de CV
trackPortfolioEvent.cvDownload();

// Vue d'un projet spécifique
trackPortfolioEvent.projectView('Nom du projet');

// Clic sur un lien social
trackPortfolioEvent.socialClick('LinkedIn');
```

### 🔍 Vérification que ça fonctionne

1. **Mode développement :**
   - Ouvrez les outils de développement (F12)
   - Onglet "Console"
   - Naviguez sur votre site, vous devriez voir les événements GA

2. **Google Analytics :**
   - Connectez-vous à votre compte GA
   - Allez dans "Rapports" > "Temps réel"
   - Naviguez sur votre site, vous devriez voir l'activité en temps réel

### 🚀 Déploiement

N'oubliez pas d'ajouter votre `VITE_GA_TRACKING_ID` dans vos variables d'environnement de production (Vercel, Netlify, etc.).

### 📊 Données collectées (conformément RGPD)

Les données collectées sont anonymisées et incluent :
- Pages visitées
- Actions utilisateur (navigation, clics)
- Informations techniques (navigateur, appareil)
- Géolocalisation approximative

Aucune donnée personnelle identifiable n'est collectée.
