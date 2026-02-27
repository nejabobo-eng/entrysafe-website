# 🌐 GoDaddy DNS Configuration for entrysafe.co.za

## 📍 Where to Configure

**GoDaddy DNS Management:**  
https://dcc.godaddy.com/manage/entrysafe.co.za/dns

---

## 🎯 Step 1: Connect to Vercel (Website)

### Add A Record for Root Domain

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds (10 minutes)
```

**What it does:** Points `entrysafe.co.za` to Vercel servers

---

### Add CNAME Record for WWW

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds (10 minutes)
```

**What it does:** Redirects `www.entrysafe.co.za` → `entrysafe.co.za`

---

## 📧 Step 2: Configure Zoho Email (Optional but Recommended)

### Add MX Records (Email Delivery)

**MX Record 1:**
```
Type: MX
Name: @
Priority: 10
Value: mx.zoho.com
TTL: 3600 seconds (1 hour)
```

**MX Record 2:**
```
Type: MX
Name: @
Priority: 20
Value: mx2.zoho.com
TTL: 3600 seconds (1 hour)
```

**MX Record 3:**
```
Type: MX
Name: @
Priority: 50
Value: mx3.zoho.com
TTL: 3600 seconds (1 hour)
```

---

### Add SPF Record (Email Security)

```
Type: TXT
Name: @
Value: v=spf1 include:zoho.com ~all
TTL: 3600 seconds
```

**What it does:** Prevents email spoofing, improves deliverability

---

### Add DKIM Record (Email Authentication)

Zoho will provide this after domain verification. It looks like:

```
Type: TXT
Name: zmail._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GN... (long key)
TTL: 3600 seconds
```

**Get from:** Zoho Mail Admin Console → Domain Settings → DKIM

---

## 🔐 Step 3: API Subdomain (Optional - For Backend)

If you want `api.entrysafe.co.za` instead of Railway's default URL:

```
Type: CNAME
Name: api
Value: your-backend.up.railway.app
TTL: 600 seconds
```

Then in Railway, add `api.entrysafe.co.za` as custom domain.

---

## ⏱️ DNS Propagation Timeline

| Record Type | Typical Time | Max Time |
|-------------|--------------|----------|
| A Record | 5-30 minutes | 24 hours |
| CNAME | 5-30 minutes | 24 hours |
| MX Records | 1-4 hours | 48 hours |
| TXT Records | 1-4 hours | 48 hours |

**Check propagation:** https://dnschecker.org/#A/entrysafe.co.za

---

## 📋 Complete DNS Configuration Summary

When fully configured, your DNS should look like:

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| A | @ | 76.76.21.21 | Website (Vercel) |
| CNAME | www | cname.vercel-dns.com | WWW redirect |
| MX | @ | mx.zoho.com (priority 10) | Email (primary) |
| MX | @ | mx2.zoho.com (priority 20) | Email (backup) |
| MX | @ | mx3.zoho.com (priority 50) | Email (backup) |
| TXT | @ | v=spf1 include:zoho.com ~all | Email security (SPF) |
| TXT | zmail._domainkey | v=DKIM1; k=rsa; p=... | Email authentication (DKIM) |
| CNAME | api | your-backend.up.railway.app | API endpoint (optional) |

---

## ✅ Verification Steps

### 1. Check Website is Live
```bash
# Check DNS resolves
nslookup entrysafe.co.za

# Visit in browser
https://entrysafe.co.za
https://www.entrysafe.co.za
```

Both should load your site with 🔒 SSL certificate.

---

### 2. Check Email Works
```bash
# Check MX records
nslookup -type=MX entrysafe.co.za
```

Should show Zoho mail servers.

**Test:**
- Send email to: support@entrysafe.co.za
- Should arrive in Zoho inbox

---

### 3. Check API Endpoint
```bash
# Test health endpoint
curl https://your-backend.up.railway.app/health

# Or if using custom subdomain:
curl https://api.entrysafe.co.za/health
```

Should return: `{"status":"healthy"}`

---

## 🚨 Important: Remove Old Records

**Before adding new records, check for:**
- Old A records pointing elsewhere
- Parking page redirects from GoDaddy
- Default nameservers

**Clean slate approach:**
1. Delete any existing A/CNAME records for @ and www
2. Add the new Vercel records
3. Keep GoDaddy nameservers (don't change these!)

---

## 🎯 Quick Setup Order

**Fastest path to live website:**

1. **Deploy to Vercel first** (10 minutes)
   - Get your Vercel project URL
   - Vercel tells you exact DNS records to add

2. **Add DNS records in GoDaddy** (5 minutes)
   - A record for @
   - CNAME for www

3. **Add domain in Vercel** (2 minutes)
   - Settings → Domains → Add entrysafe.co.za

4. **Wait for SSL** (10-30 minutes)
   - Vercel auto-provisions certificate
   - You'll see 🔒 when ready

5. **Email setup later** (optional, can wait)
   - Zoho setup takes 1 hour
   - Can use Gmail initially for support

---

## 💡 Pro Tips

✅ **Use Vercel's automatic SSL** - Don't try to configure SSL manually  
✅ **Keep TTL at 600** - Makes DNS updates faster during setup  
✅ **Test with incognito mode** - Avoids cache issues  
✅ **Mobile test** - Check on phone data (not WiFi) to see real DNS  
✅ **Bookmark GoDaddy DNS page** - You'll use it often at first  

---

## 📞 Need Help?

If DNS isn't working after 24 hours:
1. Check DNS propagation: https://dnschecker.org
2. Verify records in GoDaddy match exactly
3. Contact GoDaddy support (they're helpful!)
4. Contact Vercel support (excellent response time)

---

## 🔥 You're Ready to Go Live!

Once DNS propagates:
- `entrysafe.co.za` → Your beautiful website ✅
- `support@entrysafe.co.za` → Professional email ✅
- SSL certificate → Secure 🔒 badge ✅

**Welcome to production, Mlungisi!** 🚀
