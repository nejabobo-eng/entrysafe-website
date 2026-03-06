# 🧪 Complete Backend & Authentication Test Suite
# Run this to diagnose all authentication issues

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔐 ENTRY SAFE AUTHENTICATION TEST SUITE" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: Firebase Credentials
Write-Host "━━━ Test 1: Firebase Credentials ━━━" -ForegroundColor Yellow
$firebasePath = "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend\firebase-admin.json"
if (Test-Path $firebasePath) {
    $size = (Get-Item $firebasePath).Length
    Write-Host "✅ PASS: firebase-admin.json found" -ForegroundColor Green
    Write-Host "   📄 Size: $size bytes" -ForegroundColor Gray
    
    if ($size -lt 500) {
        Write-Host "   ⚠️  WARNING: File seems small, verify it's valid JSON" -ForegroundColor Yellow
        $allPassed = $false
    }
} else {
    Write-Host "❌ FAIL: firebase-admin.json NOT FOUND" -ForegroundColor Red
    Write-Host "   👉 Download from Firebase Console → Service Accounts" -ForegroundColor Yellow
    $allPassed = $false
}
Write-Host ""

# Test 2: Backend Health
Write-Host "━━━ Test 2: Backend Health ━━━" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/" -Method Get -TimeoutSec 60
    Write-Host "✅ PASS: Backend is online" -ForegroundColor Green
    Write-Host "   📦 Version: $($health.version)" -ForegroundColor Gray
    Write-Host "   🏥 Status: $($health.status)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: Backend unreachable" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $allPassed = $false
}
Write-Host ""

# Test 3: AI Services
Write-Host "━━━ Test 3: AI Services ━━━" -ForegroundColor Yellow
try {
    $aiHealth = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/api/ai/health" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: AI services configured" -ForegroundColor Green
    Write-Host "   🤖 All Ready: $($aiHealth.all_ready)" -ForegroundColor Gray
    Write-Host "   📝 Accounting: $($aiHealth.configured.accounting)" -ForegroundColor Gray
    Write-Host "   📄 Docs: $($aiHealth.configured.docs)" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: AI services error" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    $allPassed = $false
}
Write-Host ""

# Test 4: Backend Files
Write-Host "━━━ Test 4: Backend Files ━━━" -ForegroundColor Yellow
$backendPath = "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend"
$requiredFiles = @("app/auth.py", "app/main.py", ".env", "requirements.txt")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    $fullPath = Join-Path $backendPath $file
    if (Test-Path $fullPath) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (MISSING)" -ForegroundColor Red
        $missingFiles += $file
        $allPassed = $false
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "✅ PASS: All required files present" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Missing $($missingFiles.Count) files" -ForegroundColor Red
}
Write-Host ""

# Test 5: Flutter App Files
Write-Host "━━━ Test 5: Flutter App Files ━━━" -ForegroundColor Yellow
$flutterPath = "C:\Users\Admin\AndroidStudioProjects\entry_safe"
$flutterFiles = @(
    "lib/services/ai_service.dart",
    "lib/screens/ai_command_center_screen.dart",
    "pubspec.yaml"
)
$missingFlutterFiles = @()

foreach ($file in $flutterFiles) {
    $fullPath = Join-Path $flutterPath $file
    if (Test-Path $fullPath) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file (MISSING)" -ForegroundColor Red
        $missingFlutterFiles += $file
        $allPassed = $false
    }
}

if ($missingFlutterFiles.Count -eq 0) {
    Write-Host "✅ PASS: All Flutter files present" -ForegroundColor Green
} else {
    Write-Host "❌ FAIL: Missing $($missingFlutterFiles.Count) Flutter files" -ForegroundColor Red
}
Write-Host ""

