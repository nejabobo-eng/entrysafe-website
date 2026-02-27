# Entry Safe AI Integration Guide

Complete guide for integrating OpenAI into Entry Safe Accounting, Docs, and Pricing apps (Android, Windows, and Web).

---

## 📋 Overview

This integration provides **secure AI functionality** across all Entry Safe platforms:

- **Entry Safe Accounting** (Android + Windows)
- **Entry Safe Docs** (Android + Windows)
- **Entry Safe Pricing** (Android + Windows)

**Security:** API keys are stored **only** in the backend. Apps never see the keys.

---

## 🔧 Backend Setup (FastAPI)

### 1. Install Required Package

```bash
cd entrysafe-backend
pip install openai
```

Add to `requirements.txt`:
```
openai>=1.0.0
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your OpenAI API keys:

```env
# OpenAI API Keys (one per app for usage tracking)
OPENAI_KEY_ACCOUNTING=sk-proj-your-accounting-key-here
OPENAI_KEY_DOCS=sk-proj-your-docs-key-here
OPENAI_KEY_PRICING=sk-proj-your-pricing-key-here
```

**Note:** You can use the same key for all three apps if you prefer, or separate keys for better usage tracking.

### 3. Start the Backend

```bash
cd entrysafe-backend
python -m uvicorn app.main:app --reload
```

### 4. Test the Endpoints

```bash
# Test Accounting AI
curl -X POST http://localhost:8000/api/ai/accounting \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain VAT registration in South Africa"}'

# Test Docs AI
curl -X POST http://localhost:8000/api/ai/docs \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Summarize this invoice document"}'

# Test Pricing AI
curl -X POST http://localhost:8000/api/ai/pricing \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Suggest pricing for logo design service"}'

# Check AI health
curl http://localhost:8000/api/ai/health
```

---

## 📱 Flutter/Android Setup

### 1. Add HTTP Package

In your `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
```

Run:
```bash
flutter pub get
```

### 2. Copy the AI Service

Copy `flutter-client/entry_safe_ai_service.dart` to your Flutter project:

```
your_app/
  lib/
    services/
      entry_safe_ai_service.dart  ← Copy here
```

### 3. Update the Base URL

Edit `entry_safe_ai_service.dart` and update:

```dart
static const String _baseUrl = 'https://your-backend-url.com';
```

Replace with your actual backend URL (e.g., `https://entrysafe.com` or your deployed backend).

### 4. Use in Your App

**Example 1: Entry Safe Accounting App**

```dart
import 'services/entry_safe_ai_service.dart';

// Generate accounting insights
final response = await EntrySafeAIService.generateAccountingResponse(
  "Analyze my expenses for the last 3 months"
);
print(response.result);
```

**Example 2: Entry Safe Docs App**

```dart
// Summarize a document
final response = await EntrySafeAIService.generateDocsResponse(
  "Summarize this invoice: [invoice text]"
);
print(response.result);
```

**Example 3: Entry Safe Pricing App**

```dart
// Get pricing suggestions
final response = await EntrySafeAIService.generatePricingResponse(
  "Suggest pricing for web development service"
);
print(response.result);
```

### 5. Full UI Example

Copy `flutter-client/ai_assistant_example.dart` to see a complete UI implementation.

---

## 💻 Windows Setup (C#/.NET)

### 1. Add Required NuGet Packages

In Visual Studio, install:
- `System.Net.Http.Json` (if not already included)

Or via Package Manager Console:
```powershell
Install-Package System.Net.Http.Json
```

### 2. Copy the AI Service

Copy `windows-client/EntrySafeAIService.cs` to your Windows project:

```
YourWindowsApp/
  Services/
    EntrySafeAIService.cs  ← Copy here
```

### 3. Update the Base URL

Edit `EntrySafeAIService.cs` and update:

```csharp
private const string BaseUrl = "https://your-backend-url.com";
```

### 4. Use in Your App

**Example 1: Entry Safe Accounting App**

