#!/bin/bash

# Script de test pour valider le déploiement de production
# Usage: ./test-production-deployment.sh [URL]

URL=${1:-"http://localhost:2368"}

echo "🧪 Test du déploiement de production"
echo "📍 URL testée: $URL"
echo "=================================="

# Test 1: Page d'accueil
echo "1. 🏠 Test de la page d'accueil..."
if curl -f -s "$URL" > /dev/null; then
    echo "   ✅ Page d'accueil accessible"
else
    echo "   ❌ Page d'accueil inaccessible"
fi

# Test 2: Page admin
echo "2. 👨‍💼 Test de la page admin..."
if curl -f -s "$URL/admin" > /dev/null; then
    echo "   ✅ Page admin accessible"
else
    echo "   ❌ Page admin inaccessible"
fi

# Test 3: Health check
echo "3. 🏥 Test du health check..."
HEALTH=$(curl -f -s "$URL/health")
if [ "$HEALTH" = "healthy" ]; then
    echo "   ✅ Health check OK: $HEALTH"
else
    echo "   ❌ Health check KO: $HEALTH"
fi

# Test 4: API de test
echo "4. 🔧 Test de l'API..."
API_RESPONSE=$(curl -f -s "$URL/api/test")
if echo "$API_RESPONSE" | grep -q "success"; then
    echo "   ✅ API accessible"
else
    echo "   ❌ API inaccessible: $API_RESPONSE"
fi

# Test 5: API avec authentification
echo "5. 🔐 Test de l'authentification API..."
AUTH_RESPONSE=$(curl -f -s -H "Authorization: Bearer admin123" "$URL/api/files")
if echo "$AUTH_RESPONSE" | grep -q "success"; then
    echo "   ✅ Authentification API OK"
else
    echo "   ❌ Authentification API KO"
fi

echo "=================================="
echo "🎯 Tests terminés !"
echo ""
echo "📝 Pour des tests plus poussés:"
echo "   - Testez l'upload de fichiers via l'interface admin"
echo "   - Vérifiez la persistance après redémarrage du conteneur"
echo "   - Testez la page $URL/test-api.html"