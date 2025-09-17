# Instructions pour XAMPP
# Alternative complète avec Apache + PHP + MySQL

Write-Host "📋 Instructions pour installer XAMPP:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Télécharger XAMPP depuis: https://www.apachefriends.org/" -ForegroundColor Yellow
Write-Host "2️⃣  Installer XAMPP (généralement dans C:\xampp)" -ForegroundColor Yellow
Write-Host "3️⃣  Démarrer Apache depuis le XAMPP Control Panel" -ForegroundColor Yellow
Write-Host "4️⃣  Copier le dossier 'api' vers C:\xampp\htdocs\portfolio\" -ForegroundColor Yellow
Write-Host "5️⃣  Créer le dossier C:\xampp\htdocs\portfolio\admin-files\" -ForegroundColor Yellow
Write-Host "6️⃣  L'API sera accessible via: http://localhost/portfolio/api/" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Puis modifier adminFileService.ts:" -ForegroundColor Cyan
Write-Host "   baseUrl = 'http://localhost/portfolio/api'" -ForegroundColor Gray
Write-Host ""