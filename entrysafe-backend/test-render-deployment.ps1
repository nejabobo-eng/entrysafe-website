#!/usr/bin/env pwsh
# Test Render Deployment - Run after "Live" badge appears

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   RENDER DEPLOYMENT TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "https://entrysafe-website.onrender.com"

# Test 1: Health Check
Write-Host "[TEST 1] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: API is running" -ForegroundColor Green
    Write-Host "   Version: $($response.version)" -ForegroundColor Gray
    Write-Host "   Status: $($response.status)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: Health check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Test 2: AI Health
Write-Host "[TEST 2] AI Services Health..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/health" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: AI services configured" -ForegroundColor Green
    Write-Host "   All Ready: $($response.all_ready)" -ForegroundColor Gray
    Write-Host "   Accounting: $($response.configured.accounting)" -ForegroundColor Gray
    Write-Host "   Docs: $($response.configured.docs)" -ForegroundColor Gray
    Write-Host "   Pricing: $($response.configured.pricing)" -ForegroundColor Gray
    Write-Host "   SDStorage: $($response.configured.sdstorage)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: AI health check failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "🎉 Backend is ready! Now test Flutter app:" -ForegroundColor Cyan
Write-Host "   cd C:\Users\Admin\AndroidStudioProjects\entry_safe" -ForegroundColor Yellow
Write-Host "   flutter run`n" -ForegroundColor Yellow

Write-Host "📱 In the app, send this test message:" -ForegroundColor Cyan
Write-Host "   'Add 1500 rand income from consulting'`n" -ForegroundColor Yellow

Write-Host "✅ Expected: AI responds within 5 seconds (or 30-60s if cold start)" -ForegroundColor Green
Write-Host "✅ Expected: Transaction created successfully" -ForegroundColor Green
Write-Host "✅ Expected: No authentication errors`n" -ForegroundColor Green
