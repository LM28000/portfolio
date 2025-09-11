# Configuration EmailJS pour le Portfolio

## 📧 Installation et Configuration

### 1. Créer un compte EmailJS
1. Allez sur [EmailJS.com](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Connectez-vous à votre dashboard

### 2. Configurer le Service Email
1. Dans le dashboard EmailJS, allez dans **Email Services**
2. Cliquez sur **Add New Service**
3. Choisissez votre fournisseur email (Gmail, Outlook, etc.)
4. Suivez les instructions pour connecter votre email
5. Notez le **Service ID** généré

### 3. Créer un Template d'Email
1. Allez dans **Email Templates**
2. Cliquez sur **Create New Template**
3. Utilisez ce template HTML :

```html
Nouveau message de votre portfolio

De: {{from_name}}
Email: {{from_email}}
Sujet: {{subject}}

Message:
{{message}}

---
Envoyé depuis votre portfolio
```

4. Dans les paramètres du template, ajoutez ces variables :
   - `from_name`
   - `from_email` 
   - `subject`
   - `message`
   - `to_name`

5. Notez le **Template ID**

### 4. Obtenir la Clé Publique
1. Allez dans **Account** > **General**
2. Copiez votre **Public Key**

### 5. Configurer les Variables d'Environnement
1. Ouvrez le fichier `.env` dans votre projet
2. Remplacez les valeurs par les vôtres :

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx    # Votre Service ID
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx  # Votre Template ID  
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx    # Votre Public Key
```

### 6. Tester le Formulaire
1. Redémarrez votre serveur de développement : `npm run dev`
2. Remplissez et soumettez le formulaire
3. Vérifiez que vous recevez l'email

## 🎯 Fonctionnalités

✅ **Envoi d'emails réels** directement depuis le frontend
✅ **Interface utilisateur améliorée** avec loading et gestion d'erreurs  
✅ **Messages d'état** (succès/erreur)
✅ **Validation** des champs obligatoires
✅ **Responsive** sur tous les appareils

## 🚀 Limits Gratuites EmailJS
- **200 emails/mois** gratuits
- Parfait pour un portfolio personnel
- Upgrade possible pour plus de volume

## 🔧 Dépannage

### "Configuration EmailJS manquante"
- Vérifiez que les variables d'environnement sont définies
- Redémarrez le serveur après modification du .env

### "Erreur lors de l'envoi"
- Vérifiez votre connexion internet
- Vérifiez que le Service ID, Template ID et Public Key sont corrects
- Consultez la console du navigateur pour plus de détails

## 📝 Personnalisation

Vous pouvez modifier le template d'email dans EmailJS pour :
- Changer le design
- Ajouter des champs supplémentaires
- Modifier le format du message
