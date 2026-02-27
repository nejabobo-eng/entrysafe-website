from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from openai import OpenAI

router = APIRouter(prefix="/api/ai", tags=["AI Services"])

class AIRequest(BaseModel):
    prompt: str
    max_tokens: int = 500
    temperature: float = 0.7

class AIResponse(BaseModel):
    result: str
    tokens_used: int

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
            model="gpt-3.5-turbo",
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
async def accounting_ai(request: AIRequest):
    """
    AI endpoint for Entry Safe Accounting app
    
    Use cases:
    - Financial analysis and insights
    - Invoice generation suggestions
    - Expense categorization
    - Tax calculation assistance
    """
    result = await generate_ai_response(
        prompt=request.prompt,
        app_type="accounting",
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
    return result

@router.post("/docs", response_model=AIResponse)
async def docs_ai(request: AIRequest):
    """
    AI endpoint for Entry Safe Docs app
    
    Use cases:
    - Document summarization
    - OCR text extraction suggestions
    - Document categorization
    - Metadata generation
    """
    result = await generate_ai_response(
        prompt=request.prompt,
        app_type="docs",
        max_tokens=request.max_tokens,
        temperature=request.temperature
    )
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
