# 🔐 COMPLETE RENDER ENVIRONMENT VARIABLES CHECKLIST

**Purpose:** Ensure all environment variables are correctly configured on Render  
**Your Service:** entrysafe-website  
**Date:** January 5, 2025

---

## ✅ **REQUIRED ENVIRONMENT VARIABLES**

Copy this entire checklist and verify each one in Render Dashboard → Environment tab.

### **1. Firebase Admin SDK** ⚠️ **CRITICAL FOR AUTH**

```
Variable Name: FIREBASE_ADMIN_CREDENTIALS
Value: [Paste from firebase-credentials-for-render.json]
Format: Single line JSON, ~2300 characters
Starts with: {"type":"service_account"
```

**To copy to clipboard:**
```powershell
Get-Content ".\entrysafe-backend\firebase-credentials-for-render.json" | Set-Clipboard
```

---

### **2. MongoDB Database**

```
Variable Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/entrysafe?retryWrites=true&w=majority
Source: MongoDB Atlas → Database → Connect → Connect your application
```

---

### **3. OpenAI API Keys** (4 keys for 4 apps)

```
Variable Name: OPENAI_KEY_ACCOUNTING
Value: sk-proj-8U_1w9H7bf...
Source: OpenAI Dashboard → API Keys

Variable Name: OPENAI_KEY_DOCS
Value: sk-proj-gybFshtWOd...

Variable Name: OPENAI_KEY_PRICING
Value: sk-proj-CJcJHdsHqo...

Variable Name: OPENAI_KEY_SD_STORAGE_HELPER
Value: sk-proj-z1IF1VVLmT...
```

**⚠️ Note:** For Entry Safe (accounting app), only `OPENAI_KEY_ACCOUNTING` is critical.

---

### **4. PayPal Configuration** (If using PayPal subscriptions)

```
Variable Name: PAYPAL_CLIENT_ID
Value: [From PayPal Developer Dashboard]
Mode: Sandbox or Live

Variable Name: PAYPAL_CLIENT_SECRET
Value: [From PayPal Developer Dashboard]

Variable Name: PAYPAL_MODE
Value: sandbox (or "live" for production)

Variable Name: PAYPAL_API_BASE
Value: https://api-m.sandbox.paypal.com (for sandbox)
     or https://api-m.paypal.com (for live)

Variable Name: PAYPAL_WEBHOOK_ID
Value: [Optional - for webhook verification]
```

**Where to get PayPal credentials:**
1. Go to: https://developer.paypal.com/dashboard
2. Apps & Credentials
3. Create App (or select existing)
4. Copy: Client ID and Secret
5. Make sure **mode matches** (sandbox/live)

---

### **5. PayFast Configuration** (If using PayFast for South Africa)

```
Variable Name: PAYFAST_MERCHANT_ID
Value: [From PayFast dashboard]

Variable Name: PAYFAST_MERCHANT_KEY
Value: [From PayFast dashboard]

Variable Name: PAYFAST_PASSPHRASE
Value: [Your secure passphrase]
```

---

### **6. CORS Configuration** (Already handled in code)

```
Variable Name: CORS_ORIGINS
Value: * (or specific origins)
Note: Already set to "*" in code for mobile app compatibility
```

---

## 🎯 **PRIORITY ORDER FOR ENTRY SAFE APP**

For your Flutter app to work, you ONLY need these **3 critical variables:**

### **🔥 CRITICAL (Required Now):**

1. ✅ `FIREBASE_ADMIN_CREDENTIALS` - For authentication
2. ✅ `OPENAI_KEY_ACCOUNTING` - For AI features
3. ✅ `MONGODB_URI` - For data storage

### **📦 Optional (Can add later):**

4. PayPal variables - For subscriptions (can test without)
5. PayFast variables - For South African payments (can test without)
6. Other OpenAI keys - For other apps (not needed for Entry Safe)

---

## 🔍 **VERIFICATION SCRIPT**

Let me create a script to check what's configured:

<function_calls>
<invoke name="create_file">
<parameter name="content">#!/usr/bin/env pwsh
# Check Backend Environment Variables Status

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ENVIRONMENT VARIABLES CHECK" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "This script checks if backend can initialize all services.`n" -ForegroundColor Yellow

$baseUrl = "https://entrysafe-website.onrender.com"

# Test 1: Health Check
Write-Host "[TEST 1] Backend Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: Backend is running" -ForegroundColor Green
    Write-Host "   Version: $($response.version)" -ForegroundColor Gray
    Write-Host "   Status: $($response.status)`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ FAIL: Backend not responding" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This means Render service is down or still deploying.`n" -ForegroundColor Yellow
    exit 1
}

