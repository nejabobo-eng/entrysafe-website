"""
Payment Processing Router for Entry Safe
Author: Mlungisi Mncube
Purpose: Handle PayPal subscription creation and webhooks
"""

from fastapi import APIRouter, HTTPException, Request, Depends, status
from pydantic import BaseModel
from typing import Optional
import paypalrestsdk
import httpx
import os
from datetime import datetime, timedelta, timezone
import hmac
import hashlib
import json

from app.auth import get_current_user
from app.database import get_database
from app.models import SubscriptionTier

router = APIRouter(prefix="/api/payments", tags=["Payments"])

# PayPal Configuration
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_WEBHOOK_ID = os.getenv("PAYPAL_WEBHOOK_ID")  # For webhook verification
PAYPAL_API_BASE = os.getenv("PAYPAL_API_BASE", "https://api-m.sandbox.paypal.com")

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": PAYPAL_MODE,
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})


# ============================================================================
# SECURITY FUNCTIONS - Production-Grade Webhook Verification
# ============================================================================

async def get_paypal_access_token() -> str:
    """
    Get PayPal OAuth2 access token for server-to-server API calls.
    Used for webhook signature verification.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_API_BASE}/v1/oauth2/token",
            auth=(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data={"grant_type": "client_credentials"},
        )
        response.raise_for_status()
        return response.json()["access_token"]


async def verify_paypal_webhook(request: Request, body: dict) -> bool:
    """
    Verify PayPal webhook signature using official PayPal verification endpoint.

    This is the PRODUCTION-SAFE method recommended by PayPal.
    Do NOT manually verify certificates or reconstruct signatures.

    Returns True if signature valid, raises HTTPException if invalid.
    """
    if not PAYPAL_WEBHOOK_ID:
        print("⚠️ WARNING: PAYPAL_WEBHOOK_ID not configured. Skipping signature verification.")
        print("   This is INSECURE for production. Set PAYPAL_WEBHOOK_ID in .env")
        return True  # Allow in development, but log warning

    # Get access token
    access_token = await get_paypal_access_token()

    # Prepare verification payload
    verification_payload = {
        "auth_algo": request.headers.get("paypal-auth-algo"),
        "cert_url": request.headers.get("paypal-cert-url"),
        "transmission_id": request.headers.get("paypal-transmission-id"),
        "transmission_sig": request.headers.get("paypal-transmission-sig"),
        "transmission_time": request.headers.get("paypal-transmission-time"),
        "webhook_id": PAYPAL_WEBHOOK_ID,
        "webhook_event": body,
    }

    # Call PayPal's official verification endpoint
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
            json=verification_payload,
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"PayPal signature verification failed: {response.text}"
        )

    verification_status = response.json().get("verification_status")

    if verification_status != "SUCCESS":
        raise HTTPException(
            status_code=400,
            detail="Invalid PayPal webhook signature"
        )

    return True


async def is_duplicate_event(db, event_id: str) -> bool:
    """
    Replay protection: Check if webhook event already processed.

    Prevents duplicate processing if PayPal resends webhook.
    Stores event_id in webhook_events collection.
    """
    existing = await db.webhook_events.find_one({"event_id": event_id})
    if existing:
        print(f"⚠️ Duplicate webhook event ignored: {event_id}")
        return True

    # Mark as processed (will be updated with full details later)
    await db.webhook_events.insert_one({
        "event_id": event_id,
        "processed_at": datetime.utcnow(),
        "status": "processing"
    })
    return False


def validate_webhook_timestamp(request: Request):
    """
    Timestamp validation: Reject webhooks older than 5 minutes.

    Prevents replay attacks using old captured webhooks.
    """
    transmission_time = request.headers.get("paypal-transmission-time")
    if not transmission_time:
        raise HTTPException(status_code=400, detail="Missing transmission time")

    try:
        event_time = datetime.fromisoformat(transmission_time.replace("Z", "+00:00"))
        age_seconds = abs((datetime.now(timezone.utc) - event_time).total_seconds())

        if age_seconds > 300:  # 5 minutes
            raise HTTPException(
                status_code=400,
                detail=f"Stale webhook rejected (age: {age_seconds}s)"
            )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid transmission time format")


# ============================================================================
# SUBSCRIPTION ENDPOINTS
# ============================================================================

# Pricing Configuration (matches website)
SUBSCRIPTION_PLANS = {
    "starter": {
        "name": "Entry Safe Starter",
        "price": "199.00",
        "currency": "ZAR",
        "interval": "MONTH",
        "tier": SubscriptionTier.STARTER
    },
    "premium": {
        "name": "Entry Safe Premium",
        "price": "499.00",
        "currency": "ZAR",
        "interval": "MONTH",
        "tier": SubscriptionTier.PREMIUM
    },
    "annual": {
        "name": "Entry Safe Annual Professional",
        "price": "4999.00",
        "currency": "ZAR",
        "interval": "YEAR",
        "tier": SubscriptionTier.ANNUAL
    }
}


class SubscriptionRequest(BaseModel):
    plan: str  # starter, premium, or annual
    return_url: str
    cancel_url: str


class SubscriptionResponse(BaseModel):
    subscription_id: str
    approval_url: str
    status: str


class WebhookEvent(BaseModel):
    event_type: str
    resource: dict


@router.post("/create-subscription", response_model=SubscriptionResponse)
async def create_subscription(
    request: SubscriptionRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Create PayPal subscription for user.
    
    Plans:
    - starter: R199/month
    - premium: R499/month  
    - annual: R4999/year
    
    Returns approval URL for user to complete payment on PayPal.
    """
    # Validate plan
    if request.plan not in SUBSCRIPTION_PLANS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid plan. Choose from: {list(SUBSCRIPTION_PLANS.keys())}"
        )
    
    plan_config = SUBSCRIPTION_PLANS[request.plan]
    
    try:
        # Create billing plan
        billing_plan = paypalrestsdk.BillingPlan({
            "name": plan_config["name"],
            "description": f"Entry Safe {request.plan.capitalize()} Subscription",
            "type": "INFINITE",  # Recurring until cancelled
            "payment_definitions": [{
                "name": "Regular Payment",
                "type": "REGULAR",
                "frequency": plan_config["interval"],
                "frequency_interval": "1",
                "cycles": "0",  # Infinite
                "amount": {
                    "value": plan_config["price"],
                    "currency": plan_config["currency"]
                }
            }],
            "merchant_preferences": {
                "return_url": request.return_url,
                "cancel_url": request.cancel_url,
                "auto_bill_amount": "YES",
                "initial_fail_amount_action": "CANCEL",
                "max_fail_attempts": "3"
            }
        })
        
        # Create the plan
        if not billing_plan.create():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"PayPal plan creation failed: {billing_plan.error}"
            )
        
        # Activate the plan
        if not billing_plan.replace([{
            "op": "replace",
            "path": "/",
            "value": {"state": "ACTIVE"}
        }]):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="PayPal plan activation failed"
            )
        
        # Create billing agreement
        billing_agreement = paypalrestsdk.BillingAgreement({
            "name": plan_config["name"],
            "description": f"Subscription for {current_user['email']}",
            "start_date": (datetime.now() + timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "plan": {
                "id": billing_plan.id
            },
            "payer": {
                "payment_method": "paypal",
                "payer_info": {
                    "email": current_user['email']
                }
            }
        })
        
        # Create the agreement
        if not billing_agreement.create():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"PayPal agreement creation failed: {billing_agreement.error}"
            )
        
        # Get approval URL
        approval_url = None
        for link in billing_agreement.links:
            if link.rel == "approval_url":
                approval_url = link.href
                break
        
        if not approval_url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="No approval URL returned from PayPal"
            )
        
        # Store pending subscription in database
        db = get_database()
        await db.pending_subscriptions.insert_one({
            "user_uid": current_user["uid"],
            "email": current_user["email"],
            "plan": request.plan,
            "tier": plan_config["tier"].value,
            "billing_plan_id": billing_plan.id,
            "billing_agreement_token": billing_agreement.token,
            "status": "pending",
            "created_at": datetime.now()
        })
        
        return SubscriptionResponse(
            subscription_id=billing_agreement.token,
            approval_url=approval_url,
            status="pending_approval"
        )
        
    except paypalrestsdk.ResourceNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PayPal resource not found: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Subscription creation failed: {str(e)}"
        )


