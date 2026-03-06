from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
import os
import json
from openai import OpenAI
from app.auth import get_current_user
from app.services.usage_service import UsageService
from app.middleware.tier_check import check_ai_limit
from app.models import AITransactionResponse, TransactionData

router = APIRouter(prefix="/api/ai", tags=["AI Services"])

# Initialize usage service
usage_service = UsageService()

class AIRequest(BaseModel):
    prompt: str
    max_tokens: int = 500
    temperature: float = 0.7

class AIResponse(BaseModel):
    result: str
    tokens_used: int

class TransactionAIRequest(BaseModel):
    """Request for transaction auto-creation AI"""
    prompt: str = Field(description="User's natural language transaction request")
    userId: str = Field(description="User ID for context")
    businessName: str = Field(default="", description="Optional business name for context")
    max_tokens: int = Field(default=500, description="Maximum tokens for AI response")
    temperature: float = Field(default=0.3, description="Temperature for AI generation (lower = more consistent)")

# Initialize OpenAI clients for each app
def get_openai_client(app_type: str):
    """Get OpenAI client based on app type"""
    key_map = {
        "accounting": os.getenv("OPENAI_KEY_ACCOUNTING"),
        "docs": os.getenv("OPENAI_KEY_DOCS"),
        "pricing": os.getenv("OPENAI_KEY_PRICING"),
        "sdstorage": os.getenv("OPENAI_KEY_SD_STORAGE_HELPER")
    }

    api_key = key_map.get(app_type)
    if not api_key:
        raise HTTPException(status_code=500, detail=f"API key not configured for {app_type}")

    return OpenAI(api_key=api_key)

