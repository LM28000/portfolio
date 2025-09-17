# 📁 Système de Stockage de Fichiers Admin - Déploiement Production

## 🏗️ Architecture

Le système de stockage de fichiers fonctionne avec :

- **Frontend React** : Interface d'administration (`/admin`)
- **API Node.js** : Serveur backend pour la gestion des fichiers (`/api`)
- **Nginx** : Proxy inverse et serveur web
- **Volume Docker** : Stockage persistant des fichiers

## 🚀 Déploiement avec Docker

### Option 1 : Production complète (recommandée)

```bash
# Build et démarrage avec volumes persistants
docker-compose -f docker-compose.production.yml up -d --build
```

### Option 2 : Déploiement classique

```bash
# Utiliser le Dockerfile de production
docker build -f Dockerfile.production -t portfolio-full .
docker run -d -p 2368:80 -v admin_files:/app/admin-files --name portfolio portfolio-full
```

## 📂 Structure des Fichiers

```
/app/
├── admin-files/           # Volume persistant
│   ├── uploads/          # Fichiers uploadés
│   └── metadata.json     # Métadonnées des fichiers
├── api-server/           # Serveur API Node.js
└── /usr/share/nginx/html/ # Application React
```

## 🔧 Configuration Production

### Variables d'Environnement

- `NODE_ENV=production`
- `API_PORT=8080`
- `ADMIN_TOKEN=admin123`

### Ports

- **Port 80** : Nginx (React + Proxy API)
- **Port 8080** : API Node.js (interne)

### URLs

- **Frontend** : `http://votre-domaine/`
- **Admin** : `http://votre-domaine/admin`
- **API** : `http://votre-domaine/api/`

## 🔄 Portainer/GitHub Sync

Pour mettre à jour via Portainer :

1. **Push vers GitHub** avec les nouvelles configurations
2. **Portainer** détecte les changements
3. **Rebuild automatique** avec le nouveau `Dockerfile.production`
4. **Volume persistant** conserve les fichiers existants

### Configuration Portainer

Utilisez le `docker-compose.production.yml` dans Portainer :

```yaml
# Copier le contenu de docker-compose.production.yml
# Modifier le port si nécessaire (actuellement 2368:80)
```

## 🛡️ Sécurité

- **Token d'authentification** : `admin123` (à changer en production)
- **Upload limité** : 100MB max par fichier
- **CORS** : Configuré pour le domaine de production
- **Volumes isolés** : Fichiers stockés dans volume Docker dédié

## 🔍 Monitoring

### Health Check

```bash
curl http://votre-domaine/health
# Réponse : "healthy"
```

### Logs

```bash
# Logs du conteneur
docker logs portfolio-production

# Logs Nginx (si volume monté)
tail -f ./logs/access.log
tail -f ./logs/error.log
```

## 🔄 Migration des Données

Si vous avez des fichiers en localStorage en développement :

1. Accéder à `/admin` en production
2. Le système détectera automatiquement s'il y a des fichiers à migrer
3. Confirmer la migration vers le serveur

## 🚨 Troubleshooting

### Problème : "Serveur indisponible"

1. Vérifier que le conteneur fonctionne : `docker ps`
2. Vérifier les logs : `docker logs portfolio-production`
3. Tester l'API : `curl http://votre-domaine/api/test`

### Problème : Fichiers non sauvegardés

1. Vérifier le volume : `docker volume ls`
2. Vérifier les permissions : `docker exec portfolio-production ls -la /app/admin-files`
3. Vérifier l'espace disque : `df -h`

### Problème : CORS

- En production, Nginx gère le proxy
- L'API et React sont sur le même domaine
- Pas de problème CORS normalement

## 📋 Commandes Utiles

```bash
# Voir les volumes
docker volume ls

# Inspecter le volume des fichiers
docker volume inspect portfolio_admin_files

# Backup des fichiers
docker run --rm -v portfolio_admin_files:/data -v $(pwd):/backup alpine tar czf /backup/admin-files-backup.tar.gz -C /data .

# Restore des fichiers
docker run --rm -v portfolio_admin_files:/data -v $(pwd):/backup alpine tar xzf /backup/admin-files-backup.tar.gz -C /data
```