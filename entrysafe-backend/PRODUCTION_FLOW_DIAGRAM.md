# 🎨 ENTRYSAFE PRODUCTION FLOW DIAGRAM

**Author:** Mlungisi Mncube  
**Date:** January 2025  
**Purpose:** Visual guide to EntrySafe full-stack architecture and payment flow  
**Companion to:** GO_LIVE_CHECKLIST.md

---

## 🏗️ **ARCHITECTURE OVERVIEW**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ENTRYSAFE SAAS PLATFORM                            │
│                     Enterprise-Grade Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌────────────┐
│   USERS     │──────│   FRONTEND   │──────│   BACKEND   │──────│  DATABASE  │
│  (Browser)  │ HTTPS│   (Vercel)   │ HTTPS│  (Render)   │ SSL  │ (MongoDB)  │
└─────────────┘      └──────────────┘      └─────────────┘      └────────────┘
                            │                      │                    │
                            │                      │                    │
                     ┌──────┴──────┐        ┌──────┴──────┐      ┌─────┴──────┐
                     │  Firebase   │        │   PayPal    │      │  OpenAI    │
                     │    Auth     │        │ Payments    │      │    API     │
                     └─────────────┘        └─────────────┘      └────────────┘
```

---

## 🎯 **TECHNOLOGY STACK**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER          │ TECHNOLOGY           │ HOSTING        │ STATUS             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Frontend       │ React + Vite         │ Vercel         │ ✅ Live            │
│ Backend        │ FastAPI + Python     │ Render         │ ✅ Live            │
│ Database       │ MongoDB Atlas        │ Cloud          │ ✅ Connected       │
│ Authentication │ Firebase Auth        │ Firebase       │ ✅ Configured      │
│ Payments       │ PayPal Subscriptions │ PayPal         │ ✅ Sandbox Active  │
│ AI Services    │ OpenAI GPT-4o-mini   │ OpenAI         │ ✅ 4 Keys Active   │
│ CDN            │ Vercel Edge Network  │ Global         │ ✅ Auto-enabled    │
│ SSL/TLS        │ Let's Encrypt        │ Auto           │ ✅ Auto-renewed    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **COMPLETE USER FLOW**

### **Step-by-Step User Journey**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        USER SUBSCRIPTION FLOW                             │
└──────────────────────────────────────────────────────────────────────────┘

1️⃣  USER VISITS WEBSITE
    │
    ├──→ https://entrysafe-frontend.vercel.app
    │    (or https://app.entrysafe.co.za with custom domain)
    │
    └──→ React App Loads (Vite-optimized, <3s load time)
    
2️⃣  USER SIGNS UP / LOGS IN
    │
    ├──→ Click "Sign Up" or "Login" button
    │
    ├──→ Firebase Auth Modal Opens
    │    • Email/Password
    │    • Google Sign-In
    │    • Facebook Sign-In
    │
    ├──→ Firebase creates user account
    │
    └──→ Firebase returns JWT token
         │
         └──→ Frontend stores token in localStorage
              │
              └──→ Frontend includes token in all API requests:
                   Header: "Authorization: Bearer <JWT_TOKEN>"

3️⃣  USER SELECTS SUBSCRIPTION PLAN
    │
    ├──→ Navigate to Pricing page
    │
    ├──→ Choose plan:
    │    • FREE: R0/month (limited features)
    │    • STARTER: R199/month (basic AI)
    │    • PREMIUM: R399/month (advanced AI)
    │    • ANNUAL: R3,999/year (17% discount)
    │
    └──→ Click "Subscribe" button

4️⃣  FRONTEND CREATES SUBSCRIPTION
    │
    ├──→ POST /api/payments/create-subscription
    │    Body: {
    │      "plan_id": "P-XXXXXXXXXX",
    │      "user_email": "user@example.com"
    │    }
    │
    └──→ Backend creates PayPal subscription
         │
         └──→ Returns approval URL:
              "https://www.paypal.com/billing/subscription/approve/..."

5️⃣  USER REDIRECTED TO PAYPAL
    │
    ├──→ Frontend opens PayPal URL in new tab/window
    │
    ├──→ User logs in to PayPal account
    │
    ├──→ User reviews subscription details:
    │    • Plan name
    │    • Billing amount
    │    • Billing cycle
    │    • Next billing date
    │
    └──→ User clicks "Agree & Subscribe"

6️⃣  PAYPAL REDIRECTS BACK TO FRONTEND
    │
    ├──→ PayPal redirects to: 
    │    https://entrysafe-frontend.vercel.app/payment-success?token=BA-...
    │
    └──→ Frontend extracts token from URL

7️⃣  FRONTEND EXECUTES SUBSCRIPTION AGREEMENT
    │
    ├──→ POST /api/payments/execute-agreement
    │    Body: {
    │      "token": "BA-XXXXXXXXXXXXX"
    │    }
    │
    └──→ Backend marks subscription as "pending_confirmation"
         │
         └──→ Returns response:
              {
                "status": "pending_confirmation",
                "subscription_id": "I-XXXXXXXXXX",
                "message": "Waiting for PayPal webhook confirmation"
              }

8️⃣  FRONTEND POLLS FOR ACTIVATION
    │
    ├──→ Shows message: "Verifying payment with PayPal..."
    │
    ├──→ Every 5 seconds, call:
    │    GET /api/payments/subscription-status
    │
    ├──→ Check if status changed from "pending_confirmation" to "active"
    │
    └──→ Timeout after 60 seconds if still pending

9️⃣  PAYPAL SENDS WEBHOOK TO BACKEND
    │
    ├──→ PayPal webhook fires (1-5 seconds after approval)
    │
    ├──→ POST https://entrysafe-website.onrender.com/api/payments/webhook
    │    Body: {
    │      "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",
    │      "resource": {
    │        "id": "I-XXXXXXXXXX",
    │        "status": "ACTIVE",
    │        ...
    │      }
    │    }
    │
    └──→ Backend receives webhook

🔟  BACKEND VERIFIES WEBHOOK (5-LAYER SECURITY)
    │
    ├──→ Layer 1: Timestamp Validation
    │    • Check webhook timestamp
    │    • Reject if > 5 minutes old
    │    • Prevents replay attacks with old events
    │
    ├──→ Layer 2: Cryptographic Signature Verification
    │    • Extract webhook headers:
    │      - PAYPAL-TRANSMISSION-ID
    │      - PAYPAL-TRANSMISSION-TIME
    │      - PAYPAL-TRANSMISSION-SIG
    │      - PAYPAL-CERT-URL
    │      - PAYPAL-AUTH-ALGO
    │    • Call PayPal API:
    │      POST /v1/notifications/verify-webhook-signature
    │    • PayPal confirms signature is valid
    │
    ├──→ Layer 3: Replay Protection
    │    • Check if event_id already exists in MongoDB
    │    • Reject if duplicate (prevents double-activation)
    │
    ├──→ Layer 4: Subscription ID Matching
    │    • Check if subscription_id exists in database
    │    • Reject if subscription not found
    │
    └──→ Layer 5: State Transition Validation
         • Check current subscription status
         • Only activate if status = "pending_confirmation"
         • Reject if already "active" (prevents re-activation)

1️⃣1️⃣  BACKEND ACTIVATES SUBSCRIPTION
    │
    ├──→ Update MongoDB subscriptions collection:
    │    {
    │      "user_id": "abc123",
    │      "subscription_id": "I-XXXXXXXXXX",
    │      "plan_id": "P-XXXXXXXXXX",
    │      "tier": "PREMIUM",  ← ACTIVATED!
    │      "status": "active",
    │      "activated_at": "2025-01-15T10:30:00Z"
    │    }
    │
    ├──→ Store webhook event in webhook_events collection
    │
    ├──→ Store payment in payment_history collection
    │
    └──→ Log security event in security_logs collection

1️⃣2️⃣  FRONTEND DETECTS ACTIVATION
    │
    ├──→ Polling detects status change to "active"
    │
    ├──→ Stop polling
    │
    ├──→ Show success message:
    │    "✅ Subscription activated! Redirecting to dashboard..."
    │
    └──→ Redirect to dashboard after 2 seconds

1️⃣3️⃣  USER ACCESSES AI FEATURES
    │
    ├──→ Navigate to Accounting AI / Document AI
    │
    ├──→ Click "Generate Invoice" or "Analyze Document"
    │
    ├──→ Frontend sends request with JWT token:
    │    POST /api/ai/accounting/generate-invoice
    │    Header: "Authorization: Bearer <JWT>"
    │
    ├──→ Backend checks tier:
    │    • Extract user_id from JWT
    │    • Query subscriptions collection
    │    • Check if tier = PREMIUM or STARTER
    │
    ├──→ If tier sufficient:
    │    • Call OpenAI API
    │    • Return AI-generated content
    │
    └──→ If tier insufficient:
         • Return 403 Forbidden
         • Message: "Upgrade to Premium to access this feature"

🎉  USER ENJOYS FULL AI ACCESS!
```

