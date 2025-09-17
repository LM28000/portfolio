#!/bin/sh

# Script de démarrage pour le conteneur production
# Démarre nginx et le serveur API Node.js

echo "🚀 Démarrage du conteneur portfolio en production..."

# Créer les répertoires nécessaires
mkdir -p /app/admin-files/uploads
mkdir -p /var/log/nginx
mkdir -p /run/nginx

# Changer les permissions pour le stockage des fichiers
chown -R nodejs:nodejs /app/admin-files
chmod -R 755 /app/admin-files

echo "📁 Répertoires de stockage initialisés"

# Démarrer nginx en arrière-plan
echo "🌐 Démarrage de Nginx..."
nginx

# Vérifier que nginx a démarré
if ! pgrep nginx > /dev/null; then
    echo "❌ Erreur: Nginx n'a pas pu démarrer"
    exit 1
fi

echo "✅ Nginx démarré avec succès"

# Démarrer le serveur API Node.js
echo "🔧 Démarrage du serveur API Node.js..."
cd /app/api-server

# Démarrer l'API en arrière-plan
node server.js &
API_PID=$!

echo "✅ Serveur API démarré avec PID $API_PID"

# Fonction pour arrêter proprement les services
cleanup() {
    echo "🛑 Arrêt des services..."
    kill $API_PID 2>/dev/null
    nginx -s quit 2>/dev/null
    exit 0
}

# Capturer les signaux d'arrêt
trap cleanup TERM INT

echo "🎉 Portfolio démarré avec succès!"
echo "   - Frontend React: http://localhost/"
echo "   - API Backend: http://localhost/api/"
echo "   - Stockage fichiers: /app/admin-files/uploads/"

# Attendre que l'API se termine (keep container running)
wait $API_PID