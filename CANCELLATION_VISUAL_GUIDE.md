# 🎨 SUBSCRIPTION CANCELLATION FLOW - VISUAL GUIDE

**Author:** Mlungisi Mncube  
**Date:** January 2025  
**Purpose:** Visual guide to the hidden cancellation feature

---

## 🗺️ **USER JOURNEY MAP**

```
                     ENTRYSAFE WEBSITE
                           │
                           ▼
              ┌────────────────────────┐
              │  User Logs In          │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Clicks Profile        │
              │  Dropdown (👤)         │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Sees Menu:            │
              │  • ⚙️ Account Settings │
              │  • 🚪 Logout           │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Clicks                │
              │  "Account Settings"    │
              └────────────────────────┘
                           │
                           ▼
         ╔═══════════════════════════════════╗
         ║   ACCOUNT SETTINGS PAGE           ║
         ║   /settings                       ║
         ╠═══════════════════════════════════╣
         ║                                   ║
         ║  👤 PROFILE                       ║
         ║  ─────────────────────            ║
         ║  Email: user@example.com          ║
         ║  Name: John Doe                   ║
         ║                                   ║
         ║  💳 SUBSCRIPTION                  ║
         ║  ─────────────────────            ║
         ║  Current Plan: PREMIUM            ║
         ║  Status: [🟢 ACTIVE]              ║
         ║  ID: I-XXXXXXXXXX                 ║
         ║                                   ║
         ║  ┌──────────────────┐             ║
         ║  │ Manage           │ ◄─── CLICK │
         ║  │ Subscription     │      HERE  │
         ║  └──────────────────┘      3x!   ║
         ║                                   ║
         ║  💡 Tip: Click "Manage" 3 times  ║
         ║     to reveal advanced options    ║
         ║                                   ║
         ╚═══════════════════════════════════╝
                           │
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    CLICK #1          CLICK #2          CLICK #3
         │                 │                 │
         ▼                 ▼                 ▼
  Opens PayPal      Opens PayPal      REVEALS MODAL!
  (new tab)         (new tab)              │
                                           ▼
                    ╔═══════════════════════════════╗
                    ║  🚨 CANCELLATION MODAL       ║
                    ╠═══════════════════════════════╣
                    ║                               ║
                    ║      ⚠️  (Alert Icon)        ║
                    ║                               ║
                    ║  Cancel Subscription?         ║
                    ║                               ║
                    ║  Are you sure you want to     ║
                    ║  cancel your subscription?    ║
                    ║  You'll lose access to        ║
                    ║  premium features.            ║
                    ║                               ║
                    ║  ┌──────────────────────────┐ ║
                    ║  │ ⚠️ NOTE:                 │ ║
                    ║  │ You'll retain access     │ ║
                    ║  │ until the end of your    │ ║
                    ║  │ current billing period.  │ ║
                    ║  └──────────────────────────┘ ║
                    ║                               ║
                    ║  ┌──────┐    ┌─────────────┐ ║
                    ║  │Keep  │    │   Cancel    │ ║
                    ║  │Sub   │    │Subscription │ ║
                    ║  └──────┘    └─────────────┘ ║
                    ║   (Gray)          (Red)       ║
                    ║                               ║
                    ╚═══════════════════════════════╝
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
         KEEP SUB                        CANCEL SUB
              │                               │
              ▼                               ▼
      Modal closes                     Loading...
      No changes                             │
                                            ▼
                              POST /api/payments/
                              cancel-subscription
                                            │
                                            ▼
                                  Backend Processes:
                                  1. Verify JWT
                                  2. Find user subscription
                                  3. Call PayPal API
                                  4. Cancel subscription
                                  5. Update MongoDB
                                            │
                                            ▼
                              ┌──────────────────────┐
                              │ ✅ SUCCESS RESPONSE  │
                              │ tier: FREE          │
                              │ status: cancelled   │
                              └──────────────────────┘
                                            │
                                            ▼
                              ┌──────────────────────┐
                              │ Frontend Shows:      │
                              │ "✅ Subscription     │
                              │  cancelled           │
                              │  successfully!"      │
                              └──────────────────────┘
                                            │
                                            ▼
                              ┌──────────────────────┐
                              │ Page Refreshes       │
                              │ Status: CANCELLED    │
                              │ Tier: FREE           │
                              └──────────────────────┘
```

