# Script pour démarrer le serveur PHP intégré
# Utilise le serveur PHP intégré pour servir l'API

Write-Host "🚀 Démarrage du serveur PHP pour l'API Admin..." -ForegroundColor Cyan

# Vérifier si PHP est installé
try {
    $phpVersion = php --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PHP détecté: $($phpVersion.Split("`n")[0])" -ForegroundColor Green
    } else {
        throw "PHP non trouvé"
    }
} catch {
    Write-Host "❌ ERREUR: PHP n'est pas installé ou pas dans le PATH" -ForegroundColor Red
    Write-Host "📥 Installez PHP depuis: https://windows.php.net/download/" -ForegroundColor Yellow
    Write-Host "🍫 Ou via Chocolatey: choco install php" -ForegroundColor Yellow
    pause
    exit 1
}

# Créer le dossier admin-files s'il n'existe pas
if (!(Test-Path "admin-files")) {
    New-Item -ItemType Directory -Path "admin-files"
    New-Item -ItemType Directory -Path "admin-files/uploads"
    Write-Host "📁 Dossiers admin-files créés" -ForegroundColor Green
}

# Démarrer le serveur PHP sur le port 80 (nécessite admin) ou 8080
$port = 80
Write-Host "🌐 Tentative démarrage sur le port $port..." -ForegroundColor Yellow

try {
    # Tester si le port 80 est libre
    $portTest = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($portTest) {
        Write-Host "⚠️  Port 80 occupé, utilisation du port 8080" -ForegroundColor Yellow
        $port = 8080
    }
} catch {
    $port = 8080
}

Write-Host "🎯 Serveur PHP démarré sur: http://localhost:$port" -ForegroundColor Green
Write-Host "📂 Document root: $PWD" -ForegroundColor Gray
Write-Host "🔗 API accessible via: http://localhost:$port/api/" -ForegroundColor Cyan
Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

# Démarrer le serveur PHP
php -S localhost:$port -t .