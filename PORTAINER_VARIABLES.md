# 🔐 Configuration des Variables Sensibles dans Portainer

## ⚠️ IMPORTANT : Variables à Configurer

Toutes les variables sensibles ont été retirées du code source. Vous DEVEZ les configurer dans Portainer avant le déploiement.

## 🚀 Configuration dans Portainer

### 1. Accéder aux Variables d'Environnement

1. **Connectez-vous à Portainer**
2. **Stacks** → **Votre Stack Portfolio** → **Editor**
3. **Environment variables** (section en bas)

### 2. Variables Obligatoires à Configurer

#### 📧 **EmailJS (Formulaire de Contact)**
```
VITE_EMAILJS_SERVICE_ID=service_k0yp7g8
VITE_EMAILJS_TEMPLATE_ID=template_qjmmeea  
VITE_EMAILJS_PUBLIC_KEY=989Z7HW0nw_PZ3wE7
```

#### 📊 **Google Analytics**
```
VITE_GA_TRACKING_ID=G-DZVTZVB6CJ
```

#### 🔒 **Administration Backend**
```
ADMIN_TOKEN=VotreTokenSecuriseBE123!
```

#### 🖥️ **Administration Frontend**
```
VITE_ADMIN_PASSWORD=VotreMotDePasseSecuriseFE456!
```

### 3. Étapes de Configuration dans Portainer

#### Option A : Via l'Interface Web

1. **Dans Portainer** → **Stacks** → **Sélectionner votre stack**
2. **Cliquer sur "Editor"**
3. **Faire défiler vers le bas** → **Environment variables**
4. **Ajouter chaque variable** :
   ```
   Nom: VITE_EMAILJS_SERVICE_ID
   Valeur: service_k0yp7g8
   ```
5. **Répéter pour toutes les variables**
6. **Cliquer "Update the stack"**

#### Option B : Via le Fichier docker-compose

1. **Créer un fichier `.env` sur votre serveur** :
   ```bash
   # /opt/portainer/stacks/portfolio/.env
   VITE_EMAILJS_SERVICE_ID=service_k0yp7g8
   VITE_EMAILJS_TEMPLATE_ID=template_qjmmeea
   VITE_EMAILJS_PUBLIC_KEY=989Z7HW0nw_PZ3wE7
   VITE_GA_TRACKING_ID=G-DZVTZVB6CJ
   ADMIN_TOKEN=VotreTokenSecurise123!
   VITE_ADMIN_PASSWORD=VotreMotDePasseSecurise456!
   ```

2. **Dans Portainer** → **Advanced mode** → **Specify path to .env file**

## 🔧 Valeurs Actuelles (À Copier)

### 📧 EmailJS (Vos Vraies Valeurs)
```bash
VITE_EMAILJS_SERVICE_ID=service_k0yp7g8
VITE_EMAILJS_TEMPLATE_ID=template_qjmmeea
VITE_EMAILJS_PUBLIC_KEY=989Z7HW0nw_PZ3wE7
```

### 📊 Google Analytics (Votre Vraie Valeur)
```bash
VITE_GA_TRACKING_ID=G-DZVTZVB6CJ
```

### 🔒 Sécurité (À Personnaliser !)
```bash
# CHANGEZ CES VALEURS !
ADMIN_TOKEN=admin123_CHANGEME_PRODUCTION
VITE_ADMIN_PASSWORD=lm2025-admin-secure-key_CHANGEME
```

## ⚡ Configuration Rapide (Copy-Paste)

**Copiez-collez ceci dans Portainer Environment Variables :**

```
VITE_EMAILJS_SERVICE_ID=service_k0yp7g8
VITE_EMAILJS_TEMPLATE_ID=template_qjmmeea
VITE_EMAILJS_PUBLIC_KEY=989Z7HW0nw_PZ3wE7
VITE_GA_TRACKING_ID=G-DZVTZVB6CJ
ADMIN_TOKEN=VotreNouveauTokenSecurise123!
VITE_ADMIN_PASSWORD=VotreNouveauMotDePasseSecurise456!
```

## 🛡️ Recommandations de Sécurité

### Tokens d'Administration
- **ADMIN_TOKEN** : Minimum 20 caractères, caractères spéciaux
- **VITE_ADMIN_PASSWORD** : Minimum 15 caractères, complexe

### Exemples de Tokens Sécurisés
```bash
ADMIN_TOKEN=Portfolio2025-BE-SecureKey#789!
VITE_ADMIN_PASSWORD=LM-Portfolio#Admin*2025@Secure
```

## 🔍 Vérification du Déploiement

### 1. Test du Frontend
```bash
curl https://votre-domaine.com
# Doit afficher le site normalement
```

### 2. Test de l'API Admin
```bash
curl -H "Authorization: Bearer VotreNouveauToken" \
     https://votre-domaine.com/api/files
# Doit retourner : {"success":true,"data":[]}
```

### 3. Test de la Connexion Admin
1. Aller sur `https://votre-domaine.com/admin`
2. Saisir votre nouveau mot de passe
3. Doit connecter avec succès

## 🚨 Checklist de Sécurité

- [ ] Toutes les variables configurées dans Portainer
- [ ] Anciens tokens changés (ADMIN_TOKEN ≠ admin123)
- [ ] Ancien mot de passe changé (VITE_ADMIN_PASSWORD ≠ lm2025-admin-secure-key)
- [ ] Test de connexion admin réussi
- [ ] Test des formulaires de contact réussi
- [ ] Google Analytics fonctionne (optionnel)

## 🆘 En Cas de Problème

### Erreur "Variables non définies"
- Vérifiez que toutes les variables sont dans Portainer
- Vérifiez l'orthographe exacte des noms
- Redéployez le stack après modification

### Erreur de Connexion Admin
- Vérifiez `VITE_ADMIN_PASSWORD` dans Portainer
- Vérifiez `ADMIN_TOKEN` dans Portainer
- Consultez les logs du container

### Logs du Container
```bash
docker logs portfolio-production
```