---

## 🔐 **SECURITY ARCHITECTURE**

### **5-Layer Webhook Verification System**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WEBHOOK SECURITY VERIFICATION                            │
│                  Prevents Fraud, Replay Attacks, and                        │
│                     Silent Revenue Leakage                                  │
└─────────────────────────────────────────────────────────────────────────────┘

PayPal Webhook
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: TIMESTAMP VALIDATION                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  webhook_time = parse_datetime(headers['PAYPAL-TRANSMISSION-TIME'])        │
│  current_time = datetime.utcnow()                                          │
│  age = (current_time - webhook_time).total_seconds()                       │
│                                                                             │
│  if age > 300:  # 5 minutes                                                │
│      ❌ REJECT: "Webhook too old (replay attack?)"                         │
│  else:                                                                      │
│      ✅ PASS: Proceed to Layer 2                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: CRYPTOGRAPHIC SIGNATURE VERIFICATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  verification_payload = {                                                  │
│      "transmission_id": headers['PAYPAL-TRANSMISSION-ID'],                 │
│      "transmission_time": headers['PAYPAL-TRANSMISSION-TIME'],             │
│      "transmission_sig": headers['PAYPAL-TRANSMISSION-SIG'],               │
│      "cert_url": headers['PAYPAL-CERT-URL'],                               │
│      "auth_algo": headers['PAYPAL-AUTH-ALGO'],                             │
│      "webhook_id": PAYPAL_WEBHOOK_ID,                                      │
│      "webhook_event": webhook_body                                         │
│  }                                                                          │
│                                                                             │
│  response = paypal_api.post(                                               │
│      "/v1/notifications/verify-webhook-signature",                         │
│      json=verification_payload                                             │
│  )                                                                          │
│                                                                             │
│  if response.json()['verification_status'] != 'SUCCESS':                   │
│      ❌ REJECT: "Invalid webhook signature (not from PayPal)"              │
│  else:                                                                      │
│      ✅ PASS: Proceed to Layer 3                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: REPLAY PROTECTION (DUPLICATE EVENT DETECTION)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  event_id = webhook_body['id']                                             │
│                                                                             │
│  existing_event = db.webhook_events.find_one({"event_id": event_id})      │
│                                                                             │
│  if existing_event:                                                         │
│      ❌ REJECT: "Duplicate event (already processed)"                      │
│      Log to security_logs: "REPLAY_ATTACK_DETECTED"                        │
│  else:                                                                      │
│      ✅ PASS: Proceed to Layer 4                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: SUBSCRIPTION ID MATCHING                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  subscription_id = webhook_body['resource']['id']                          │
│                                                                             │
│  subscription = db.subscriptions.find_one({                                │
│      "subscription_id": subscription_id                                    │
│  })                                                                         │
│                                                                             │
│  if not subscription:                                                       │
│      ❌ REJECT: "Subscription not found in database"                       │
│      Log to security_logs: "UNKNOWN_SUBSCRIPTION"                          │
│  else:                                                                      │
│      ✅ PASS: Proceed to Layer 5                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ LAYER 5: STATE TRANSITION VALIDATION                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  current_status = subscription['status']                                   │
│                                                                             │
│  if current_status == 'active':                                             │
│      ❌ REJECT: "Subscription already active (duplicate activation)"       │
│      Log to security_logs: "DUPLICATE_ACTIVATION_ATTEMPT"                  │
│  elif current_status != 'pending_confirmation':                            │
│      ❌ REJECT: "Invalid state transition"                                 │
│  else:                                                                      │
│      ✅ PASS: Activate subscription!                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ✅ ALL LAYERS PASSED - ACTIVATE SUBSCRIPTION                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  db.subscriptions.update_one(                                              │
│      {"subscription_id": subscription_id},                                 │
│      {"$set": {                                                             │
│          "tier": plan_tier,  # STARTER, PREMIUM, or ANNUAL                │
│          "status": "active",                                               │
│          "activated_at": datetime.utcnow()                                 │
│      }}                                                                     │
│  )                                                                          │
│                                                                             │
│  ✅ User can now access AI features!                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **TIER ENFORCEMENT ARCHITECTURE**

