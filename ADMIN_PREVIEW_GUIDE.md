# Guide de Prévisualisation - Système Admin

## 👀 **Système de prévisualisation des fichiers**

### **Types de fichiers supportés :**

#### **📷 Images**
- **Formats :** JPG, JPEG, PNG, GIF, BMP, WebP
- **Fonctionnalités :**
  - Zoom : 25% à 300%
  - Rotation : Par increments de 90°
  - Affichage pleine résolution
  - Téléchargement direct depuis l'aperçu

#### **📄 Documents PDF**
- **Format :** PDF uniquement
- **Fonctionnalités :**
  - Visualisation dans iframe intégrée
  - Navigation par pages
  - Zoom natif du navigateur
  - Téléchargement direct

#### **📝 Fichiers texte**
- **Formats :** TXT, et autres fichiers text/*
- **Fonctionnalités :**
  - Affichage formaté avec syntaxe préservée
  - Défilement pour longs documents
  - Police monospace pour la lisibilité

### **🎮 Comment utiliser :**

#### **1. Ouvrir un aperçu :**
- Cliquez sur l'icône **👁️ (œil violet)** dans la liste des fichiers
- L'aperçu s'ouvre dans une modal plein écran

#### **2. Navigation dans l'aperçu :**
- **Zoom (images uniquement) :**
  - 🔍➖ Zoom arrière (-25%)
  - 🔍➕ Zoom avant (+25%)
  - Affichage du pourcentage en temps réel

- **Rotation (images uniquement) :**
  - 🔄 Rotation de 90° dans le sens horaire
  - Cumulative (0°, 90°, 180°, 270°)

#### **3. Actions disponibles :**
- **📥 Télécharger :** Bouton dans la barre d'outils de l'aperçu
- **❌ Fermer :** Bouton X ou clic en dehors de la modal

### **📋 Informations affichées :**

#### **En-tête de l'aperçu :**
- 📄 Nom du fichier
- 📊 Taille et type MIME
- 🛠️ Contrôles de zoom/rotation (selon le type)

#### **Pied de page :**
- 📅 Date d'upload
- 🔒 Statut de chiffrement
- 🏷️ Catégorie du document

### **⚡ Avantages de la prévisualisation :**

#### **🚀 Rapidité :**
- Pas besoin de télécharger pour voir le contenu
- Chargement instantané depuis le cache local
- Interface fluide et responsive

#### **🔒 Sécurité :**
- Les fichiers restent chiffrés en local
- Logs de sécurité pour chaque aperçu
- Pas d'exposition des données sensibles

#### **💾 Économie d'espace :**
- Évite les téléchargements multiples
- Prévisualisation temporaire en mémoire
- Nettoyage automatique à la fermeture

### **🔧 Cas d'usage pratiques :**

#### **📋 Vérification rapide :**
- Vérifier le contenu avant téléchargement
- S'assurer de l'identité du document
- Contrôler la qualité des scans

#### **🔍 Recherche visuelle :**
- Parcourir rapidement plusieurs documents
- Identifier visuellement le bon fichier
- Comparer plusieurs versions

#### **📝 Lecture directe :**
- Lire des documents texte courts
- Consulter des PDFs de quelques pages
- Vérifier des informations spécifiques

### **⚠️ Limitations techniques :**

#### **Types non supportés :**
- Documents Office (.doc, .docx, .xls, .ppt)
- Archives (.zip, .rar, .7z)
- Vidéos et fichiers audio
- Fichiers exécutables

#### **Taille recommandée :**
- **Images :** Optimal jusqu'à 5MB
- **PDF :** Jusqu'à 10MB pour de bonnes performances
- **Texte :** Illimité (affichage optimisé)

### **🎯 Conseils d'utilisation :**

1. **Pour les images :**
   - Utilisez le zoom pour voir les détails
   - Rotation utile pour les documents scannés
   - Double-clic pour fermer rapidement

2. **Pour les PDFs :**
   - Utilisez les contrôles natifs du navigateur
   - Ctrl+F pour rechercher dans le document
   - Idéal pour les factures et contrats

3. **Pour les textes :**
   - Parfait pour les notes et configurations
   - Recherche avec Ctrl+F dans la prévisualisation
   - Copie possible du contenu affiché

---

**💡 Astuce :** La prévisualisation est particulièrement utile pour organiser vos documents. Vous pouvez rapidement parcourir plusieurs fichiers pour identifier ceux à conserver ou supprimer.