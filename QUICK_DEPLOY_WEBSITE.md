# 🚀 Quick Deployment Guide - Website Updates

## What Was Changed (Website Only)

### Backend (FastAPI)
✅ **New Endpoint:** `GET /api/users/usage-status`
- Returns tier, usage stats, and limits
- Located in: `entrysafe-backend/app/routers/users.py`

### Frontend (React)
✅ **Enhanced Page:** `/settings` (Account Settings)
- Shows usage bars for Free/Starter users
- Shows "Unlimited" card for Premium users
- Located in: `entrysafe-frontend/src/pages/AccountSettings.jsx`

---

## Deployment Commands

### 1. Commit Changes
```bash
git add .
git commit -m "feat: add usage tracking and tier limits display on website"
git push origin main
```

### 2. Auto-Deploy
- **Render:** Detects push → builds backend → deploys automatically
- **Vercel:** Detects push → builds frontend → deploys automatically

### 3. Verify Live
```bash
# Test backend
curl https://entrysafe-website.onrender.com/api/users/usage-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test frontend
open https://entrysafe-frontend.vercel.app/settings
```

---

## Testing Scenarios

### Test Case 1: Free User
1. Login as free user
2. Go to `/settings`
3. **Expected:** See usage bars with limits
4. **Expected:** "Upgrade to Premium" CTA

### Test Case 2: Premium User
1. Login as premium user
2. Go to `/settings`
3. **Expected:** See dark "Premium Unlimited" card
4. **Expected:** No usage bars

### Test Case 3: Near Limit
1. Use 9/10 AI queries as free user
2. Go to `/settings`
3. **Expected:** Red progress bar
4. **Expected:** Warning message

---

## Tier Limits Reference

| Tier | AI Queries | Storage | Documents | Devices |
|------|-----------|---------|-----------|---------|
| FREE | 10/month | 1 GB | 50 | 2 |
| STARTER | 50/month | 10 GB | 500 | 5 |
| PREMIUM | ∞ | ∞ | ∞ | ∞ |

---

## Files Changed

### Backend
- ✅ `entrysafe-backend/app/routers/users.py` (+105 lines)

### Frontend
- ✅ `entrysafe-frontend/src/pages/AccountSettings.jsx` (+167 lines)

### Docs
- ✅ `WEBSITE_USAGE_LIMITS_COMPLETE.md` (full guide)
- ✅ `WEBSITE_UPDATES_SUMMARY.md` (summary)

---

## API Response Example

```json
{
  "tier": "STARTER",
  "usage": {
    "ai_queries": {
      "used": 23,
      "limit": 50,
      "percentage": 46.0,
      "unlimited": false
    },
    "storage": {
      "used_gb": 2.5,
      "limit_gb": 10,
      "percentage": 25.0,
      "unlimited": false
    }
  }
}
```

---

## Troubleshooting

### Backend Not Showing Usage
- Check JWT token is valid
- Verify user has subscription tier in database
- Check MongoDB connection
- Review Render logs

### Frontend Not Displaying Bars
- Verify API call succeeds (check Network tab)
- Check user authentication
- Verify tier is "FREE" or "STARTER"
- Premium users should see unlimited card instead

---

**Status:** ✅ Ready to Deploy  
**Next:** Push to GitHub → Auto-deploy