@router.get("/execute-agreement/{token}")
async def execute_agreement(token: str, current_user: dict = Depends(get_current_user)):
    """
    Execute billing agreement after user approves on PayPal.

    ⚠️ SECURITY: Does NOT activate tier immediately.
    Tier activation happens ONLY after webhook confirms payment.

    Called after user returns from PayPal approval.
    """
    try:
        # Find pending subscription
        db = get_database()
        pending_sub = await db.pending_subscriptions.find_one({
            "user_uid": current_user["uid"],
            "billing_agreement_token": token
        })

        if not pending_sub:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pending subscription not found"
            )

        # Execute the agreement
        billing_agreement = paypalrestsdk.BillingAgreement.find(token)

        if not billing_agreement.execute():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Agreement execution failed: {billing_agreement.error}"
            )

        # ⚠️ CRITICAL: Mark as pending_confirmation, NOT active
        # Tier will be activated by webhook after payment confirmed
        await db.users.update_one(
            {"uid": current_user["uid"]},
            {
                "$set": {
                    "subscription_status": "pending_confirmation",
                    "subscription_id": billing_agreement.id,
                    "pending_tier": pending_sub["tier"],
                    "subscription_start_date": datetime.now(),
                    "updated_at": datetime.now()
                }
            }
        )

        # Keep pending subscription (remove only after webhook confirms)
        await db.pending_subscriptions.update_one(
            {"_id": pending_sub["_id"]},
            {
                "$set": {
                    "status": "awaiting_webhook",
                    "subscription_id": billing_agreement.id,
                    "updated_at": datetime.now()
                }
            }
        )

        return {
            "message": "Payment submitted. Awaiting confirmation...",
            "subscription_id": billing_agreement.id,
            "status": "pending_confirmation"
        }

    except paypalrestsdk.ResourceNotFound as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PayPal agreement not found: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agreement execution failed: {str(e)}"
        )


