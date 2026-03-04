"""
Backend Configuration Test
Tests PayPal credentials and imports
"""

import os
import sys
from dotenv import load_dotenv

print("🔍 Testing Entry Safe Backend Configuration...\n")

# Load environment variables
load_dotenv()
print("✅ .env file loaded successfully\n")

# Test required environment variables
print("📋 Checking Environment Variables:")
print("-" * 50)

required_vars = {
    "MONGODB_URL": os.getenv("MONGODB_URL"),
    "PAYPAL_MODE": os.getenv("PAYPAL_MODE"),
    "PAYPAL_CLIENT_ID": os.getenv("PAYPAL_CLIENT_ID"),
    "PAYPAL_CLIENT_SECRET": os.getenv("PAYPAL_CLIENT_SECRET"),
    "OPENAI_KEY_ACCOUNTING": os.getenv("OPENAI_KEY_ACCOUNTING"),
}

all_set = True
for var_name, var_value in required_vars.items():
    if var_value:
        # Mask sensitive values
        if "SECRET" in var_name or "KEY" in var_name:
            display_value = var_value[:10] + "..." + var_value[-4:] if len(var_value) > 14 else "***"
        else:
            display_value = var_value
        print(f"✅ {var_name}: {display_value}")
    else:
        print(f"❌ {var_name}: NOT SET")
        all_set = False

print()

# Test imports
print("📦 Testing Package Imports:")
print("-" * 50)

try:
    import fastapi
    print(f"✅ FastAPI {fastapi.__version__}")
except ImportError as e:
    print(f"❌ FastAPI: {e}")
    all_set = False

try:
    import paypalrestsdk
    print(f"✅ PayPal SDK installed")
except ImportError as e:
    print(f"❌ PayPal SDK: {e}")
    all_set = False

try:
    import openai
    print(f"✅ OpenAI SDK {openai.__version__}")
except ImportError as e:
    print(f"❌ OpenAI SDK: {e}")
    all_set = False

try:
    import motor
    print(f"✅ Motor (MongoDB async driver)")
except ImportError as e:
    print(f"❌ Motor: {e}")
    all_set = False

try:
    import firebase_admin
    print(f"✅ Firebase Admin SDK")
except ImportError as e:
    print(f"❌ Firebase Admin: {e}")
    all_set = False

print()

# Test PayPal configuration
print("💳 Testing PayPal Configuration:")
print("-" * 50)

try:
    paypalrestsdk.configure({
        "mode": os.getenv("PAYPAL_MODE"),
        "client_id": os.getenv("PAYPAL_CLIENT_ID"),
        "client_secret": os.getenv("PAYPAL_CLIENT_SECRET")
    })
    print(f"✅ PayPal SDK configured successfully")
    print(f"   Mode: {os.getenv('PAYPAL_MODE')}")
    print(f"   Client ID: {os.getenv('PAYPAL_CLIENT_ID')[:10]}...")
except Exception as e:
    print(f"❌ PayPal configuration failed: {e}")
    all_set = False

print()

# Test imports of our custom modules
print("🔧 Testing Custom Modules:")
print("-" * 50)

try:
    from app.routers import payments
    print("✅ app.routers.payments")
except ImportError as e:
    print(f"❌ app.routers.payments: {e}")
    all_set = False

try:
    from app.routers import ai
    print("✅ app.routers.ai")
except ImportError as e:
    print(f"❌ app.routers.ai: {e}")
    all_set = False

try:
    from app.middleware import tier_check
    print("✅ app.middleware.tier_check")
except ImportError as e:
    print(f"❌ app.middleware.tier_check: {e}")
    all_set = False

try:
    from app.services import usage_service
    print("✅ app.services.usage_service")
except ImportError as e:
    print(f"❌ app.services.usage_service: {e}")
    all_set = False

print()

# Summary
print("=" * 50)
if all_set:
    print("✅ ALL TESTS PASSED!")
    print("\n🚀 Your backend is ready to run:")
    print("   python -m uvicorn app.main:app --reload")
    print("\n   Then open: http://localhost:8000/docs")
else:
    print("❌ SOME TESTS FAILED")
    print("   Please fix the issues above before running the server.")

print("=" * 50)
