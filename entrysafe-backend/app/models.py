from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    CLIENT = "client"

class SubscriptionTier(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PREMIUM = "premium"
    ANNUAL = "annual"

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.CLIENT

class UserCreate(UserBase):
    uid: str
    emailVerified: bool = False

class UserInDB(UserBase):
    uid: str
    createdAt: datetime
    emailVerified: bool
    lastLogin: Optional[datetime] = None
    subscriptionTier: SubscriptionTier = SubscriptionTier.FREE
    subscriptionStatus: str = "active"  # active, cancelled, expired
    subscriptionStartDate: Optional[datetime] = None
    subscriptionEndDate: Optional[datetime] = None
    registeredDevices: List[str] = []

class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    role: UserRole
    emailVerified: bool
    createdAt: datetime
    lastLogin: Optional[datetime] = None
    subscriptionTier: SubscriptionTier = SubscriptionTier.FREE
    subscriptionStatus: str = "active"

class DocumentBase(BaseModel):
    filename: str
    fileType: str
    fileSize: int
    userId: str

class DocumentCreate(DocumentBase):
    storagePath: str
    downloadUrl: Optional[str] = None

class DocumentInDB(DocumentBase):
    id: str
    storagePath: str
    uploadedAt: datetime
    downloadUrl: Optional[str] = None

class DocumentResponse(BaseModel):
    id: str
    filename: str
    fileType: str
    fileSize: int
    userId: str
    uploadedAt: datetime
    downloadUrl: Optional[str] = None

class AdminAction(BaseModel):
    adminId: str
    action: str
    targetUserId: Optional[str] = None
    targetDocumentId: Optional[str] = None
    details: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    submittedAt: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"  # new, contacted, resolved

class UpdateRoleRequest(BaseModel):
    role: UserRole

class ErrorResponse(BaseModel):
    detail: str
