from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import get_current_user
from app.database import get_database
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
import uuid
import json

router = APIRouter(prefix="/api/cloud-backup", tags=["Cloud Backup"])

# ============================================================================
# MODELS
# ============================================================================

class BackupInitiateRequest(BaseModel):
    """Request to initiate backup to cloud provider"""
    provider: str = Field(..., description="Cloud provider: google_drive, onedrive, dropbox")
    include_documents: bool = Field(default=True, description="Include receipt/document files")
    include_transactions: bool = Field(default=True, description="Include all transactions")
    include_settings: bool = Field(default=True, description="Include company settings")

class BackupResponse(BaseModel):
    """Response with backup details"""
    backup_id: str
    status: str
    message: str
    oauth_url: Optional[str] = None
    timestamp: str

class BackupHistoryItem(BaseModel):
    """Backup history item"""
    backup_id: str
    provider: str
    created_at: str
    status: str
    file_count: int
    size_mb: float

class RestoreRequest(BaseModel):
    """Request to restore from backup"""
    backup_id: str
    provider: str
    restore_transactions: bool = True
    restore_documents: bool = True
    restore_settings: bool = False  # Careful with settings

# ============================================================================
# OAUTH URLS (Frontend handles actual OAuth, backend provides endpoints)
# ============================================================================

OAUTH_CONFIG = {
    "google_drive": {
        "name": "Google Drive",
        "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
        "scopes": ["https://www.googleapis.com/auth/drive.file"],
        "instructions": "Log in with your Google account to authorize backup access"
    },
    "onedrive": {
        "name": "Microsoft OneDrive",
        "auth_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
        "scopes": ["Files.ReadWrite"],
        "instructions": "Log in with your Microsoft account to authorize backup access"
    },
    "dropbox": {
        "name": "Dropbox",
        "auth_url": "https://www.dropbox.com/oauth2/authorize",
        "scopes": ["files.content.write", "files.content.read"],
        "instructions": "Log in with your Dropbox account to authorize backup access"
    }
}

# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/initiate", response_model=BackupResponse)
async def initiate_backup(
    request: BackupInitiateRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Initiate user cloud backup.
    
    This endpoint:
    1. Validates the cloud provider
    2. Creates a backup record in database
    3. Returns OAuth URL for user authorization (if needed)
    4. Prepares data for backup
    
    Frontend Flow:
    1. Call this endpoint
    2. Open OAuth URL in browser/webview
    3. User authorizes
    4. Frontend gets access token
    5. Call /execute endpoint with token
    """
    db = get_database()
    
    # Validate provider
    if request.provider not in OAUTH_CONFIG:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider. Choose from: {', '.join(OAUTH_CONFIG.keys())}"
        )
    
    # Create backup record
    backup_id = str(uuid.uuid4())
    backup_record = {
        "_id": backup_id,
        "userId": current_user["uid"],
        "provider": request.provider,
        "status": "pending_authorization",
        "includeDocuments": request.include_documents,
        "includeTransactions": request.include_transactions,
        "includeSettings": request.include_settings,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.backups.insert_one(backup_record)
    
    # Return OAuth instructions
    provider_config = OAUTH_CONFIG[request.provider]
    
    return BackupResponse(
        backup_id=backup_id,
        status="pending_authorization",
        message=f"Please authorize {provider_config['name']} access",
        oauth_url=None,  # Frontend handles OAuth flow
        timestamp=datetime.utcnow().isoformat()
    )

@router.post("/execute/{backup_id}")
async def execute_backup(
    backup_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Execute backup after OAuth authorization.
    
    This endpoint:
    1. Gathers user's data (transactions, documents, settings)
    2. Creates backup JSON file
    3. Returns backup data for Flutter to upload to cloud
    
    Note: Flutter app handles actual cloud upload using OAuth token.
    Backend just prepares the data.
    """
    db = get_database()
    
    # Get backup record
    backup = await db.backups.find_one({
        "_id": backup_id,
        "userId": current_user["uid"]
    })
    
    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )
    
    # Gather data to backup
    backup_data = {
        "backup_metadata": {
            "backup_id": backup_id,
            "user_id": current_user["uid"],
            "timestamp": datetime.utcnow().isoformat(),
            "app_version": "1.0.0",
            "data_version": "1"
        },
        "data": {}
    }
    
    # Include transactions if requested
    if backup.get("includeTransactions", True):
        transactions_cursor = db.transactions.find({"userId": current_user["uid"]})
        transactions = await transactions_cursor.to_list(length=10000)
        
        # Convert ObjectId to string for JSON serialization
        for txn in transactions:
            txn["_id"] = str(txn["_id"])
        
        backup_data["data"]["transactions"] = transactions
    
    # Include documents metadata if requested
    if backup.get("includeDocuments", True):
        documents_cursor = db.documents.find({"userId": current_user["uid"]})
        documents = await documents_cursor.to_list(length=1000)
        
        for doc in documents:
            doc["_id"] = str(doc["_id"])
        
        backup_data["data"]["documents"] = documents
    
    # Include settings if requested
    if backup.get("includeSettings", True):
        company = await db.companies.find_one({"userId": current_user["uid"]})
        if company:
            company["_id"] = str(company["_id"])
            backup_data["data"]["company_settings"] = company
    
    # Update backup record
    await db.backups.update_one(
        {"_id": backup_id},
        {
            "$set": {
                "status": "ready_to_upload",
                "fileCount": len(backup_data["data"].get("documents", [])),
                "transactionCount": len(backup_data["data"].get("transactions", [])),
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    # Return backup data (Flutter will upload to cloud)
    return {
        "backup_id": backup_id,
        "status": "ready_to_upload",
        "message": "Backup data prepared. Upload to cloud using your OAuth token.",
        "backup_data": backup_data,
        "size_estimate_mb": len(json.dumps(backup_data)) / (1024 * 1024)
    }

@router.post("/confirm/{backup_id}")
async def confirm_backup_uploaded(
    backup_id: str,
    cloud_file_id: str,
    file_size_bytes: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Confirm that Flutter successfully uploaded backup to cloud.
    
    After Flutter uploads to cloud, it calls this endpoint with:
    - cloud_file_id: The ID from Google Drive/OneDrive/Dropbox
    - file_size_bytes: Size of uploaded file
    
    This helps track backup history.
    """
    db = get_database()
    
    # Update backup record
    result = await db.backups.update_one(
        {"_id": backup_id, "userId": current_user["uid"]},
        {
            "$set": {
                "status": "completed",
                "cloudFileId": cloud_file_id,
                "sizeBytes": file_size_bytes,
                "completedAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )
    
    return {
        "status": "success",
        "message": "Backup confirmed and recorded",
        "backup_id": backup_id
    }

@router.get("/history", response_model=List[BackupHistoryItem])
async def backup_history(
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's backup history.
    
    Returns list of all backups with their status.
    """
    db = get_database()
    
    cursor = db.backups.find({"userId": current_user["uid"]}).sort("createdAt", -1).limit(50)
    backups = await cursor.to_list(length=50)
    
    return [
        BackupHistoryItem(
            backup_id=str(backup["_id"]),
            provider=backup.get("provider", "unknown"),
            created_at=backup.get("createdAt", datetime.utcnow()).isoformat(),
            status=backup.get("status", "unknown"),
            file_count=backup.get("fileCount", 0),
            size_mb=backup.get("sizeBytes", 0) / (1024 * 1024)
        )
        for backup in backups
    ]

@router.get("/status/{backup_id}")
async def backup_status(
    backup_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Check status of a specific backup.
    """
    db = get_database()
    
    backup = await db.backups.find_one({
        "_id": backup_id,
        "userId": current_user["uid"]
    })
    
    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )
    
    return {
        "backup_id": backup_id,
        "status": backup.get("status", "unknown"),
        "provider": backup.get("provider", "unknown"),
        "created_at": backup.get("createdAt", datetime.utcnow()).isoformat(),
        "size_mb": backup.get("sizeBytes", 0) / (1024 * 1024),
        "file_count": backup.get("fileCount", 0),
        "transaction_count": backup.get("transactionCount", 0)
    }

@router.get("/providers")
async def list_providers():
    """
    List supported cloud backup providers.
    
    Returns configuration for each provider.
    """
    return {
        "providers": [
            {
                "id": provider_id,
                "name": config["name"],
                "instructions": config["instructions"]
            }
            for provider_id, config in OAUTH_CONFIG.items()
        ]
    }

@router.delete("/{backup_id}")
async def delete_backup_record(
    backup_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete backup record from database.
    
    Note: This only deletes the metadata record.
    User must manually delete file from cloud storage.
    """
    db = get_database()
    
    result = await db.backups.delete_one({
        "_id": backup_id,
        "userId": current_user["uid"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )
    
    return {
        "status": "success",
        "message": "Backup record deleted (cloud file remains)"
    }

# ============================================================================
# RESTORE ENDPOINTS (Future Enhancement)
# ============================================================================

@router.post("/restore/validate")
async def validate_backup_file(
    backup_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Validate backup file before restore.
    
    Checks:
    - Data format is correct
    - No corrupted data
    - Compatible version
    """
    # Validate backup structure
    if "backup_metadata" not in backup_data:
        return {"valid": False, "error": "Missing backup metadata"}
    
    if "data" not in backup_data:
        return {"valid": False, "error": "Missing backup data"}
    
    metadata = backup_data["backup_metadata"]
    
    # Check version compatibility
    if metadata.get("data_version") != "1":
        return {
            "valid": False,
            "error": f"Incompatible backup version: {metadata.get('data_version')}"
        }
    
    # Count what's in the backup
    transaction_count = len(backup_data["data"].get("transactions", []))
    document_count = len(backup_data["data"].get("documents", []))
    
    return {
        "valid": True,
        "backup_id": metadata.get("backup_id"),
        "timestamp": metadata.get("timestamp"),
        "transaction_count": transaction_count,
        "document_count": document_count,
        "message": "Backup file is valid and ready to restore"
    }
