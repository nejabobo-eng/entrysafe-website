# 🚀 RENDER DEPLOYMENT - STEP-BY-STEP GUIDE

**Author:** Mlungisi Mncube  
**Date:** January 2025  
**Purpose:** Fix deployment failure and deploy correctly  
**Status:** Ready to deploy after MongoDB Atlas setup

---

## 🚨 **DEPLOYMENT FAILURE - ROOT CAUSE**

### Error Message:
```
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

### Why It Failed:
1. ❌ Root Directory not set → Render looked at repo root instead of `entrysafe-backend/`
2. ❌ Build command included frontend → Tried to install npm in Python service
3. ❌ Start command typo → `vicorn` instead of `uvicorn`
4. ❌ MongoDB localhost → Cloud deployment can't access localhost:27017

---

## ✅ **CORRECTED RENDER CONFIGURATION**

### 🔧 **Step 1: Delete Old Service**

1. Go to Render dashboard: https://dashboard.render.com
2. Find service: `entrysafe-website`
3. Click on service → Settings (bottom) → Delete Service
4. Confirm deletion

**Why:** Wrong configuration, easier to start fresh than fix.

---

### 🆕 **Step 2: Create NEW Backend Service**

#### Navigate to Dashboard
1. Go to: https://dashboard.render.com
2. Click: **New +** (top right)
3. Select: **Web Service**

#### Connect Repository
1. Click: **Connect account** (if not connected)
2. Or select: `nejabobo-eng/entrysafe-website`
3. Click: **Connect**

---

### ⚙️ **Step 3: Configure Service Settings**

Copy these EXACT settings:

#### **Basic Settings:**

| Setting | Value | Notes |
|---------|-------|-------|
| **Name** | `entrysafe-backend` | Clarifies this is backend only |
| **Region** | Oregon (US West) | Or closest to you |
| **Branch** | `main` | Your default branch |
| **Root Directory** | `entrysafe-backend` | ⚠️ CRITICAL - Must set this! |
| **Runtime** | Python 3 | NOT Node.js |
| **Build Command** | `pip install -r requirements.txt` | Remove npm install |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port 10000` | Fix typo: uvicorn not vicorn |

#### **Instance Type:**
- Free (for testing)
- Or Starter ($7/month for production)

---

### 🔑 **Step 4: Add Environment Variables**

Click **Add Environment Variable** and add each of these:

#### **MongoDB (⚠️ CRITICAL - Wait for Atlas setup)**
```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net
MONGODB_DB_NAME=entrysafe
```
**Note:** Replace with your MongoDB Atlas connection string (you're setting this up now)

#### **Firebase**
```bash
FIREBASE_CREDENTIALS_PATH=./firebase-admin.json
```

#### **API Configuration**
```bash
API_HOST=0.0.0.0
API_PORT=10000
API_RELOAD=False
```
**Note:** `False` in production (not `True`)

#### **CORS (Update after frontend deployment)**
```bash
CORS_ORIGINS=https://entrysafe-website.onrender.com,https://entrysafe.vercel.app
```
**Note:** Add your actual frontend URL here

#### **Environment**
```bash
ENVIRONMENT=production
```

#### **OpenAI Keys (Copy from your .env file)**
```bash
OPENAI_KEY_ACCOUNTING=sk-proj-YOUR_KEY_HERE
OPENAI_KEY_DOCS=sk-proj-YOUR_KEY_HERE
OPENAI_KEY_PRICING=sk-proj-YOUR_KEY_HERE
OPENAI_KEY_SD_STORAGE_HELPER=sk-proj-YOUR_KEY_HERE
```
**Note:** Copy these from your local `.env` file (NOT from this guide)

#### **PayPal Configuration (Sandbox for now)**
```bash
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=AW6uLGXswSfsVsUlmRmlNYUd2lHODZ9-4aql4WlbDO64Xm-p66vvYaceSi5_fPWIfFoPGp2bsinB4dIS
PAYPAL_CLIENT_SECRET=EPJzSL__0Ps_m1o7wmcu0V9URkhnCzeNnHcHWXhxtyTiHP5Q35pkFsopcepyCjK6SC0ylNHYhnB1ApOb
PAYPAL_WEBHOOK_ID=
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

---

### 🎯 **Step 5: Create Web Service**

1. Review all settings
2. Click: **Create Web Service**
3. Wait for deployment (5-10 minutes first time)

---

## 📊 **DEPLOYMENT CHECKLIST**

### Before Deployment:
- [x] Root Directory set to `entrysafe-backend`
- [x] Build command: `pip install -r requirements.txt`
- [x] Start command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
- [ ] MongoDB Atlas URL configured (you're doing this now)
- [x] All environment variables added
- [x] OpenAI keys copied
- [x] PayPal credentials copied

### After Deployment:
- [ ] Check logs for successful startup
- [ ] Test health endpoint: `https://entrysafe-backend.onrender.com/`
- [ ] Test API docs: `https://entrysafe-backend.onrender.com/docs`
- [ ] Verify MongoDB connection works
- [ ] Test AI endpoints with Postman/curl

---

## 🔍 **VERIFY DEPLOYMENT SUCCESS**

### 1. Check Build Logs
Look for these success messages:
```
✅ Installing Python version 3.14.3
✅ Installing dependencies from requirements.txt
✅ Successfully installed fastapi uvicorn motor...
✅ Build succeeded
```

### 2. Check Start Logs
Look for:
```
✅ Starting uvicorn
✅ Application startup complete
✅ Uvicorn running on http://0.0.0.0:10000
```

### 3. Test Health Endpoint
```bash
curl https://entrysafe-backend.onrender.com/
```

Expected response:
```json
{
  "message": "EntrySafe API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

### 4. Test API Documentation
Open in browser:
```
https://entrysafe-backend.onrender.com/docs
```

You should see interactive Swagger UI with all 27 endpoints.

---

## 🚨 **COMMON ISSUES & FIXES**

### Issue 1: "Could not connect to MongoDB"
**Cause:** MongoDB Atlas URL not configured or wrong  
**Fix:**
1. Get correct connection string from MongoDB Atlas
2. Update `MONGODB_URL` environment variable
3. Ensure IP whitelist includes `0.0.0.0/0` or Render IPs

### Issue 2: "Module 'app' has no attribute 'main'"
**Cause:** Root Directory not set  
**Fix:** Set Root Directory to `entrysafe-backend`

### Issue 3: "Port 10000 already in use"
**Cause:** Render uses dynamic ports  
**Fix:** Use `--port $PORT` or keep `--port 10000` (Render handles this)

### Issue 4: "Firebase credentials not found"
**Cause:** `firebase-admin.json` not in deployment  
**Fix:**
- Upload file to Render
- Or use environment variable for credentials JSON

### Issue 5: Build takes too long / times out
**Cause:** Large dependencies  
**Fix:**
- Use requirements.txt with pinned versions (you already have this ✅)
- Consider upgrading to paid instance

---

## 📈 **MONITORING AFTER DEPLOYMENT**

### First 24 Hours:
- [ ] Check logs every hour
- [ ] Monitor MongoDB Atlas usage
- [ ] Test all critical endpoints
- [ ] Verify webhook receives PayPal events
- [ ] Check OpenAI API usage

### Daily:
- [ ] Review error logs
- [ ] Check API response times
- [ ] Monitor database queries
- [ ] Verify security logs (fraud attempts)

### Weekly:
- [ ] Review payment history
- [ ] Check subscription activations
- [ ] Analyze tier distribution
- [ ] Review webhook success rate

---

## 🔐 **SECURITY CHECKLIST**

After deployment, verify:

- [x] HTTPS enabled (automatic on Render)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] PayPal webhook signature verification working
- [ ] Firebase Admin SDK initialized
- [x] OpenAI keys not exposed in logs
- [x] Environment variables encrypted
- [ ] CORS origins restricted to your frontend

---

## 🎯 **NEXT STEPS AFTER SUCCESSFUL DEPLOYMENT**

### Immediate (Today):
1. ✅ Backend deployed and healthy
2. Configure PayPal webhook URL in dashboard
3. Test webhook with PayPal sandbox
4. Deploy frontend to Vercel/Netlify

### Short-Term (This Week):
1. Test complete payment flow end-to-end
2. Verify all 8 security scenarios
3. Monitor first 10 sandbox subscriptions
4. Document any issues

### Production (After Testing):
1. Switch PayPal to live credentials
2. Update webhook URLs
3. Test with real payment
4. Monitor first 5-10 real subscriptions
5. Go live! 🚀

---

## 📞 **GETTING HELP**

### Render Support:
- Documentation: https://render.com/docs
- Community: https://community.render.com
- Support: support@render.com

### Entry Safe Issues:
- Check logs first
- Review SECURITY_FIX_COMPLETE.md
- Review TESTING_AND_DEPLOYMENT_STATUS.md
- Test locally before assuming cloud issue

---

## ✅ **DEPLOYMENT SUCCESS CRITERIA**

You know deployment succeeded when:

1. ✅ Build completes without errors
2. ✅ Service shows "Live" status (green)
3. ✅ Health endpoint returns 200 OK
4. ✅ API docs accessible at /docs
5. ✅ MongoDB connection established
6. ✅ No errors in logs
7. ✅ Can create test subscription
8. ✅ Webhook receives events

---

## 🔥 **FINAL NOTES**

### Free Tier Limitations:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 50+ seconds
- 750 hours/month free compute time
- Good for testing, not production

### When to Upgrade:
- Going to production
- Need always-on service
- Need custom domains
- Need SSH access
- Need scaling

### Cost Estimate:
- Free: $0/month (testing)
- Starter: $7/month (small production)
- Standard: $25/month (growing business)

---

**Author:** Mlungisi Mncube  
**Last Updated:** January 2025  
**Status:** Ready for deployment after MongoDB Atlas setup  
**Next:** Deploy with corrected configuration