### **How Subscription Tiers Control Feature Access**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TIER-BASED ACCESS CONTROL                                │
└─────────────────────────────────────────────────────────────────────────────┘

User Request (with JWT)
    │
    ▼
Backend Middleware: get_current_user()
    │
    ├──→ Extract JWT token from Authorization header
    │
    ├──→ Verify JWT signature with Firebase Admin SDK
    │
    ├──→ Extract user_id from JWT
    │
    └──→ Query MongoDB: db.subscriptions.find_one({"user_id": user_id})
         │
         └──→ Returns subscription object:
              {
                "user_id": "abc123",
                "tier": "PREMIUM",  ← Current tier
                "status": "active",
                "expires_at": "2025-02-15T10:30:00Z"
              }

Backend Middleware: require_tier(minimum_tier)
    │
    ├──→ Check if user's tier >= minimum_tier
    │
    ├──→ Tier hierarchy:
    │    FREE < STARTER < PREMIUM = ANNUAL
    │
    ├──→ If user's tier sufficient:
    │    ✅ Allow request to proceed
    │
    └──→ If user's tier insufficient:
         ❌ Return 403 Forbidden
         {
           "error": "Upgrade required",
           "message": "This feature requires Premium subscription",
           "current_tier": "STARTER",
           "required_tier": "PREMIUM"
         }

