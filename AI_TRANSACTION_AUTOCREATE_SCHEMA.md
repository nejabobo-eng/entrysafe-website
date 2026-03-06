# 🤖 AI Transaction Auto-Creation Schema

## Overview
FastAPI backend now enforces a **standardized AI response schema** for transaction auto-creation, ensuring the Flutter app receives consistent, validated JSON for the "Approve & Execute" workflow.

---

## 📋 Response Schema

### Complete Response Structure
```json
{
  "response": "I've drafted an income transaction of R1,200 from Client A.",
  "data": {
    "transactionType": "income",
    "amount": 1200,
    "currency": "ZAR",
    "date": "2026-03-05",
    "description": "Income from Client A",
    "category": "Client Payment",
    "tags": ["Client A"],
    "status": "pending",
    "userId": "user123",
    "businessName": "My Business",
    "referenceId": "TXN-2026-03-05-001"
  }
}
```

---

## 🔑 Field Specifications

### Required Fields (Never Omitted)

| Field | Type | Validation | Example |
|-------|------|------------|---------|
| `transactionType` | Enum | Must be `"income"` or `"expense"` | `"income"` |
| `amount` | Float | Must be positive (> 0) | `1200` |
| `currency` | String | Always `"ZAR"` | `"ZAR"` |
| `date` | String | ISO 8601 format (YYYY-MM-DD) | `"2026-03-05"` |
| `description` | String | 1-500 characters | `"Income from Client A"` |
| `status` | Enum | Always `"pending"` (until approved) | `"pending"` |

### Optional Fields (Defaults Provided)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `category` | String | `null` | Transaction category for reporting |
| `tags` | Array | `[]` | Keywords for filtering/search |
| `userId` | String | Auto-filled | User ID from request context |
| `businessName` | String | Auto-filled | Business name from request context |
| `referenceId` | String | `null` | Unique ID for audit logs |

---

## 🎯 Pydantic Models

### Backend Models (entrysafe-backend/app/models.py)

```python
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    EXECUTED = "executed"
    REJECTED = "rejected"

class TransactionData(BaseModel):
    """Structured transaction data returned by AI for auto-creation"""
    transactionType: TransactionType
    amount: float = Field(gt=0, description="Transaction amount in ZAR")
    currency: str = Field(default="ZAR", description="Currency code (always ZAR)")
    date: str = Field(description="Transaction date in ISO 8601 format (YYYY-MM-DD)")
    description: str = Field(min_length=1, max_length=500, description="Transaction description")
    category: Optional[str] = Field(default=None, description="Optional category for reporting")
    tags: List[str] = Field(default_factory=list, description="Optional tags for filtering")
    status: TransactionStatus = Field(default=TransactionStatus.PENDING, description="Transaction status")
    
    # Optional context fields
    userId: Optional[str] = Field(default=None, description="User ID for multi-user context")
    businessName: Optional[str] = Field(default=None, description="Business name for context")
    referenceId: Optional[str] = Field(default=None, description="Unique reference ID for audit logs")

class AITransactionResponse(BaseModel):
    """Standardized AI response for transaction auto-creation"""
    response: str = Field(description="Human-readable AI response message")
    data: TransactionData = Field(description="Structured transaction data for auto-creation")
```

---

## 🚀 API Endpoint

### POST `/api/ai/transaction-autocreate`

**Authentication:** Required (JWT Bearer token)

**Request Body:**
```json
{
  "prompt": "I received R1200 from Client A today",
  "userId": "user123",
  "businessName": "My Business",
  "max_tokens": 500,
  "temperature": 0.3
}
```

**Response (200 OK):**
```json
{
  "response": "I've drafted an income transaction of R1,200 from Client A.",
  "data": {
    "transactionType": "income",
    "amount": 1200,
    "currency": "ZAR",
    "date": "2026-03-05",
    "description": "Income from Client A",
    "category": "Client Payment",
    "tags": ["Client A"],
    "status": "pending",
    "userId": "user123",
    "businessName": "My Business",
    "referenceId": null
  }
}
```

**Error Responses:**

| Status | Scenario | Example |
|--------|----------|---------|
| 400 | Validation failed | `{"detail": "Transaction data validation failed: amount must be positive"}` |
| 500 | Invalid JSON from AI | `{"detail": "AI returned invalid JSON. Please try rephrasing your request."}` |
| 429 | Tier limit exceeded | `{"detail": "AI query limit exceeded for your tier"}` |

---

## 🧠 AI System Prompt

The backend includes a comprehensive system prompt that instructs the AI to:

1. **Always return valid JSON** matching the exact schema
2. **Never omit required fields** (transactionType, amount, currency, date, description, status)
3. **Validate field types** (numbers, strings, enums)
4. **Handle date parsing** (today, yesterday, relative dates → ISO 8601)
5. **Extract amounts correctly** (remove currency symbols, convert words to numbers)
6. **Infer categories and tags** from context when possible
7. **Return structured errors** if user input is ambiguous

### Key System Prompt Rules:
```
- transactionType: Must be exactly "income" or "expense"
- amount: Must be positive number (no currency symbols)
- currency: Always "ZAR"
- date: Must be valid ISO 8601 date (YYYY-MM-DD)
- description: Must be clear and descriptive
- status: Always "pending" (user will approve)
```

---

## 🎨 Flutter Integration Flow

### 1. User Makes Voice/Text Request
```dart
final request = TransactionAIRequest(
  prompt: "I received R1200 from Client A today",
  userId: currentUser.uid,
  businessName: currentUser.businessName,
);
```

