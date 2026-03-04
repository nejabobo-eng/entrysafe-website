"""
Tier Enforcement Middleware for Entry Safe
Author: Mlungisi Mncube
Purpose: Enforce subscription tier limits (AI usage, storage, devices)
"""

from fastapi import HTTPException, status
from datetime import datetime
from typing import Optional

# Tier Limits Configuration
TIER_LIMITS = {
    "free": {
        "ai_queries_monthly": 10,
        "storage_gb": 1,
        "devices": 1,
        "has_ads": True,
    },
    "starter": {
        "ai_queries_monthly": 50,
        "storage_gb": 5,
        "devices": 1,
        "has_ads": True,
    },
    "premium": {
        "ai_queries_monthly": 200,
        "storage_gb": -1,  # Unlimited
        "devices": 5,
        "has_ads": False,
    },
    "annual": {
        "ai_queries_monthly": 200,
        "storage_gb": -1,  # Unlimited
        "devices": 5,
        "has_ads": False,
    }
}


async def check_ai_limit(user_uid: str, tier: str, usage_service) -> None:
    """
    Check if user has exceeded AI usage limit for their tier.
    Raises HTTP 403 if limit exceeded.
    
    Args:
        user_uid: Firebase user UID
        tier: User's subscription tier (free/starter/premium/annual)
        usage_service: Instance of UsageService for MongoDB queries
    
    Raises:
        HTTPException: 403 if limit exceeded
    """
    # Get tier limit
    tier_config = TIER_LIMITS.get(tier.lower())
    if not tier_config:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid subscription tier: {tier}"
        )
    
    limit = tier_config["ai_queries_monthly"]
    
    # Get current usage
    current_usage = await usage_service.get_monthly_ai_usage(user_uid)
    
    # Check if exceeded
    if current_usage >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"AI usage limit exceeded. You've used {current_usage}/{limit} queries this month. Upgrade to continue."
        )


async def check_storage_limit(user_uid: str, tier: str, usage_service, additional_bytes: int = 0) -> None:
    """
    Check if user has exceeded storage limit for their tier.
    Raises HTTP 403 if limit exceeded.
    
    Args:
        user_uid: Firebase user UID
        tier: User's subscription tier
        usage_service: Instance of UsageService
        additional_bytes: Size of new file being uploaded (optional)
    
    Raises:
        HTTPException: 403 if limit exceeded
    """
    tier_config = TIER_LIMITS.get(tier.lower())
    if not tier_config:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid subscription tier: {tier}"
        )
    
    limit_gb = tier_config["storage_gb"]
    
    # Unlimited storage for premium/annual
    if limit_gb == -1:
        return
    
    # Get current storage usage
    current_bytes = await usage_service.get_storage_usage(user_uid)
    total_bytes = current_bytes + additional_bytes
    total_gb = total_bytes / (1024 ** 3)  # Convert bytes to GB
    
    # Check if exceeded
    if total_gb > limit_gb:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Storage limit exceeded. You've used {total_gb:.2f}GB of your {limit_gb}GB limit. Upgrade for more storage."
        )


async def check_device_limit(user_uid: str, tier: str, usage_service, device_id: Optional[str] = None) -> None:
    """
    Check if user has exceeded device limit for their tier.
    Raises HTTP 403 if limit exceeded.
    
    Args:
        user_uid: Firebase user UID
        tier: User's subscription tier
        usage_service: Instance of UsageService
        device_id: Current device identifier (optional)
    
    Raises:
        HTTPException: 403 if limit exceeded
    """
    tier_config = TIER_LIMITS.get(tier.lower())
    if not tier_config:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid subscription tier: {tier}"
        )
    
    limit = tier_config["devices"]
    
    # Get registered devices
    registered_devices = await usage_service.get_registered_devices(user_uid)
    device_count = len(registered_devices)
    
    # If this is a new device
    if device_id and device_id not in registered_devices:
        # Check if adding this device would exceed limit
        if device_count >= limit:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Device limit exceeded. Your {tier.capitalize()} plan allows {limit} device(s). Upgrade for multi-device access."
            )


def get_ads_flag(tier: str) -> bool:
    """
    Get whether ads should be shown for this tier.
    
    Args:
        tier: User's subscription tier
    
    Returns:
        bool: True if ads should be shown, False otherwise
    """
    tier_config = TIER_LIMITS.get(tier.lower(), {})
    return tier_config.get("has_ads", True)


def get_tier_features(tier: str) -> dict:
    """
    Get all feature flags for a tier.
    
    Args:
        tier: User's subscription tier
    
    Returns:
        dict: Tier configuration with all limits and features
    """
    return TIER_LIMITS.get(tier.lower(), TIER_LIMITS["free"])
