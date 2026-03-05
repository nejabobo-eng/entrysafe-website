# 🍃 MONGODB ATLAS SETUP GUIDE - STEP-BY-STEP

**Author:** Mlungisi Mncube  
**Date:** January 2025  
**Purpose:** Set up cloud-hosted MongoDB for Entry Safe  
**Time:** 15 minutes  
**Cost:** FREE (512MB storage, shared cluster)

---

## 🎯 **WHY MONGODB ATLAS?**

**Current Problem:**
- Your `.env`: `MONGODB_URL=mongodb://localhost:27017`
- This ONLY works on your local machine
- Render deployment can't access `localhost`

**Solution:**
- MongoDB Atlas = Cloud-hosted MongoDB
- Accessible from anywhere (local dev + production)
- Free tier: 512MB storage, perfect for testing

---

## 🚀 **STEP-BY-STEP SETUP**

### **Step 1: Create MongoDB Atlas Account** (2 minutes)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with:
   - **Email:** Your work email
   - **Password:** Strong password (save in password manager)
   - Or: Sign up with Google
3. Click **Get Started Free**
4. Skip survey (or fill it out)

---

### **Step 2: Create Your First Cluster** (3 minutes)

#### Choose Deployment Type:
1. Select: **M0 (FREE)**
   - ✅ 512 MB Storage
   - ✅ Shared RAM
   - ✅ No credit card required

#### Cloud Provider & Region:
1. **Provider:** AWS (recommended) or Google Cloud
2. **Region:** Choose closest to you:
   - If in South Africa: **AWS / Africa (Cape Town) ap-south-1**
   - Or: **AWS / EU (Ireland) eu-west-1**
   - Or: **AWS / US East (N. Virginia) us-east-1**
3. **Note:** Free tier available in most regions

#### Cluster Name:
1. **Name:** `EntrySafe-Cluster-0` (or any name you like)
2. Click: **Create Deployment**
3. Wait: 1-3 minutes for cluster to provision

---

### **Step 3: Create Database User** (2 minutes)

A popup will appear: "Security Quickstart"

#### Create Database User:
1. **Authentication Method:** Username and Password (default)
2. **Username:** `entrysafe_admin` (or any name)
3. **Password:** Click **Autogenerate Secure Password**
   - ⚠️ **CRITICAL:** Copy this password immediately!
   - Save to password manager or text file
   - You'll need this for connection string
4. Click: **Create User**

**Example credentials:**
```
Username: entrysafe_admin
Password: aB3xY9mK2pQ7sL4w  (yours will be different)
```

---

### **Step 4: Set Up Network Access** (1 minute)

Still in "Security Quickstart" popup:

#### Add IP Address:
1. You'll see: "Where would you like to connect from?"
2. **Option A (Recommended for Testing):**
   - Click: **Add entries to my IP Access List**
   - Select: **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ This is OK for testing, restrict later for production
   
3. **Option B (More Secure):**
   - Add specific IP addresses:
     * Your home/office IP
     * Render.com IP ranges
   - You can add more IPs later

4. Click: **Finish and Close**
5. Click: **Go to Overview** (if prompted)

---

### **Step 5: Get Connection String** (2 minutes)

#### Navigate to Connect:
1. In your cluster overview, click: **Connect**
2. Choose: **Drivers** (connect your application)
3. **Driver:** Python
4. **Version:** 3.12 or later

#### Copy Connection String:
You'll see a string like:
```
mongodb+srv://entrysafe_admin:<password>@entrysafe-cluster-0.abc123.mongodb.net/?retryWrites=true&w=majority
```

#### Replace `<password>`:
1. Copy the full string
2. Replace `<password>` with your actual password
3. **Example:**
```
mongodb+srv://entrysafe_admin:aB3xY9mK2pQ7sL4w@entrysafe-cluster-0.abc123.mongodb.net/?retryWrites=true&w=majority
```

⚠️ **IMPORTANT:** No spaces, use exact password!

---

### **Step 6: Create Database** (1 minute)

