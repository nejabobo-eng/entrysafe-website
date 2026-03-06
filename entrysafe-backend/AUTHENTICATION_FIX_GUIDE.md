# 🔐 AUTHENTICATION FIX GUIDE - Entry Safe Backend

**Issue:** `Invalid authentication credentials` error when Flutter app calls FastAPI backend

**Location:** `C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend`

---

## 🎯 **QUICK DIAGNOSIS**

Run this checklist to identify the exact problem:

### **1. Check Firebase Admin SDK Initialization**

**Location:** `entrysafe-backend/app/auth.py`

```bash
# Check if firebase-admin.json exists
Test-Path "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend\firebase-admin.json"
```

**Expected:** `True`  
**If False:** Download service account key from Firebase Console

---

### **2. Verify Backend Logs**

**Start your backend and check logs:**

```bash
cd "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend"
uvicorn app.main:app --reload
```

**Look for:**
```
✅ Firebase Admin SDK initialized
```

**If you see:**
```
⚠️ Firebase Admin SDK not initialized
```

**Problem:** Missing or invalid `firebase-admin.json`

---

### **3. Test Token Verification Manually**

**Get a fresh token from Flutter:**

Add this temporarily to your Flutter code:

```dart
// In ai_service.dart, add debug logging
Future<void> sendMessage(String text, UserProfile profile) async {
  final idToken = await _auth.currentUser?.getIdToken(true);  // Force refresh
  
  debugPrint('🔑 Firebase Token: ${idToken?.substring(0, 50)}...');
  debugPrint('👤 User ID: ${_auth.currentUser?.uid}');
  
  // ... rest of your code
}
```

**Copy the token from console, then test with curl:**

```powershell
curl -X POST "https://entrysafe-website.onrender.com/api/ai/accounting" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -H "Content-Type: application/json" `
  -d '{"prompt": "test", "user_id": "test123"}'
```

**Expected Response:**
```json
{
  "response": "...",
  "data": {...}
}
```

**If you get 401 error:**  
Backend token verification is failing

---

## 🔧 **FIX #1: Update Flutter Token Handling**

**Problem:** Token expired or not refreshed

**Location:** `C:\Users\Admin\AndroidStudioProjects\entry_safe\lib\services\ai_service.dart`

**Current code (WRONG):**
```dart
final idToken = await _auth.currentUser?.getIdToken();
```

**Fixed code (CORRECT):**
```dart
final idToken = await _auth.currentUser?.getIdToken(true);  // ← Add true to force refresh
```

**Apply this fix:**

Find all instances of `getIdToken()` in your Flutter app and add the `true` parameter.

---

## 🔧 **FIX #2: Verify Backend Auth Configuration**

**Location:** `entrysafe-backend/app/auth.py`

**Check this file exists and has correct code:**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth, credentials, initialize_app
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "./firebase-admin.json")

try:
    if os.path.exists(FIREBASE_CREDENTIALS_PATH):
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        initialize_app(cred)
        print("✅ Firebase Admin SDK initialized")
    else:
        print("⚠️  Firebase credentials file not found at:", FIREBASE_CREDENTIALS_PATH)
        print("   Authentication will fail!")
except Exception as e:
    print(f"❌ Firebase Admin SDK initialization error: {e}")

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase JWT token"""
    token = credentials.credentials
    
    try:
        # Verify the token with Firebase Admin SDK
        decoded_token = auth.verify_id_token(token, check_revoked=True)
        
        print(f"✅ Token verified for user: {decoded_token.get('uid')}")
        
        return decoded_token
    except auth.ExpiredIdTokenError:
        print("❌ Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.RevokedIdTokenError:
        print("❌ Token revoked")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token revoked. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.InvalidIdTokenError:
        print("❌ Invalid token format")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"❌ Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(token_data: dict = Depends(verify_token)):
    """Get current user from token"""
    uid = token_data.get("uid")
    email = token_data.get("email")
    
    if not uid or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    return {
        "uid": uid,
        "email": email,
        "email_verified": token_data.get("email_verified", False)
    }
```

**Key additions:**
- `check_revoked=True` - Verify token hasn't been revoked
- Better error messages for expired/invalid tokens
- Debug logging to help identify issues

---

## 🔧 **FIX #3: Download Firebase Service Account Key**

**If `firebase-admin.json` is missing:**

### **Step 1: Go to Firebase Console**

