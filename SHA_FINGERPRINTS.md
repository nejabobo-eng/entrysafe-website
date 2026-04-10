# 🔑 Firebase SHA Fingerprints for Entry Safe

**Date:** March 7, 2026  
**Project:** Entry Safe  
**Package:** `com.mluaccounting.entrysafe.entry_safe`

---

## 📋 Current SHA Fingerprints

### ✅ Already Registered in Firebase (Release):
```
SHA-1: c0:fd:4c:1e:93:f2:27:de:cb:d4:41:ba:8a:4f:21:c1:09:67:d7:72
```

### ⚠️ **MISSING - Debug Key (Add This Now):**
```
SHA-1: E5:40:91:F3:10:93:F9:4A:9F:A2:04:98:42:3B:1A:48:6A:B0:3B:3E
SHA-256: FD:39:0B:C9:E1:4B:95:6B:1F:F8:7A:90:D0:C7:D0:8B:B9:6A:F4:D6:11:02:77:87:9B:3E:EB:69:EF:73:DD:7F
```

---

## 🚀 How to Add Debug SHA to Firebase

**1. Go to Firebase Console:**
```
https://console.firebase.google.com/project/entry-safe/settings/general
```

**2. Scroll to "Your apps" → Click on:**
```
Entry Safe Accounting
com.mluaccounting.entrysafe.entry_safe
```

**3. Click "Add fingerprint" button**

**4. Paste this SHA-1:**
```
E5:40:91:F3:10:93:F9:4A:9F:A2:04:98:42:3B:1A:48:6A:B0:3B:3E
```

**5. Save**

**6. Download new google-services.json**

**7. Replace file:**
```
C:\Users\Admin\AndroidStudioProjects\entry_safe\android\app\google-services.json
```

**8. Clean and rebuild:**
```powershell
cd "C:\Users\Admin\AndroidStudioProjects\entry_safe"
flutter clean
flutter pub get
flutter run -d R58T41XLHEJ
```

---

## 🔍 Why This Fixes the Error

**The error you saw:**
```
E/GoogleApiManager: DEVELOPER_ERROR
E/GoogleApiManager: Unknown calling package name 'com.google.android.gms'
```

**Root cause:**  
When you run `flutter run`, Android uses the **debug keystore**, which has a different SHA-1 than the release key Firebase currently has registered.

**What happens after adding debug SHA:**
- ✅ Google Play Services can verify your app during development
- ✅ Google Sign-In works in debug mode
- ✅ No more DEVELOPER_ERROR warnings

---

## 📊 Verification

After completing steps above, run the app and check logs:

**Before (Error):**
```
E/GoogleApiManager: DEVELOPER_ERROR
W/GoogleApiManager: Not showing notification since connectionResult is not user-facing
```

**After (Fixed):**
```
(No GoogleApiManager errors)
```

---

## 🎯 Quick Copy-Paste

**Debug SHA-1 (Copy This):**
```
E5:40:91:F3:10:93:F9:4A:9F:A2:04:98:42:3B:1A:48:6A:B0:3B:3E
```

**Release SHA-1 (Already Registered):**
```
c0:fd:4c:1e:93:f2:27:de:cb:d4:41:ba:8a:4f:21:c1:09:67:d7:72
```

---

**Status:** Ready to add to Firebase Console 🚀