#### Navigate to Collections:
1. In sidebar, click: **Database** (or **Browse Collections**)
2. Click: **Add My Own Data**
3. **Database Name:** `entrysafe`
4. **Collection Name:** `users` (we'll add more later)
5. Click: **Create**

---

### **Step 7: Test Connection Locally** (2 minutes)

#### Update Your Local `.env`:

1. Open: `entrysafe-backend/.env`
2. Find line:
```bash
MONGODB_URL=mongodb://localhost:27017
```

3. Replace with your Atlas connection string:
```bash
MONGODB_URL=mongodb+srv://entrysafe_admin:aB3xY9mK2pQ7sL4w@entrysafe-cluster-0.abc123.mongodb.net/?retryWrites=true&w=majority
```

4. Save file

#### Test Connection:
Run this command in terminal:
```bash
cd entrysafe-backend
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; client = AsyncIOMotorClient('YOUR_CONNECTION_STRING'); asyncio.run(client.admin.command('ping')); print('✅ MongoDB Atlas connected successfully!')"
```

Expected output:
```
✅ MongoDB Atlas connected successfully!
```

If you see error:
- Check password (no spaces, exact match)
- Check IP whitelist (0.0.0.0/0 should allow all)
- Check connection string format

---

## 📊 **YOUR MONGODB ATLAS CREDENTIALS**

**Save these for Render deployment:**

```bash
# Connection String:
mongodb+srv://entrysafe_admin:YOUR_PASSWORD@entrysafe-cluster-0.abc123.mongodb.net/?retryWrites=true&w=majority

# Database Name:
entrysafe

# Collections (will be auto-created):
- users
- usage
- pending_subscriptions
- webhook_events
- payment_history
- documents
- security_logs
- webhook_errors
```

---

## 🔐 **SECURITY BEST PRACTICES**

### For Testing (Current):
- ✅ IP whitelist: 0.0.0.0/0 (allow all)
- ✅ Strong password
- ✅ Username not "admin"

### For Production (Later):
1. **Restrict IP Access:**
   - Remove 0.0.0.0/0
   - Add only:
     * Your office IP
     * Render.com IPs
     * Any other trusted IPs

2. **Use Environment Variables:**
   - Never commit connection string to GitHub
   - Store in .env (gitignored) ✅
   - Use Render environment variables ✅

3. **Create Separate Users:**
   - Production user (read/write)
   - Backup user (read only)
   - Admin user (full access)

4. **Enable Monitoring:**
   - Set up alerts for:
     * High connection count
     * Storage approaching limit
     * Unusual query patterns

---

## 🎯 **NEXT STEPS**

### Immediate:
1. ✅ MongoDB Atlas cluster created
2. ✅ Database user created
3. ✅ Connection string obtained
4. ✅ Local `.env` updated
5. ✅ Connection tested

### For Render Deployment:
1. Copy connection string
2. Add to Render environment variables:
```bash
MONGODB_URL=mongodb+srv://entrysafe_admin:PASSWORD@cluster.mongodb.net
MONGODB_DB_NAME=entrysafe
```
3. Deploy backend
4. Verify connection in Render logs

### For Production:
1. Restrict IP whitelist
2. Set up monitoring alerts
3. Enable backup (free on M0)
4. Review security checklist

---

## 📈 **MONITORING YOUR DATABASE**

### MongoDB Atlas Dashboard:

1. **Overview:**
   - Connection count
   - Storage used
   - Network traffic

2. **Metrics:**
   - Operations per second
   - Query execution time
   - Index usage

3. **Alerts:**
   - Set up email alerts for:
     * Storage > 400MB (80% of 512MB)
     * Connections > 90% of limit
     * Slow queries

---

## 🚨 **TROUBLESHOOTING**

### Issue 1: "Authentication failed"
**Cause:** Wrong password or username  
**Fix:**
1. Go to Database Access in Atlas
2. Edit user
3. Reset password
4. Update connection string

### Issue 2: "Connection timeout"
**Cause:** IP not whitelisted  
**Fix:**
1. Go to Network Access
2. Add 0.0.0.0/0 (or your IP)
3. Wait 2-3 minutes for update

### Issue 3: "Database does not exist"
**Cause:** Database name typo  
**Fix:**
1. Check spelling: `entrysafe` (lowercase)
2. Or create database in Collections

### Issue 4: "Too many connections"
**Cause:** Free tier limit (M0: 500 connections)  
**Fix:**
1. Close unused connections
2. Implement connection pooling
3. Or upgrade to paid tier

---

## 💰 **PRICING & LIMITS**

### Free Tier (M0):
- ✅ Storage: 512 MB
- ✅ RAM: Shared
- ✅ Connections: Up to 500
- ✅ Backup: 1 day retention
- ✅ Cost: $0/month forever

### When to Upgrade:
- Storage > 512 MB
- Need dedicated resources
- Need longer backup retention
- Need advanced features

### Paid Tiers:
- **M10:** $0.08/hour (~$57/month) - 10GB storage
- **M20:** $0.20/hour (~$144/month) - 20GB storage
- **M30:** $0.54/hour (~$389/month) - 40GB storage

**For Entry Safe:**
- Start with M0 (Free) ✅
- Upgrade when you have 50+ active users
- Or when storage approaches 400MB

---

## ✅ **CHECKLIST**

### Setup Complete When:
- [x] MongoDB Atlas account created
- [x] Cluster provisioned and running
- [x] Database user created with strong password
- [x] IP whitelist configured (0.0.0.0/0 for testing)
- [x] Database `entrysafe` created
- [x] Connection string obtained
- [x] Local `.env` updated
- [x] Connection tested successfully
- [ ] Connection string added to Render environment variables
- [ ] Backend deployed and connected to Atlas

---

## 📞 **GETTING HELP**

### MongoDB Support:
- Documentation: https://www.mongodb.com/docs/atlas/
- Community: https://www.mongodb.com/community/forums/
- University (Free courses): https://learn.mongodb.com/

### Common Issues:
- Check connection string format
- Verify password (no special characters causing issues)
- Check IP whitelist
- Wait 2-3 minutes after IP changes

---

## 🎉 **YOU'RE READY!**

Once you see:
```
✅ MongoDB Atlas connected successfully!
```

You can:
1. Deploy backend to Render
2. Use same connection string in production
3. Scale as your app grows
4. Monitor from Atlas dashboard

**MongoDB Atlas is now your production database!** 🚀

---

**Author:** Mlungisi Mncube  
**Setup Time:** ~15 minutes  
**Status:** Ready for production use  
**Cost:** FREE (M0 tier)