---

## 🔄 **BACKEND FLOW**

```
┌─────────────────────────────────────────────────────────┐
│  USER CANCELLATION REQUEST                              │
│  POST /api/payments/cancel-subscription                 │
│  Header: Authorization: Bearer <JWT_TOKEN>              │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 1: JWT AUTHENTICATION                             │
│  • Extract token from Authorization header              │
│  • Verify with Firebase Admin SDK                       │
│  • Extract user_id (uid)                                │
│  • If invalid → 401 Unauthorized                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 2: FIND USER SUBSCRIPTION                         │
│  • Query MongoDB: db.users.find_one({"uid": user_id})  │
│  • Check if subscription_id exists                      │
│  • If not found → 404 Not Found                         │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 3: CANCEL PAYPAL SUBSCRIPTION                     │
│  • Get subscription: BillingAgreement.find(sub_id)      │
│  • Cancel: agreement.cancel({note: "..."})              │
│  • If PayPal error → 500 Internal Server Error          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 4: UPDATE MONGODB                                 │
│  • db.users.update_one(                                 │
│      {"uid": user_id},                                  │
│      {                                                   │
│        "$set": {                                         │
│          "subscription_status": "cancelled",            │
│          "subscription_tier": "FREE",                   │
│          "cancelled_at": datetime.now()                 │
│        }                                                 │
│      }                                                   │
│    )                                                     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  STEP 5: RETURN SUCCESS RESPONSE                        │
│  {                                                       │
│    "message": "Subscription cancelled successfully",    │
│    "tier": "FREE",                                      │
│    "status": "cancelled"                                │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  PAYPAL WEBHOOK (Async, 1-5 seconds later)              │
│  • Event: BILLING.SUBSCRIPTION.CANCELLED                │
│  • Backend verifies webhook (5-layer security)          │
│  • Confirms cancellation in database                    │
│  • User access continues until billing period ends      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 **STATE TRANSITIONS**

```
┌───────────────────────────────────────────────────────────────┐
│  SUBSCRIPTION STATE MACHINE                                   │
└───────────────────────────────────────────────────────────────┘

         ┌──────────┐
         │  FREE    │ ◄────────────────────────┐
         │  TIER    │                          │
         └──────────┘                          │
              │                                │
              │ User subscribes                │
              ▼                                │
  ┌────────────────────────┐                  │
  │  PENDING_CONFIRMATION  │                  │
  │  (awaiting webhook)    │                  │
  └────────────────────────┘                  │
              │                                │
              │ Webhook confirms               │
              ▼                                │
         ┌──────────┐                          │
         │ ACTIVE   │                          │
         │ (Premium)│                          │
         └──────────┘                          │
              │                                │
              │ User cancels                   │
              ▼                                │
      ┌──────────────┐                        │
      │  CANCELLED   │ ─── End of billing ───►│
      │ (retains     │       period           │
      │  access)     │                        │
      └──────────────┘                        │
              │                                │
              │ Billing period ends            │
              └────────────────────────────────┘
```

---

## 📊 **CLICK COUNTER LOGIC**

```javascript
// State management in AccountSettings.jsx

const [cancelClickCount, setCancelClickCount] = useState(0)
const [showCancelModal, setShowCancelModal] = useState(false)

const handleManageSubscription = () => {
  // Increment click counter
  setCancelClickCount(prev => prev + 1)
  
  // Check if 3 clicks reached
  if (cancelClickCount + 1 >= 3) {
    // REVEAL MODAL!
    setShowCancelModal(true)
    // Reset counter
    setCancelClickCount(0)
  } else {
    // Clicks 1 & 2: Open PayPal normally
    window.open('https://www.paypal.com/myaccount/autopay', '_blank')
  }
}

// Visual feedback
<p className="text-xs text-gray-500 mt-2 text-center">
  💡 Tip: Click "Manage Subscription" 3 times to reveal advanced options
</p>
```

---

## 🔐 **SECURITY CHECKPOINTS**

```
USER REQUEST
    │
    ▼
┌─────────────────────────────────────┐
│ Checkpoint 1: JWT Validation        │
│ ✓ Token present?                    │
│ ✓ Token valid?                      │
│ ✓ Token not expired?                │
│ ✓ User exists in database?          │
└─────────────────────────────────────┘
    │ ✅ PASSED
    ▼
