# Configuration des Variables d'Environnement pour Portainer

## Variables à définir dans Portainer

Copiez-collez ces variables dans la section "Environment variables" de votre stack Portainer :

```bash
# === EmailJS Configuration ===
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key

# === Google Analytics ===
VITE_GA_TRACKING_ID=votre_tracking_id

# === Administration ===
# Token pour l'API backend (IMPORTANT: doit être identique pour frontend et backend)
ADMIN_TOKEN=Portfolio2025-SecureToken-BE#789!

# Token pour le frontend (IMPORTANT: doit être identique à ADMIN_TOKEN)
VITE_ADMIN_TOKEN=Portfolio2025-SecureToken-BE#789!

# Mot de passe pour l'interface admin
VITE_ADMIN_PASSWORD=Portfolio2025-SecurePassword-FE*456!
```

## ⚠️ Important

1. **ADMIN_TOKEN et VITE_ADMIN_TOKEN doivent avoir la même valeur** pour que l'authentification fonctionne
2. Changez toutes les valeurs par vos vraies clés de production
3. Ces variables ne sont PAS dans le code source sur GitHub (sécurisé)

## Comment ça fonctionne

- **Développement** : Utilise automatiquement le fichier `.env.local` (non versionné)
- **Production** : Utilise automatiquement les variables définies dans Portainer
- **Fallback** : Si aucune variable n'est définie, utilise des valeurs par défaut non-fonctionnelles

## Test en développement

```bash
# Démarrer l'API
cd api-server
node server.js

# Démarrer le frontend
npm run dev
```

Tout devrait fonctionner automatiquement avec les valeurs du `.env.local`.