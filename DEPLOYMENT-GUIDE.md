# 🚀 EntrySafe Deployment Guide

## 🎉 Congratulations!

**Domain Secured:** `entrysafe.co.za` ✅  
**Cost:** R273.70 (1 year + protection)  
**Status:** Registration in progress (DNS propagation: 5 mins - 24 hours)

---

## 🎯 Deployment Roadmap

### Phase 1: Frontend Deployment (Website) ⭐ START HERE

**Recommended: Vercel (Best for React/Vite)**

#### Option A: Vercel (Recommended) 🔥
**Why:** Free tier, automatic HTTPS, global CDN, GitHub integration

1. **Sign up:** https://vercel.com
2. **Connect GitHub repo:**
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite config
3. **Configure:**
   - Framework Preset: Vite
   - Root Directory: `entrysafe-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variables:**
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_URL=https://your-backend.railway.app
   ```
5. **Deploy** - Click "Deploy"
6. **Get URL** - You'll get: `entrysafe-frontend.vercel.app`

#### Option B: Netlify (Alternative)
1. **Sign up:** https://netlify.com
2. **Drag & drop** or connect GitHub
3. **Build settings:**
   - Base directory: `entrysafe-frontend`
   - Build command: `npm run build`
   - Publish directory: `entrysafe-frontend/dist`
4. **Add environment variables** (same as above)
5. **Deploy**

---

### Phase 2: Backend Deployment (API)

**Recommended: Render (Best for FastAPI/Python)**

#### Option A: Render (Recommended) 🔥
**Why:** Generous free tier, Python-optimized, easy setup, reliable

1. **Sign up:** https://render.com
2. **New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your backend repo
3. **Configure:**
   - Name: `entrysafe-backend`
   - Environment: **Python 3**
   - Region: **Oregon (US West)** or closest
   - Branch: `main`
   - Root Directory: `entrysafe-backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
   OPENAI_KEY_ACCOUNTING=sk-proj-8U_1w9H7bf...
   OPENAI_KEY_DOCS=sk-proj-gybFshtWOd...
   OPENAI_KEY_PRICING=sk-proj-CJcJHdsHqo...
   OPENAI_KEY_SD_STORAGE_HELPER=sk-proj-z1IF1VVLmT...
   PAYFAST_MERCHANT_ID=your_merchant_id
   PAYFAST_MERCHANT_KEY=your_merchant_key
   PAYFAST_PASSPHRASE=your_passphrase
   ```
5. **Instance Type:** Select **Free**
6. **Deploy** - Render gives you: `https://entrysafe-backend.onrender.com`
7. **Update Frontend** - Add Render URL to frontend's `VITE_API_URL`

**⚠️ Free Tier Note:** Backend sleeps after 15 mins of inactivity. First request after sleep takes 30-60 seconds. Perfect for launch, upgrade to paid ($7/month) when you want always-on performance.

#### Option B: Railway (Alternative)
**Why:** Free $5/month credit, easy Python deployment, alternative to Render

1. **Sign up:** https://railway.app
2. **New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your backend repo
3. **Configure:**
   - Root Directory: `entrysafe-backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add all environment variables** (same as Render)
5. **Generate Domain** - Railway gives you: `your-backend.up.railway.app`
6. **Update Frontend** - Add Railway URL to frontend's `VITE_API_URL`

**Note:** Railway's free tier is $5 credit/month. For basic usage, this covers hosting. Monitor usage.

---

### Phase 3: Connect Domain to Hosting 🌐

#### Connect entrysafe.co.za to Vercel

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add domain: `entrysafe.co.za`
   - Also add: `www.entrysafe.co.za`

2. **In GoDaddy DNS Management:**
   - Go to: https://dcc.godaddy.com/manage/entrysafe.co.za/dns
   - **Add A Record:**
     ```
     Type: A
     Name: @
     Value: 76.76.21.21 (Vercel IP)
     TTL: 600
     ```
   - **Add CNAME Record:**
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     TTL: 600
     ```

3. **Wait for DNS propagation** (usually 5-30 minutes)

4. **Verify SSL:**
   - Vercel automatically provisions SSL
   - Visit: https://entrysafe.co.za
   - You should see 🔒 secure badge

---

### Phase 4: Professional Email Setup 📧

#### Option A: Zoho Mail (Free Tier) 🔥

1. **Sign up:** https://www.zoho.com/mail/
2. **Add domain:** `entrysafe.co.za`
3. **Create emails:**
   - `support@entrysafe.co.za`
   - `admin@entrysafe.co.za`
   - `billing@entrysafe.co.za`
   - `mlungisi@entrysafe.co.za` (your personal one)

4. **Update GoDaddy DNS with Zoho MX records:**
   ```
   Type: MX
   Priority: 10
   Value: mx.zoho.com
   
   Type: MX
   Priority: 20
   Value: mx2.zoho.com
   
   Type: MX
   Priority: 50
   Value: mx3.zoho.com
   ```

