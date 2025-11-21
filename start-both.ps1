# PowerShell script to start both Admin Panel and Main App
# Usage: .\start-both.ps1

Write-Host "Starting Montevideo Recycling App System..." -ForegroundColor Green
Write-Host ""

# Start Admin Panel
Write-Host "Starting Admin Panel..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Recycling_Scheduler_Admin; npm run dev"

# Wait a moment for the first terminal to open
Start-Sleep -Seconds 2

# Start Main App
Write-Host "Starting Main App (Expo)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

Write-Host ""
Write-Host "Both applications are starting..." -ForegroundColor Green
Write-Host "Admin Panel: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Main App (Expo): Choose platform from Expo menu" -ForegroundColor Yellow
Write-Host "  Press 'w' for web, 'a' for Android, 'i' for iOS" -ForegroundColor Gray
Write-Host ""
Write-Host "Login Credentials:" -ForegroundColor Magenta
Write-Host "  Admin - username: admin, password: admin123" -ForegroundColor White
Write-Host "  Driver - username: demo, password: demo123" -ForegroundColor White