# Test 6: Check Flutter ai_service.dart for token refresh
Write-Host "━━━ Test 6: Flutter Token Refresh Check ━━━" -ForegroundColor Yellow
$aiServicePath = "C:\Users\Admin\AndroidStudioProjects\entry_safe\lib\services\ai_service.dart"
if (Test-Path $aiServicePath) {
    $content = Get-Content $aiServicePath -Raw
    if ($content -match "getIdToken\(true\)") {
        Write-Host "✅ PASS: Token refresh (getIdToken(true)) is implemented" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL: Token refresh NOT found" -ForegroundColor Red
        Write-Host "   👉 Update to: getIdToken(true)" -ForegroundColor Yellow
        $allPassed = $false
    }
} else {
    Write-Host "❌ FAIL: ai_service.dart not found" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Test 7: Check auth.py for improved error handling
Write-Host "━━━ Test 7: Backend Auth Error Handling ━━━" -ForegroundColor Yellow
$authPath = Join-Path $backendPath "app/auth.py"
if (Test-Path $authPath) {
    $authContent = Get-Content $authPath -Raw
    $hasCheckRevoked = $authContent -match "check_revoked=True"
    $hasExpiredError = $authContent -match "ExpiredIdTokenError"
    $hasRevokedError = $authContent -match "RevokedIdTokenError"
    
    if ($hasCheckRevoked -and $hasExpiredError -and $hasRevokedError) {
        Write-Host "✅ PASS: Enhanced error handling implemented" -ForegroundColor Green
        Write-Host "   ✓ check_revoked parameter" -ForegroundColor Gray
        Write-Host "   ✓ ExpiredIdTokenError handling" -ForegroundColor Gray
        Write-Host "   ✓ RevokedIdTokenError handling" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  WARNING: Missing some error handlers" -ForegroundColor Yellow
        if (-not $hasCheckRevoked) {
            Write-Host "   ✗ check_revoked parameter" -ForegroundColor Red
        }
        if (-not $hasExpiredError) {
            Write-Host "   ✗ ExpiredIdTokenError handling" -ForegroundColor Red
        }
        if (-not $hasRevokedError) {
            Write-Host "   ✗ RevokedIdTokenError handling" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ FAIL: auth.py not found" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "   ✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "   🎉 Your backend is properly configured!" -ForegroundColor White
    Write-Host ""
    Write-Host "   📱 Next steps:" -ForegroundColor Yellow
    Write-Host "      1. Run: flutter pub get" -ForegroundColor White
    Write-Host "      2. Run: flutter run" -ForegroundColor White
    Write-Host "      3. Test AI: 'Add 1500 rand income from consulting'" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "   ❌ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "   🔧 Review the failures above and:" -ForegroundColor Yellow
    Write-Host "      1. Fix missing files" -ForegroundColor White
    Write-Host "      2. Apply recommended code changes" -ForegroundColor White
    Write-Host "      3. Run this script again" -ForegroundColor White
    Write-Host ""
}
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Advanced: Show authentication flow
Write-Host "━━━ Understanding the Auth Flow ━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Flutter App:" -ForegroundColor Yellow
Write-Host "   • User signs in with Google (Firebase)" -ForegroundColor White
Write-Host "   • Gets Firebase ID token" -ForegroundColor White
Write-Host "   • Calls: getIdToken(true) to refresh" -ForegroundColor Green
Write-Host ""
Write-Host "2️⃣  HTTP Request:" -ForegroundColor Yellow
Write-Host "   • Header: Authorization: Bearer <token>" -ForegroundColor White
Write-Host "   • Endpoint: $baseUrl/api/ai/accounting" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  FastAPI Backend:" -ForegroundColor Yellow
Write-Host "   • Receives token in Authorization header" -ForegroundColor White
Write-Host "   • Calls: auth.verify_id_token(token, check_revoked=True)" -ForegroundColor Green
Write-Host "   • Returns user data or 401 error" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Common Issues:" -ForegroundColor Yellow
Write-Host "   • Token expired → Use getIdToken(true)" -ForegroundColor White
Write-Host "   • firebase-admin.json missing → Download from Firebase" -ForegroundColor White
Write-Host "   • Backend cold start → First request takes 30-60s" -ForegroundColor White
Write-Host ""