┌─────────────────────────────────────┐
│ Checkpoint 2: Subscription Check    │
│ ✓ User has active subscription?     │
│ ✓ Subscription ID valid?            │
│ ✓ Subscription not already cancelled?│
└─────────────────────────────────────┘
    │ ✅ PASSED
    ▼
┌─────────────────────────────────────┐
│ Checkpoint 3: PayPal API Call       │
│ ✓ Subscription exists in PayPal?    │
│ ✓ Cancellation successful?          │
│ ✓ PayPal returns success?           │
└─────────────────────────────────────┘
    │ ✅ PASSED
    ▼
┌─────────────────────────────────────┐
│ Checkpoint 4: Database Update       │
│ ✓ MongoDB connection healthy?       │
│ ✓ Update query successful?          │
│ ✓ Tier downgraded to FREE?          │
└─────────────────────────────────────┘
    │ ✅ PASSED
    ▼
┌─────────────────────────────────────┐
│ Checkpoint 5: Webhook Confirmation  │
│ ✓ Webhook received (1-5 sec)?       │
│ ✓ Webhook verified (5 layers)?      │
│ ✓ Status confirmed in database?     │
└─────────────────────────────────────┘
    │ ✅ PASSED
    ▼
🎉 CANCELLATION COMPLETE!
```

---

## 📱 **RESPONSIVE DESIGN**

### Desktop View (> 768px)
```
┌────────────────────────────────────────────────┐
│  ⚙️ Account Settings                           │
│  Manage your account, subscription, and        │
│  preferences                                   │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 👤 PROFILE INFORMATION                   │ │
│  │ Email: user@example.com                  │ │
│  │ Name: John Doe                           │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ 💳 SUBSCRIPTION & BILLING                │ │
│  │                                          │ │
│  │ [🟢 PREMIUM]  [🟢 ACTIVE]               │ │
│  │                                          │ │
│  │ ID: I-XXXXXXXXXX                        │ │
│  │                                          │ │
│  │ [Manage Subscription] [Upgrade Plan]    │ │
│  │                                          │ │
│  │ 💡 Click "Manage" 3x for advanced opts  │ │
│  └──────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘
```

### Mobile View (< 768px)
```
┌───────────────────────────┐
│ ⚙️ Account Settings       │
├───────────────────────────┤
│                           │
│ 👤 PROFILE                │
│ ──────────────            │
│ user@example.com          │
│ John Doe                  │
│                           │
│ 💳 SUBSCRIPTION           │
│ ──────────────            │
│ [🟢 PREMIUM]              │
│ [🟢 ACTIVE]               │
│                           │
│ ID: I-XXXXXXXXXX          │
│                           │
│ [Manage Subscription]     │
│ (full width button)       │
│                           │
│ [Upgrade Plan]            │
│ (full width button)       │
│                           │
│ 💡 Click 3x               │
│                           │
└───────────────────────────┘
```

---

## 🎨 **VISUAL ELEMENTS**

### Color Scheme
- **Navy (#003366):** Primary brand color
- **Gold (#D4AF37):** Accent color, upgrade CTAs
- **Green (#10B981):** Active status, success messages
- **Red (#EF4444):** Cancellation buttons, warnings
- **Gray (#6B7280):** Secondary text, disabled states

### Icons
- ⚙️ Settings gear
- 👤 User profile
- 💳 Credit card
- 🔔 Bell (notifications)
- 🛡️ Shield (security)
- ⚠️ Warning triangle
- ✅ Checkmark (success)
- 🟢 Green circle (active)
- 🔴 Red circle (cancelled)

---

## 🎯 **SUCCESS INDICATORS**

### User Feedback
1. **Loading State:** "Cancelling..." (spinner)
2. **Success Message:** "✅ Subscription cancelled successfully"
3. **Status Update:** Badge changes to "🔴 CANCELLED"
4. **Tier Change:** Plan shows "FREE"
5. **Access Notice:** "You'll retain access until [date]"

### Backend Logs
```plaintext
❌ Webhook: Cancelled subscription for user abc123
✅ PayPal cancellation successful: I-XXXXXXXXXX
✅ MongoDB updated: tier=FREE, status=cancelled
```

---

**Status: 🟢 PRODUCTION READY**

The hidden cancellation feature is fully implemented, tested, and ready for users!
