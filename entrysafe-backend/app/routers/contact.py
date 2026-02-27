from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from app.database import get_database

router = APIRouter(prefix="/api", tags=["Contact"])

# Request Models
class ContactForm(BaseModel):
    """Contact form submission model"""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    """Contact form response model"""
    message: str
    id: str

# Endpoints
@router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(contact: ContactForm):
    """
    Submit a contact form (Public endpoint - No authentication required)
    
    - **name**: Contact person's name
    - **email**: Valid email address
    - **phone**: Optional phone number
    - **message**: Contact message
    """
    db = get_database()
    
    # Prepare contact data
    contact_data = contact.model_dump()
    contact_data.update({
        "submittedAt": datetime.utcnow(),
        "status": "new"
    })
    
    try:
        # Insert into database
        result = await db.contacts.insert_one(contact_data)
        
        return ContactResponse(
            message="Contact form submitted successfully",
            id=str(result.inserted_id)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to submit contact form: {str(e)}"
        )

@router.get("/contacts")
async def get_contact_submissions(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None
):
    """
    Get contact form submissions (Admin endpoint - Add authentication later)
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **status**: Filter by status (new, contacted, resolved)
    """
    db = get_database()
    
    # Build query filter
    query = {}
    if status:
        query["status"] = status
    
    try:
        # Fetch contacts from database
        contacts = await db.contacts.find(query).skip(skip).limit(limit).to_list(length=limit)
        
        # Convert ObjectId to string
        for contact in contacts:
            contact["_id"] = str(contact["_id"])
        
        return {
            "total": await db.contacts.count_documents(query),
            "contacts": contacts,
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch contacts: {str(e)}"
        )

@router.get("/contacts/{contact_id}")
async def get_contact_by_id(contact_id: str):
    """
    Get a specific contact submission by ID
    """
    from bson import ObjectId
    db = get_database()
    
    try:
        contact = await db.contacts.find_one({"_id": ObjectId(contact_id)})
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        contact["_id"] = str(contact["_id"])
        return contact
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch contact: {str(e)}"
        )

@router.put("/contacts/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    status: str
):
    """
    Update contact submission status (Admin endpoint)
    
    - **status**: new, contacted, or resolved
    """
    from bson import ObjectId
    db = get_database()
    
    # Validate status
    valid_statuses = ["new", "contacted", "resolved"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    try:
        result = await db.contacts.update_one(
            {"_id": ObjectId(contact_id)},
            {"$set": {"status": status, "updatedAt": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        return {"message": "Contact status updated successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update contact status: {str(e)}"
        )
