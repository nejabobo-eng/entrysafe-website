from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from typing import List, Optional
from datetime import datetime
import logging

from app.database import get_database
from app.auth import get_current_user
from app.models import (
    Company, Account, JournalEntry, TransactionPreview,
    AICommandRequest, AICommandResponse,
    ApproveTransactionRequest, ApproveTransactionResponse
)
from app.services.accounting_engine import AccountingEngine
from app.services.ai_parser import AIAccountingParser
from app.services.reports_generator import ReportsGenerator
from app.services.document_manager import DocumentManager
from app.services.registers_generator import RegistersGenerator

logger = logging.getLogger(__name__)

# Create router with /api prefix
api_router = APIRouter(prefix="/api", tags=["accounting"])


# ============ AI COMMAND CENTER ============

@api_router.post("/ai-command", response_model=AICommandResponse)
async def process_ai_command(
    request: AICommandRequest,
    db=Depends(get_database)
):
    """
    Process natural language accounting command and return preview.

    AUTO-CREATES company if user doesn't have one yet!

    Example:
    {
        "user_id": "user123",
        "company_id": "company456",  // Optional - will auto-create if missing
        "message": "Add 1500 rand income from consulting"
    }
    """

    try:
        # Initialize services
        accounting_engine = AccountingEngine(db)
        ai_parser = AIAccountingParser()

        # AUTO-FIND OR CREATE COMPANY for this user
        company_id = request.company_id
        company_doc = None

        if company_id:
            # Try to find by company_id
            company_doc = await db.companies.find_one({"id": company_id})

        if not company_doc:
            # Try to find by user_id (owner_uid)
            company_doc = await db.companies.find_one({"owner_uid": request.user_id})

            if company_doc:
                company_id = company_doc["id"]
                logger.info(f"Found existing company for user {request.user_id}: {company_id}")
            else:
                # AUTO-CREATE COMPANY for new user
                logger.info(f"Auto-creating company for user {request.user_id}")

                import uuid
                from datetime import datetime

                company_id = str(uuid.uuid4())
                company_doc = {
                    "id": company_id,
                    "owner_uid": request.user_id,
                    "name": "My Company",  # User can update in settings
                    "currency": "ZAR",
                    "country": "South Africa",
                    "created_at": datetime.now(),
                    "status": "active"
                }

                await db.companies.insert_one(company_doc)

                # Create default 20 accounts
                await accounting_engine.create_default_accounts(company_id)

                logger.info(f"Company auto-created: {company_id}")

        currency = company_doc.get("currency", "ZAR")

        # Parse command with AI
        result = await ai_parser.parse_accounting_command(
            command=request.message,
            company_id=company_id,
            currency=currency
        )

        if not result["success"]:
            return AICommandResponse(
                status="error",
                preview_id="",
                transaction={},
                message=f"Failed to parse command: {result.get('error', 'Unknown error')}"
            )

        parsed_data = result["data"]

        # Validate transaction
        validation = await ai_parser.validate_transaction(parsed_data)
        if not validation["valid"]:
            return AICommandResponse(
                status="error",
                preview_id="",
                transaction={},
                message=f"Validation errors: {', '.join(validation['errors'])}"
            )
        
        # Create journal entry (not posted yet)
        journal_entry = await accounting_engine.create_journal_entry(
            company_id=request.company_id,
            user_id=request.user_id,
            description=parsed_data["description"],
            lines=parsed_data["journal_lines"],
            date=parsed_data["date"],
            ai_generated=True
        )
        
        # Create transaction preview
        preview = TransactionPreview(
            company_id=request.company_id,
            user_id=request.user_id,
            original_command=request.message,
            parsed_data=parsed_data,
            journal_entry=journal_entry
        )
        
        # Save preview to database
        preview_doc = preview.model_dump()
        preview_doc['created_at'] = preview_doc['created_at'].isoformat()
        preview_doc['journal_entry']['created_at'] = preview_doc['journal_entry']['created_at'].isoformat()
        
        await db.transaction_previews.insert_one(preview_doc)
        
        # Return preview response
        return AICommandResponse(
            status="preview",
            preview_id=preview.id,
            transaction={
                "description": parsed_data["description"],
                "amount": parsed_data["amount"],
                "currency": parsed_data.get("currency", currency),
                "date": parsed_data["date"],
                "type": parsed_data["transaction_type"],
                "journal_lines": parsed_data["journal_lines"],
                "reference": journal_entry.reference
            },
            message="✅ Transaction parsed successfully. Please review and approve."
        )
        
    except Exception as e:
        logger.error(f"Error processing AI command: {str(e)}")
        return AICommandResponse(
            status="error",
            preview_id="",
            transaction={},
            message=f"Error: {str(e)}"
        )


@api_router.post("/approve-transaction", response_model=ApproveTransactionResponse)
async def approve_transaction(
    request: ApproveTransactionRequest,
    db=Depends(get_database)
):
    """
    Approve and post a previewed transaction to the journal.
    """
    
    try:
        accounting_engine = AccountingEngine(db)
        
        # Get preview
        preview_doc = await db.transaction_previews.find_one({
            "id": request.preview_id,
            "company_id": request.company_id
        })
        
        if not preview_doc:
            raise HTTPException(status_code=404, detail="Transaction preview not found")
        
        # Check if already approved
        if preview_doc.get("status") == "approved":
            raise HTTPException(status_code=400, detail="Transaction already approved")
        
        # Reconstruct journal entry
        journal_data = preview_doc["journal_entry"]
        journal_data['created_at'] = datetime.fromisoformat(journal_data['created_at'])
        
        journal_entry = JournalEntry(**journal_data)
        
        # Post to journal
        journal_entry_id = await accounting_engine.post_journal_entry(journal_entry)
        
        # Update preview status
        await db.transaction_previews.update_one(
            {"id": request.preview_id},
            {"$set": {"status": "approved"}}
        )
        
        return ApproveTransactionResponse(
            status="approved",
            journal_entry_id=journal_entry_id,
            message=f"✅ Transaction approved and posted to journal (Reference: {journal_entry.reference})"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error approving transaction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ CHART OF ACCOUNTS ============

@api_router.get("/chart-of-accounts", response_model=List[Account])
async def get_chart_of_accounts(
    company_id: str,
    db=Depends(get_database)
):
    """Get all accounts for a company"""
    
    try:
        accounts = await db.chart_of_accounts.find(
            {"company_id": company_id, "is_active": True},
            {"_id": 0}
        ).sort("code", 1).to_list(1000)
        
        for acc in accounts:
            if isinstance(acc.get('created_at'), str):
                acc['created_at'] = datetime.fromisoformat(acc['created_at'])
        
        return accounts
        
    except Exception as e:
        logger.error(f"Error fetching chart of accounts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/account-balance")
async def get_account_balance(
    company_id: str,
    account_name: str,
    db=Depends(get_database)
):
    """Get balance of a specific account"""
    
    try:
        accounting_engine = AccountingEngine(db)
        balance = await accounting_engine.get_account_balance(company_id, account_name)
        
        return {
            "company_id": company_id,
            "account_name": account_name,
            "balance": balance
        }
        
    except Exception as e:
        logger.error(f"Error fetching account balance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ JOURNAL ENTRIES ============

@api_router.get("/journal-entries", response_model=List[JournalEntry])
async def get_journal_entries(
    company_id: str,
    approved_only: bool = True,
    limit: int = 100,
    db=Depends(get_database)
):
    """Get journal entries for a company"""
    
    try:
        query = {"company_id": company_id}
        if approved_only:
            query["approved"] = True
        
        entries = await db.journal_entries.find(
            query,
            {"_id": 0}
        ).sort("date", -1).limit(limit).to_list(limit)
        
        for entry in entries:
            if isinstance(entry.get('created_at'), str):
                entry['created_at'] = datetime.fromisoformat(entry['created_at'])
            if isinstance(entry.get('approved_at'), str):
                entry['approved_at'] = datetime.fromisoformat(entry['approved_at'])
        
        return entries
        
    except Exception as e:
        logger.error(f"Error fetching journal entries: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ REGISTERS ============

@api_router.get("/register/{register_type}")
async def get_register(
    company_id: str,
    register_type: str,
    limit: int = 100,
    db=Depends(get_database)
):
    """Get register entries (Bank or Cash)"""
    
    try:
        registers_generator = RegistersGenerator(db)
        
        if register_type.lower() == "bank":
            return await registers_generator.get_bank_register(company_id, limit=limit)
        elif register_type.lower() == "cash":
            return await registers_generator.get_cash_register(company_id, limit=limit)
        else:
            raise HTTPException(status_code=400, detail=f"Invalid register type: {register_type}")
        
    except Exception as e:
        logger.error(f"Error fetching register: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/registers/sales-ledger")
async def get_sales_ledger(
    company_id: str,
    start_date: str,
    end_date: str,
    db=Depends(get_database)
):
    """Get Sales Ledger"""
    
    try:
        registers_generator = RegistersGenerator(db)
        return await registers_generator.generate_sales_ledger(company_id, start_date, end_date)
    except Exception as e:
        logger.error(f"Error generating sales ledger: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/registers/expenses")
async def get_expenses_register(
    company_id: str,
    start_date: str,
    end_date: str,
    db=Depends(get_database)
):
    """Get Expenses Register"""
    
    try:
        registers_generator = RegistersGenerator(db)
        return await registers_generator.generate_expenses_register(company_id, start_date, end_date)
    except Exception as e:
        logger.error(f"Error generating expenses register: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ COMPANY MANAGEMENT ============

@api_router.post("/company")
async def create_company(
    company: Company,
    db=Depends(get_database)
):
    """Create a new company and initialize chart of accounts"""
    
    try:
        accounting_engine = AccountingEngine(db)
        
        # Save company
        company_doc = company.model_dump()
        company_doc['created_at'] = company_doc['created_at'].isoformat()
        
        await db.companies.insert_one(company_doc)
        
        # Initialize chart of accounts
        await accounting_engine.initialize_chart_of_accounts(company.id)
        
        return {
            "status": "success",
            "message": "Company created and chart of accounts initialized",
            "company_id": company.id
        }
        
    except Exception as e:
        logger.error(f"Error creating company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/company/{company_id}")
async def get_company(
    company_id: str,
    db=Depends(get_database)
):
    """Get company details"""
    
    try:
        company_doc = await db.companies.find_one({"id": company_id}, {"_id": 0})
        
        if not company_doc:
            raise HTTPException(status_code=404, detail="Company not found")
        
        return company_doc
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.put("/company/{company_id}")
async def update_company(
    company_id: str,
    updates: dict,
    db=Depends(get_database)
):
    """Update company settings"""
    
    try:
        # Allowed fields to update
        allowed_fields = [
            "name", "registration_number", "country", "currency",
            "registration_date", "representative_name", "tax_number", "vat_number"
        ]
        
        # Filter to only allowed fields
        filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
        
        if not filtered_updates:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        result = await db.companies.update_one(
            {"id": company_id},
            {"$set": filtered_updates}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Company not found")
        
        return {
            "status": "success",
            "message": "Company settings updated successfully",
            "updated_fields": list(filtered_updates.keys())
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating company: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ REPORTS ============

@api_router.get("/reports/income-statement")
async def get_income_statement(
    company_id: str,
    start_date: str,
    end_date: str,
    format: str = "json",
    db=Depends(get_database)
):
    """Generate Income Statement"""
    
    try:
        reports_generator = ReportsGenerator(db)
        
        if format == "pdf":
            pdf_bytes = await reports_generator.generate_income_statement(
                company_id=company_id,
                start_date=start_date,
                end_date=end_date,
                format="pdf"
            )
            
            return StreamingResponse(
                iter([pdf_bytes]),
                media_type="application/pdf",
                headers={
                    "Content-Disposition": f"attachment; filename=income_statement_{start_date}_to_{end_date}.pdf"
                }
            )
        else:
            statement = await reports_generator.generate_income_statement(
                company_id=company_id,
                start_date=start_date,
                end_date=end_date,
                format="json"
            )
            return statement
        
    except Exception as e:
        logger.error(f"Error generating income statement: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/reports/balance-sheet")
async def get_balance_sheet(
    company_id: str,
    as_of_date: str,
    format: str = "json",
    db=Depends(get_database)
):
    """Generate Balance Sheet"""
    
    try:
        reports_generator = ReportsGenerator(db)
        statement = await reports_generator.generate_balance_sheet(
            company_id=company_id,
            as_of_date=as_of_date,
            format=format
        )
        return statement
        
    except Exception as e:
        logger.error(f"Error generating balance sheet: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/reports/trial-balance")
async def get_trial_balance(
    company_id: str,
    as_of_date: str,
    format: str = "json",
    db=Depends(get_database)
):
    """Generate Trial Balance"""
    
    try:
        reports_generator = ReportsGenerator(db)
        trial_balance = await reports_generator.generate_trial_balance(
            company_id=company_id,
            as_of_date=as_of_date,
            format=format
        )
        return trial_balance
        
    except Exception as e:
        logger.error(f"Error generating trial balance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ TRANSACTIONS LIST ============

@api_router.get("/transactions/list")
async def get_transaction_list(
    company_id: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    transaction_type: Optional[str] = None,
    reference: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db=Depends(get_database)
):
    """Get filtered transaction list (journal entries)"""
    
    try:
        query = {"company_id": company_id, "approved": True}
        
        if start_date or end_date:
            date_query = {}
            if start_date:
                date_query["$gte"] = start_date
            if end_date:
                date_query["$lte"] = end_date
            query["date"] = date_query
        
        if reference:
            query["reference"] = reference
        
        total_count = await db.journal_entries.count_documents(query)
        
        transactions = await db.journal_entries.find(
            query,
            {"_id": 0}
        ).sort("date", -1).skip(offset).limit(limit).to_list(limit)
        
        for txn in transactions:
            if isinstance(txn.get('created_at'), str):
                txn['created_at'] = datetime.fromisoformat(txn['created_at'])
            if isinstance(txn.get('approved_at'), str):
                txn['approved_at'] = datetime.fromisoformat(txn['approved_at'])
        
        return {
            "total_count": total_count,
            "limit": limit,
            "offset": offset,
            "count": len(transactions),
            "transactions": transactions
        }
        
    except Exception as e:
        logger.error(f"Error fetching transaction list: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ DOCUMENTS ============

@api_router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    company_id: str = Form(...),
    user_id: str = Form(...),
    file_type: str = Form("other"),
    journal_entry_id: Optional[str] = Form(None),
    transaction_id: Optional[str] = Form(None),
    db=Depends(get_database)
):
    """Upload a document (invoice, receipt, bank statement)"""
    
    try:
        document_manager = DocumentManager(db)
        
        document = await document_manager.upload_document(
            file=file,
            company_id=company_id,
            user_id=user_id,
            file_type=file_type,
            journal_entry_id=journal_entry_id,
            transaction_id=transaction_id
        )
        
        return {
            "status": "success",
            "message": "Document uploaded successfully",
            "document": document.model_dump()
        }
        
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/documents")
async def list_documents(
    company_id: str,
    file_type: Optional[str] = None,
    journal_entry_id: Optional[str] = None,
    limit: int = 100,
    db=Depends(get_database)
):
    """List documents for a company"""
    
    try:
        document_manager = DocumentManager(db)
        
        if journal_entry_id:
            documents = await document_manager.get_documents_by_journal_entry(
                journal_entry_id=journal_entry_id,
                company_id=company_id
            )
        else:
            documents = await document_manager.get_company_documents(
                company_id=company_id,
                file_type=file_type,
                limit=limit
            )
        
        return {
            "count": len(documents),
            "documents": [doc.model_dump() for doc in documents]
        }
        
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ============ HEALTH CHECK ============

@api_router.get("/accounting/health")
async def accounting_health_check(db=Depends(get_database)):
    """Health check for accounting module"""
    try:
        await db.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "accounting_engine": "operational",
            "ai_parser": "operational",
            "reports": "operational"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }
