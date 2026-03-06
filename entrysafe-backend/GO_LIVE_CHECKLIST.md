# 🚀 ENTRYSAFE - GO LIVE CHECKLIST

**Author:** Mlungisi Mncube  
**Date:** January 2025  
**Purpose:** Production deployment checklist for EntrySafe SaaS platform  
**Status:** Ready for production launch after sandbox testing

---

## 📋 **PRE-LAUNCH VERIFICATION**

Before going live, confirm all sandbox testing is complete:

### ✅ Sandbox Testing Completed
- [ ] User signup/login works (Firebase Auth)
- [ ] Subscription plan selection works
- [ ] PayPal sandbox payment completes successfully
- [ ] Webhook receives and verifies PayPal events
- [ ] Subscription tier activates automatically (webhook-verified)
- [ ] AI features unlock for paid tiers
- [ ] AI features blocked for free tier
- [ ] Subscription cancellation works
- [ ] Failed payment handling works
- [ ] All 8 security scenarios tested (see SECURITY_FIX_COMPLETE.md)

### ✅ Infrastructure Health
- [ ] Backend health endpoint returns 200 OK: https://entrysafe-website.onrender.com/
- [ ] Frontend loads without errors: https://entrysafe-frontend.vercel.app
- [ ] MongoDB Atlas connection stable
- [ ] Firebase Admin SDK initialized
- [ ] All 4 OpenAI API keys working
- [ ] No errors in Render logs
- [ ] No CORS errors in browser console

### ✅ Security Verification
- [ ] Webhook signature verification working
- [ ] Replay attack prevention tested
- [ ] Timestamp validation working (rejects > 5 min old)
- [ ] Duplicate event detection working
- [ ] State transition validation working
- [ ] JWT authentication working
- [ ] HTTPS enabled on all services
- [ ] Environment variables encrypted

---

## 🎯 **PHASE 1: PAYPAL LIVE SETUP**

### Step 1: Create Live PayPal Business Account

**If you don't have one:**
1. Go to: https://www.paypal.com/za/business
2. Click: **Sign Up**
3. Select: **Business Account**
4. Complete business verification (may take 1-3 business days)
5. Verify bank account and identity documents

**Cost:** Free account, but PayPal charges 2.9% + R0.30 per transaction

---

### Step 2: Create Live REST API App

1. Go to: https://developer.paypal.com/dashboard
2. Switch from **Sandbox** to **Live** (toggle at top)
3. Click: **Apps & Credentials**
4. Click: **Create App**
5. Enter:
   - **App Name:** EntrySafe Live
   - **App Type:** Merchant
6. Click: **Create App**
7. **CRITICAL:** Copy and save securely:
   - **Client ID** (starts with `A...`)
   - **Secret** (click "Show" to reveal)

**⚠️ Security Warning:** Never commit these to GitHub or share publicly!

---

### Step 3: Enable Live Subscriptions

1. In your PayPal Live app settings
2. Scroll to: **Features**
3. Enable:
   - ✅ **Subscriptions** (recurring payments)
   - ✅ **Vault** (save payment methods)
   - ✅ **Webhooks** (event notifications)
4. Click: **Save**

---

### Step 4: Create Live Subscription Plans

You need to recreate your subscription plans in **live mode**:

#### **Option A: Via PayPal Dashboard (Recommended)**
1. Go to: https://www.paypal.com/businessprofile/settings/
2. Click: **Payment Preferences**
3. Click: **Subscription Plans**
4. Create 3 plans matching your sandbox plans:

**Plan 1: Starter Monthly**
- **Name:** EntrySafe Starter
- **Billing Cycle:** Every 1 month
- **Price:** R199.00 ZAR
- **Description:** Basic AI features for small businesses
- **Setup Fee:** R0
- **Trial Period:** None (or 7 days free)

**Plan 2: Premium Monthly**
- **Name:** EntrySafe Premium
- **Billing Cycle:** Every 1 month
- **Price:** R399.00 ZAR
- **Description:** Advanced AI with priority support
- **Setup Fee:** R0
- **Trial Period:** None (or 7 days free)

**Plan 3: Annual Premium**
- **Name:** EntrySafe Annual
- **Billing Cycle:** Every 12 months
- **Price:** R3,999.00 ZAR (save 17%)
- **Description:** Full year premium access with discount
- **Setup Fee:** R0
- **Trial Period:** None (or 7 days free)

5. **CRITICAL:** Copy each plan's **Plan ID** (starts with `P-...`)
6. Update these in your frontend code:
   - `entrysafe-frontend/src/pages/Pricing.jsx`
   - Or wherever you store plan IDs

#### **Option B: Via API** (Advanced)
Use PayPal REST API to create plans programmatically (see PayPal docs)

---

### Step 5: Create Live Webhook

1. Go to: https://developer.paypal.com/dashboard
2. Ensure you're in **Live** mode (toggle at top)
3. Click: **Apps & Credentials**
4. Click: Your live app name (EntrySafe Live)
5. Scroll to: **Webhooks**
6. Click: **Add Webhook**
7. Enter:
   - **Webhook URL:** `https://entrysafe-website.onrender.com/api/payments/webhook`
   - **Event version:** 1.0
8. Select these events (same as sandbox):
   - ✅ `BILLING.SUBSCRIPTION.ACTIVATED`
   - ✅ `BILLING.SUBSCRIPTION.CANCELLED`
   - ✅ `BILLING.SUBSCRIPTION.CREATED`
   - ✅ `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - ✅ `BILLING.SUBSCRIPTION.UPDATED`
   - ✅ `CHECKOUT.ORDER.APPROVED`
   - ✅ `CHECKOUT.ORDER.COMPLETED`
   - ✅ `PAYMENT.SALE.COMPLETED`
   - ✅ `PAYMENT.SALE.DENIED`
9. Click: **Save**
10. **CRITICAL:** Copy the **Webhook ID** (format: `###########`)

---

### Step 6: Update Render Environment Variables

1. Go to: https://dashboard.render.com
2. Click: `entrysafe-backend` (or `entrysafe-website`)
3. Click: **Environment** tab (left sidebar)
4. Update these variables:

| Variable | Sandbox Value | Live Value |
|----------|---------------|------------|
| `PAYPAL_MODE` | `sandbox` | **`live`** |
| `PAYPAL_CLIENT_ID` | `AW6uLGXs...` | **`<your_live_client_id>`** |
| `PAYPAL_CLIENT_SECRET` | `EPJzSL__...` | **`<your_live_client_secret>`** |
| `PAYPAL_WEBHOOK_ID` | `231133211T414415X` | **`<your_live_webhook_id>`** |
| `PAYPAL_API_BASE` | `https://api-m.sandbox.paypal.com` | **`https://api-m.paypal.com`** |

5. Click: **Save Changes**
6. Wait 1-2 minutes for Render to redeploy automatically

---

### Step 7: Update Frontend Plan IDs

1. Open: `entrysafe-frontend/src/pages/Pricing.jsx` (or your pricing config file)
2. Replace sandbox plan IDs with live plan IDs:

```javascript
// BEFORE (Sandbox)
const PLANS = {
  starter: "P-1234567890SANDBOX",
  premium: "P-9876543210SANDBOX",
  annual: "P-5555555555SANDBOX"
};

// AFTER (Live)
const PLANS = {
  starter: "P-XXXXXXXXXXXXXXXXXX", // Your live Starter plan ID
  premium: "P-YYYYYYYYYYYYYYYYYY", // Your live Premium plan ID
  annual: "P-ZZZZZZZZZZZZZZZZZZ"  // Your live Annual plan ID
};
```

3. Commit and push changes:
```bash
git add entrysafe-frontend/src/pages/Pricing.jsx
git commit -m "Update PayPal plan IDs for production"
git push origin main
```

4. Redeploy frontend:
```bash
cd entrysafe-frontend
vercel --prod
```

---

## 🌐 **PHASE 2: DOMAIN & SSL (OPTIONAL)**

### Frontend Custom Domain (Vercel)

**Example:** `https://app.entrysafe.co.za`

#### Step 1: Add Domain to Vercel
1. Go to: https://vercel.com/dashboard
2. Click: Your project (`entrysafe-frontend`)
3. Click: **Settings** → **Domains**
4. Enter: `app.entrysafe.co.za`
5. Click: **Add**

#### Step 2: Configure DNS
1. Go to your domain registrar (e.g., Crazy Domains, GoDaddy)
2. Add DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `app` | `cname.vercel-dns.com` | 3600 |

3. Wait 5-60 minutes for DNS propagation
4. Vercel will automatically provision SSL certificate (Let's Encrypt)

---

### Backend Custom Domain (Render)

**Example:** `https://api.entrysafe.co.za`

#### Step 1: Add Custom Domain
1. Go to: https://dashboard.render.com
2. Click: `entrysafe-backend`
3. Click: **Settings** → **Custom Domain**
4. Enter: `api.entrysafe.co.za`
5. Click: **Save**

#### Step 2: Configure DNS
1. Go to your domain registrar
2. Add DNS records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| `CNAME` | `api` | `entrysafe-backend.onrender.com` | 3600 |

3. Wait 5-60 minutes for DNS propagation
4. Render will automatically provision SSL certificate

---

### Update CORS Origins

After custom domains are active:

1. Go to Render: `entrysafe-backend` → **Environment**
2. Update `CORS_ORIGINS`:

**Without Custom Domains:**
```
https://entrysafe-frontend.vercel.app,http://localhost:5173
```

**With Custom Domains:**
```
https://app.entrysafe.co.za,http://localhost:5173
```

3. Click: **Save Changes**

---

### Update PayPal Webhook URL

If using custom domain for backend:

1. Go to: https://developer.paypal.com/dashboard (Live mode)
2. Click: Your app → **Webhooks**
3. Click: **Edit** on existing webhook
4. Update URL to: `https://api.entrysafe.co.za/api/payments/webhook`
5. Click: **Save**

---

## 🔐 **PHASE 3: SECURITY HARDENING**

### MongoDB Atlas IP Whitelist

**Current:** `0.0.0.0/0` (allows all IPs - testing only)

**Production:** Restrict to specific IPs

1. Go to: https://cloud.mongodb.com
2. Click: **Network Access**
3. Click: **Add IP Address**
4. Add these IPs:
   - **Render IPs:** Get from Render docs (changes by region)
   - **Your office IP:** For manual database access
   - **Vercel IPs:** (optional, if using Vercel Edge Functions)
5. Remove: `0.0.0.0/0` entry
6. Click: **Confirm**

**Find Render IPs:**
- Go to: https://render.com/docs/static-outbound-ip-addresses
- Add all IPs for your region (e.g., Oregon)

---

### Firebase Security Rules

Review Firebase Auth and Firestore rules:

1. Go to: https://console.firebase.google.com
2. Click: Your project (`entry-safe`)
3. Click: **Firestore Database** → **Rules**
4. Ensure rules restrict access appropriately:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Only admins can read all users
    match /users/{userId} {
      allow read: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

5. Click: **Publish**

---

### Environment Variables Audit

Verify all sensitive values are NOT in code:

- [ ] No API keys in frontend code
- [ ] No secrets in GitHub repository
- [ ] `.env` files in `.gitignore`
- [ ] Render environment variables encrypted
- [ ] Vercel environment variables set (if needed)

---

## 📊 **PHASE 4: MONITORING SETUP**

### Render Monitoring

1. Go to: https://dashboard.render.com
2. Click: `entrysafe-backend`
3. Enable:
   - **Email Alerts** (for service failures)
   - **Webhook Alerts** (optional, Slack integration)

---

### MongoDB Atlas Alerts

1. Go to: https://cloud.mongodb.com
2. Click: **Alerts**
3. Configure alerts for:
   - **High CPU usage** (> 80%)
   - **High memory usage** (> 90%)
   - **Connection spikes** (> 100 connections)
   - **Disk space warning** (> 80% used)

---

### OpenAI Usage Monitoring

1. Go to: https://platform.openai.com/usage
2. Set up billing alerts:
   - **Soft limit:** $50/month
   - **Hard limit:** $100/month
3. Monitor daily costs

---

### PayPal Transaction Monitoring

1. Go to: https://www.paypal.com/businessprofile/transactions
2. Review daily:
   - Successful subscriptions
   - Failed payments
   - Chargebacks/disputes
3. Set up email notifications for:
   - **Failed payments**
   - **Subscription cancellations**
   - **Chargebacks**

---

## 🧪 **PHASE 5: PRODUCTION TESTING**

### Test 1: Low-Value Live Payment

**⚠️ Use real money - test with minimum plan**

1. Open: `https://entrysafe-frontend.vercel.app` (or custom domain)
2. Create new test account (use real email)
3. Select: **Starter Plan** (lowest price)
4. Complete PayPal payment with real card
5. Verify:
   - [ ] Payment succeeds
   - [ ] Webhook received in Render logs
   - [ ] Subscription activated in MongoDB
   - [ ] AI features unlocked
6. Cancel subscription immediately (to avoid recurring charge)
7. Verify cancellation works

---

### Test 2: Health Check

```bash
curl https://entrysafe-website.onrender.com/
```

Expected:
```json
{
  "message": "EntrySafe API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

---

### Test 3: API Documentation

Open: https://entrysafe-website.onrender.com/docs

Verify:
- [ ] All 27 endpoints listed
- [ ] Interactive Swagger UI loads
- [ ] Can test endpoints (with auth)

---

### Test 4: Webhook Verification

1. Make a test subscription
2. Check Render logs for:
```
INFO: Webhook received from PayPal
INFO: Webhook verified successfully
INFO: Subscription activated for user: [user_id]
```

3. Check MongoDB `webhook_events` collection
4. Verify no duplicate event_id entries

---

### Test 5: Failed Payment Handling

1. In PayPal dashboard, simulate failed payment
2. Or: Use test card with insufficient funds
3. Verify:
   - [ ] `PAYMENT.SALE.DENIED` event logged
   - [ ] User subscription status = `payment_failed`
   - [ ] User receives email notification (if configured)
   - [ ] AI features remain blocked

---

### Test 6: Security Scenarios

Test all 8 scenarios from `SECURITY_FIX_COMPLETE.md`:

1. ✅ Successful subscription activation
2. ✅ Tier activation timing (after webhook, not before)
3. ✅ Failed payment handling
4. ✅ Suspended subscription
5. ✅ Expired subscription
6. ✅ Cancelled subscription
7. ✅ Replay attack prevention
8. ✅ Stale webhook rejection

---

## 🚨 **ROLLBACK PLAN**

If production issues occur:

### Quick Rollback to Sandbox

1. Go to Render: `entrysafe-backend` → **Environment**
2. Change:
   - `PAYPAL_MODE=sandbox`
   - `PAYPAL_CLIENT_ID=<sandbox_client_id>`
   - `PAYPAL_CLIENT_SECRET=<sandbox_client_secret>`
   - `PAYPAL_WEBHOOK_ID=231133211T414415X`
   - `PAYPAL_API_BASE=https://api-m.sandbox.paypal.com`
3. Click: **Save Changes**
4. Update frontend plan IDs back to sandbox
5. Redeploy frontend

**Note:** Existing live subscriptions will continue to work even in sandbox mode (they're stored in MongoDB)

---

### Database Backup

Before going live, backup MongoDB:

1. Go to: https://cloud.mongodb.com
2. Click: **Clusters** → **entrysafe**
3. Click: **Backup** tab
4. Click: **Take Snapshot Now**
5. Download backup (optional)

**Restore if needed:**
1. Click: **Backups**
2. Select snapshot
3. Click: **Restore**

---

## 📈 **PHASE 6: POST-LAUNCH MONITORING**

### First 24 Hours
- [ ] Check Render logs every 2 hours
- [ ] Monitor MongoDB Atlas metrics (CPU, memory, connections)
- [ ] Review PayPal transactions (all successful?)
- [ ] Check webhook success rate (should be 100%)
- [ ] Monitor OpenAI API usage (any spikes?)
- [ ] Watch for error logs (fraud attempts, failures)
- [ ] Verify all subscriptions activated correctly
- [ ] Check user feedback (support emails, social media)

### First Week
- [ ] Review error logs daily
- [ ] Check API response times (< 500ms average)
- [ ] Monitor database query performance
- [ ] Verify webhook event deduplication working
- [ ] Review payment failure rate (should be < 5%)
- [ ] Analyze tier distribution (which plans popular?)
- [ ] Track OpenAI costs per user
- [ ] Monitor subscription churn rate

### Ongoing
- [ ] Weekly payment reconciliation (PayPal vs. MongoDB)
- [ ] Monthly cost analysis (hosting + APIs)
- [ ] Quarterly security audit
- [ ] Review and optimize slow endpoints
- [ ] Update dependencies regularly
- [ ] Monitor for PayPal API changes
- [ ] Test disaster recovery procedures

---

## 📞 **SUPPORT & ESCALATION**

### If Issues Occur

**Backend Down:**
1. Check Render status: https://status.render.com
2. Check Render logs for errors
3. Restart service: Render → Manual Deploy
4. Contact Render support: support@render.com

**Payment Failures:**
1. Check PayPal webhook logs
2. Verify webhook signature verification passed
3. Check MongoDB for duplicate events
4. Contact PayPal support: https://www.paypal.com/za/smarthelp/contact-us

**MongoDB Connection Issues:**
1. Check MongoDB Atlas status
2. Verify IP whitelist includes Render IPs
3. Check connection string is correct
4. Contact MongoDB support: https://support.mongodb.com

**OpenAI API Errors:**
1. Check API key quotas: https://platform.openai.com/usage
2. Verify rate limits not exceeded
3. Check OpenAI status: https://status.openai.com
4. Rotate to backup API key if needed

---

## ✅ **LAUNCH CHECKLIST SUMMARY**

### Pre-Launch
- [ ] All sandbox testing complete
- [ ] All 8 security scenarios passed
- [ ] Backend health check passing
- [ ] Frontend loading without errors
- [ ] MongoDB connection stable
- [ ] No errors in logs

### PayPal Live Setup
- [ ] Live PayPal Business account verified
- [ ] Live REST API app created
- [ ] Live subscription plans created
- [ ] Live webhook created
- [ ] Render environment variables updated
- [ ] Frontend plan IDs updated
- [ ] Test live payment completed successfully

### Domain & SSL (Optional)
- [ ] Frontend custom domain configured
- [ ] Backend custom domain configured
- [ ] SSL certificates provisioned
- [ ] CORS origins updated
- [ ] PayPal webhook URL updated

### Security
- [ ] MongoDB IP whitelist restricted
- [ ] Firebase security rules reviewed
- [ ] No secrets in code repository
- [ ] Environment variables encrypted
- [ ] Webhook signature verification working

### Monitoring
- [ ] Render email alerts enabled
- [ ] MongoDB Atlas alerts configured
- [ ] OpenAI usage limits set
- [ ] PayPal transaction monitoring enabled

### Testing
- [ ] Low-value live payment test passed
- [ ] Health check passing
- [ ] API documentation accessible
- [ ] Webhook verification working
- [ ] Failed payment handling tested
- [ ] All security scenarios tested

### Post-Launch
- [ ] 24-hour monitoring completed
- [ ] No critical errors logged
- [ ] All subscriptions activating correctly
- [ ] Webhook success rate 100%
- [ ] User feedback positive

---

## 🎉 **YOU'RE LIVE!**

Congratulations! EntrySafe is now running in production with:

✅ **Frontend:** Vercel (React + Vite)  
✅ **Backend:** Render (FastAPI + Python)  
✅ **Database:** MongoDB Atlas  
✅ **Authentication:** Firebase  
✅ **Payments:** PayPal Subscriptions  
✅ **AI Services:** OpenAI (4 API keys)  
✅ **Security:** 5-layer webhook verification  
✅ **Monitoring:** Real-time alerts & logging  

---

**Next Steps:**
1. Monitor first 10 live subscriptions closely
2. Gather user feedback
3. Optimize performance based on metrics
4. Plan feature enhancements
5. Scale infrastructure as needed

---

**Author:** Mlungisi Mncube  
**Last Updated:** January 2025  
**Status:** Production-ready deployment guide  
**Support:** Check SECURITY_FIX_COMPLETE.md, RENDER_DEPLOYMENT_GUIDE.md, MONGODB_ATLAS_SETUP.md