Endpoint Examples:

┌────────────────────────────────────────────────────────────────┐
│ FREE TIER (No subscription)                                    │
├────────────────────────────────────────────────────────────────┤
│ ✅ GET /api/user/profile                                       │
│ ✅ GET /api/ai/demo (limited to 3 requests/day)               │
│ ❌ POST /api/ai/accounting/* (requires STARTER)               │
│ ❌ POST /api/ai/documents/* (requires STARTER)                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ STARTER TIER (R199/month)                                      │
├────────────────────────────────────────────────────────────────┤
│ ✅ POST /api/ai/accounting/generate-invoice (100/month)       │
│ ✅ POST /api/ai/accounting/expense-analysis (100/month)       │
│ ✅ POST /api/ai/documents/classify (50/month)                 │
│ ❌ POST /api/ai/documents/extract-data (requires PREMIUM)     │
│ ❌ POST /api/admin/* (requires PREMIUM + admin role)          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ PREMIUM TIER (R399/month or R3,999/year)                       │
├────────────────────────────────────────────────────────────────┤
│ ✅ ALL STARTER FEATURES                                        │
│ ✅ POST /api/ai/accounting/* (unlimited)                      │
│ ✅ POST /api/ai/documents/* (unlimited)                       │
│ ✅ POST /api/ai/pricing/* (unlimited)                         │
│ ✅ Priority support (24-hour response time)                   │
│ ✅ Bulk operations (batch processing)                         │
└────────────────────────────────────────────────────────────────┘
```

---

## 💳 **PAYMENT FLOW - SEQUENCE DIAGRAM**

```
User          Frontend        Backend         PayPal        MongoDB
 │               │               │               │              │
 │  Click        │               │               │              │
 │ "Subscribe"   │               │               │              │
 ├──────────────→│               │               │              │
 │               │  POST         │               │              │
 │               │ /create-      │               │              │
 │               │ subscription  │               │              │
 │               ├──────────────→│               │              │
 │               │               │  Create       │              │
 │               │               │ Subscription  │              │
 │               │               ├──────────────→│              │
 │               │               │               │              │
 │               │               │  Return       │              │
 │               │               │ approval_url  │              │
 │               │               │←──────────────┤              │
 │               │  Return       │               │              │
 │               │ approval_url  │               │              │
 │               │←──────────────┤               │              │
 │               │               │               │              │
 │  Redirect     │               │               │              │
 │  to PayPal    │               │               │              │
 ├──────────────────────────────────────────────→│              │
 │               │               │               │              │
 │  Approve      │               │               │              │
 │ Subscription  │               │               │              │
 ├──────────────────────────────────────────────→│              │
 │               │               │               │              │
 │  Redirect     │               │               │              │
 │  back to      │               │               │              │
 │  Frontend     │               │               │              │
 │←──────────────────────────────────────────────┤              │
 │               │               │               │              │
 │               │  POST         │               │              │
 │               │ /execute-     │               │              │
 │               │ agreement     │               │              │
 │               ├──────────────→│               │              │
 │               │               │  Update       │              │
 │               │               │ status =      │              │
 │               │               │ "pending"     │              │
 │               │               ├─────────────────────────────→│
 │               │               │               │              │
 │               │  Return       │               │              │
 │               │ "pending"     │               │              │
 │               │←──────────────┤               │              │
 │               │               │               │              │
 │  Show         │               │               │              │
 │ "Verifying    │               │               │              │
 │  payment..."  │               │               │              │
 │←──────────────┤               │               │              │
 │               │               │               │              │
 │               │  GET          │               │              │
 │               │ /subscription │               │              │
 │               │ -status       │               │              │
 │               │ (polling      │               │              │
 │               │  every 5s)    │               │              │
 │               ├──────────────→│               │              │
 │               │               │  Query        │              │
 │               │               │ subscription  │              │
 │               │               ├─────────────────────────────→│
 │               │               │               │              │
 │               │               │  Return       │              │
 │               │               │ "pending"     │              │
 │               │               │←─────────────────────────────┤
 │               │  Return       │               │              │
 │               │ "pending"     │               │              │
 │               │←──────────────┤               │              │
 │               │               │               │              │
 │               │               │   POST        │              │
 │               │               │  /webhook     │              │
 │               │               │  (BILLING.    │              │
 │               │               │  SUBSCRIPTION │              │
 │               │               │  .ACTIVATED)  │              │
 │               │               │←──────────────┤              │
 │               │               │               │              │
 │               │               │  Verify       │              │
 │               │               │ Webhook       │              │
 │               │               │ (5 layers)    │              │
 │               │               ├──────────────→│              │
 │               │               │               │              │
 │               │               │  Signature    │              │
 │               │               │  valid ✅     │              │
 │               │               │←──────────────┤              │
 │               │               │               │              │
 │               │               │  Update       │              │
 │               │               │ tier="PREMIUM"│              │
 │               │               │ status="active"│             │
 │               │               ├─────────────────────────────→│
 │               │               │               │              │
 │               │  GET          │               │              │
 │               │ /subscription │               │              │
 │               │ -status       │               │              │
 │               │ (next poll)   │               │              │
 │               ├──────────────→│               │              │
 │               │               │  Query        │              │
 │               │               │ subscription  │              │
 │               │               ├─────────────────────────────→│
 │               │               │               │              │
 │               │               │  Return       │              │
 │               │               │ "active" ✅   │              │
 │               │               │←─────────────────────────────┤
 │               │  Return       │               │              │
 │               │ "active" ✅   │               │              │
 │               │←──────────────┤               │              │
 │               │               │               │              │
 │  Show         │               │               │              │
 │ "Subscription │               │               │              │
 │  activated!"  │               │               │              │
 │←──────────────┤               │               │              │
 │               │               │               │              │
 │  Access       │               │               │              │
 │ AI Features   │               │               │              │
 │ ✅            │               │               │              │
```

---

## 🧠 **AI FEATURE ACCESS FLOW**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI FEATURE REQUEST FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

User clicks "Generate Invoice" (Accounting AI)
    │
    ▼
Frontend sends request:
    POST /api/ai/accounting/generate-invoice
    Headers: {
        "Authorization": "Bearer <JWT_TOKEN>",
        "Content-Type": "application/json"
    }
    Body: {
        "customer_name": "ABC Corp",
        "items": [
            {"description": "Consulting", "amount": 5000}
        ]
    }
    │
    ▼
Backend Middleware Chain:
    │
    ├──→ 1. get_current_user(jwt_token)
    │    • Verify JWT signature
    │    • Extract user_id
    │    • Query user from MongoDB
    │    • Attach user object to request
    │
    ├──→ 2. require_tier(SubscriptionTier.STARTER)
    │    • Query subscription from MongoDB
    │    • Check if user.tier >= STARTER
    │    • If YES: continue
    │    • If NO: return 403 Forbidden
    │
    └──→ 3. rate_limit(100 per month for STARTER)
         • Check usage count for current month
         • If < 100: continue
         • If >= 100: return 429 Too Many Requests
    │
    ▼
Backend AI Service:
    │
    ├──→ 1. Retrieve OpenAI API key
    │    key = OPENAI_KEY_ACCOUNTING
    │
    ├──→ 2. Construct prompt
    │    prompt = f"""
    │    Generate a professional invoice for:
    │    Customer: {customer_name}
    │    Items: {items}
    │    Format: PDF-ready HTML
    │    """
    │
    ├──→ 3. Call OpenAI API
    │    response = openai.ChatCompletion.create(
    │        model="gpt-4o-mini",
    │        messages=[
    │            {"role": "system", "content": "You are an accounting AI"},
    │            {"role": "user", "content": prompt}
    │        ]
    │    )
    │
    ├──→ 4. Parse AI response
    │    invoice_html = response.choices[0].message.content
    │
    ├──→ 5. Store in MongoDB
    │    db.documents.insert_one({
    │        "user_id": user_id,
    │        "type": "invoice",
    │        "content": invoice_html,
    │        "created_at": datetime.utcnow()
    │    })
    │
    ├──→ 6. Increment usage count
    │    db.usage.update_one(
    │        {"user_id": user_id, "month": current_month},
    │        {"$inc": {"accounting_requests": 1}}
    │    )
    │
    └──→ 7. Return response to frontend
         {
             "success": true,
             "invoice_html": "<div>...",
             "usage_remaining": 99
         }
    │
    ▼
Frontend displays invoice to user ✅
```

---

## 📊 **DATABASE SCHEMA**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MONGODB COLLECTIONS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ USERS COLLECTION                                          │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "firebase_uid": "abc123def456",                        │
│   "email": "user@example.com",                           │
│   "display_name": "John Doe",                            │
│   "role": "user",  // or "admin"                         │
│   "created_at": ISODate("2025-01-15T10:00:00Z"),        │
│   "last_login": ISODate("2025-01-15T14:30:00Z")         │
│ }                                                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ SUBSCRIPTIONS COLLECTION                                  │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "user_id": "abc123def456",                             │
│   "subscription_id": "I-XXXXXXXXXX",  // PayPal ID       │
│   "plan_id": "P-XXXXXXXXXX",          // PayPal plan ID  │
│   "tier": "PREMIUM",  // FREE, STARTER, PREMIUM, ANNUAL  │
│   "status": "active",  // or "pending", "cancelled", etc.│
│   "billing_cycle": "monthly",  // or "yearly"            │
│   "amount": 399.00,                                      │
│   "currency": "ZAR",                                     │
│   "next_billing_date": ISODate("2025-02-15T10:00:00Z"), │
│   "created_at": ISODate("2025-01-15T10:00:00Z"),        │
│   "activated_at": ISODate("2025-01-15T10:05:00Z"),      │
│   "cancelled_at": null                                   │
│ }                                                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ WEBHOOK_EVENTS COLLECTION                                 │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "event_id": "WH-123456789",  // PayPal event ID        │
│   "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",        │
│   "resource_id": "I-XXXXXXXXXX",  // Subscription ID     │
│   "timestamp": ISODate("2025-01-15T10:05:00Z"),         │
│   "verification_status": "SUCCESS",                      │
│   "payload": { /* full webhook body */ },                │
│   "processed_at": ISODate("2025-01-15T10:05:02Z")       │
│ }                                                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ PAYMENT_HISTORY COLLECTION                                │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "user_id": "abc123def456",                             │
│   "subscription_id": "I-XXXXXXXXXX",                     │
│   "payment_id": "PAYID-XXXXXXXXXX",  // PayPal txn ID    │
│   "amount": 399.00,                                      │
│   "currency": "ZAR",                                     │
│   "status": "completed",  // or "failed", "refunded"     │
│   "payment_method": "paypal",                            │
│   "payer_email": "user@example.com",                     │
│   "created_at": ISODate("2025-01-15T10:05:00Z")         │
│ }                                                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ USAGE COLLECTION                                          │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "user_id": "abc123def456",                             │
│   "month": "2025-01",                                    │
│   "accounting_requests": 45,  // out of 100 (STARTER)    │
│   "document_requests": 23,    // out of 50 (STARTER)     │
│   "pricing_requests": 12,     // unlimited (PREMIUM)     │
│   "openai_tokens_used": 15420,                          │
│   "openai_cost_usd": 0.23                               │
│ }                                                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ DOCUMENTS COLLECTION                                      │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "user_id": "abc123def456",                             │
│   "type": "invoice",  // or "expense", "report", etc.    │
│   "title": "Invoice #001 - ABC Corp",                    │
│   "content": "<html>...</html>",  // or PDF URL          │
│   "ai_generated": true,                                  │
│   "tokens_used": 450,                                    │
│   "created_at": ISODate("2025-01-15T14:30:00Z"),        │
│   "tags": ["client:abc-corp", "paid"]                   │
│ }                                                         │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ SECURITY_LOGS COLLECTION                                  │
├───────────────────────────────────────────────────────────┤
│ {                                                         │
│   "_id": ObjectId("..."),                                │
│   "timestamp": ISODate("2025-01-15T15:00:00Z"),         │
│   "event_type": "REPLAY_ATTACK_DETECTED",               │
│   "severity": "high",  // low, medium, high, critical    │
│   "user_id": "abc123def456",                             │
│   "ip_address": "105.0.1.196",                           │
│   "details": {                                            │
│       "event_id": "WH-123456789",                        │
│       "reason": "Duplicate event_id found in database"   │
│   }                                                       │
│ }                                                         │
└───────────────────────────────────────────────────────────┘
```

---

## 🌍 **DEPLOYMENT ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PRODUCTION DEPLOYMENT DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────┘

                            INTERNET (HTTPS)
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │   VERCEL     │   │    RENDER    │   │   MONGODB    │
        │   (Global    │   │   (Oregon)   │   │    ATLAS     │
        │    CDN)      │   │              │   │   (Cloud)    │
        └──────────────┘   └──────────────┘   └──────────────┘
                │                  │                  │
        ┌───────┴───────┐  ┌───────┴───────┐  ┌───────┴───────┐
        │ FRONTEND      │  │ BACKEND       │  │ DATABASE      │
        │ - React App   │  │ - FastAPI     │  │ - Users       │
        │ - Vite Build  │  │ - Python 3.14 │  │ - Subscriptns │
        │ - Static HTML │  │ - Uvicorn     │  │ - Webhooks    │
        │ - Auto-scale  │  │ - 512MB RAM   │  │ - Payments    │
        │ - Edge Deploy │  │ - 0.1 CPU     │  │ - Documents   │
        └───────────────┘  └───────────────┘  └───────────────┘
                │                  │                  │
                └──────────┬───────┴───────┬──────────┘
                           │               │
                   ┌───────┴───────┐  ┌────┴─────┐
                   │   FIREBASE    │  │  OPENAI  │
                   │     AUTH      │  │   API    │
                   └───────────────┘  └──────────┘
                           │               │
                   ┌───────┴───────────────┴───────┐
                   │         PAYPAL API            │
                   │    (Subscriptions +           │
                   │       Webhooks)               │
                   └───────────────────────────────┘

REGIONS:
• Frontend: Global (200+ edge locations via Vercel)
• Backend: Oregon, USA (Render)
• Database: Multi-region (MongoDB Atlas, automatic failover)
• Firebase: Global (Google infrastructure)
• PayPal: Global (automatic routing)
• OpenAI: Global (automatic routing)

REDUNDANCY:
• Frontend: Auto-replicated across all edge nodes
• Backend: Can scale horizontally (add more instances)
• Database: Automatic backups every 24 hours
• All services: Automatic HTTPS/TLS
```