async def generate_ai_response(prompt: str, app_type: str, max_tokens: int = 500, temperature: float = 0.7) -> dict:
    """Generate AI response using OpenAI"""
    try:
        client = get_openai_client(app_type)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": f"You are a helpful assistant for the Entry Safe {app_type.capitalize()} app."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=max_tokens,
            temperature=temperature
        )
        
        return {
            "result": response.choices[0].message.content,
            "tokens_used": response.usage.total_tokens
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@router.post("/accounting", response_model=AIResponse)
async def accounting_ai(request: AIRequest, current_user: dict = Depends(get_current_user)):
    """
    AI endpoint for Entry Safe Accounting app

    Use cases:
    - Financial analysis and insights
    - Invoice generation suggestions
    - Expense categorization
    - Tax calculation assistance

    ⚠️ Tier limits enforced before processing
    """
    # Get user tier from database
    user_tier = await usage_service.get_user_tier(current_user["uid"])

    # Check if user has AI queries remaining
    await check_ai_limit(current_user["uid"], user_tier, usage_service)

    # Process AI request
    result = await generate_ai_response(
        prompt=request.prompt,
        app_type="accounting",
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )

    # Increment usage counter
    await usage_service.increment_ai_usage(current_user["uid"])

    return result

@router.post("/docs", response_model=AIResponse)
async def docs_ai(request: AIRequest, current_user: dict = Depends(get_current_user)):
    """
    AI endpoint for Entry Safe Docs app

    Use cases:
    - Document summarization
    - OCR text extraction suggestions
    - Document categorization
    - Metadata generation

    ⚠️ Tier limits enforced before processing
    """
    # Get user tier from database
    user_tier = await usage_service.get_user_tier(current_user["uid"])

    # Check if user has AI queries remaining
    await check_ai_limit(current_user["uid"], user_tier, usage_service)

    # Process AI request
    result = await generate_ai_response(
        prompt=request.prompt,
        app_type="docs",
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )

    # Increment usage counter
    await usage_service.increment_ai_usage(current_user["uid"])

    return result

@router.post("/pricing", response_model=AIResponse)
async def pricing_ai(request: AIRequest):
    """
    AI endpoint for Entry Safe Pricing app
    
    Use cases:
    - Pricing strategy recommendations
    - Cost analysis
    - Profit margin calculations
    - Competitive pricing insights
    """
    result = await generate_ai_response(
        prompt=request.prompt,
        app_type="pricing",
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    return result

@router.post("/sdstorage", response_model=AIResponse)
async def sdstorage_ai(request: AIRequest):
    """
    AI endpoint for SD Storage Helper app

    Use cases:
    - Storage analysis and insights
    - File organization suggestions
    - Duplicate detection
    - Storage optimization recommendations
    """
    result = await generate_ai_response(
        prompt=request.prompt,
        app_type="sdstorage",
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    return result

@router.get("/health")
async def ai_health_check():
    """Check if AI services are properly configured"""
    status = {
        "accounting": bool(os.getenv("OPENAI_KEY_ACCOUNTING")),
        "docs": bool(os.getenv("OPENAI_KEY_DOCS")),
        "pricing": bool(os.getenv("OPENAI_KEY_PRICING")),
        "sdstorage": bool(os.getenv("OPENAI_KEY_SD_STORAGE_HELPER"))
    }

    return {
        "message": "AI services status",
        "configured": status,
        "all_ready": all(status.values())
    }

# Transaction Auto-Creation System Prompt
TRANSACTION_SYSTEM_PROMPT = """You are an AI accounting assistant for Entry Safe. Your role is to parse user transaction requests and return ONLY structured JSON.

CRITICAL RULES:
1. ALWAYS return valid JSON matching this exact schema:
{
  "response": "Brief confirmation message",
  "data": {
    "transactionType": "income" or "expense",
    "amount": numeric value (positive number),
    "currency": "ZAR",
    "date": "YYYY-MM-DD" (ISO 8601 format),
    "description": "Clear transaction description",
    "category": "Optional category name or null",
    "tags": ["optional", "tags"] or [],
    "status": "pending"
  }
}

2. REQUIRED FIELDS (never omit):
   - transactionType: Must be exactly "income" or "expense"
   - amount: Must be positive number (no currency symbols)
   - currency: Always "ZAR"
   - date: Must be valid ISO 8601 date (YYYY-MM-DD)
   - description: Must be clear and descriptive
   - status: Always "pending" (user will approve)

3. OPTIONAL FIELDS:
   - category: Infer from context or set to null
   - tags: Extract relevant keywords or use []

4. DATE HANDLING:
   - "today" → use current date
   - "yesterday" → subtract 1 day
   - Relative dates ("last Monday") → calculate actual date
   - Always return ISO 8601 format (YYYY-MM-DD)

5. AMOUNT EXTRACTION:
   - Extract numeric value only (remove "R", "ZAR", commas)
   - Convert words to numbers ("one thousand" → 1000)
   - Must be positive (use transactionType for direction)

6. VALIDATION:
   - Never return partial JSON
   - Never return malformed JSON
   - Never omit required fields
   - Never include fields outside the schema

EXAMPLES:

User: "I received R1200 from Client A today"
Response:
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
    "status": "pending"
  }
}

User: "Paid R500 for office rent on 2026-03-01"
Response:
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

NOW PROCESS THE USER'S TRANSACTION REQUEST AND RETURN ONLY VALID JSON."""

@router.post("/transaction-autocreate", response_model=AITransactionResponse)
async def transaction_autocreate_ai(request: TransactionAIRequest, current_user: dict = Depends(get_current_user)):
    """
    AI endpoint for transaction auto-creation with enforced schema validation.

    This endpoint ensures:
    - Structured JSON response matching TransactionData schema
    - All required fields validated (transactionType, amount, currency, date, description)
    - Consistent format for Flutter app integration
    - Pydantic validation prevents malformed responses

    Use cases:
    - Voice-to-transaction conversion
    - Natural language transaction creation
    - Batch transaction processing from AI prompts

    ⚠️ Tier limits enforced before processing
    """
    try:
        # Get user tier from database
        user_tier = await usage_service.get_user_tier(current_user["uid"])

        # Check if user has AI queries remaining
        await check_ai_limit(current_user["uid"], user_tier, usage_service)

        # Get OpenAI client for accounting app
        client = get_openai_client("accounting")

        # Build context-aware prompt
        context = f"User ID: {request.userId}"
        if request.businessName:
            context += f", Business: {request.businessName}"

        full_prompt = f"{context}\n\nUser Request: {request.prompt}"

        # Call OpenAI with structured output enforcement
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": TRANSACTION_SYSTEM_PROMPT},
                {"role": "user", "content": full_prompt}
            ],
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            response_format={"type": "json_object"}  # Enforce JSON response
        )

        # Parse AI response
        ai_content = response.choices[0].message.content
        parsed_response = json.loads(ai_content)

        # Add user context to transaction data if not present
        if "data" in parsed_response:
            if "userId" not in parsed_response["data"] or not parsed_response["data"]["userId"]:
                parsed_response["data"]["userId"] = request.userId
            if "businessName" not in parsed_response["data"] or not parsed_response["data"]["businessName"]:
                parsed_response["data"]["businessName"] = request.businessName if request.businessName else None

        # Validate response against Pydantic model (automatic validation)
        validated_response = AITransactionResponse(**parsed_response)

        # Increment usage counter
        await usage_service.increment_ai_usage(current_user["uid"])

        return validated_response

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, 
            detail=f"AI returned invalid JSON. Please try rephrasing your request. Error: {str(e)}"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Transaction data validation failed: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Transaction auto-creation failed: {str(e)}"
        )