1. Open: https://console.firebase.google.com
2. Select your Entry Safe project
3. Click the gear icon (⚙️) → Project Settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Save the file as `firebase-admin.json`

### **Step 2: Move to Backend Folder**

```powershell
Move-Item "path\to\downloaded\firebase-admin.json" "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend\firebase-admin.json"
```

### **Step 3: Verify File Exists**

```powershell
Test-Path "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend\firebase-admin.json"
```

Should return `True`

### **Step 4: Restart Backend**

```bash
cd "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend"
uvicorn app.main:app --reload
```

Look for: `✅ Firebase Admin SDK initialized`

---

## 🔧 **FIX #4: Update AI Service in Flutter**

**Location:** `C:\Users\Admin\AndroidStudioProjects\entry_safe\lib\services\ai_service.dart`

**Replace the `sendMessage` method:**

```dart
Future<void> sendMessage(String text, UserProfile profile) async {
  if (_userId.isEmpty) return;

  if (profile.subscriptionStatus != 'active') {
    throw Exception('Your subscription is not active. Please check your billing status.');
  }

  final userMessage = AIMessage(
    role: 'user',
    content: text,
    timestamp: DateTime.now(),
  );

  await _firestore
      .collection('users')
      .doc(_userId)
      .collection('ai_conversations')
      .doc('current_thread')
      .collection('messages')
      .add(userMessage.toMap());

  try {
    // CRITICAL: Force token refresh
    final idToken = await _auth.currentUser?.getIdToken(true);
    
    if (idToken == null) {
      throw Exception('Not signed in. Please sign in again.');
    }
    
    debugPrint('🔑 Token obtained (${idToken.length} chars)');
    debugPrint('🌐 Calling: $baseUrl/api/ai/accounting');

    final response = await http.post(
      Uri.parse('$baseUrl/api/ai/accounting'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $idToken',
      },
      body: jsonEncode({
        'prompt': text,
        'user_id': _userId,
      }),
    ).timeout(
      const Duration(seconds: 60),
      onTimeout: () {
        throw Exception('Request timed out. Backend may be sleeping (Render free tier). Try again in 30 seconds.');
      },
    );

    debugPrint('📡 Response status: ${response.statusCode}');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final String aiResponseContent = data['response'] ?? "I couldn't process that request.";
      final Map<String, dynamic>? transactionData = data['data'];

      final aiMessage = AIMessage(
        role: 'assistant',
        content: aiResponseContent,
        timestamp: DateTime.now(),
        data: transactionData,
      );

      await _firestore
          .collection('users')
          .doc(_userId)
          .collection('ai_conversations')
          .doc('current_thread')
          .collection('messages')
          .add(aiMessage.toMap());

    } else if (response.statusCode == 401) {
      debugPrint('❌ 401 Unauthorized - Token verification failed');
      throw Exception('Authentication failed. Please sign out and sign in again.');
    } else if (response.statusCode == 403) {
      throw Exception('AI limit exceeded or tier too low. Please upgrade.');
    } else {
      final errorBody = jsonDecode(response.body);
      debugPrint('❌ Error: ${errorBody['detail']}');
      throw Exception('Backend Error: ${errorBody['detail'] ?? response.reasonPhrase}');
    }

  } catch (e) {
    debugPrint('❌ Exception: $e');
    
    final errorMessage = AIMessage(
      role: 'assistant',
      content: "Error: ${e.toString().replaceAll('Exception: ', '')}",
      timestamp: DateTime.now(),
    );
    
    await _firestore
        .collection('users')
        .doc(_userId)
        .collection('ai_conversations')
        .doc('current_thread')
        .collection('messages')
        .add(errorMessage.toMap());
  }
}
```

**Key changes:**
- Added `getIdToken(true)` to force refresh
- Added null check for token
- Added timeout handling (60 seconds for Render free tier cold start)
- Added detailed debug logging
- Better error messages for 401 errors

---

## 🔧 **FIX #5: Add Retry Logic for Cold Starts**

**Problem:** Render free tier spins down after 15 minutes of inactivity

**Solution:** Add retry logic with better user feedback