---

## 🚀 **SCALING STRATEGY**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCALING PATH: FREE → PRODUCTION                          │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: TESTING (Current - 0-10 users)
    │
    ├─ Frontend: Vercel Free Tier
    │  • Unlimited bandwidth
    │  • Auto-scaling
    │  • Global CDN
    │  • Cost: $0/month
    │
    ├─ Backend: Render Free Tier
    │  • 512MB RAM, 0.1 CPU
    │  • Spins down after 15 min inactive
    │  • 750 hours/month free
    │  • Cost: $0/month
    │
    └─ Database: MongoDB Atlas M0
       • 512MB storage
       • Shared cluster
       • Good for testing
       • Cost: $0/month
    
    TOTAL: $0/month

────────────────────────────────────────────────────────────────────

PHASE 2: EARLY PRODUCTION (10-100 users)
    │
    ├─ Frontend: Vercel Pro
    │  • Same as Free, but with:
    │  • Custom domain
    │  • Priority support
    │  • Cost: $20/month
    │
    ├─ Backend: Render Starter
    │  • 512MB RAM, 0.5 CPU
    │  • Always-on (no spin-down)
    │  • Custom domain
    │  • Cost: $7/month
    │
    └─ Database: MongoDB Atlas M10
       • 2GB RAM, 10GB storage
       • Dedicated cluster
       • Automatic backups
       • Cost: $57/month
    
    TOTAL: ~$84/month
    
    REVENUE ESTIMATE:
    • 50 Starter users × R199 = R9,950/month (~$530)
    • 20 Premium users × R399 = R7,980/month (~$425)
    • TOTAL: ~R17,930/month (~$955)
    • PROFIT: ~$871/month

