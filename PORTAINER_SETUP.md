# 🚀 Déploiement Portfolio avec Portainer via GitHub

## 📋 Configuration Portainer Stack

### 1. **Créer une nouvelle Stack dans Portainer**

1. Aller dans **Stacks** → **Add stack**
2. Choisir **Repository** comme source
3. Configurer le repository :

```
Repository URL: https://github.com/LM28000/portfolio
Repository reference: refs/heads/main
Compose path: docker-compose.yml
```

### 2. **Variables d'environnement dans Portainer**

Dans l'onglet **Environment variables**, ajoutez :

```bash
# Port d'exposition (modifiable selon votre configuration)
PORTFOLIO_PORT=2368

# Token admin (CHANGEZ EN PRODUCTION!)
ADMIN_TOKEN=votre_token_securise_ici

# Configuration EmailJS (déjà dans le compose)
VITE_EMAILJS_SERVICE_ID=service_k0yp7g8
VITE_EMAILJS_TEMPLATE_ID=template_qjmmeea
VITE_EMAILJS_PUBLIC_KEY=989Z7HW0nw_PZ3wE7

# Google Analytics
VITE_GA_TRACKING_ID=G-DZVTZVB6CJ
```

### 3. **Configuration avancée**

#### **Auto-update avec Webhook (optionnel)**

1. Dans Portainer, activez **Automatic updates**
2. Copiez l'URL du webhook
3. Dans GitHub → Settings → Webhooks, ajoutez l'URL Portainer

#### **Surveillance avec Health Check**

Le conteneur inclut un health check automatique :
- **URL** : `http://votre-domaine/health`
- **Intervalle** : 30s
- **Timeout** : 10s

## 🔧 Structure des URLs

Une fois déployé, votre application sera accessible :

```
🌐 Site principal    : http://votre-domaine:2368/
👨‍💼 Interface admin  : http://votre-domaine:2368/admin
🔧 API Backend      : http://votre-domaine:2368/api/
🏥 Health Check     : http://votre-domaine:2368/health
🧪 Test API         : http://votre-domaine:2368/test-api.html
```

## 📁 Persistance des Données

### **Volume Docker automatique**

Le `docker-compose.yml` crée automatiquement :

```yaml
volumes:
  admin_files:
    driver: local
```

### **Localisation des fichiers**

Sur votre serveur Docker :
```bash
# Voir les volumes
docker volume ls | grep admin_files

# Accéder aux fichiers
docker run --rm -v portfolio_admin_files:/data alpine ls -la /data
```

## 🔄 Processus de Mise à Jour

### **Via GitHub Push (Automatique)**

1. **Poussez vos modifications** vers la branche `main`
2. **Portainer détecte** les changements (si webhook configuré)
3. **Rebuild automatique** du conteneur
4. **Volume préservé** - fichiers admin conservés

### **Via Portainer Manuel**

1. Dans Portainer → **Stacks** → Votre stack
2. Cliquer sur **Update the stack**
3. Portainer récupère la dernière version GitHub
4. Redéploie avec les nouvelles modifications

## 🛡️ Sécurité en Production

### **Recommandations importantes**

```bash
# 1. Changez le token admin
ADMIN_TOKEN=un_token_tres_securise_unique

# 2. Configurez un reverse proxy (Traefik/Nginx)
# Pour HTTPS et nom de domaine

# 3. Limitez l'accès à l'admin par IP si possible
# Via votre reverse proxy ou firewall
```

### **Backup des fichiers admin**

```bash
# Sauvegarde
docker run --rm \
  -v portfolio_admin_files:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/admin-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restauration
docker run --rm \
  -v portfolio_admin_files:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/admin-backup-YYYYMMDD.tar.gz -C /data
```

## 🔍 Troubleshooting

### **Container ne démarre pas**

```bash
# Vérifier les logs
docker logs portfolio-production

# Vérifier la configuration
docker-compose config
```

### **API inaccessible**

```bash
# Tester depuis le serveur
curl http://localhost:2368/health
curl http://localhost:2368/api/test

# Vérifier les ports
netstat -tlnp | grep :2368
```

### **Fichiers non sauvegardés**

```bash
# Vérifier le volume
docker volume inspect portfolio_admin_files

# Vérifier les permissions dans le container
docker exec portfolio-production ls -la /app/admin-files
```

## 📱 Monitoring

### **Logs utiles**

```bash
# Logs application
docker logs -f portfolio-production

# Logs Nginx (si volume activé)
docker exec portfolio-production tail -f /var/log/nginx/access.log

# Logs API Node.js
docker exec portfolio-production ps aux | grep node
```

### **Métriques de santé**

- **Health endpoint** : `GET /health` → `"healthy"`
- **API test** : `GET /api/test` → `{"success": true}`
- **Auth test** : `GET /api/files` avec header `Authorization: Bearer <token>`

## 🎯 Configuration Portainer finale

**Nom de la stack** : `portfolio-production`

**Repository** :
- URL : `https://github.com/LM28000/portfolio`
- Branch : `main`
- Compose file : `docker-compose.yml`

**Variables d'environnement** :
```
ADMIN_TOKEN=changez_moi_en_production
PORTFOLIO_PORT=2368
```

**Options** :
- ✅ Auto-update enabled
- ✅ Prune unused images
- ✅ Enable access control