# 🔐 Environment Variables for Deployment

## Frontend (Vercel/Netlify)

Add these in your hosting dashboard (Settings → Environment Variables):

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL (Update after backend deployment)
VITE_API_URL=https://entrysafe-backend.onrender.com
```

**Where to find Firebase values:**
1. Go to: https://console.firebase.google.com
2. Select your project
3. Click ⚙️ (Settings) → Project settings
4. Scroll to "Your apps" section
5. Copy values from SDK setup

---

## Backend (Render/Railway)

Add these in your hosting dashboard (Environment Variables tab):

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/entrysafe?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Firebase Admin SDK (entire JSON as single line)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# OpenAI API Keys (4 Apps)
OPENAI_KEY_ACCOUNTING=sk-proj-8U_1w9H7bf...
OPENAI_KEY_DOCS=sk-proj-gybFshtWOd...
OPENAI_KEY_PRICING=sk-proj-CJcJHdsHqo...
OPENAI_KEY_SD_STORAGE_HELPER=sk-proj-z1IF1VVLmT...

# PayFast (Get from PayFast dashboard after signup)
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_secure_passphrase

# CORS (Update after frontend deployment)
ALLOWED_ORIGINS=https://entrysafe.co.za,https://www.entrysafe.co.za
```

**Important Notes:**
- Never commit these to GitHub!
- Use strong, random values for JWT_SECRET
- Firebase service account key must be valid JSON (escape newlines in private_key)
- Update ALLOWED_ORIGINS after frontend is deployed

---

## 🔍 How to Get Firebase Service Account Key

1. Go to: https://console.firebase.google.com
2. Select your project
3. Click ⚙️ (Settings) → Project settings
4. Click "Service accounts" tab
5. Click "Generate new private key"
6. Download JSON file
7. **For Railway/Render:** Copy entire JSON content as single line (minified)
8. **Keep this file secure!** Never share or commit to Git

---

## ✅ Deployment Checklist

### Before Deploying
- [ ] All code committed to GitHub
- [ ] Environment variables documented
- [ ] Firebase project created and configured
- [ ] MongoDB Atlas cluster created
- [ ] OpenAI keys have billing enabled ($5-10 credit)
- [ ] PayFast merchant account created

### Frontend Deployment
- [ ] Vercel/Netlify account created
- [ ] Repository connected
- [ ] Environment variables added
- [ ] Build successful
- [ ] Site accessible via temporary URL

### Backend Deployment
- [ ] Railway/Render account created
- [ ] Repository connected
- [ ] Environment variables added
- [ ] API responding (test /health endpoint)
- [ ] Database connection verified

### Domain Connection
- [ ] DNS records added in GoDaddy
- [ ] Domain added in Vercel
- [ ] SSL certificate provisioned
- [ ] Site accessible via entrysafe.co.za
- [ ] www.entrysafe.co.za redirects properly

### Email Setup
- [ ] Zoho account created
- [ ] Domain verified
- [ ] MX records configured
- [ ] Test email sent successfully
- [ ] Updated contact forms to new email

### Final Testing
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Client portal accessible
- [ ] Apps page displays properly
- [ ] Contact form works
- [ ] Mobile responsive
- [ ] SSL certificate shows 🔒 in browser

---

## 🚨 Common Issues & Solutions

**Issue:** "Domain not found"  
**Solution:** DNS propagation takes time. Wait 1-24 hours, check with `nslookup entrysafe.co.za`

**Issue:** "Certificate error"  
**Solution:** Vercel SSL takes 10-30 mins to provision. Wait and refresh.

**Issue:** "API requests failing"  
**Solution:** Update CORS in backend to allow entrysafe.co.za, update VITE_API_URL in frontend

**Issue:** "Build fails on Vercel"  
**Solution:** Check build logs. Usually missing env variables or Node version mismatch

**Issue:** "Firebase auth redirect fails"  
**Solution:** Add entrysafe.co.za to Firebase authorized domains (Authentication → Settings → Authorized domains)

---

## 📞 Support Resources

**Vercel Docs:** https://vercel.com/docs  
**Railway Docs:** https://docs.railway.app  
**Firebase Docs:** https://firebase.google.com/docs  
**Zoho Mail Setup:** https://www.zoho.com/mail/help/  
**GoDaddy DNS:** https://za.godaddy.com/help/manage-dns-records-680

---

## 🎉 You're Ready!

Your platform is production-ready. Domain is secured. Time to deploy and launch! 🚀

**Estimated deployment time:** 2-3 hours (if you have all credentials ready)

Let's make Entry Safe live! 💪
