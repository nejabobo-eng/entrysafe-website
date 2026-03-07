"""
Usage Service for Entry Safe
Author: Mlungisi Mncube
Purpose: Track and retrieve user usage metrics (AI queries, storage, devices)
"""

from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from typing import Optional, List
from app.database import get_database


class UsageService:
    """Service for tracking user usage across different metrics"""

    def _get_db(self) -> AsyncIOMotorDatabase:
        """Get database instance"""
        return get_database()
    
    def _get_current_month_id(self) -> str:
        """Get current month identifier (YYYY-MM format)"""
        return datetime.now().strftime("%Y-%m")
    
    async def get_monthly_ai_usage(self, user_uid: str) -> int:
        """
        Get user's AI query count for current month.

        Args:
            user_uid: Firebase user UID

        Returns:
            int: Number of AI queries used this month
        """
        db = self._get_db()
        month_id = self._get_current_month_id()

        # Query: users/{uid}/usage/{month_id}
        usage_doc = await db.usage.find_one({
            "user_uid": user_uid,
            "month_id": month_id
        })

        if not usage_doc:
            return 0

        return usage_doc.get("ai_queries_used", 0)
    
    async def increment_ai_usage(self, user_uid: str) -> None:
        """
        Increment user's AI query count for current month atomically.

        Args:
            user_uid: Firebase user UID
        """
        db = self._get_db()
        month_id = self._get_current_month_id()
        
        # Create month document if doesn't exist
        await db.usage.update_one(
            {"user_uid": user_uid, "month_id": month_id},
            {
                "$inc": {"ai_queries_used": 1},
                "$setOnInsert": {
                    "user_uid": user_uid,
                    "month_id": month_id,
                    "created_at": datetime.now(),
                    "transactions_used": 0,
                    "storage_bytes": 0
                }
            },
            upsert=True
        )
    
    async def get_storage_usage(self, user_uid: str) -> int:
        """
        Get user's total storage usage in bytes.

        Args:
            user_uid: Firebase user UID

        Returns:
            int: Total storage used in bytes
        """
        db = self._get_db()
        
        # Aggregate all documents for user
        pipeline = [
            {"$match": {"user_uid": user_uid}},
            {"$group": {"_id": None, "total_bytes": {"$sum": "$file_size"}}}
        ]
        
        result = await db.documents.aggregate(pipeline).to_list(length=1)
        
        if not result:
            return 0
        
        return result[0].get("total_bytes", 0)
    
    async def increment_storage_usage(self, user_uid: str, file_size_bytes: int) -> None:
        """
        Add to user's storage usage when uploading a file.

        Args:
            user_uid: Firebase user UID
            file_size_bytes: Size of uploaded file in bytes
        """
        db = self._get_db()
        month_id = self._get_current_month_id()
        
        await db.usage.update_one(
            {"user_uid": user_uid, "month_id": month_id},
            {
                "$inc": {"storage_bytes": file_size_bytes},
                "$setOnInsert": {
                    "user_uid": user_uid,
                    "month_id": month_id,
                    "created_at": datetime.now(),
                    "ai_queries_used": 0,
                    "transactions_used": 0
                }
            },
            upsert=True
        )
    
    async def get_registered_devices(self, user_uid: str) -> List[str]:
        """
        Get list of device IDs registered for this user.

        Args:
            user_uid: Firebase user UID

        Returns:
            List[str]: List of device IDs
        """
        db = self._get_db()
        
        user_doc = await db.users.find_one({"uid": user_uid})
        
        if not user_doc:
            return []
        
        return user_doc.get("registered_devices", [])
    
    async def register_device(self, user_uid: str, device_id: str, device_info: dict) -> None:
        """
        Register a new device for user (after device limit check passes).

        Args:
            user_uid: Firebase user UID
            device_id: Unique device identifier
            device_info: Device metadata (platform, model, etc.)
        """
        db = self._get_db()
        
        await db.users.update_one(
            {"uid": user_uid},
            {
                "$addToSet": {"registered_devices": device_id},
                "$set": {
                    f"device_info.{device_id}": {
                        **device_info,
                        "registered_at": datetime.now()
                    }
                }
            }
        )
    
    async def get_user_tier(self, user_uid: str) -> str:
        """
        Get user's current subscription tier from database.

        Args:
            user_uid: Firebase user UID

        Returns:
            str: Tier name (free/starter/premium/annual)
        """
        db = self._get_db()  # Fixed: Don't await database object

        user_doc = await db.users.find_one({"uid": user_uid})

        if not user_doc:
            return "free"  # Default to free tier

        return user_doc.get("subscription_tier", "free").lower()
