# Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet ! Ce document fournit des directives pour contribuer efficacement.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Standards de code](#standards-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Signaler des bugs](#signaler-des-bugs)
- [Suggérer des améliorations](#suggérer-des-améliorations)

## Code de conduite

Ce projet adhère à un code de conduite. En participant, vous êtes censé respecter ce code.

### Nos engagements

- Utiliser un langage accueillant et inclusif
- Respecter les différents points de vue et expériences
- Accepter gracieusement les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté

## Comment contribuer

### 1. Fork et Clone

```bash
# Fork le repository sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/portfolio.git
cd portfolio
```

### 2. Créer une branche

```bash
# Créez une branche pour votre fonctionnalité ou correction
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Faire vos modifications

- Écrivez du code propre et maintenable
- Suivez les conventions de code existantes
- Ajoutez des commentaires si nécessaire
- Testez vos modifications

### 5. Vérifier le code

```bash
# Vérifiez le linting
npm run lint

# Corrigez automatiquement les problèmes de linting
npm run lint --fix
```

### 6. Commit

```bash
# Ajoutez vos fichiers
git add .

# Committez avec un message descriptif
git commit -m "feat: ajouter une nouvelle fonctionnalité"
```

#### Convention de commit

Utilisez le format suivant pour vos messages de commit :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Modifications de documentation
- `style:` Changements de formatage (pas de changement de code)
- `refactor:` Refactorisation de code
- `test:` Ajout ou modification de tests
- `chore:` Tâches de maintenance

**Exemples :**
```
feat: ajouter support pour le mode sombre
fix: corriger l'affichage des projets sur mobile
docs: mettre à jour le guide d'installation
style: formater le code avec prettier
refactor: simplifier la logique de filtrage
test: ajouter tests pour le composant Hero
chore: mettre à jour les dépendances
```

### 7. Push et Pull Request

```bash
# Push vers votre fork
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis créez une Pull Request sur GitHub.

## Standards de code

### TypeScript

- Utilisez des types explicites autant que possible
- Évitez `any`, préférez `unknown` si nécessaire
- Créez des interfaces pour les objets complexes
- Utilisez des types unions quand approprié

**Exemple :**
```typescript
// ✅ Bon
interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
}

// ❌ Éviter
const project: any = {
  id: 1,
  title: "Project"
};
```

### React

- Utilisez des composants fonctionnels avec hooks
- Nommage : PascalCase pour les composants
- Un composant par fichier (sauf petits composants helper)
- Props : définissez toujours les types

**Exemple :**
```typescript
// ✅ Bon
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}
```

### CSS / TailwindCSS

- Utilisez TailwindCSS en priorité
- Suivez l'ordre logique des classes : layout → sizing → spacing → colors → effects
- Créez des classes personnalisées dans `index.css` pour les patterns répétitifs
- Utilisez `dark:` pour le mode sombre

**Exemple :**
```typescript
// ✅ Bon - ordre logique
<div className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">

// ❌ Éviter - désorganisé
<div className="shadow-md bg-white px-4 rounded-lg flex dark:bg-gray-800 w-full items-center py-2 justify-between">
```

### Structure des fichiers

```
src/
├── components/     # Composants réutilisables
├── pages/          # Composants de page
├── contexts/       # Contextes React
├── hooks/          # Hooks personnalisés
├── services/       # Services API
├── utils/          # Fonctions utilitaires
├── types/          # Définitions TypeScript
└── admin/          # Composants d'administration
```

### Hooks personnalisés

- Préfixez avec `use`
- Un hook = une responsabilité
- Documentez les paramètres et valeurs de retour

**Exemple :**
```typescript
/**
 * Hook pour gérer l'animation au scroll
 * @param ref - Référence à l'élément DOM
 * @returns isVisible - true si l'élément est visible
 */
export function useScrollAnimation(ref: RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false);
  // ... logique
  return isVisible;
}
```

## Processus de Pull Request

### Checklist avant de soumettre

- [ ] Le code respecte les conventions du projet
- [ ] Le linting passe sans erreur (`npm run lint`)
- [ ] Le build fonctionne (`npm run build`)
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Le commit suit la convention de message
- [ ] La PR a un titre et une description clairs

### Description de la Pull Request

Incluez dans votre PR :

1. **Type de changement**
   - [ ] Bug fix
   - [ ] Nouvelle fonctionnalité
   - [ ] Breaking change
   - [ ] Documentation

2. **Description**
   - Qu'est-ce qui change ?
   - Pourquoi ce changement est nécessaire ?
   - Comment cela affecte-t-il les utilisateurs ?

3. **Screenshots** (si changements visuels)

4. **Tests effectués**
   - Comment avez-vous testé les changements ?
   - Navigateurs testés ?
   - Appareils testés ?

### Exemple de template PR

```markdown
## Type de changement
- [x] Nouvelle fonctionnalité

## Description
Ajout d'un système de filtrage avancé dans le panneau d'administration permettant de filtrer les fichiers par nom, type et date.

## Motivation
Les utilisateurs avaient des difficultés à trouver des fichiers spécifiques quand la liste était longue.

## Screenshots
![Avant](url-screenshot-avant)
![Après](url-screenshot-après)

## Tests
- [x] Chrome (Desktop)
- [x] Firefox (Desktop)
- [x] Safari (Mobile)
- [x] Build de production testé

## Checklist
- [x] Code testé localement
- [x] Linting passé
- [x] Documentation mise à jour
```

## Signaler des bugs

### Avant de signaler

- Vérifiez que le bug n'a pas déjà été signalé
- Assurez-vous que c'est bien un bug et pas une limitation connue
- Testez avec la dernière version du code

### Template de rapport de bug

```markdown
**Description du bug**
Une description claire et concise du bug.

**Pour reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Scroller jusqu'à '...'
4. Le bug apparaît

**Comportement attendu**
Description de ce qui devrait se passer.

**Comportement actuel**
Description de ce qui se passe réellement.

**Screenshots**
Si applicable, ajoutez des screenshots.

**Environnement**
- OS: [e.g. macOS 14.0]
- Navigateur: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Informations supplémentaires**
Tout autre contexte utile.
```

## Suggérer des améliorations

### Template de suggestion

```markdown
**La fonctionnalité est-elle liée à un problème ?**
Une description claire du problème. Ex: "Je suis frustré quand [...]"

**Solution proposée**
Une description claire de ce que vous aimeriez voir.

**Alternatives considérées**
Description des solutions alternatives envisagées.

**Contexte additionnel**
Tout autre contexte, screenshots ou exemples.
```

## Questions ?

Si vous avez des questions, n'hésitez pas à :
- Ouvrir une issue avec le label `question`
- Contacter les mainteneurs

## Remerciements

Merci de contribuer à améliorer ce projet ! Chaque contribution, petite ou grande, est appréciée. 🙏

---

**Happy Coding! 🚀**
