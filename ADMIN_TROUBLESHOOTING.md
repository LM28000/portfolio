# Guide de Dépannage - Système Admin

## 🔧 Erreurs d'Upload de Fichiers

### Causes communes et solutions :

#### 1. **Fichier trop volumineux**
- **Erreur :** "Fichier trop volumineux. Taille maximale : 10MB"
- **Solution :** Réduire la taille du fichier ou le compresser
- **Limite :** 10MB par fichier (limitation localStorage)

#### 2. **Espace de stockage insuffisant**
- **Erreur :** "Espace de stockage insuffisant"
- **Solution :** Supprimer des fichiers anciens depuis l'interface admin
- **Vérification :** Voir l'indicateur de stockage dans la sidebar

#### 3. **Type de fichier non supporté**
- **Types acceptés :** .pdf, .doc, .docx, .jpg, .jpeg, .png, .txt
- **Solution :** Convertir le fichier dans un format supporté

#### 4. **Erreur de conversion**
- **Erreur :** "Erreur lors de la conversion du fichier"
- **Cause :** Fichier corrompu ou format inhabituel
- **Solution :** Vérifier l'intégrité du fichier source

### 🛠️ Actions de dépannage :

1. **Vérifier la console du navigateur :**
   - F12 → Console → Rechercher les erreurs rouges

2. **Nettoyer le stockage local :**
   - F12 → Application → Local Storage → Supprimer les entrées "admin-"

3. **Tester avec un fichier plus petit :**
   - Essayer d'abord avec un fichier texte de quelques KB

4. **Redémarrer la session :**
   - Se déconnecter et se reconnecter

### 📋 Informations techniques :

- **Stockage :** localStorage du navigateur
- **Chiffrement :** Base64 (prototype)
- **Limite totale :** ~5MB pour tous les fichiers
- **Session :** 2h max, 30min d'inactivité

### 🔍 Logs de sécurité :

Toutes les tentatives d'upload sont enregistrées dans les logs.
Consultez la section "Logs de Sécurité" pour plus de détails.

---

**⚠️ En cas de problème persistant :**
1. Sauvegarder les fichiers importants
2. Nettoyer complètement le localStorage
3. Redémarrer le navigateur
4. Réessayer l'upload