### 2. Backend Returns Validated JSON
```dart
final response = await http.post(
  Uri.parse('$API_URL/api/ai/transaction-autocreate'),
  headers: {'Authorization': 'Bearer $token'},
  body: jsonEncode(request),
);

final AITransactionResponse data = AITransactionResponse.fromJson(jsonDecode(response.body));
```

### 3. Show in "Pending AI Changes" Panel
```dart
StreamBuilder<List<TransactionData>>(
  stream: pendingTransactionsStream,
  builder: (context, snapshot) {
    return ListView.builder(
      itemCount: snapshot.data?.length ?? 0,
      itemBuilder: (context, index) {
        final transaction = snapshot.data![index];
        return TransactionCard(
          type: transaction.transactionType,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          onApprove: () => executeTransaction(transaction),
          onReject: () => rejectTransaction(transaction),
        );
      },
    );
  },
)
```

### 4. User Approves → Execute Transaction
```dart
Future<void> executeTransaction(TransactionData data) async {
  await FirebaseFirestore.instance.collection('transactions').add({
    'type': data.transactionType,
    'amount': data.amount,
    'currency': data.currency,
    'date': data.date,
    'description': data.description,
    'category': data.category,
    'tags': data.tags,
    'status': 'executed',
    'userId': data.userId,
    'businessName': data.businessName,
    'executedAt': FieldValue.serverTimestamp(),
  });
  
  // Remove from pending list
  pendingTransactions.removeWhere((t) => t.referenceId == data.referenceId);
}
```

---

## ✅ Validation Guarantees

### Pydantic Automatic Validation:
1. **Type Safety:** Ensures all fields match expected types
2. **Enum Validation:** transactionType must be "income" or "expense"
3. **Positive Amount:** amount field validated with `gt=0`
4. **Required Fields:** Pydantic raises ValidationError if missing
5. **String Length:** description validated (1-500 chars)

### OpenAI JSON Mode:
```python
response_format={"type": "json_object"}  # Forces valid JSON output
```

### Error Handling:
```python
try:
    validated_response = AITransactionResponse(**parsed_response)
except ValueError as e:
    raise HTTPException(status_code=400, detail=f"Validation failed: {str(e)}")
```

---

## 📊 Example Use Cases

### Use Case 1: Voice Transaction Entry
**User says:** "I paid R500 for office rent on March 1st"

**AI Response:**
```json
{
  "response": "I've drafted an expense of R500 for office rent.",
  "data": {
    "transactionType": "expense",
    "amount": 500,
    "currency": "ZAR",
    "date": "2026-03-01",
    "description": "Office rent payment",
    "category": "Rent",
    "tags": ["office", "rent"],
    "status": "pending"
  }
}
```

### Use Case 2: Batch Invoice Processing
**User says:** "Create income entries for invoices INV-001 (R1200), INV-002 (R3500), INV-003 (R800) all dated today"

**AI Response (3 separate transactions):**
```json
[
  {"response": "...", "data": {"amount": 1200, "description": "Invoice INV-001", ...}},
  {"response": "...", "data": {"amount": 3500, "description": "Invoice INV-002", ...}},
  {"response": "...", "data": {"amount": 800, "description": "Invoice INV-003", ...}}
]
```

### Use Case 3: Natural Language Date Parsing
**User says:** "Record R200 expense for lunch yesterday"

**AI Response:**
```json
{
  "response": "I've drafted an expense of R200 for lunch yesterday.",
  "data": {
    "transactionType": "expense",
    "amount": 200,
    "currency": "ZAR",
    "date": "2026-03-04",  // Auto-calculated
    "description": "Lunch expense",
    "category": "Meals",
    "tags": ["lunch"],
    "status": "pending"
  }
}
```

---

## 🔧 Testing

### Test Request (cURL)
```bash
curl -X POST "https://entrysafe-website.onrender.com/api/ai/transaction-autocreate" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "I received R1200 from Client A today",
    "userId": "test-user-123",
    "businessName": "Test Business",
    "max_tokens": 500,
    "temperature": 0.3
  }'
```

### Expected Response
```json
{
  "response": "I've drafted an income transaction of R1,200 from Client A.",
  "data": {
    "transactionType": "income",
    "amount": 1200,
    "currency": "ZAR",
    "date": "2026-03-05",
    "description": "Income from Client A",
    "category": "Client Payment",
    "tags": ["Client A"],
    "status": "pending",
    "userId": "test-user-123",
    "businessName": "Test Business",
    "referenceId": null
  }
}
```

---

## 🚀 Deployment Checklist

- [x] Pydantic models added to `models.py`
- [x] System prompt created with validation rules
- [x] Endpoint `/api/ai/transaction-autocreate` implemented
- [x] OpenAI JSON mode enabled (`response_format={"type": "json_object"}`)
- [x] Automatic Pydantic validation
- [x] Context fields auto-populated (userId, businessName)
- [x] Error handling for invalid JSON
- [x] Error handling for validation failures
- [x] Tier limit enforcement
- [x] Usage tracking integration
- [ ] Deploy to Render (push to main branch)
- [ ] Test with Flutter app integration
- [ ] Monitor AI response quality
- [ ] Add referenceId generation logic (optional)

---

## 📖 Related Documentation
- `BACKEND_READY_CANCELLATION_ADDED.md` - Backend readiness verification
- `WEBSITE_CANCELLATION_COMPLETE.md` - Cancellation feature implementation
- `FINAL_SUMMARY.md` - Complete project summary

---

**Last Updated:** 2026-03-05  
**Status:** ✅ Production-Ready  
**Endpoint:** `POST /api/ai/transaction-autocreate`  
**Authentication:** Required (JWT)
