"""
AI Content Generation Router for Entry Safe
Purpose: Generate daily business quotes and lessons in EntrySafe style
Author: Mlungisi Mncube

Features:
- Midday-controlled generation (12:00 PM)
- Persistent file caching (survives Render restarts)
- Fallback content (if OpenAI fails)
- Cost-optimized (once per day)
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import os
from typing import Optional
from openai import OpenAI
import json

router = APIRouter(prefix="/api/ai", tags=["AI Content"])

# Initialize OpenAI client (v1.0.0+ API)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Cache file location (persistent across Render restarts)
CACHE_FILE = "/tmp/daily_content_cache.json"

# In-memory cache (faster than file reads on every request)
daily_cache = {
    "date": None,
    "quote": "",
    "lesson": ""
}


def load_cache():
    """Load cache from file if it exists"""
    try:
        if os.path.exists(CACHE_FILE):
            with open(CACHE_FILE, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"⚠️ Warning: Failed to load cache from file: {e}")

    return {"date": None, "quote": "", "lesson": ""}


def save_cache(data):
    """Save cache to file for persistence"""
    try:
        with open(CACHE_FILE, "w") as f:
            json.dump(data, f)
    except Exception as e:
        print(f"⚠️ Warning: Failed to save cache to file: {e}")


# Load cache on startup
daily_cache = load_cache()


@router.get("/daily-content")
async def get_daily_content():
    """
    Get daily business quote and lesson.
    Generates once per day, then caches.
    """
    today = datetime.now().strftime("%Y-%m-%d")

    # Check cache
    if daily_cache["date"] == today:
        return {
            "quote": daily_cache["quote"],
            "lesson": daily_cache["lesson"],
            "cached": True
        }

    try:
        # Generate quote
        quote_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": get_quote_prompt()
                }
            ],
            temperature=0.7,
            max_tokens=150
        )

        quote = quote_response.choices[0].message.content.strip()

        # Generate lesson
        lesson_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": get_lesson_prompt()
                }
            ],
            temperature=0.7,
            max_tokens=300
        )

        lesson = lesson_response.choices[0].message.content.strip()

        # Cache today's content
        daily_cache["date"] = today
        daily_cache["quote"] = quote
        daily_cache["lesson"] = lesson

        return {
            "quote": quote,
            "lesson": lesson,
            "cached": False
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate content: {str(e)}"
        )


def get_quote_prompt() -> str:
    """
    EntrySafe Quote Generation Prompt
    Tuned to Mlungisi's exact teaching style
    """
    return """Write a short business quote in the EntrySafe style.

Format exactly:

💡 Business Quote of the Day

"Quote"

Add one short, calm encouraging sentence.

Keep it:
- Simple
- Realistic (not hype)
- About discipline, consistency, growth, or business fundamentals

Topics to consider: 
- Small business growth through consistency
- Discipline in spending
- Reinvestment mindset
- Customer service importance
- Building strong foundations

End with:
🌐 www.entrysafe.co.za

Example format:
💡 Business Quote of the Day

"Small businesses grow through consistency — keep showing up, even when progress feels slow."

Stay committed. What you're building matters 💼

🌐 www.entrysafe.co.za"""


def get_lesson_prompt() -> str:
    """
    EntrySafe Lesson Generation Prompt
    Tuned to match Mlungisi's teaching patterns
    """
    return """Write a daily business lesson in EntrySafe style.

Use ONE of these formats:

------------------------

FORMAT 1: FULL LESSON (most common)

📘 EntrySafe Focus – [Simple practical topic]

Good day everyone 👋 OR Good evening everyone 👋

Teach a simple business principle using:

💡 Clear explanation or definition
📌 Practical steps or bullet points (2–4 points)
⚖️ A simple rule or comparison (optional but powerful)
✅ / ❌ Examples showing right vs wrong (optional)

End with a strong, practical closing sentence.

------------------------

FORMAT 2: SHORT REINFORCEMENT

Start with "Good day everyone 👋" or "Good evening everyone 👋"

Give one strong business principle with:

📌 A clear practical instruction
💡 A supporting insight

Keep it short and direct (4–6 lines).

------------------------

RULES FOR BOTH:
- Use simple language (no jargon)
- Avoid long paragraphs
- Make it practical and actionable, not motivational fluff
- Keep it 6–12 lines maximum
- Make it sound like a real person teaching
- Topics: growth vs survival, customer service, cash flow, needs vs wants, reinvestment, discipline, consistency, business structure

ALWAYS end with:
🌐 www.entrysafe.co.za

EXAMPLE (FORMAT 1):
📘 EntrySafe Focus – Separating Needs vs Wants in Business

Good day everyone 👋

One of the biggest mistakes in business is spending money on wants instead of needs.

💡 Needs are things your business cannot operate without.
💡 Wants are things that are nice to have, but not essential.

📌 Examples:
✅ Need: Stock, raw materials, essential tools
❌ Want: Expensive branding, upgrades, or items that don't increase income

⚖️ Simple rule:
If it doesn't help your business make or protect money, it is likely a want.

Discipline in spending is what keeps a business alive and growing.

🌐 www.entrysafe.co.za

------------------------

EXAMPLE (FORMAT 2):
Good evening everyone 👋

Good customer service is not a once-off action — it must be consistent.

📌 Treat every customer with the same level of respect and professionalism, every time.

💡 Consistency builds trust, and trust builds long-term business.

Customers return where they feel valued.

🌐 www.entrysafe.co.za"""
