#!/usr/bin/env pwsh
# Firebase Environment Variable Setup Guide

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   FIREBASE CREDENTIALS SETUP" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 STEP-BY-STEP INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣ The Firebase JSON is already in your clipboard!" -ForegroundColor Green
Write-Host ""
Write-Host "2️⃣ Go to Render Dashboard:" -ForegroundColor Yellow
Write-Host "   https://dashboard.render.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣ Click on: entrysafe-website" -ForegroundColor Yellow
Write-Host ""
Write-Host "4️⃣ Click on: Environment tab" -ForegroundColor Yellow
Write-Host ""
Write-Host "5️⃣ Look for: FIREBASE_ADMIN_CREDENTIALS" -ForegroundColor Yellow
Write-Host "   (If not found, click 'Add Environment Variable')" -ForegroundColor Gray
Write-Host ""
Write-Host "6️⃣ Key: FIREBASE_ADMIN_CREDENTIALS" -ForegroundColor Yellow
Write-Host "   Value: Paste from clipboard (Ctrl+V)" -ForegroundColor Yellow
Write-Host ""
Write-Host "7️⃣ Click: Save Changes" -ForegroundColor Yellow
Write-Host ""
Write-Host "8️⃣ Click: Manual Deploy (top right)" -ForegroundColor Yellow
Write-Host ""
Write-Host "9️⃣ Wait 5-10 minutes for deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   WHAT TO WATCH FOR IN LOGS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ SUCCESS - Look for:" -ForegroundColor Green
Write-Host "   ✅ Firebase Admin SDK initialized (from environment variable)" -ForegroundColor Green
Write-Host "      Project ID: entry-safe" -ForegroundColor Gray
Write-Host ""
Write-Host "❌ FAILURE - Look for:" -ForegroundColor Red
Write-Host "   ❌ Firebase Admin SDK initialization error" -ForegroundColor Red
Write-Host "   ⚠️  Firebase credentials not found!" -ForegroundColor Red
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AFTER DEPLOYMENT COMPLETES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Run this command to verify:" -ForegroundColor Yellow
Write-Host "   .\entrysafe-backend\test-render-deployment.ps1`n" -ForegroundColor Cyan

Write-Host "Then test Flutter app:" -ForegroundColor Yellow
Write-Host "   cd C:\Users\Admin\AndroidStudioProjects\entry_safe" -ForegroundColor Cyan
Write-Host "   flutter run`n" -ForegroundColor Cyan

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PRESS ANY KEY WHEN READY" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Cyan

Read-Host "Press Enter after you've updated Render and deployment is LIVE"

Write-Host "`n🔍 Testing backend now...`n" -ForegroundColor Cyan

# Test backend health
try {
    $response = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/" -Method Get -TimeoutSec 30
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
    Write-Host "   Wait a few more minutes for deployment to complete`n" -ForegroundColor Yellow
    exit 1
}

# Test AI health
try {
    $response = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/api/ai/health" -Method Get -TimeoutSec 30
    Write-Host "✅ AI services configured`n" -ForegroundColor Green
} catch {
    Write-Host "❌ AI services not responding`n" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BACKEND READY!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🎉 Now test your Flutter app!" -ForegroundColor Green
Write-Host "   cd C:\Users\Admin\AndroidStudioProjects\entry_safe" -ForegroundColor Yellow
Write-Host "   flutter run`n" -ForegroundColor Yellow