```csharp
using EntrySafe.Services;

// Generate accounting insights
var response = await EntrySafeAIService.GenerateAccountingResponseAsync(
    "Analyze my expenses for the last 3 months"
);
MessageBox.Show(response.Result);
```

**Example 2: Entry Safe Docs App**

```csharp
// Summarize a document
var response = await EntrySafeAIService.GenerateDocsResponseAsync(
    "Summarize this invoice: [invoice text]"
);
textBox.Text = response.Result;
```

**Example 3: Entry Safe Pricing App**

```csharp
// Get pricing suggestions
var response = await EntrySafeAIService.GeneratePricingResponseAsync(
    "Suggest pricing for web development service"
);
MessageBox.Show(response.Result);
```

### 5. Full UI Example

See `windows-client/AIAssistantWindow.cs` for a complete WPF window implementation.

---

## 🌐 Web Setup (React/Vite)

### Update the Frontend API Service

Edit `entrysafe-frontend/src/services/api.js`:

```javascript
// AI Service endpoints
export const ai = {
  accounting: async (prompt, maxTokens = 500) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/accounting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: maxTokens })
    });
    return response.json();
  },

  docs: async (prompt, maxTokens = 500) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: maxTokens })
    });
    return response.json();
  },

  pricing: async (prompt, maxTokens = 500) => {
    const response = await fetch(`${API_BASE_URL}/api/ai/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: maxTokens })
    });
    return response.json();
  }
};
```

**Use in React Component:**

```jsx
import { ai } from '../services/api';

const handleAIRequest = async () => {
  const response = await ai.accounting("Analyze my expenses");
  console.log(response.result);
};
```

---

## 🔐 Security Best Practices

✅ **API keys are stored ONLY in the backend** `.env` file  
✅ **Never commit `.env` to Git** (already in `.gitignore`)  
✅ **Apps call the backend**, not OpenAI directly  
✅ **Backend validates requests** before calling OpenAI  
✅ **Use HTTPS in production** for encrypted communication  

---

## 💰 Cost Management

### Track Usage by App

Each app has its own API key, so you can monitor usage separately in your OpenAI dashboard:

- **OPENAI_KEY_ACCOUNTING** → Track accounting app usage
- **OPENAI_KEY_DOCS** → Track docs app usage
- **OPENAI_KEY_PRICING** → Track pricing app usage

### Set Usage Limits

In your OpenAI account:
1. Go to **Billing → Usage Limits**
2. Set monthly spending limits for each API key
3. Set email alerts for usage thresholds

---

## 🧪 Testing

### Backend Tests

```bash
# Test all AI endpoints
pytest tests/test_ai.py -v
```

### Manual Testing

Use the provided examples:
- **Flutter:** Run `ai_assistant_example.dart`
- **Windows:** Run `AIAssistantWindow.cs`
- **Web:** Call API from browser console

---

## 🚀 Deployment Checklist

- [ ] Backend deployed with OpenAI keys in environment variables
- [ ] Flutter apps updated with production backend URL
- [ ] Windows apps updated with production backend URL
- [ ] Web app updated with production backend URL
- [ ] HTTPS enabled for all API calls
- [ ] Usage limits configured in OpenAI dashboard
- [ ] API health check passing: `/api/ai/health`

---

## 📊 API Endpoints Reference

### POST /api/ai/accounting
Generate AI response for accounting app.

**Request:**
```json
{
  "prompt": "Explain VAT in South Africa",
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Response:**
```json
{
  "result": "VAT (Value-Added Tax) in South Africa...",
  "tokens_used": 120
}
```

### POST /api/ai/docs
Generate AI response for docs app.

### POST /api/ai/pricing
Generate AI response for pricing app.

### GET /api/ai/health
Check if AI services are configured.

**Response:**
```json
{
  "message": "AI services status",
  "configured": {
    "accounting": true,
    "docs": true,
    "pricing": true
  },
  "all_ready": true
}
```

---

## 📞 Support

Questions? Contact: **entrysafeapps@gmail.com**

---

**🎉 You're all set!** Your Entry Safe apps now have secure AI integration across Android, Windows, and Web.