────────────────────────────────────────────────────────────────────

PHASE 3: GROWTH (100-1,000 users)
    │
    ├─ Frontend: Vercel Pro
    │  • No change needed
    │  • Cost: $20/month
    │
    ├─ Backend: Render Standard
    │  • 2GB RAM, 1.0 CPU
    │  • Auto-scaling (2-4 instances)
    │  • Load balancing
    │  • Cost: $25/month × 2 instances = $50/month
    │
    └─ Database: MongoDB Atlas M30
       • 8GB RAM, 40GB storage
       • High performance
       • Multi-region backup
       • Cost: $200/month
    
    TOTAL: ~$270/month
    
    REVENUE ESTIMATE:
    • 500 Starter × R199 = R99,500/month (~$5,300)
    • 200 Premium × R399 = R79,800/month (~$4,250)
    • TOTAL: ~R179,300/month (~$9,550)
    • PROFIT: ~$9,280/month

────────────────────────────────────────────────────────────────────

PHASE 4: SCALE (1,000+ users)
    │
    ├─ Frontend: Vercel Enterprise
    │  • Dedicated support
    │  • SLA guarantees
    │  • Cost: Custom (negotiate)
    │
    ├─ Backend: Render Standard/Pro
    │  • 4GB RAM, 2.0 CPU
    │  • 5-10 instances (auto-scale)
    │  • Cost: ~$500/month
    │
    └─ Database: MongoDB Atlas M50+
       • 16GB+ RAM, 100GB+ storage
       • Multi-region replication
       • 24/7 support
       • Cost: ~$1,000/month
    
    TOTAL: ~$1,500+/month
    
    REVENUE ESTIMATE:
    • 5,000+ users
    • TOTAL: R1M+/month (~$53,000+)
    • PROFIT: $51,500+/month

────────────────────────────────────────────────────────────────────

KEY SCALING TRIGGERS:
• Backend response time > 1 second → Upgrade Render
• Database CPU > 80% → Upgrade MongoDB Atlas
• Monthly costs > 10% of revenue → Profitable, keep scaling
• Error rate > 1% → Investigate and fix before scaling
```

---

## 🎯 **SUCCESS METRICS**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HEALTH MONITORING DASHBOARD                           │
└─────────────────────────────────────────────────────────────────────────────┘

BACKEND HEALTH:
✅ Response Time: < 500ms average
✅ Error Rate: < 1%
✅ Uptime: > 99.5%
✅ Memory Usage: < 80%
✅ CPU Usage: < 70%

PAYMENT HEALTH:
✅ Webhook Success Rate: 100%
✅ Payment Failure Rate: < 5%
✅ Subscription Activation Time: < 10 seconds
✅ Churn Rate: < 10%/month

DATABASE HEALTH:
✅ Query Response Time: < 100ms
✅ Connection Count: < 100
✅ Disk Usage: < 70%
✅ Backup Success Rate: 100%

AI SERVICE HEALTH:
✅ OpenAI API Success Rate: > 99%
✅ Average Token Usage: < 1,000 per request
✅ Cost Per User: < R20/month
✅ Feature Usage Rate: > 70% of users

SECURITY HEALTH:
✅ Replay Attacks Blocked: 100%
✅ Invalid Webhooks Rejected: 100%
✅ JWT Verification Success: 100%
✅ No credential leaks detected

USER SATISFACTION:
✅ Average Session Duration: > 10 minutes
✅ Feature Adoption Rate: > 60%
✅ Support Ticket Rate: < 5%
✅ NPS Score: > 50
```

---

## 📝 **QUICK REFERENCE**

### **Production URLs**
- **Frontend:** https://entrysafe-frontend.vercel.app
- **Backend:** https://entrysafe-website.onrender.com
- **API Docs:** https://entrysafe-website.onrender.com/docs
- **Health Check:** https://entrysafe-website.onrender.com/

### **Key Files**
- `GO_LIVE_CHECKLIST.md` - Production deployment guide
- `SECURITY_FIX_COMPLETE.md` - Security architecture details
- `RENDER_DEPLOYMENT_GUIDE.md` - Render configuration
- `MONGODB_ATLAS_SETUP.md` - Database setup guide

### **Support Resources**
- Render Docs: https://render.com/docs
- PayPal Docs: https://developer.paypal.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Firebase Docs: https://firebase.google.com/docs

---

**Author:** Mlungisi Mncube  
**Last Updated:** January 2025  
**Status:** Visual documentation for production deployment  
**Use with:** GO_LIVE_CHECKLIST.md for complete production launch guide
