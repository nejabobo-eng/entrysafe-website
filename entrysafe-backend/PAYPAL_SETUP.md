# PayPal Integration Setup Guide
**Author:** Mlungisi Mncube  
**Date:** 2025-01-10

## 🎯 What We Implemented

✅ **Python PayPal SDK integration** in FastAPI backend  
✅ **Subscription creation** endpoint (`/api/payments/create-subscription`)  
✅ **PayPal webhook handler** for payment events  
✅ **Tier enforcement integration** (automatic tier updates on payment)  
✅ **Subscription management** (status check, cancellation)

---

## 📋 Prerequisites

1. **PayPal Developer Account**
   - Sign up: https://developer.paypal.com/
   - Create sandbox account for testing

2. **Get PayPal Credentials**
   - Go to: https://developer.paypal.com/dashboard/applications
   - Create new app (or use existing)
   - Copy your **Client ID** and **Client Secret**

---

## 🔧 Installation Steps

### Step 1: Install Dependencies

```bash
cd entrysafe-backend
pip install -r requirements.txt
```

This installs:
- `paypalrestsdk==1.13.1` (PayPal Python SDK)
- `email-validator==2.1.0` (Email validation)

### Step 2: Configure Environment Variables

Add to your `.env` file:

```bash
# PayPal Configuration
PAYPAL_MODE=sandbox                    # Use 'sandbox' for testing, 'live' for production
PAYPAL_CLIENT_ID=your-client-id-here
PAYPAL_CLIENT_SECRET=your-secret-here
PAYPAL_WEBHOOK_ID=optional-webhook-id  # For webhook signature verification
```

**⚠️ IMPORTANT:** Never commit your actual `.env` file to Git!

### Step 3: Test Backend Connection

```bash
cd entrysafe-backend
python -m uvicorn app.main:app --reload
```

Open: http://localhost:8000/docs

You should see new endpoints:
- `POST /api/payments/create-subscription`
- `GET /api/payments/execute-agreement/{token}`
- `POST /api/payments/webhook`
- `GET /api/payments/subscription-status`
- `POST /api/payments/cancel-subscription`

---

## 🚀 API Endpoints

### 1. Create Subscription

**Endpoint:** `POST /api/payments/create-subscription`

**Request:**
```json
{
  "plan": "starter",  // or "premium" or "annual"
  "return_url": "https://entrysafe.co.za/payment-success",
  "cancel_url": "https://entrysafe.co.za/payment-cancel"
}
```

**Response:**
```json
{
  "subscription_id": "I-XXXXXXXXXX",
  "approval_url": "https://www.sandbox.paypal.com/...",
  "status": "pending_approval"
}
```

**Flow:**
1. User clicks "Subscribe" on website
2. Frontend calls this endpoint with JWT token
3. Backend creates PayPal billing plan and agreement
4. Returns `approval_url`
5. Frontend redirects user to PayPal
6. User approves payment
7. PayPal redirects back to `return_url`
8. Frontend calls `/execute-agreement/{token}`
9. Backend activates subscription and updates user tier

---

### 2. Execute Agreement

**Endpoint:** `GET /api/payments/execute-agreement/{token}`

**Called after user returns from PayPal approval.**

**Response:**
```json
{
  "message": "Subscription activated successfully",
  "subscription_id": "I-XXXXXXXXXX",
  "tier": "starter",
  "status": "active"
}
```

---

### 3. Get Subscription Status

**Endpoint:** `GET /api/payments/subscription-status`

**Response:**
```json
{
  "tier": "premium",
  "status": "active",
  "subscription_id": "I-XXXXXXXXXX",
  "start_date": "2025-01-10T12:00:00",
  "end_date": null
}
```

---

### 4. Cancel Subscription

**Endpoint:** `POST /api/payments/cancel-subscription`

**Response:**
```json
{
  "message": "Subscription cancelled successfully",
  "tier": "free",
  "status": "cancelled"
}
```

---

### 5. PayPal Webhook

**Endpoint:** `POST /api/payments/webhook`

**Automatically called by PayPal when events occur:**
- `BILLING.SUBSCRIPTION.ACTIVATED` → Set user tier to active
- `BILLING.SUBSCRIPTION.CANCELLED` → Downgrade to free tier
- `BILLING.SUBSCRIPTION.SUSPENDED` → Mark as suspended
- `BILLING.SUBSCRIPTION.EXPIRED` → Downgrade to free
- `PAYMENT.SALE.COMPLETED` → Log successful payment

**⚠️ Configure webhook URL in PayPal Dashboard:**
1. Go to: https://developer.paypal.com/dashboard/webhooks
2. Add webhook URL: `https://api.entrysafe.co.za/api/payments/webhook`
3. Select events to listen for (all `BILLING.*` and `PAYMENT.SALE.COMPLETED`)

---

## 💰 Pricing Configuration

Prices are hardcoded in `payments.py` to match website:

```python
SUBSCRIPTION_PLANS = {
    "starter": {
        "price": "199.00",  # R199/month
        "currency": "ZAR",
        "interval": "MONTH"
    },
    "premium": {
        "price": "499.00",  # R499/month
        "currency": "ZAR",
        "interval": "MONTH"
    },
    "annual": {
        "price": "4999.00",  # R4999/year
        "currency": "ZAR",
        "interval": "YEAR"
    }
}
```

**Update these if website pricing changes!**

---

## 🔐 Security Features

✅ **Firebase JWT authentication** on all endpoints (except webhook)  
✅ **Tier enforcement** automatically applies after payment  
✅ **Webhook signature verification** (recommended for production)  
✅ **Environment variables** for sensitive credentials  
✅ **MongoDB atomic updates** to prevent race conditions  