```dart
// Add to ai_service.dart
Future<http.Response> _makeAuthenticatedRequest({
  required String url,
  required Map<String, dynamic> body,
  int maxRetries = 2,
}) async {
  int retries = 0;
  
  while (retries <= maxRetries) {
    try {
      final idToken = await _auth.currentUser?.getIdToken(true);
      
      if (idToken == null) {
        throw Exception('Not signed in');
      }
      
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $idToken',
        },
        body: jsonEncode(body),
      ).timeout(
        Duration(seconds: retries == 0 ? 60 : 30),  // First try: 60s, retry: 30s
      );
      
      return response;
      
    } on TimeoutException {
      if (retries < maxRetries) {
        retries++;
        debugPrint('⏱️ Timeout, retrying ($retries/$maxRetries)...');
        
        // Show "waking up backend" message on first timeout
        if (retries == 1) {
          await _firestore
              .collection('users')
              .doc(_userId)
              .collection('ai_conversations')
              .doc('current_thread')
              .collection('messages')
              .add(AIMessage(
                role: 'assistant',
                content: '⏳ AI assistant is waking up (Render free tier cold start). Please wait...',
                timestamp: DateTime.now(),
              ).toMap());
        }
        
        continue;
      }
      throw Exception('Backend is not responding. Please try again in 1 minute.');
    } catch (e) {
      if (retries < maxRetries) {
        retries++;
        debugPrint('❌ Error, retrying ($retries/$maxRetries): $e');
        await Future.delayed(Duration(seconds: 2));
        continue;
      }
      rethrow;
    }
  }
  
  throw Exception('Max retries exceeded');
}

// Update sendMessage to use this
Future<void> sendMessage(String text, UserProfile profile) async {
  // ... validation code ...
  
  try {
    final response = await _makeAuthenticatedRequest(
      url: '$baseUrl/api/ai/accounting',
      body: {
        'prompt': text,
        'user_id': _userId,
      },
    );
    
    // ... rest of response handling ...
  } catch (e) {
    // ... error handling ...
  }
}
```

---

## 🧪 **TESTING CHECKLIST**

### **Test 1: Backend Health Check**

```powershell
Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/" -Method Get
```

**Expected:**
```json
{
  "message": "EntrySafe API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

### **Test 2: Token Verification Test**

**Get a token from Flutter (add to your test code):**

```dart
void testAuth() async {
  final token = await FirebaseAuth.instance.currentUser?.getIdToken(true);
  print('Token: $token');
}
```

**Test with curl:**

```powershell
$token = "YOUR_TOKEN_HERE"

Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/api/ai/health" `
  -Method Get `
  -Headers @{
    "Authorization" = "Bearer $token"
  }
```

**Expected:** 200 OK

---

### **Test 3: AI Endpoint Test**

```powershell
$token = "YOUR_TOKEN_HERE"

Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/api/ai/accounting" `
  -Method Post `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
  } `
  -Body '{"prompt": "test", "user_id": "test123"}'
```

**Expected:**
```json
{
  "response": "...",
  "data": {...}
}
```

---

## 🐛 **COMMON ERRORS & SOLUTIONS**

### **Error: "Token expired. Please sign in again."**

**Cause:** Token older than 1 hour

**Solution:**
```dart
// Force refresh every time
final idToken = await _auth.currentUser?.getIdToken(true);
```

---

### **Error: "Invalid token format"**

**Cause:** Token not properly encoded or corrupted

**Solution:**
1. Check that token starts with `eyJ`
2. Verify no extra spaces in Authorization header
3. Sign out and sign in again in Flutter app

---

### **Error: "Firebase Admin SDK not initialized"**

**Cause:** Missing `firebase-admin.json`

**Solution:**
1. Download service account key from Firebase Console
2. Save as `firebase-admin.json` in backend root
3. Restart backend

---

### **Error: "No such file or directory: './firebase-admin.json'"**

**Cause:** Wrong path in backend

**Solution:**
Check `.env` file has correct path:
```
FIREBASE_CREDENTIALS_PATH=./firebase-admin.json
```

Or use absolute path:
```
FIREBASE_CREDENTIALS_PATH=C:/Users/Admin/source/repos/Entry Safe Website/entrysafe-backend/firebase-admin.json
```

---

## 🚀 **DEPLOYMENT FIX (If Backend is on Render.com)**

### **1. Add Firebase Credentials to Render**

Since you can't upload `firebase-admin.json` directly to Render, use environment variables:

**Option A: Upload as File**

1. Go to Render.com dashboard
2. Select your service
3. Go to "Environment" tab
4. Add Secret File:
   - Key: `FIREBASE_ADMIN_JSON`
   - File: Upload `firebase-admin.json`

**Then update backend code:**

```python
# app/auth.py
import json