@router.post("/webhook")
async def paypal_webhook(request: Request):
    """
    Handle PayPal webhook events with production-grade security.

    🔐 SECURITY STACK:
    - ✅ Cryptographic signature verification (PayPal official endpoint)
    - ✅ Replay protection (event_id stored)
    - ✅ Timestamp validation (reject webhooks > 5 minutes old)
    - ✅ State transition validation (only activate if pending_confirmation)
    - ✅ Subscription ID matching
    - ✅ Fraud logging

    🎯 CRITICAL: This is the ONLY place tier activation happens.

    Events handled:
    - BILLING.SUBSCRIPTION.ACTIVATED ✅ Activates tier
    - BILLING.SUBSCRIPTION.CANCELLED ❌ Downgrades to free
    - BILLING.SUBSCRIPTION.SUSPENDED ⏸️ Suspends access
    - BILLING.SUBSCRIPTION.EXPIRED 🔚 Downgrades to free
    - PAYMENT.SALE.COMPLETED 💰 Logs payment
    - PAYMENT.SALE.DENIED ❌ Logs failure
    """
    try:
        # Parse event body
        body = await request.json()
        event_id = body.get("id")
        event_type = body.get("event_type")
        resource = body.get("resource", {})
        subscription_id = resource.get("id")

        db = get_database()

        # ============================================================================
        # SECURITY LAYER 1: Timestamp Validation
        # ============================================================================
        validate_webhook_timestamp(request)

        # ============================================================================
        # SECURITY LAYER 2: Cryptographic Signature Verification
        # ============================================================================
        await verify_paypal_webhook(request, body)

        # ============================================================================
        # SECURITY LAYER 3: Replay Protection
        # ============================================================================
        if await is_duplicate_event(db, event_id):
            return {"status": "duplicate_ignored", "event_id": event_id}

        # ============================================================================
        # SECURITY LAYER 4: Subscription ID Matching
        # ============================================================================
        user = await db.users.find_one({"subscription_id": subscription_id})

        if not user and event_type.startswith("BILLING.SUBSCRIPTION"):
            # Possible fraud attempt - log for investigation
            await db.security_logs.insert_one({
                "type": "unknown_subscription_webhook",
                "event_type": event_type,
                "subscription_id": subscription_id,
                "event_id": event_id,
                "resource": resource,
                "headers": dict(request.headers),
                "timestamp": datetime.utcnow()
            })
            print(f"🚨 SECURITY: Unknown subscription webhook: {subscription_id}")
            raise HTTPException(
                status_code=400,
                detail="Unknown subscription"
            )

        # ============================================================================
        # EVENT HANDLING - Production-Grade State Transitions
        # ============================================================================

        if event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
            # ============================================================================
            # SECURITY LAYER 5: State Transition Validation
            # ============================================================================
            if user.get("subscription_status") != "pending_confirmation":
                await db.security_logs.insert_one({
                    "type": "invalid_state_transition",
                    "event_type": event_type,
                    "user_uid": user["uid"],
                    "current_status": user.get("subscription_status"),
                    "expected_status": "pending_confirmation",
                    "timestamp": datetime.utcnow()
                })
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid state transition. Current: {user.get('subscription_status')}, Expected: pending_confirmation"
                )

            # Get pending tier
            pending_tier = user.get("pending_tier")

            if not pending_tier:
                print(f"⚠️ Webhook: No pending tier for user {user['uid']}")
                raise HTTPException(status_code=400, detail="No pending tier")

            # ✅ ACTIVATE TIER (This is the ONLY place this happens)
            await db.users.update_one(
                {"uid": user["uid"]},
                {
                    "$set": {
                        "subscription_tier": pending_tier,
                        "subscription_status": "active",
                        "activated_at": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    },
                    "$unset": {
                        "pending_tier": ""
                    }
                }
            )

            # Remove pending subscription record
            await db.pending_subscriptions.delete_one({
                "subscription_id": subscription_id
            })

            print(f"✅ Webhook: Activated {pending_tier} tier for user {user['uid']}")

        elif event_type == "BILLING.SUBSCRIPTION.CANCELLED":
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "cancelled",
                            "subscription_tier": SubscriptionTier.FREE.value,
                            "cancelled_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                print(f"❌ Webhook: Cancelled subscription for user {user['uid']}")

        elif event_type == "BILLING.SUBSCRIPTION.SUSPENDED":
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "suspended",
                            "suspended_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                print(f"⏸️ Webhook: Suspended subscription for user {user['uid']}")

        elif event_type == "BILLING.SUBSCRIPTION.EXPIRED":
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "expired",
                            "subscription_tier": SubscriptionTier.FREE.value,
                            "expired_at": datetime.utcnow(),
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                print(f"🔚 Webhook: Expired subscription for user {user['uid']}")

        elif event_type == "PAYMENT.SALE.COMPLETED":
            # Log successful payment
            await db.payment_history.insert_one({
                "event_id": event_id,
                "transaction_id": resource.get("id"),
                "amount": resource.get("amount"),
                "currency": resource.get("amount", {}).get("currency"),
                "billing_agreement_id": resource.get("billing_agreement_id"),
                "status": "completed",
                "completed_at": datetime.utcnow()
            })
            print(f"💰 Webhook: Payment completed {resource.get('id')}")

        elif event_type == "PAYMENT.SALE.DENIED":
            # Log failed payment attempt
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "payment_failed",
                            "updated_at": datetime.utcnow()
                        }
                    }
                )

            await db.payment_history.insert_one({
                "event_id": event_id,
                "transaction_id": resource.get("id"),
                "amount": resource.get("amount"),
                "currency": resource.get("amount", {}).get("currency"),
                "billing_agreement_id": resource.get("billing_agreement_id"),
                "status": "denied",
                "reason": resource.get("reason_code"),
                "denied_at": datetime.utcnow()
            })
            print(f"❌ Webhook: Payment denied {resource.get('id')}")

        # Mark webhook as successfully processed
        await db.webhook_events.update_one(
            {"event_id": event_id},
            {
                "$set": {
                    "processed": True,
                    "processed_at": datetime.utcnow(),
                    "event_type": event_type,
                    "resource": resource
                }
            }
        )

        return {
            "status": "success",
            "event_type": event_type,
            "event_id": event_id
        }

    except HTTPException:
        # Re-raise HTTP exceptions (security failures)
        raise
    except Exception as e:
        print(f"🚨 Webhook processing error: {str(e)}")
        # Log error for investigation
        db = get_database()
        await db.webhook_errors.insert_one({
            "error": str(e),
            "event_type": body.get("event_type") if 'body' in locals() else None,
            "timestamp": datetime.utcnow()
        })
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Webhook processing failed: {str(e)}"
        )


