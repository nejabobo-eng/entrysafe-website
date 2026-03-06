from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user
from app.database import get_database
from app.models import UserResponse, UserInDB
from app.services.usage_service import UsageService
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile"""
    db = get_database()
    
    user_doc = await db.users.find_one({"uid": current_user["uid"]})
    
    if not user_doc:
        # Create user if doesn't exist (first login)
        user_doc = {
            "uid": current_user["uid"],
            "email": current_user["email"],
            "role": "client",
            "emailVerified": current_user.get("email_verified", False),
            "createdAt": datetime.utcnow(),
            "lastLogin": datetime.utcnow()
        }
        await db.users.insert_one(user_doc)
    else:
        # Update last login
        await db.users.update_one(
            {"uid": current_user["uid"]},
            {"$set": {"lastLogin": datetime.utcnow()}}
        )
    
    return UserResponse(
        uid=user_doc["uid"],
        email=user_doc["email"],
        role=user_doc["role"],
        emailVerified=user_doc.get("emailVerified", False),
        createdAt=user_doc["createdAt"],
        lastLogin=user_doc.get("lastLogin")
    )

@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    updates: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile (limited fields)"""
    db = get_database()
    
    # Only allow updating certain fields
    allowed_fields = {"phone", "company", "address"}
    filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if not filtered_updates:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update"
        )
    
    result = await db.users.update_one(
        {"uid": current_user["uid"]},
        {"$set": filtered_updates}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return updated user
    user_doc = await db.users.find_one({"uid": current_user["uid"]})
    return UserResponse(**user_doc)

@router.get("/stats")
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    """Get user statistics"""
    db = get_database()

    # Count user's documents
    doc_count = await db.documents.count_documents({"userId": current_user["uid"]})

    # Get user's role
    user_doc = await db.users.find_one({"uid": current_user["uid"]})

    return {
        "documentsCount": doc_count,
        "role": user_doc.get("role", "client") if user_doc else "client",
        "accountAge": (datetime.utcnow() - user_doc["createdAt"]).days if user_doc else 0
    }

@router.get("/usage-status")
async def get_usage_status(current_user: dict = Depends(get_current_user)):
    """
    Get user's current usage status with tier limits.

    Returns:
    - Current tier (free/starter/premium/annual)
    - AI queries used/limit
    - Storage used/limit
    - Documents uploaded/limit
    - Registered devices/limit
    """
    usage_service = UsageService()
    db = get_database()

    # Get user tier
    tier = await usage_service.get_user_tier(current_user["uid"])

    # Define tier limits
    tier_limits = {
        "free": {
            "ai_queries": 10,
            "storage_gb": 1,
            "documents": 50,
            "devices": 2
        },
        "starter": {
            "ai_queries": 50,
            "storage_gb": 10,
            "documents": 500,
            "devices": 5
        },
        "premium": {
            "ai_queries": -1,  # Unlimited
            "storage_gb": -1,  # Unlimited
            "documents": -1,  # Unlimited
            "devices": -1  # Unlimited
        },
        "annual": {
            "ai_queries": -1,  # Unlimited
            "storage_gb": -1,  # Unlimited
            "documents": -1,  # Unlimited
            "devices": -1  # Unlimited
        }
    }

    limits = tier_limits.get(tier, tier_limits["free"])

    # Get current usage
    ai_queries_used = await usage_service.get_monthly_ai_usage(current_user["uid"])
    storage_bytes_used = await usage_service.get_storage_usage(current_user["uid"])
    storage_gb_used = round(storage_bytes_used / (1024**3), 2)

    # Count documents
    doc_count = await db.documents.count_documents({"userId": current_user["uid"]})

    # Get registered devices
    devices = await usage_service.get_registered_devices(current_user["uid"])
    device_count = len(devices)

    return {
        "tier": tier.upper(),
        "usage": {
            "ai_queries": {
                "used": ai_queries_used,
                "limit": limits["ai_queries"],
                "percentage": round((ai_queries_used / limits["ai_queries"]) * 100, 1) if limits["ai_queries"] > 0 else 0,
                "unlimited": limits["ai_queries"] == -1
            },
            "storage": {
                "used_gb": storage_gb_used,
                "limit_gb": limits["storage_gb"],
                "percentage": round((storage_gb_used / limits["storage_gb"]) * 100, 1) if limits["storage_gb"] > 0 else 0,
                "unlimited": limits["storage_gb"] == -1
            },
            "documents": {
                "used": doc_count,
                "limit": limits["documents"],
                "percentage": round((doc_count / limits["documents"]) * 100, 1) if limits["documents"] > 0 else 0,
                "unlimited": limits["documents"] == -1
            },
            "devices": {
                "used": device_count,
                "limit": limits["devices"],
                "percentage": round((device_count / limits["devices"]) * 100, 1) if limits["devices"] > 0 else 0,
                "unlimited": limits["devices"] == -1
            }
        }
    }
