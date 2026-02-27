from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import require_admin
from app.database import get_database
from app.models import UserResponse, UpdateRoleRequest, AdminAction
from datetime import datetime
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(current_user: dict = Depends(require_admin)):
    """Get all users (admin only)"""
    db = get_database()
    
    cursor = db.users.find({})
    users = await cursor.to_list(length=1000)
    
    return [
        UserResponse(
            uid=user["uid"],
            email=user["email"],
            role=user["role"],
            emailVerified=user.get("emailVerified", False),
            createdAt=user["createdAt"],
            lastLogin=user.get("lastLogin")
        )
        for user in users
    ]

@router.put("/users/{uid}/role")
async def update_user_role(
    uid: str,
    role_update: UpdateRoleRequest,
    current_user: dict = Depends(require_admin)
):
    """Update user's role (admin only)"""
    db = get_database()
    
    # Cannot change own role
    if uid == current_user["uid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own role"
        )
    
    result = await db.users.update_one(
        {"uid": uid},
        {"$set": {"role": role_update.role}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Log admin action
    await db.admin_actions.insert_one({
        "adminId": current_user["uid"],
        "action": "update_user_role",
        "targetUserId": uid,
        "details": {"newRole": role_update.role},
        "timestamp": datetime.utcnow()
    })
    
    return {"message": f"User role updated to {role_update.role}"}

@router.delete("/users/{uid}")
async def delete_user(
    uid: str,
    current_user: dict = Depends(require_admin)
):
    """Delete a user (admin only)"""
    db = get_database()
    
    # Cannot delete own account
    if uid == current_user["uid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Delete user
    result = await db.users.delete_one({"uid": uid})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Delete user's documents
    await db.documents.delete_many({"userId": uid})
    
    # Log admin action
    await db.admin_actions.insert_one({
        "adminId": current_user["uid"],
        "action": "delete_user",
        "targetUserId": uid,
        "timestamp": datetime.utcnow()
    })
    
    return {"message": "User deleted successfully"}

@router.get("/actions")
async def get_admin_actions(
    limit: int = 50,
    current_user: dict = Depends(require_admin)
):
    """Get recent admin actions (admin only)"""
    db = get_database()
    
    cursor = db.admin_actions.find({}).sort("timestamp", -1).limit(limit)
    actions = await cursor.to_list(length=limit)
    
    return [
        {
            "id": str(action["_id"]),
            "adminId": action["adminId"],
            "action": action["action"],
            "targetUserId": action.get("targetUserId"),
            "targetDocumentId": action.get("targetDocumentId"),
            "details": action.get("details"),
            "timestamp": action["timestamp"]
        }
        for action in actions
    ]

@router.get("/stats")
async def get_admin_stats(current_user: dict = Depends(require_admin)):
    """Get platform statistics (admin only)"""
    db = get_database()
    
    total_users = await db.users.count_documents({})
    total_documents = await db.documents.count_documents({})
    total_clients = await db.users.count_documents({"role": "client"})
    total_admins = await db.users.count_documents({"role": "admin"})
    total_downloads = await db.downloads.count_documents({})
    total_contacts = await db.contacts.count_documents({})
    
    return {
        "totalUsers": total_users,
        "totalDocuments": total_documents,
        "totalClients": total_clients,
        "totalAdmins": total_admins,
        "totalDownloads": total_downloads,
        "totalContacts": total_contacts
    }

@router.get("/documents")
async def get_all_documents(current_user: dict = Depends(require_admin)):
    """Get all documents across all users (admin only)"""
    db = get_database()
    
    cursor = db.documents.find({}).sort("uploadedAt", -1).limit(100)
    documents = await cursor.to_list(length=100)
    
    return [
        {
            "id": str(doc["_id"]),
            "filename": doc["filename"],
            "fileType": doc["fileType"],
            "fileSize": doc["fileSize"],
            "userId": doc["userId"],
            "uploadedAt": doc["uploadedAt"]
        }
        for doc in documents
    ]
