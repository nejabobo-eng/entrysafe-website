"""
API Endpoints Verification Test
Checks that all routes are properly registered
"""

from app.main import app
from fastapi.testclient import TestClient

print("🔍 Testing API Endpoints...\n")

client = TestClient(app)

print("📋 Registered API Routes:")
print("-" * 70)

# Group routes by tag
routes_by_tag = {}
for route in app.routes:
    if hasattr(route, 'methods') and hasattr(route, 'path'):
        methods = ', '.join(route.methods)
        path = route.path
        tags = getattr(route, 'tags', ['General'])
        
        for tag in tags:
            if tag not in routes_by_tag:
                routes_by_tag[tag] = []
            routes_by_tag[tag].append(f"{methods:20} {path}")

# Print organized by tag
for tag, routes in sorted(routes_by_tag.items()):
    print(f"\n🏷️  {tag}:")
    for route in routes:
        print(f"   {route}")

print("\n" + "=" * 70)

# Test health endpoint
print("\n🏥 Testing Health Endpoint:")
print("-" * 70)

try:
    response = client.get("/")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ GET / → {response.status_code}")
        print(f"   Message: {data.get('message')}")
        print(f"   Version: {data.get('version')}")
        print(f"   Status: {data.get('status')}")
    else:
        print(f"❌ GET / → {response.status_code}")
except Exception as e:
    print(f"❌ Health check failed: {e}")

print()

# Verify critical endpoints exist
print("🔐 Verifying Critical Endpoints:")
print("-" * 70)

critical_endpoints = [
    ("POST", "/api/payments/create-subscription", "Payment"),
    ("POST", "/api/payments/webhook", "Payment"),
    ("GET", "/api/payments/subscription-status", "Payment"),
    ("POST", "/api/ai/accounting", "AI"),
    ("POST", "/api/ai/docs", "AI"),
    ("POST", "/api/ai/pricing", "AI"),
]

all_found = True
for method, path, category in critical_endpoints:
    found = False
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            if method in route.methods and route.path == path:
                found = True
                break
    
    if found:
        print(f"✅ {method:6} {path:45} [{category}]")
    else:
        print(f"❌ {method:6} {path:45} [{category}] - NOT FOUND")
        all_found = False

print("\n" + "=" * 70)

if all_found:
    print("✅ ALL CRITICAL ENDPOINTS REGISTERED!")
    print("\n🚀 Backend is ready for:")
    print("   • PayPal subscriptions")
    print("   • AI tier enforcement")
    print("   • OpenAI integration")
    print("\n📖 API Documentation: http://localhost:8000/docs")
else:
    print("❌ SOME ENDPOINTS ARE MISSING")
    print("   Please check app/main.py router registration")

print("=" * 70)