5. **Add SPF/DKIM records** (Zoho provides these)

#### Option B: Google Workspace (Paid - R125/month per user)
Professional but costs money. Zoho free tier is perfect for starting.

---

### Phase 5: Update Website Content

**Things to Update After Deployment:**

1. **Replace all email references:**
   - Old: `entrysafeapps@gmail.com`
   - New: `support@entrysafe.co.za`

2. **Update contact forms** to send to new email

3. **Update Firebase Auth email domain** (once email is set up)

4. **Add domain to app descriptions:**
   - "Download at entrysafe.co.za"
   - "Visit entrysafe.co.za for subscriptions"

---

## 🔐 Security Checklist

Before going live:

- [ ] All environment variables configured (no hardcoded secrets)
- [ ] Firebase security rules configured
- [ ] MongoDB access restricted to backend IP only
- [ ] SSL certificate active (https://)
- [ ] CORS configured correctly (only allow entrysafe.co.za)
- [ ] PayFast sandbox tested before going live
- [ ] .env files in .gitignore (never commit secrets)

---

## 📊 Post-Launch Monitoring

**Set up:**
1. **Google Analytics** - Track visitors
2. **Sentry** - Error monitoring (free tier)
3. **Uptime Robot** - Monitor site availability (free)
4. **PayFast Dashboard** - Track subscription payments

---

## 💡 Next Steps (In Order)

### Immediate (This Week)
1. ✅ Domain purchased - DONE! 🎉
2. ⏳ Wait for DNS propagation (check with: `nslookup entrysafe.co.za`)
3. 🚀 Deploy frontend to Vercel
4. 🔌 Deploy backend to Railway
5. 🌐 Connect entrysafe.co.za to Vercel
6. 🔒 Verify SSL is working
7. 📧 Set up Zoho email (support@entrysafe.co.za)

### Soon (Next 2 Weeks)
8. 📱 Upload APK files for Android apps
9. 💻 Upload EXE files for Windows apps
10. 💳 Activate PayFast merchant account
11. 💰 Add OpenAI billing ($10 initial credit)
12. 🎨 Generate app icons (AppIcon.co for Flutter, IcoConverter for Windows)
13. 📝 Write Privacy Policy and Terms of Service pages

### Later (Month 1)
14. 🎯 Google Ads campaign (R500-1000 budget)
15. 📱 Social media presence (Facebook, LinkedIn)
16. 📊 Set up analytics and monitoring
17. 🧪 Test all 4 apps with live AI endpoints
18. 👥 Onboard first 10 beta users

---

## 🎯 Your Current Stack

**Frontend:**
- React + Vite + Tailwind CSS
- Hosted on: Vercel (recommended)
- Domain: entrysafe.co.za
- SSL: Automatic via Vercel

**Backend:**
- FastAPI (Python)
- Hosted on: Railway (recommended)
- Database: MongoDB Atlas (cloud)
- AI: OpenAI GPT-3.5-turbo

**Apps:**
- 4 Android apps (Flutter)
- 4 Windows apps (.NET/Flutter)
- Downloads via website

**Payments:**
- PayFast (South African gateway)
- Supports all major cards + EFT

---

## 💼 Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Domain (entrysafe.co.za) | R7.40/mo | R89/year prepaid |
| Vercel (Frontend) | R0 | Free tier (perfect for now) |
| Railway (Backend) | R0-R80 | $5 free credit/month |
| MongoDB Atlas | R0 | Free tier (512MB) |
| Firebase Auth | R0 | Free tier (50k users) |
| Zoho Email | R0 | Free tier (5 users) |
| OpenAI API | R50-200 | Pay-as-you-go (~$0.002 per request) |
| **TOTAL** | **R57-287/mo** | Extremely affordable! |

**Revenue at 100 users:** R39,237/month  
**Profit margin:** 99%+ 🔥

---

## 🛠️ Quick Commands

```bash
# Frontend Build (local test)
cd entrysafe-frontend
npm run build
npm run preview

# Backend Run (local test)
cd entrysafe-backend
uvicorn app.main:app --reload

# Test OpenAI Keys
cd entrysafe-backend
python test_openai_keys.py

# Check DNS Propagation
nslookup entrysafe.co.za
# or visit: https://dnschecker.org/#A/entrysafe.co.za
```

---

## 🔥 You're Ready to Launch!

**What You've Built:**
✅ Professional business website  
✅ 4-tier subscription system  
✅ AI-powered app ecosystem  
✅ Secure client portal  
✅ Payment integration ready  
✅ Official domain secured  

**This is no longer a side project.**  
**This is a registered business platform.**

When you're ready to deploy, start with **Vercel for frontend** and **Railway for backend** - both have excellent free tiers and will scale with you.

🚀 **Let's go, Mlungisi!** You're building something real.

---

## 📞 Need Help?

If you need assistance with:
- Vercel deployment walkthrough
- Railway backend setup
- DNS configuration
- Email setup with Zoho
- PayFast merchant account

Just ask! I'll guide you through each step. 💪
