#!/usr/bin/env python3
"""
Test script to verify all OpenAI API keys are working correctly
Run this before deploying to production
"""

import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def test_openai_key(key_name: str, app_name: str) -> bool:
    """Test a single OpenAI API key"""
    api_key = os.getenv(key_name)
    
    if not api_key:
        print(f"❌ {app_name}: Key not found in .env ({key_name})")
        return False
    
    try:
        client = OpenAI(api_key=api_key)
        
        # Make a minimal test request
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are a helpful assistant for {app_name}."},
                {"role": "user", "content": "Say 'hello' in one word."}
            ],
            max_tokens=10
        )
        
        result = response.choices[0].message.content
        tokens_used = response.usage.total_tokens
        
        print(f"✅ {app_name}: Key is valid")
        print(f"   Response: {result}")
        print(f"   Tokens used: {tokens_used}")
        return True
        
    except Exception as e:
        print(f"❌ {app_name}: Key is invalid or expired")
        print(f"   Error: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🔑 Testing OpenAI API Keys for Entry Safe Platform")
    print("=" * 60)
    print()
    
    tests = [
        ("OPENAI_KEY_ACCOUNTING", "Entry Safe Accounting"),
        ("OPENAI_KEY_DOCS", "Entry Safe Docs"),
        ("OPENAI_KEY_PRICING", "Entry Safe Pricing"),
        ("OPENAI_KEY_SD_STORAGE_HELPER", "SD Storage Helper")
    ]
    
    results = []
    
    for key_name, app_name in tests:
        print(f"Testing {app_name}...")
        result = test_openai_key(key_name, app_name)
        results.append(result)
        print()
    
    print("=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    
    if all(results):
        print("✅ All API keys are working correctly!")
        print("🚀 Backend is ready for deployment")
        sys.exit(0)
    else:
        print("⚠️  Some API keys failed validation")
        print("Please check the keys in your .env file")
        sys.exit(1)

if __name__ == "__main__":
    main()