---

## 🧪 Testing Flow

### 1. Sandbox Testing

Use PayPal sandbox accounts to test without real money.

**Create test accounts:**
1. Go to: https://developer.paypal.com/dashboard/accounts
2. Create personal and business sandbox accounts
3. Use these for testing subscriptions

### 2. Test Subscription Creation

```bash
# Example with curl
curl -X POST https://api.entrysafe.co.za/api/payments/create-subscription \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "starter",
    "return_url": "https://entrysafe.co.za/payment-success",
    "cancel_url": "https://entrysafe.co.za/payment-cancel"
  }'
```

### 3. Test Webhook Locally

Use PayPal's webhook simulator:
- https://developer.paypal.com/dashboard/webhooks/simulator

Or use ngrok to expose localhost:
```bash
ngrok http 8000
# Use ngrok URL in PayPal webhook config
```

---

## 🔄 Frontend Integration

### React (Website)

Update `entrysafe-frontend/src/pages/Apps.jsx`:

```javascript
const handleSubscribe = async (planId) => {
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    // Get Firebase token
    const token = await user.getIdToken();

    // Call backend to create subscription
    const response = await fetch('https://api.entrysafe.co.za/api/payments/create-subscription', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        plan: planId,  // "starter", "premium", or "annual"
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/apps`
      })
    });

    const data = await response.json();

    if (data.approval_url) {
      // Redirect to PayPal
      window.location.href = data.approval_url;
    }
  } catch (error) {
    console.error('Subscription creation failed:', error);
    alert('Failed to create subscription. Please try again.');
  }
};
```

### Flutter (Mobile Apps)

Update `lib/screens/upgrade_screen.dart`:

```dart
Future<void> _handleSubscribe(String plan) async {
  // Get Firebase token
  final user = FirebaseAuth.instance.currentUser;
  if (user == null) return;

  final token = await user.getIdToken();

  // Call backend
  final response = await http.post(
    Uri.parse('https://api.entrysafe.co.za/api/payments/create-subscription'),
    headers: {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    },
    body: json.encode({
      'plan': plan,
      'return_url': 'entrysafe://payment-success',
      'cancel_url': 'entrysafe://payment-cancel',
    }),
  );

  final data = json.decode(response.body);

  if (data['approval_url'] != null) {
    // Open PayPal in browser
    await launchUrl(Uri.parse(data['approval_url']));
  }
}
```

---

## 📊 Database Schema

### Users Collection

```javascript
{
  "uid": "firebase-uid",
  "email": "user@example.com",
  "subscription_tier": "premium",  // free, starter, premium, annual
  "subscription_status": "active",  // active, cancelled, suspended, expired
  "subscription_id": "I-XXXXXXXXXX",
  "subscription_start_date": ISODate("2025-01-10"),
  "subscription_end_date": null,
  "registered_devices": ["device-id-1", "device-id-2"],
  "updated_at": ISODate("2025-01-10")
}
```

### Pending Subscriptions Collection

```javascript
{
  "user_uid": "firebase-uid",
  "email": "user@example.com",
  "plan": "starter",
  "tier": "starter",
  "billing_plan_id": "P-XXXXXXXXXX",
  "billing_agreement_token": "BA-XXXXXXXXXX",
  "status": "pending",
  "created_at": ISODate("2025-01-10")
}
```

### Webhook Events Collection

```javascript
{
  "event_type": "BILLING.SUBSCRIPTION.ACTIVATED",
  "resource_id": "I-XXXXXXXXXX",
  "resource": { /* full PayPal resource object */ },
  "received_at": ISODate("2025-01-10"),
  "processed": true,
  "processed_at": ISODate("2025-01-10")
}
```

---

## 🚨 Common Issues

### 1. "PayPal plan creation failed"
- Check your `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
- Ensure `PAYPAL_MODE=sandbox` for testing
- Verify PayPal app is active in dashboard

### 2. "Agreement execution failed"
- Token expired (PayPal tokens expire after ~3 hours)
- User didn't complete PayPal approval
- Check pending_subscriptions collection for orphaned records

### 3. Webhook not receiving events
- Check webhook URL is publicly accessible (no localhost)
- Verify webhook URL in PayPal dashboard matches backend
- Check event types are selected in PayPal dashboard

### 4. Tier not updating after payment
- Check MongoDB `users` collection for `subscription_tier` field
- Verify webhook processed successfully in `webhook_events` collection
- Check backend logs for errors

---

## 🎯 Next Steps

1. **Get PayPal Sandbox Credentials**
   - Create developer account
   - Get client ID and secret
   - Test in sandbox mode

2. **Update Frontend**
   - Implement `handleSubscribe` in `Apps.jsx`
   - Add payment success/cancel pages
   - Show subscription status in user dashboard

3. **Test Complete Flow**
   - Create subscription
   - Approve on PayPal
   - Verify tier updated
   - Test AI endpoint with new tier limits

4. **Go Live**
   - Change `PAYPAL_MODE=live`
   - Use production credentials
   - Test with real (small) payment
   - Monitor webhook events

---

## 📞 Support

If you encounter issues:
1. Check backend logs: `uvicorn` console output
2. Check MongoDB collections: `users`, `pending_subscriptions`, `webhook_events`
3. Check PayPal dashboard: Activity logs
4. Review this guide for troubleshooting steps

---

**✅ Payment integration is ready!**

Once you add PayPal credentials to `.env`, the backend will handle:
- Subscription creation
- Tier upgrades/downgrades
- Payment webhooks
- Cancellation

Your tier enforcement middleware will automatically apply limits based on subscription status.
