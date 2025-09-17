# 📂 Import Rapide des Variables dans Portainer

## 🚀 Méthode Simplifiée

Toutes les variables sont maintenant dans le fichier `.env.local` du projet. Voici comment les importer rapidement dans Portainer :

### Option 1 : Copy-Paste Direct (Recommandé)

1. **Ouvrez le fichier `.env.local`** de votre projet
2. **Copiez tout le contenu** (sauf les commentaires si vous voulez)
3. **Dans Portainer** :
   - **Stacks** → **Votre Stack Portfolio** 
   - **Editor** → Faire défiler vers le bas
   - **Environment variables** → **Load variables from .env file**
   - **Collez le contenu** du `.env.local`
   - **Update the stack**

### Option 2 : Upload de Fichier

1. **Téléchargez le fichier `.env.local`** sur votre serveur Portainer
2. **Dans Portainer** :
   - **Stacks** → **Votre Stack Portfolio**
   - **Editor** → **Advanced mode**
   - **Upload from file** → Sélectionner `.env.local`

## 📋 Variables Incluses dans .env.local

✅ **EmailJS** : service_k0yp7g8, template_qjmmeea, 989Z7HW0nw_PZ3wE7  
✅ **Google Analytics** : G-DZVTZVB6CJ  
✅ **Administration Backend** : Portfolio2025-SecureToken-BE#789!  
✅ **Administration Frontend** : Portfolio2025-SecurePassword-FE*456!  
✅ **Configuration API** : /api, 8080, production  
✅ **Mode Test** : false  
✅ **Port Portainer** : 2368  

## 🔒 Sécurité

⚠️ **IMPORTANT** : Les mots de passe dans `.env.local` sont des exemples sécurisés mais vous devriez les changer :

```bash
# Changez ces valeurs dans Portainer après import :
ADMIN_TOKEN=VotreTokenPersonnelSecurise123!
VITE_ADMIN_PASSWORD=VotreMotDePassePersonnelSecurise456!
```

## ✅ Vérification

Après l'import et le redéploiement :

1. **Site web** : `https://votre-domaine.com` ✅
2. **Admin** : `https://votre-domaine.com/admin` ✅
3. **API** : `https://votre-domaine.com/api/files` ✅
4. **Contact** : Formulaire de contact fonctionne ✅

## 🔄 Mise à Jour

Si vous modifiez des variables dans `.env.local` :
1. **Copiez** le nouveau contenu
2. **Portainer** → **Environment variables** → **Remplacez**
3. **Update the stack**

C'est tout ! Plus besoin de saisir les variables une par une. 🎉