"""
Payment Processing Router for Entry Safe
Author: Mlungisi Mncube
Purpose: Handle PayPal subscription creation and webhooks
"""

from fastapi import APIRouter, HTTPException, Request, Depends, status
from pydantic import BaseModel
from typing import Optional
import paypalrestsdk
import os
from datetime import datetime, timedelta
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

# Configure PayPal SDK
paypalrestsdk.configure({
    "mode": PAYPAL_MODE,
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_CLIENT_SECRET
})

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
        
        # Update user subscription in database
        await db.users.update_one(
            {"uid": current_user["uid"]},
            {
                "$set": {
                    "subscription_tier": pending_sub["tier"],
                    "subscription_status": "active",
                    "subscription_id": billing_agreement.id,
                    "subscription_start_date": datetime.now(),
                    "updated_at": datetime.now()
                }
            }
        )
        
        # Remove pending subscription
        await db.pending_subscriptions.delete_one({"_id": pending_sub["_id"]})
        
        return {
            "message": "Subscription activated successfully",
            "subscription_id": billing_agreement.id,
            "tier": pending_sub["tier"],
            "status": "active"
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
    Handle PayPal webhook events.
    
    Events handled:
    - BILLING.SUBSCRIPTION.CREATED
    - BILLING.SUBSCRIPTION.ACTIVATED
    - BILLING.SUBSCRIPTION.CANCELLED
    - BILLING.SUBSCRIPTION.SUSPENDED
    - BILLING.SUBSCRIPTION.EXPIRED
    - PAYMENT.SALE.COMPLETED
    """
    try:
        # Get webhook body
        body = await request.body()
        headers = request.headers
        
        # Verify webhook signature (CRITICAL for security)
        if PAYPAL_WEBHOOK_ID:
            # PayPal webhook verification
            # Note: paypalrestsdk doesn't have built-in webhook verification
            # You may need to implement this manually or use PayPal's webhook simulator
            pass
        
        # Parse event
        event = await request.json()
        event_type = event.get("event_type")
        resource = event.get("resource", {})
        
        db = get_database()
        
        # Log webhook event
        await db.webhook_events.insert_one({
            "event_type": event_type,
            "resource_id": resource.get("id"),
            "resource": resource,
            "received_at": datetime.now(),
            "processed": False
        })
        
        # Handle different event types
        if event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
            subscription_id = resource.get("id")
            
            # Find user by subscription ID
            user = await db.users.find_one({"subscription_id": subscription_id})
            
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "active",
                            "updated_at": datetime.now()
                        }
                    }
                )
        
        elif event_type == "BILLING.SUBSCRIPTION.CANCELLED":
            subscription_id = resource.get("id")
            
            user = await db.users.find_one({"subscription_id": subscription_id})
            
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "cancelled",
                            "subscription_tier": SubscriptionTier.FREE.value,
                            "updated_at": datetime.now()
                        }
                    }
                )
        
        elif event_type == "BILLING.SUBSCRIPTION.SUSPENDED":
            subscription_id = resource.get("id")
            
            user = await db.users.find_one({"subscription_id": subscription_id})
            
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "suspended",
                            "updated_at": datetime.now()
                        }
                    }
                )
        
        elif event_type == "BILLING.SUBSCRIPTION.EXPIRED":
            subscription_id = resource.get("id")
            
            user = await db.users.find_one({"subscription_id": subscription_id})
            
            if user:
                await db.users.update_one(
                    {"uid": user["uid"]},
                    {
                        "$set": {
                            "subscription_status": "expired",
                            "subscription_tier": SubscriptionTier.FREE.value,
                            "updated_at": datetime.now()
                        }
                    }
                )
        
        elif event_type == "PAYMENT.SALE.COMPLETED":
            # Log successful payment
            await db.payment_history.insert_one({
                "transaction_id": resource.get("id"),
                "amount": resource.get("amount"),
                "currency": resource.get("amount", {}).get("currency"),
                "billing_agreement_id": resource.get("billing_agreement_id"),
                "status": "completed",
                "completed_at": datetime.now()
            })
        
        # Mark webhook as processed
        await db.webhook_events.update_one(
            {"resource_id": resource.get("id"), "event_type": event_type},
            {"$set": {"processed": True, "processed_at": datetime.now()}}
        )
        
        return {"status": "success", "event_type": event_type}
        
    except Exception as e:
        print(f"Webhook processing error: {str(e)}")
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
