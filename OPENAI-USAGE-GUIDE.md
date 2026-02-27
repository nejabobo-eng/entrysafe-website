# 💰 OpenAI Usage & Cost Management Guide

## ✅ Current Status

**Credit Balance:** $25.00  
**Auto-Recharge:** OFF (recommended for launch)  
**API Keys:** 4 keys configured (all apps)

---

## 🎯 Set Usage Limits (DO THIS NOW)

**Why:** Prevent unexpected charges and runaway costs

**How:**
1. Go to: https://platform.openai.com/account/limits
2. Set **Soft Limit:** $20/month
3. Set **Hard Limit:** $30/month

**What happens:**
- **Soft limit:** You get email warning
- **Hard limit:** API stops working (protects from overuse)

---

## 💸 Cost Breakdown (GPT-3.5-turbo)

Your 4 apps use **gpt-3.5-turbo** (most cost-effective model):

| Usage Type | Cost per Request | Example |
|------------|------------------|---------|
| Short query (50 tokens) | $0.0001 | "Summarize this receipt" |
| Medium query (200 tokens) | $0.0004 | "Analyze this invoice" |
| Long query (1000 tokens) | $0.002 | "Generate financial report" |

**Average request:** ~$0.0005 (half a cent)

**Your $25 covers:**
- **50,000+ short requests**
- **12,500+ medium requests**
- **12,500+ long requests**

**For early users (10-50 people), this lasts MONTHS!** 🔥

---

## 📊 Monitor Your Usage

### Check Dashboard Daily (First 2 Weeks)

**URL:** https://platform.openai.com/usage

**What to watch:**
- Daily requests count
- Cost per day
- Which API key is being used most
- Token usage patterns

**Red flags:**
- Sudden spike in requests (possible bug or loop)
- One key using way more than others
- Costs climbing faster than user growth

---

## 🔐 Usage by App

Your 4 keys track separately:

| App | API Key | Expected Usage |
|-----|---------|----------------|
| Entry Safe Accounting | OPENAI_KEY_ACCOUNTING | Medium (invoice analysis, bookkeeping) |
| Entry Safe Docs | OPENAI_KEY_DOCS | High (document analysis, OCR, categorization) |
| Entry Safe Pricing | OPENAI_KEY_PRICING | Low (pricing suggestions) |
| SD Storage Helper | OPENAI_KEY_SD_STORAGE_HELPER | Medium (file organization, duplicates) |

**Most used will likely be Docs** (document processing)

---

## 💡 Cost Optimization Tips

### 1. Cache Common Responses
Don't call OpenAI for repeated questions:
```python
# Example: Cache document categories
category_cache = {
  "invoice": "Financial",
  "receipt": "Expense",
  # etc.
}
```

### 2. Use Smart Defaults
Only call AI when necessary:
- Simple categorization? Use rules
- Complex analysis? Use AI

### 3. Batch Requests When Possible
Process multiple items in one request instead of many small ones

### 4. Limit Token Length
Set `max_tokens` in your API calls to control costs:
```python
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[...],
    max_tokens=500  # Limits response length
)
```

### 5. Monitor Per-User Usage
Track which users make the most requests
Consider usage limits per subscription tier

---

## 🚨 When to Upgrade Auto-Recharge

**Keep OFF during:**
- Launch phase (first 2-4 weeks)
- Beta testing
- While refining AI features

**Turn ON when:**
- You have 50+ active paying users
- Revenue is consistent (R10,000+/month)
- You've optimized usage patterns
- You trust your cost projections

**Set auto-recharge to:** $50 top-up when balance < $10

---

## 📈 Cost Projections

### Scenario: 100 Active Users

**Conservative estimate:**
- 10 AI requests per user per day
- Average cost: $0.0005 per request
- **Daily cost:** 100 users × 10 requests × $0.0005 = **$0.50/day**
- **Monthly cost:** $0.50 × 30 = **$15/month**

**Your $25 credit = 1.5 months for 100 users!**

### Scenario: 500 Active Users

**Conservative estimate:**
- 10 AI requests per user per day
- **Monthly cost:** $75/month

**At 500 users, your revenue is ~R199,500/month (R399 avg plan)**  
**OpenAI cost: ~R1,400/month (~$75)**  
**Profit margin: 99%+ still!** 🔥

---

## 🎯 Subscription Tier Limits (Recommended)

Prevent abuse by limiting AI usage per plan:

| Plan | Monthly AI Requests | Cost to You |
|------|---------------------|-------------|
| Free | 50 requests | $0.025 (~50 cents) |
| Starter (R199) | 500 requests | $0.25 (~R5) |
| Premium (R499) | 2,000 requests | $1.00 (~R19) |
| Annual (R4,990) | Unlimited* | $5-10/month per user |

*Unlimited with fair use policy (10k requests/month)

**You make massive profit even with AI costs!**

---

## ✅ Setup Checklist

Before going live:

- [ ] **Set usage limits** ($20 soft, $30 hard)
- [ ] **Test all 4 API keys** (run `test_openai_keys.py`)
- [ ] **Monitor dashboard daily** (first 2 weeks)
- [ ] **Implement request caching** (in backend)
- [ ] **Add rate limiting** (per user, per subscription tier)
- [ ] **Set max_tokens** in API calls (500-1000)
- [ ] **Document usage patterns** (which features cost most)
- [ ] **Plan for scale** (when to enable auto-recharge)

---

## 📞 Usage Alerts

**Set up email alerts:**

1. Go to: https://platform.openai.com/account/limits
2. Enable email notifications for:
   - Soft limit reached ($20)
   - Hard limit reached ($30)
   - Unusual usage patterns

**You'll get warnings before costs get high!**

---

## 🔥 Bottom Line

**Your $25 is MORE than enough for launch!**

**Key points:**
- ✅ GPT-3.5-turbo is extremely cheap (~$0.0005/request)
- ✅ $25 = 50,000+ requests
- ✅ Set usage limits to protect from accidents
- ✅ Monitor daily for first 2 weeks
- ✅ OpenAI costs are tiny compared to revenue potential

**You can safely launch, test with beta users, and refine your product without worrying about AI costs burning through your budget.**

**When you're earning R39,000/month from subscriptions, spending R1,400/month on AI is nothing!** 💪

---

## 📊 Track This Spreadsheet

Create a simple Google Sheet to track:

| Date | Users | Requests | Cost | Revenue | Profit Margin |
|------|-------|----------|------|---------|---------------|
| Week 1 | 10 | 500 | $0.25 | R0 | N/A (beta) |
| Week 2 | 25 | 1,250 | $0.63 | R4,975 | 99.7% |
| Week 3 | 50 | 2,500 | $1.25 | R9,950 | 99.5% |
| Month 2 | 100 | 30,000 | $15 | R19,900 | 99.2% |

**This helps you see the business is profitable from day 1!** 🚀

---

## 🎉 You're Protected!

With:
- $25 credit loaded
- Usage limits set
- Monitoring dashboard bookmarked
- Cost-per-user calculated

**You can launch with confidence!**

AI costs won't surprise you. Revenue will exceed costs by 100x+.

**Let's deploy and go live!** 🔥
