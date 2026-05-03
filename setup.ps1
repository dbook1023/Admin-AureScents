# AURE SCENTS - PROJECT SETUP SCRIPT
# This script automates the installation and configuration for new devices.

Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "   AURE SCENTS EXECUTIVE PORTFOLIO SETUP   " -ForegroundColor Gold -BackgroundColor DarkBlue
Write-Host "------------------------------------------------" -ForegroundColor Cyan

# 1. Install Dependencies
Write-Host "`n[1/3] Installing necessary dependencies..." -ForegroundColor Yellow
npm install

# 2. Configure Environment
Write-Host "`n[2/3] Configuring environment variables..." -ForegroundColor Yellow
if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "SUCCESS: .env file created from template." -ForegroundColor Green
    Write-Host "IMPORTANT: Please open .env and add your Supabase URL and Anon Key." -ForegroundColor Red
} else {
    Write-Host "NOTE: .env file already exists. Skipping..." -ForegroundColor Gray
}

# 3. Final Checks
Write-Host "`n[3/3] Project is ready for launch!" -ForegroundColor Yellow
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "QUICK START COMMANDS:" -ForegroundColor White
Write-Host "  npm run dev      - Starts the development server" -ForegroundColor Gray
Write-Host "  npm run build    - Prepares production bundle" -ForegroundColor Gray
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$launch = Read-Host "Would you like to start the development server now? (y/n)"
if ($launch -eq "y") {
    npm run dev
}
