# QR Attendance System - Deployment Helper Script
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  QR Attendance - Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Git not initialized. Initializing now..." -ForegroundColor Yellow
    git init
    Write-Host "Git initialized" -ForegroundColor Green
    Write-Host ""
}

# Check if files are committed
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Uncommitted changes found. Adding files..." -ForegroundColor Yellow
    git add .
    Write-Host "Files added" -ForegroundColor Green
    Write-Host ""
    
    $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
    if ([string]::IsNullOrWhiteSpace($commitMsg)) {
        $commitMsg = "Ready for Vercel deployment"
    }
    git commit -m $commitMsg
    Write-Host "Files committed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "All files are committed" -ForegroundColor Green
    Write-Host ""
}

# Check if remote is set
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "GitHub remote not set." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To set up GitHub remote, run:" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/qr-attendance-system.git" -ForegroundColor Gray
    Write-Host "  git branch -M main" -ForegroundColor Gray
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "GitHub remote configured: $remote" -ForegroundColor Green
    Write-Host ""
    Write-Host "To push to GitHub, run:" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    Write-Host ""
}

# Generate Firebase Service Account JSON
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Firebase Service Account JSON" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "prepare-vercel-env.js") {
    Write-Host "Generating Firebase JSON for Vercel..." -ForegroundColor Yellow
    Write-Host ""
    node prepare-vercel-env.js
} else {
    Write-Host "prepare-vercel-env.js not found" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Push code to GitHub:" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor White
Write-Host ""

Write-Host "2. Go to Vercel:" -ForegroundColor Yellow
Write-Host "   https://vercel.com" -ForegroundColor White
Write-Host ""

Write-Host "3. Import your GitHub repository" -ForegroundColor Yellow
Write-Host ""

Write-Host "4. Add environment variables (see VERCEL_ENV_VARIABLES_GUIDE.md)" -ForegroundColor Yellow
Write-Host ""

Write-Host "5. Deploy!" -ForegroundColor Yellow
Write-Host ""

Write-Host "Full guide: DEPLOY_NOW.md" -ForegroundColor Green
Write-Host ""
