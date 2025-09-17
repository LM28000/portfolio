# Script d'installation PHP manuelle
Write-Host "📥 Installation PHP manuelle" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Allez sur: https://windows.php.net/download/" -ForegroundColor Yellow
Write-Host "2️⃣  Téléchargez 'PHP 8.x VC15 x64 Thread Safe'" -ForegroundColor Yellow
Write-Host "3️⃣  Extraire dans C:\php\" -ForegroundColor Yellow
Write-Host "4️⃣  Ajouter C:\php au PATH Windows" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Ou utilisez ce script PowerShell automatique:" -ForegroundColor Green
Write-Host ""

# Variables
$phpVersion = "8.2.12"
$phpUrl = "https://windows.php.net/downloads/releases/php-$phpVersion-Win32-vs16-x64.zip"
$installPath = "C:\php"
$zipPath = "$env:TEMP\php.zip"

Write-Host "📂 Téléchargement de PHP $phpVersion..." -ForegroundColor Yellow

try {
    # Créer le dossier d'installation
    if (!(Test-Path $installPath)) {
        New-Item -ItemType Directory -Path $installPath -Force
    }

    # Télécharger PHP
    Write-Host "⬇️  Téléchargement depuis: $phpUrl" -ForegroundColor Gray
    Invoke-WebRequest -Uri $phpUrl -OutFile $zipPath -UseBasicParsing

    # Extraire
    Write-Host "📦 Extraction vers: $installPath" -ForegroundColor Gray
    Expand-Archive -Path $zipPath -DestinationPath $installPath -Force

    # Nettoyer
    Remove-Item $zipPath -Force

    # Vérifier l'installation
    $phpExe = "$installPath\php.exe"
    if (Test-Path $phpExe) {
        Write-Host "✅ PHP installé avec succès!" -ForegroundColor Green
        
        # Ajouter au PATH pour cette session
        $env:PATH += ";$installPath"
        
        Write-Host "🎯 Version installée:" -ForegroundColor Cyan
        & $phpExe --version
        
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Ajoutez manuellement C:\php au PATH Windows" -ForegroundColor Yellow
        Write-Host "   (Panneau de configuration > Système > Variables d'environnement)" -ForegroundColor Gray
    } else {
        throw "Fichier php.exe non trouvé après extraction"
    }

} catch {
    Write-Host "❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔄 Essayez l'installation manuelle" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Une fois PHP installé, exécutez:" -ForegroundColor Green
Write-Host "   .\start-php-server.ps1" -ForegroundColor White