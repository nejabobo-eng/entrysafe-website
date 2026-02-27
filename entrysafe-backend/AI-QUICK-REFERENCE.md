# 🚀 Entry Safe AI - Quick Reference Card

## 📱 Flutter (Android Apps)

### Import
```dart
import 'services/entry_safe_ai_service.dart';
```

### Usage
```dart
// Accounting
final response = await EntrySafeAIService.generateAccountingResponse("your prompt");

// Docs
final response = await EntrySafeAIService.generateDocsResponse("your prompt");

// Pricing
final response = await EntrySafeAIService.generatePricingResponse("your prompt");

// Display result
print(response.result);
print('Tokens: ${response.tokensUsed}');
```

---

## 💻 Windows (C# Apps)

### Using
```csharp
using EntrySafe.Services;
```

### Usage
```csharp
// Accounting
var response = await EntrySafeAIService.GenerateAccountingResponseAsync("your prompt");

// Docs
var response = await EntrySafeAIService.GenerateDocsResponseAsync("your prompt");

// Pricing
var response = await EntrySafeAIService.GeneratePricingResponseAsync("your prompt");

// Display result
MessageBox.Show(response.Result);
Console.WriteLine($"Tokens: {response.TokensUsed}");
```

---

## 🌐 API Endpoints

| Endpoint | Method | App |
|----------|--------|-----|
| `/api/ai/accounting` | POST | Entry Safe Accounting |
| `/api/ai/docs` | POST | Entry Safe Docs |
| `/api/ai/pricing` | POST | Entry Safe Pricing |
| `/api/ai/health` | GET | Health check |

### Request Format
```json
{
  "prompt": "Your question here",
  "max_tokens": 500,
  "temperature": 0.7
}
```

### Response Format
```json
{
  "result": "AI generated response",
  "tokens_used": 150
}
```

---

## ⚙️ Environment Variables

```env
OPENAI_KEY_ACCOUNTING=sk-proj-your-key-here
OPENAI_KEY_DOCS=sk-proj-your-key-here
OPENAI_KEY_PRICING=sk-proj-your-key-here
```

---

## 🧪 Quick Test

### Backend
```bash
python -m uvicorn app.main:app --reload
curl http://localhost:8000/api/ai/health
```

### Flutter
```bash
flutter pub get
flutter run
```

### Windows
```
Build → Run in Visual Studio
```

---

## 📞 Support

**entrysafeapps@gmail.com**
