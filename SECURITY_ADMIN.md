# 🔐 Guide de Sécurité - Mot de Passe Admin

## ⚠️ Problème de Sécurité Résolu

Avant cette mise à jour, le mot de passe admin était stocké en dur dans le code source et donc visible sur GitHub. **Ce problème a été corrigé !**

## ✅ Solution Mise en Place

### 1. Variables d'Environnement

Le mot de passe admin est maintenant stocké dans les variables d'environnement :

```bash
# Dans .env.local (non versionnée)
VITE_ADMIN_PASSWORD=VotreMotDePasseSecurise
```

### 2. Fichiers de Configuration

- **`.env.local`** : Contient vos mots de passe (NON versionnée sur GitHub)
- **`.env.example`** : Template avec des exemples (versionnée, mais sans mots de passe)
- **`.gitignore`** : Exclut automatiquement `.env.local` et `*.local`

### 3. Configuration du Code

Le code utilise maintenant :
```typescript
PASSWORD_HASH: import.meta.env.VITE_ADMIN_PASSWORD || 'default-password-change-me'
```

## 🚀 Installation / Configuration

### Pour le Développement Local

1. **Copiez le template** :
   ```bash
   cp .env.example .env.local
   ```

2. **Modifiez `.env.local`** :
   ```bash
   VITE_ADMIN_PASSWORD=VotreMotDePasseTresSecurise123!
   ```

3. **Redémarrez l'application** :
   ```bash
   npm run dev
   ```

### Pour la Production (Portainer)

1. **Dans Portainer** → **Stacks** → **Votre Stack** → **Environment variables**

2. **Ajoutez la variable** :
   ```
   Nom: VITE_ADMIN_PASSWORD
   Valeur: VotreMotDePasseProdSecurise456!
   ```

3. **Mise à jour du stack** avec la nouvelle variable

## 🔒 Recommandations de Sécurité

### Mots de Passe Forts
- **Minimum 12 caractères**
- **Majuscules, minuscules, chiffres et symboles**
- **Unique pour cette application**

### Exemples de Bons Mots de Passe
```
AdminPortfolio2025!SecureKey
LM-Admin#2025*UltraSecure
Portfolio$Admin&2025#Strong
```

### Rotation des Mots de Passe
- **Changez régulièrement** (tous les 3-6 mois)
- **Changez immédiatement** en cas de suspicion de compromission

## 🔧 Dépannage

### Si vous ne pouvez plus vous connecter :

1. **Vérifiez le fichier `.env.local`** :
   ```bash
   cat .env.local
   ```

2. **Vérifiez que la variable est définie** :
   ```javascript
   console.log(import.meta.env.VITE_ADMIN_PASSWORD);
   ```

3. **Réinitialisez si nécessaire** :
   ```bash
   rm .env.local
   cp .env.example .env.local
   # Puis modifiez .env.local avec votre mot de passe
   ```

## 📋 Checklist de Sécurité

- [x] Mot de passe retiré du code source
- [x] Variable d'environnement configurée
- [x] `.env.local` dans `.gitignore`
- [x] Documentation mise à jour
- [ ] Mot de passe fort configuré (à faire par vous)
- [ ] Variables d'environnement production configurées (Portainer)

## 🚨 Important

**Le mot de passe par défaut dans `.env.local` doit être changé !**

Ne commitez JAMAIS un fichier contenant de vrais mots de passe sur GitHub.