# Script pour utiliser PHP portable sans installation
Write-Host "🎒 Configuration PHP Portable" -ForegroundColor Cyan

$portablePhpUrl = "https://windows.php.net/downloads/releases/php-8.2.12-Win32-vs16-x64.zip"
$localPhpPath = ".\php-portable"
$zipFile = "php-portable.zip"

try {
    Write-Host "📥 Téléchargement PHP portable..." -ForegroundColor Yellow
    
    # Créer dossier local
    if (!(Test-Path $localPhpPath)) {
        New-Item -ItemType Directory -Path $localPhpPath
    }
    
    # Télécharger et extraire localement
    Invoke-WebRequest -Uri $portablePhpUrl -OutFile $zipFile -UseBasicParsing
    Expand-Archive -Path $zipFile -DestinationPath $localPhpPath -Force
    Remove-Item $zipFile
    
    # Copier la configuration PHP
    Copy-Item "$localPhpPath\php.ini-development" "$localPhpPath\php.ini" -ErrorAction SilentlyContinue
    
    Write-Host "✅ PHP portable configuré dans: $localPhpPath" -ForegroundColor Green
    
    # Test
    $phpExe = "$localPhpPath\php.exe"
    if (Test-Path $phpExe) {
        Write-Host "🎯 Version:" -ForegroundColor Cyan
        & $phpExe --version
        
        Write-Host ""
        Write-Host "🚀 Démarrage du serveur avec PHP portable..." -ForegroundColor Green
        Write-Host "🌐 Serveur accessible sur: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "📂 API accessible via: http://localhost:8080/api/" -ForegroundColor Yellow
        Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Gray
        Write-Host ""
        
        # Créer dossiers nécessaires
        if (!(Test-Path "admin-files")) {
            New-Item -ItemType Directory -Path "admin-files"
            New-Item -ItemType Directory -Path "admin-files\uploads"
            Write-Host "📁 Dossiers admin-files créés" -ForegroundColor Green
        }
        
        # Démarrer le serveur
        & $phpExe -S localhost:8080 -t .
        
    } else {
        throw "PHP portable non trouvé"
    }
    
} catch {
    Write-Host "❌ ERREUR: $($_.Exception.Message)" -ForegroundColor Red
}