# Try to load from environment variable first (for Render)
firebase_creds = os.getenv("FIREBASE_ADMIN_JSON")

if firebase_creds:
    # Parse JSON from environment variable
    cred_dict = json.loads(firebase_creds)
    cred = credentials.Certificate(cred_dict)
    initialize_app(cred)
    print("✅ Firebase Admin SDK initialized (from env)")
elif os.path.exists(FIREBASE_CREDENTIALS_PATH):
    # Load from file (for local development)
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    initialize_app(cred)
    print("✅ Firebase Admin SDK initialized (from file)")
else:
    print("❌ Firebase credentials not found!")
```

**Option B: Use Environment Variables**

Add these to Render environment:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

**Then update backend:**

```python
# app/auth.py
if os.getenv("FIREBASE_PROJECT_ID"):
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": os.getenv("FIREBASE_PROJECT_ID"),
        "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
        "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    })
    initialize_app(cred)
    print("✅ Firebase Admin SDK initialized (from env vars)")
```

---

## 📋 **FINAL CHECKLIST**

Before testing, verify:

- [ ] `firebase-admin.json` exists in backend folder
- [ ] Backend shows "✅ Firebase Admin SDK initialized" on startup
- [ ] Flutter app uses `getIdToken(true)` to force token refresh
- [ ] Authorization header format: `Bearer <token>` (with space)
- [ ] Backend `/api/ai/health` endpoint returns 200 OK
- [ ] Backend logs show "✅ Token verified for user: [uid]"
- [ ] No CORS errors in browser console (if testing web)
- [ ] Render environment variables set (if deployed)

---

## 🎯 **QUICK FIX SCRIPT**

**Run this to check everything:**

```powershell
# Check backend file
$backendPath = "C:\Users\Admin\source\repos\Entry Safe Website\entrysafe-backend"
$firebasePath = Join-Path $backendPath "firebase-admin.json"

Write-Host "Checking Firebase credentials..." -ForegroundColor Cyan

if (Test-Path $firebasePath) {
    Write-Host "✅ firebase-admin.json found" -ForegroundColor Green
    $size = (Get-Item $firebasePath).Length
    Write-Host "   File size: $size bytes" -ForegroundColor White
    
    if ($size -lt 100) {
        Write-Host "   ⚠️ Warning: File seems too small" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ firebase-admin.json NOT FOUND" -ForegroundColor Red
    Write-Host "   Download from: Firebase Console → Service Accounts" -ForegroundColor Yellow
}

Write-Host "`nTesting backend health..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/" -Method Get
    Write-Host "✅ Backend is online" -ForegroundColor Green
    Write-Host "   Version: $($health.version)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend is offline or unreachable" -ForegroundColor Red
}

Write-Host "`nChecking AI endpoints..." -ForegroundColor Cyan
try {
    $aiHealth = Invoke-RestMethod -Uri "https://entrysafe-website.onrender.com/api/ai/health" -Method Get
    Write-Host "✅ AI services configured" -ForegroundColor Green
} catch {
    Write-Host "❌ AI services not responding" -ForegroundColor Red
}

Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. If firebase-admin.json is missing, download it from Firebase Console"
Write-Host "2. Restart your backend server"
Write-Host "3. Test with: flutter run"
Write-Host "4. Send AI message: 'Add 1500 rand income'"
Write-Host "5. Check logs for '✅ Token verified'"
```

---

## 🆘 **STILL NOT WORKING?**

**Check backend logs on Render.com:**

1. Go to https://dashboard.render.com
2. Select your `entrysafe-website` service
3. Click "Logs" tab
4. Look for errors when Flutter app makes request

**Common log messages:**

✅ **Good:**
```
✅ Firebase Admin SDK initialized
✅ Token verified for user: abc123
```

❌ **Bad:**
```
❌ Firebase credentials file not found
❌ Token verification error: ...
❌ Invalid token format
```

**Share the exact error message from logs for specific help.**

---

**Status:** 🔧 Fix Ready  
**Estimated Time:** 15 minutes  
**Difficulty:** Medium

**After applying fixes, test with:**
```
"Add 1500 rand income from consulting"
```

Good luck! 🚀
