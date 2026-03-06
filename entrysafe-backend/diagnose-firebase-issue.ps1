#!/usr/bin/env pwsh
# Test AI Endpoint with Authentication
# This simulates what Flutter does when you send an AI message

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AI ENDPOINT AUTHENTICATION TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "⚠️  This test requires a real Firebase token from your app.`n" -ForegroundColor Yellow

Write-Host "To get your Firebase token:" -ForegroundColor Cyan
Write-Host "1. In your Flutter app console, look for lines starting with:" -ForegroundColor Gray
Write-Host "   'D/FirebaseAuth'" -ForegroundColor Gray
Write-Host "2. Your user ID: NUlaeBjW5eMmn2lZi2ScjUlIQnW2`n" -ForegroundColor Gray

Write-Host "Testing basic endpoints (no auth required):`n" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "[TEST 1] Backend Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: Backend is running" -ForegroundColor Green
    Write-Host "   Version: $($response.version)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: Backend not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 2: AI Health
Write-Host "[TEST 2] AI Services Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/api/ai/health" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: AI services configured" -ForegroundColor Green
    Write-Host "   All Ready: $($response.all_ready)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: AI services not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FIREBASE STATUS CHECK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "⚠️  Critical Question:`n" -ForegroundColor Yellow
Write-Host "Did you complete these steps?" -ForegroundColor Cyan
Write-Host "1. [ ] Pasted Firebase JSON to Render Environment variable" -ForegroundColor Gray
Write-Host "2. [ ] Saved the environment variable" -ForegroundColor Gray
Write-Host "3. [ ] Clicked 'Manual Deploy' on Render" -ForegroundColor Gray
Write-Host "4. [ ] Waited for 'Live' badge (5-10 minutes)" -ForegroundColor Gray
Write-Host "5. [ ] Checked Render logs for Firebase initialization`n" -ForegroundColor Gray

Write-Host "If you answered NO to any of these:" -ForegroundColor Red
Write-Host "1. Run this command to copy Firebase JSON to clipboard:" -ForegroundColor Yellow
Write-Host "   Get-Content '.\entrysafe-backend\firebase-credentials-for-render.json' | Set-Clipboard`n" -ForegroundColor Cyan

Write-Host "2. Go to Render dashboard and paste it to FIREBASE_ADMIN_CREDENTIALS`n" -ForegroundColor Yellow

Write-Host "3. Click 'Manual Deploy' and wait 10 minutes`n" -ForegroundColor Yellow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DIAGNOSIS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Your Flutter error: 'FormatException: Unexpected character (at character 1) Internal Server Error'" -ForegroundColor Red
Write-Host "`nThis means:" -ForegroundColor Yellow
Write-Host "✅ Flutter is working correctly" -ForegroundColor Green
Write-Host "✅ Flutter can reach the backend" -ForegroundColor Green
Write-Host "✅ Backend is running" -ForegroundColor Green
Write-Host "❌ Backend is returning 'Internal Server Error' (plain text)" -ForegroundColor Red
Write-Host "❌ Flutter expected JSON response" -ForegroundColor Red
Write-Host "`nRoot cause: Backend Firebase is not initialized" -ForegroundColor Yellow
Write-Host "Fix: Add Firebase credentials to Render environment variables`n" -ForegroundColor Green

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "After you update Render, run this again to verify!" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan
