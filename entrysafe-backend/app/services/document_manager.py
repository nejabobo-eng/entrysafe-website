from fastapi import UploadFile, HTTPException
from pathlib import Path
import uuid
import os
import logging
from typing import Optional, List
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Document storage directory (Render uses ephemeral storage, but this works for now)
# For production, should integrate with Firebase Storage or S3
DOCUMENTS_DIR = Path("/tmp/documents")
DOCUMENTS_DIR.mkdir(exist_ok=True, parents=True)


class Document:
    """Document model"""
    def __init__(
        self,
        id: str,
        company_id: str,
        user_id: str,
        filename: str,
        original_filename: str,
        file_type: str,
        file_path: str,
        file_size: int,
        mime_type: str,
        journal_entry_id: Optional[str] = None,
        transaction_id: Optional[str] = None,
        uploaded_at: datetime = None
    ):
        self.id = id
        self.company_id = company_id
        self.user_id = user_id
        self.filename = filename
        self.original_filename = original_filename
        self.file_type = file_type
        self.file_path = file_path
        self.file_size = file_size
        self.mime_type = mime_type
        self.journal_entry_id = journal_entry_id
        self.transaction_id = transaction_id
        self.uploaded_at = uploaded_at or datetime.now(timezone.utc)
    
    def model_dump(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "user_id": self.user_id,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_type": self.file_type,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "mime_type": self.mime_type,
            "journal_entry_id": self.journal_entry_id,
            "transaction_id": self.transaction_id,
            "uploaded_at": self.uploaded_at
        }


class DocumentManager:
    """Manage document uploads and storage"""
    
    def __init__(self, db):
        self.db = db
        self.storage_dir = DOCUMENTS_DIR
    
    async def upload_document(
        self,
        file: UploadFile,
        company_id: str,
        user_id: str,
        file_type: str = "other",
        journal_entry_id: Optional[str] = None,
        transaction_id: Optional[str] = None
    ) -> Document:
        """
        Upload a document and save to storage.
        
        Args:
            file: Uploaded file
            company_id: Company ID
            user_id: User ID
            file_type: Type of document (invoice, receipt, bank_statement, other)
            journal_entry_id: Optional journal entry to link
            transaction_id: Optional transaction to link
        """
        
        try:
            # Validate file type
            allowed_types = ["invoice", "receipt", "bank_statement", "other"]
            if file_type not in allowed_types:
                raise ValueError(f"Invalid file_type. Must be one of: {allowed_types}")
            
            # Generate unique filename
            file_extension = Path(file.filename).suffix
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            
            # Create company directory
            company_dir = self.storage_dir / company_id
            company_dir.mkdir(exist_ok=True, parents=True)
            
            # Save file
            file_path = company_dir / unique_filename
            
            contents = await file.read()
            with open(file_path, "wb") as f:
                f.write(contents)
            
            # Create document record
            document = Document(
                id=str(uuid.uuid4()),
                company_id=company_id,
                user_id=user_id,
                filename=unique_filename,
                original_filename=file.filename,
                file_type=file_type,
                file_path=str(file_path),
                file_size=len(contents),
                mime_type=file.content_type or "application/octet-stream",
                journal_entry_id=journal_entry_id,
                transaction_id=transaction_id,
                uploaded_at=datetime.now(timezone.utc)
            )
            
            # Save to database
            doc_dict = document.model_dump()
            doc_dict['uploaded_at'] = doc_dict['uploaded_at'].isoformat()
            
            await self.db.documents.insert_one(doc_dict)
            
            logger.info(f"Document uploaded: {document.id} ({file.filename})")
            
            return document
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")
    
    async def get_document(self, document_id: str, company_id: str) -> Optional[Document]:
        """Get document metadata by ID"""
        
        doc = await self.db.documents.find_one({
            "id": document_id,
            "company_id": company_id
        }, {"_id": 0})
        
        if not doc:
            return None
        
        if isinstance(doc.get('uploaded_at'), str):
            doc['uploaded_at'] = datetime.fromisoformat(doc['uploaded_at'])
        
        return Document(**doc)
    
    async def get_documents_by_journal_entry(
        self,
        journal_entry_id: str,
        company_id: str
    ) -> List[Document]:
        """Get all documents linked to a journal entry"""
        
        docs = await self.db.documents.find({
            "journal_entry_id": journal_entry_id,
            "company_id": company_id
        }, {"_id": 0}).to_list(100)
        
        documents = []
        for doc in docs:
            if isinstance(doc.get('uploaded_at'), str):
                doc['uploaded_at'] = datetime.fromisoformat(doc['uploaded_at'])
            documents.append(Document(**doc))
        
        return documents
    
    async def get_company_documents(
        self,
        company_id: str,
        file_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Document]:
        """Get all documents for a company"""
        
        query = {"company_id": company_id}
        if file_type:
            query["file_type"] = file_type
        
        docs = await self.db.documents.find(
            query,
            {"_id": 0}
        ).sort("uploaded_at", -1).limit(limit).to_list(limit)
        
        documents = []
        for doc in docs:
            if isinstance(doc.get('uploaded_at'), str):
                doc['uploaded_at'] = datetime.fromisoformat(doc['uploaded_at'])
            documents.append(Document(**doc))
        
        return documents
    
    async def delete_document(self, document_id: str, company_id: str) -> bool:
        """Delete a document"""
        
        # Get document
        document = await self.get_document(document_id, company_id)
        if not document:
            return False
        
        # Delete file from storage
        try:
            file_path = Path(document.file_path)
            if file_path.exists():
                file_path.unlink()
        except Exception as e:
            logger.error(f"Error deleting file: {str(e)}")
        
        # Delete from database
        result = await self.db.documents.delete_one({
            "id": document_id,
            "company_id": company_id
        })
        
        return result.deleted_count > 0
    
    def get_file_path(self, document: Document) -> Path:
        """Get the file system path for a document"""
        return Path(document.file_path)
