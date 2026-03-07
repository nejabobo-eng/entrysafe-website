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

# AI Transaction Auto-Creation Models
class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    EXECUTED = "executed"
    REJECTED = "rejected"

class TransactionData(BaseModel):
    """Structured transaction data returned by AI for auto-creation"""
    transactionType: TransactionType
    amount: float = Field(gt=0, description="Transaction amount in ZAR")
    currency: str = Field(default="ZAR", description="Currency code (always ZAR)")
    date: str = Field(description="Transaction date in ISO 8601 format (YYYY-MM-DD)")
    description: str = Field(min_length=1, max_length=500, description="Transaction description")
    category: Optional[str] = Field(default=None, description="Optional category for reporting")
    tags: List[str] = Field(default_factory=list, description="Optional tags for filtering")
    status: TransactionStatus = Field(default=TransactionStatus.PENDING, description="Transaction status")

    # Optional context fields
    userId: Optional[str] = Field(default=None, description="User ID for multi-user context")
    businessName: Optional[str] = Field(default=None, description="Business name for context")
    referenceId: Optional[str] = Field(default=None, description="Unique reference ID for audit logs")

class AITransactionResponse(BaseModel):
    """Standardized AI response for transaction auto-creation"""
    response: str = Field(description="Human-readable AI response message")
    data: TransactionData = Field(description="Structured transaction data for auto-creation")


# ============ COMPREHENSIVE ACCOUNTING MODELS ============
# Models for double-entry accounting system

from typing import Literal
import uuid
from datetime import timezone

class Company(BaseModel):
    """Company entity for accounting system"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    registration_number: str
    country: str
    currency: str = "ZAR"
    registration_date: str
    representative_name: Optional[str] = None
    tax_number: Optional[str] = None
    vat_number: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Account(BaseModel):
    """Chart of accounts entity"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    code: str  # e.g., "1000", "2000"
    name: str  # e.g., "Bank", "Accounts Payable"
    type: Literal["Asset", "Liability", "Equity", "Revenue", "Expense"]
    subtype: Optional[str] = None
    balance: float = 0.0
    currency: str = "ZAR"
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class JournalLine(BaseModel):
    """Individual line in a journal entry"""
    account_id: str
    account_code: str
    account_name: str
    debit: float = 0.0
    credit: float = 0.0
    description: Optional[str] = None


class JournalEntry(BaseModel):
    """Double-entry journal entry"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    user_id: str
    date: str  # ISO format
    reference: str  # e.g., "JE-000001"
    description: str
    lines: List[JournalLine]
    total_debit: float
    total_credit: float
    ai_generated: bool = False
    approved: bool = False
    approved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TransactionPreview(BaseModel):
    """Preview of AI-parsed transaction before approval"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    company_id: str
    user_id: str
    original_command: str
    parsed_data: dict
    journal_entry: JournalEntry
    status: str = "preview"  # preview, approved, rejected
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AICommandRequest(BaseModel):
    """Request for AI command processing"""
    user_id: str
    company_id: Optional[str] = None  # Optional - backend will auto-create if missing
    message: str


class AICommandResponse(BaseModel):
    """Response from AI command processing"""
    status: str  # preview, error
    preview_id: str
    transaction: dict
    message: str


class ApproveTransactionRequest(BaseModel):
    """Request to approve a previewed transaction"""
    preview_id: str
    user_id: str
    company_id: str


class ApproveTransactionResponse(BaseModel):
    """Response after approving transaction"""
    status: str  # approved, error
    journal_entry_id: str
    message: str