@router.get("/subscription-status")
async def get_subscription_status(current_user: dict = Depends(get_current_user)):
    """
    Get current user's subscription status.
    """
    db = get_database()
    user = await db.users.find_one({"uid": current_user["uid"]})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "tier": user.get("subscription_tier", SubscriptionTier.FREE.value),
        "status": user.get("subscription_status", "active"),
        "subscription_id": user.get("subscription_id"),
        "start_date": user.get("subscription_start_date"),
        "end_date": user.get("subscription_end_date")
    }


@router.post("/cancel-subscription")
async def cancel_subscription(current_user: dict = Depends(get_current_user)):
    """
    Cancel user's PayPal subscription.
    """
    db = get_database()
    user = await db.users.find_one({"uid": current_user["uid"]})
    
    if not user or not user.get("subscription_id"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active subscription found"
        )
    
    try:
        # Cancel PayPal subscription
        billing_agreement = paypalrestsdk.BillingAgreement.find(user["subscription_id"])
        
        cancel_note = {
            "note": f"Subscription cancelled by user {current_user['email']}"
        }
        
        if not billing_agreement.cancel(cancel_note):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Cancellation failed: {billing_agreement.error}"
            )
        
        # Update database
        await db.users.update_one(
            {"uid": current_user["uid"]},
            {
                "$set": {
                    "subscription_status": "cancelled",
                    "subscription_tier": SubscriptionTier.FREE.value,
                    "cancelled_at": datetime.now(),
                    "updated_at": datetime.now()
                }
            }
        )
        
        return {
            "message": "Subscription cancelled successfully",
            "tier": SubscriptionTier.FREE.value,
            "status": "cancelled"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cancellation failed: {str(e)}"
        )