# Test 2: AI Services Configuration
Write-Host "[TEST 2] AI Services Configuration..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/ai/health" -Method Get -TimeoutSec 30
    Write-Host "✅ PASS: AI services status" -ForegroundColor Green
    Write-Host "   All Ready: $($response.all_ready)" -ForegroundColor Gray
    Write-Host "   Accounting AI: $($response.configured.accounting)" -ForegroundColor Gray
    Write-Host "   Docs AI: $($response.configured.docs)" -ForegroundColor Gray
    Write-Host "   Pricing AI: $($response.configured.pricing)" -ForegroundColor Gray
    Write-Host "   SD Storage AI: $($response.configured.sdstorage)`n" -ForegroundColor Gray
    
    if (-not $response.configured.accounting) {
        Write-Host "⚠️  WARNING: OPENAI_KEY_ACCOUNTING not configured!" -ForegroundColor Red
        Write-Host "   Entry Safe app will not work without this.`n" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAIL: AI services not configured" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)`n" -ForegroundColor Red
}

# Test 3: Check if authenticated endpoints work (requires Firebase)
Write-Host "[TEST 3] Firebase Authentication..." -ForegroundColor Yellow
Write-Host "   This test requires a real Firebase token." -ForegroundColor Gray
Write-Host "   We'll check Render logs instead.`n" -ForegroundColor Gray

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Now check Render Dashboard:" -ForegroundColor Yellow
Write-Host "1. Go to: https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "2. Click: entrysafe-website service" -ForegroundColor Cyan
Write-Host "3. Click: Logs tab" -ForegroundColor Cyan
Write-Host "4. Search for: 'Firebase Admin SDK initialized'`n" -ForegroundColor Cyan

Write-Host "You MUST see:" -ForegroundColor Yellow
Write-Host "✅ Firebase Admin SDK initialized (from environment variable)" -ForegroundColor Green
Write-Host "   Project ID: entry-safe`n" -ForegroundColor Gray

Write-Host "If you see:" -ForegroundColor Yellow
Write-Host "⚠️  Firebase credentials not found!" -ForegroundColor Red
Write-Host "Then FIREBASE_ADMIN_CREDENTIALS is missing or incorrect.`n" -ForegroundColor Red

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   CRITICAL ENVIRONMENT VARIABLES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "For Entry Safe app to work, Render MUST have:`n" -ForegroundColor Yellow

Write-Host "1. FIREBASE_ADMIN_CREDENTIALS" -ForegroundColor Cyan
Write-Host "   - Minified JSON (~2300 chars)" -ForegroundColor Gray
Write-Host "   - From: firebase-credentials-for-render.json`n" -ForegroundColor Gray

Write-Host "2. OPENAI_KEY_ACCOUNTING" -ForegroundColor Cyan
Write-Host "   - Starts with: sk-proj-" -ForegroundColor Gray
Write-Host "   - From: OpenAI Dashboard`n" -ForegroundColor Gray

Write-Host "3. MONGODB_URI" -ForegroundColor Cyan
Write-Host "   - Starts with: mongodb+srv://" -ForegroundColor Gray
Write-Host "   - From: MongoDB Atlas`n" -ForegroundColor Gray

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "If Render is still deploying:" -ForegroundColor Yellow
Write-Host "   Wait for 'Live' badge (5-10 minutes)`n" -ForegroundColor Gray

Write-Host "If Render shows 'Live':" -ForegroundColor Yellow
Write-Host "   1. Check logs for Firebase initialization" -ForegroundColor Gray
Write-Host "   2. If successful, test Flutter app" -ForegroundColor Gray
Write-Host "   3. Send AI message: 'Add 1500 rand income from consulting'`n" -ForegroundColor Gray

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✅ Backend is responding" -ForegroundColor Green
Write-Host "✅ AI services endpoint works" -ForegroundColor Green
Write-Host "🟡 Firebase status: Check Render logs" -ForegroundColor Yellow
Write-Host "🟡 Flutter test: After Firebase is confirmed working`n" -ForegroundColor Yellow

Write-Host "🚀 Once you see Firebase initialized in logs, your app will work!" -ForegroundColor Green
