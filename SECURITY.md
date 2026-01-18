# Politique de Sécurité

## 🔒 Versions supportées

Le tableau suivant indique les versions actuellement supportées avec des mises à jour de sécurité :

| Version | Supportée          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 🛡️ Signaler une Vulnérabilité

La sécurité de ce projet est prise très au sérieux. Si vous découvrez une vulnérabilité de sécurité, merci de la signaler de manière responsable.

### Comment signaler

**⚠️ NE PAS créer d'issue publique pour les problèmes de sécurité.**

Au lieu de cela :

1. **Envoyez un email** aux mainteneurs avec les détails
2. **Incluez** :
   - Description de la vulnérabilité
   - Étapes pour reproduire
   - Impact potentiel
   - Suggestions de correction (si vous en avez)

3. **Attendez** une réponse dans les 48 heures

### Ce à quoi s'attendre

- **Accusé de réception** sous 48 heures
- **Évaluation initiale** sous 7 jours
- **Mise à jour régulière** sur le statut de la correction
- **Publication d'un patch** dès que possible
- **Crédit public** (si souhaité) lors de la divulgation

## 🔐 Bonnes pratiques de sécurité

### Pour les contributeurs

1. **Variables d'environnement**
   - Ne jamais committer de fichiers `.env` avec des vraies valeurs
   - Utiliser `.env.example` pour les templates
   - Documenter toutes les variables sensibles

2. **Tokens et clés API**
   - Stocker dans des variables d'environnement
   - Ne jamais hardcoder dans le code
   - Utiliser des secrets management (GitHub Secrets, etc.)

3. **Dépendances**
   - Maintenir les dépendances à jour
   - Vérifier régulièrement avec `npm audit`
   - Corriger rapidement les vulnérabilités connues

### Pour les utilisateurs

1. **Configuration**
   - Utiliser des tokens forts et uniques
   - Changer les tokens par défaut
   - Activer HTTPS en production

2. **Authentification admin**
   - Utiliser un token fort (minimum 32 caractères)
   - Changer régulièrement les credentials
   - Limiter l'accès au panneau admin

3. **Déploiement**
   - Utiliser HTTPS/TLS
   - Configurer les CORS correctement
   - Limiter l'accès aux endpoints sensibles
   - Activer les logs de sécurité

## 🔍 Audits de sécurité

### Derniers audits

- **Date** : À venir
- **Type** : Audit automatisé (npm audit)
- **Résultat** : Aucune vulnérabilité critique

### Vérifications régulières

Nous effectuons régulièrement :
- `npm audit` pour les dépendances
- Revue du code pour les problèmes de sécurité
- Tests de pénétration basiques
- Vérification des configurations

## 📋 Checklist de sécurité

### Avant le déploiement

- [ ] Variables d'environnement configurées
- [ ] Tokens d'admin changés depuis les valeurs par défaut
- [ ] HTTPS activé
- [ ] CORS configuré correctement
- [ ] Logs de sécurité activés
- [ ] Dernières dépendances installées
- [ ] `npm audit` sans vulnérabilités critiques
- [ ] Tests de sécurité passés

### Maintenance régulière

- [ ] Mise à jour des dépendances (mensuel)
- [ ] Rotation des tokens (trimestriel)
- [ ] Revue des logs de sécurité (hebdomadaire)
- [ ] Backup des données (quotidien)

## 🚨 Incidents de sécurité

En cas d'incident de sécurité confirmé :

1. **Notification immédiate** à tous les utilisateurs affectés
2. **Publication d'un patch** dès que possible
3. **Communication transparente** sur le problème et la solution
4. **Post-mortem** pour prévenir les incidents futurs

## 📚 Ressources

### Documentation de sécurité

- [Guide de sécurité admin](SECURITY_ADMIN.md)
- [Configuration sécurisée](README.md#configuration)
- [Variables d'environnement](.env.example)

### Outils recommandés

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Audit des dépendances
- [Snyk](https://snyk.io/) - Scan de vulnérabilités
- [OWASP ZAP](https://www.zaproxy.org/) - Tests de sécurité
- [GitHub Security Advisories](https://github.com/advisories) - Alertes de sécurité

## 📞 Contact

Pour les questions de sécurité qui ne sont pas des vulnérabilités :
- Ouvrir une issue avec le label `security`
- Consulter la documentation existante

---

**Merci de contribuer à la sécurité de ce projet ! 🙏**
