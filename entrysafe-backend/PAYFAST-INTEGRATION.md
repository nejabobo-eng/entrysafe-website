# PayFast Integration Guide for Entry Safe

Complete guide for integrating PayFast payment gateway into the Entry Safe subscription system.

---

## 📋 Overview

**PayFast** is South Africa's leading payment gateway, supporting:
- Credit/Debit Cards
- Instant EFT
- SnapScan
- Zapper
- Masterpass

---

## 🔧 Setup

### 1. Create PayFast Account

1. Go to https://www.payfast.co.za
2. Click "Sign Up" → Choose "Merchant Account"
3. Complete business verification
4. Get your **Merchant ID** and **Merchant Key**

### 2. Configure Environment Variables

Add to `.env`:

```env
# PayFast Configuration
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_secure_passphrase
PAYFAST_MODE=sandbox  # Change to 'live' for production
```

### 3. PayFast URLs

**Sandbox (Testing):**
- Payment URL: `https://sandbox.payfast.co.za/eng/process`
- Validation URL: `https://sandbox.payfast.co.za/eng/query/validate`

**Live (Production):**
- Payment URL: `https://www.payfast.co.za/eng/process`
- Validation URL: `https://www.payfast.co.za/eng/query/validate`

---

## 💻 Backend Implementation (FastAPI)

### Create PayFast Router

```python
# app/routers/payfast.py
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
import hashlib
import os
from app.database import get_database

router = APIRouter(prefix="/api/payfast", tags=["PayFast"])

class PaymentRequest(BaseModel):
    plan_id: str  # "premium" or "annual"
    user_email: str

def generate_signature(data: dict) -> str:
    """Generate PayFast signature"""
    passphrase = os.getenv("PAYFAST_PASSPHRASE", "")
    
    # Create parameter string
    param_string = "&".join(f"{key}={value}" for key, value in sorted(data.items()))
    
    if passphrase:
        param_string += f"&passphrase={passphrase}"
    
    # Generate MD5 hash
    return hashlib.md5(param_string.encode()).hexdigest()

@router.post("/create-payment")
async def create_payment(request: PaymentRequest):
    """Create PayFast payment"""

    # Plan pricing
    plans = {
        "starter": {"amount": "199.00", "name": "Starter Monthly"},
        "premium": {"amount": "499.00", "name": "Premium Monthly"},
        "annual": {"amount": "4990.00", "name": "Annual Premium"}
    }

    plan = plans.get(request.plan_id)
    if not plan:
        raise HTTPException(status_code=400, detail="Invalid plan")
    
    # PayFast payment data
    merchant_id = os.getenv("PAYFAST_MERCHANT_ID")
    merchant_key = os.getenv("PAYFAST_MERCHANT_KEY")
    mode = os.getenv("PAYFAST_MODE", "sandbox")
    
    payment_data = {
        "merchant_id": merchant_id,
        "merchant_key": merchant_key,
        "return_url": f"{os.getenv('FRONTEND_URL')}/payment/success",
        "cancel_url": f"{os.getenv('FRONTEND_URL')}/payment/cancel",
        "notify_url": f"{os.getenv('API_URL')}/api/payfast/notify",
        "name_first": request.user_email.split("@")[0],
        "email_address": request.user_email,
        "amount": plan["amount"],
        "item_name": plan["name"],
        "custom_str1": request.plan_id
    }
    
    # Generate signature
    signature = generate_signature(payment_data)
    payment_data["signature"] = signature
    
    # Return payment URL
    payment_url = "https://sandbox.payfast.co.za/eng/process" if mode == "sandbox" else "https://www.payfast.co.za/eng/process"
    
    return {
        "payment_url": payment_url,
        "payment_data": payment_data
    }

@router.post("/notify")
async def payment_notify(request: Request):
    """Handle PayFast ITN (Instant Transaction Notification)"""
    
    # Get form data
    data = await request.form()
    data_dict = dict(data)
    
    # Verify signature
    received_signature = data_dict.pop("signature", None)
    calculated_signature = generate_signature(data_dict)
    
    if received_signature != calculated_signature:
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    # Payment successful
    if data_dict.get("payment_status") == "COMPLETE":
        # Update user subscription in database
        db = get_database()
        user_email = data_dict.get("email_address")
        plan_id = data_dict.get("custom_str1")
        
        await db.users.update_one(
            {"email": user_email},
            {
                "$set": {
                    "subscription": {
                        "plan": plan_id,
                        "status": "active",
                        "payment_id": data_dict.get("pf_payment_id"),
                        "amount": data_dict.get("amount_gross"),
                        "date": data_dict.get("payment_date")
                    }
                }
            }
        )
    
    return {"status": "received"}
```

### Add to main.py

```python
from app.routers import payfast

app.include_router(payfast.router)
```

---

## 🌐 Frontend Implementation (React)

### Update Apps.jsx

```jsx
const handleSubscribe = async (planId) => {
  if (!user) {
    alert("Please login or register to subscribe")
    window.location.href = "/register"
    return
  }
  
  if (planId === "free") return
  
  try {
    // Create payment with backend
    const response = await fetch(`${API_BASE_URL}/api/payfast/create-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: planId,
        user_email: user.email
      })
    });
    
    const data = await response.json();
    
    // Create form and submit to PayFast
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = data.payment_url;
    
    for (const [key, value] of Object.entries(data.payment_data)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    
    document.body.appendChild(form);
    form.submit();
    
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to initiate payment. Please try again.');
  }
}
```

### Create Success Page

```jsx
// src/pages/PaymentSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to apps after 5 seconds
    const timer = setTimeout(() => {
      navigate('/apps');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Thank you for subscribing to Entry Safe Premium. Your account has been upgraded.
          </p>
          <p className="text-gray-600 mb-8">
            You can now download and use all apps with premium features.
          </p>
          <a
            href="/apps"
            className="inline-block bg-navy text-white px-8 py-3 rounded-lg font-bold hover:bg-navy-dark transition-all"
          >
            Go to Apps
          </a>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
```

### Create Cancel Page

```jsx
// src/pages/PaymentCancel.jsx
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your payment was cancelled. No charges were made.
          </p>
          <Link
            to="/apps"
            className="inline-block bg-navy text-white px-8 py-3 rounded-lg font-bold hover:bg-navy-dark transition-all"
          >
            Back to Apps
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
```

---

## 🧪 Testing

### Use PayFast Sandbox

**Test Card Details:**
- Card Number: `4000000000000002`
- CVV: Any 3 digits
- Expiry: Any future date

**Test Amounts:**
- R499.00 → Successful payment
- R500.00 → Cancelled payment
- R1.00 → Failed payment

---

## ✅ Production Checklist

- [ ] PayFast account verified and activated
- [ ] Merchant ID and Key added to `.env`
- [ ] Passphrase configured
- [ ] ITN (notify_url) endpoint tested
- [ ] SSL certificate installed (HTTPS required)
- [ ] Payment success/cancel pages created
- [ ] Subscription status updates tested
- [ ] Changed `PAYFAST_MODE` to `live`

---

## 📞 Support

**PayFast Support:** support@payfast.co.za  
**Entry Safe:** entrysafeapps@gmail.com
