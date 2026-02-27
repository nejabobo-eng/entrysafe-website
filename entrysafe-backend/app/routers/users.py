from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user
from app.database import get_database
from app.models import UserResponse, UserInDB
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
