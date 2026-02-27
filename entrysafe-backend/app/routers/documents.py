from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.auth import get_current_user
from app.database import get_database
from app.models import DocumentResponse, DocumentCreate
from datetime import datetime, timedelta
from typing import List
import uuid

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.get("/", response_model=List[DocumentResponse])
async def get_user_documents(current_user: dict = Depends(get_current_user)):
    """Get all documents for current user"""
    db = get_database()
    
    cursor = db.documents.find({"userId": current_user["uid"]})
    documents = await cursor.to_list(length=100)
    
    return [
        DocumentResponse(
            id=str(doc["_id"]),
            filename=doc["filename"],
            fileType=doc["fileType"],
            fileSize=doc["fileSize"],
            userId=doc["userId"],
            uploadedAt=doc["uploadedAt"],
            downloadUrl=doc.get("downloadUrl")
        )
        for doc in documents
    ]

@router.get("/{document_id}/download-url")
async def get_download_url(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get signed download URL for a document (expires in 5 minutes)"""
    db = get_database()
    
    from bson import ObjectId
    
    try:
        doc = await db.documents.find_one({
            "_id": ObjectId(document_id),
            "userId": current_user["uid"]
        })
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document ID"
        )
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or access denied"
        )
    
    # Generate signed URL (expires in 5 minutes)
    # In production, this would use Firebase Storage signed URLs
    # For now, return a placeholder URL
    signed_url = f"https://storage.googleapis.com/entrysafe/{doc['storagePath']}?token={uuid.uuid4()}"
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    
    # Log download activity
    await db.downloads.insert_one({
        "documentId": document_id,
        "userId": current_user["uid"],
        "downloadedAt": datetime.utcnow()
    })
    
    return {
        "downloadUrl": signed_url,
        "expiresAt": expires_at.isoformat(),
        "filename": doc["filename"]
    }

@router.post("/upload", response_model=DocumentResponse)
async def upload_document_metadata(
    document: DocumentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Upload document metadata (admin only or own documents)"""
    db = get_database()
    
    # Check if user is uploading for themselves or is admin
    user_doc = await db.users.find_one({"uid": current_user["uid"]})
    is_admin = user_doc and user_doc.get("role") == "admin"
    
    if document.userId != current_user["uid"] and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot upload documents for other users"
        )
    
    doc_dict = {
        "filename": document.filename,
        "fileType": document.fileType,
        "fileSize": document.fileSize,
        "userId": document.userId,
        "storagePath": document.storagePath,
        "uploadedAt": datetime.utcnow(),
        "downloadUrl": document.downloadUrl
    }
    
    result = await db.documents.insert_one(doc_dict)
    doc_dict["id"] = str(result.inserted_id)
    
    return DocumentResponse(**doc_dict)

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a document"""
    db = get_database()
    
    from bson import ObjectId
    
    try:
        # Find document
        doc = await db.documents.find_one({"_id": ObjectId(document_id)})
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid document ID"
        )
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check permissions (owner or admin)
    user_doc = await db.users.find_one({"uid": current_user["uid"]})
    is_admin = user_doc and user_doc.get("role") == "admin"
    
    if doc["userId"] != current_user["uid"] and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Delete document
    await db.documents.delete_one({"_id": ObjectId(document_id)})
    
    return {"message": "Document deleted successfully"}
