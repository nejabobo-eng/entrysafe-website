from typing import List, Dict, Tuple
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)


class AccountingEngine:
    """Core accounting engine with double-entry bookkeeping logic"""
    
    # Standard account types and their normal balance
    ACCOUNT_TYPES = {
        "Asset": "debit",      # Assets increase with debits
        "Expense": "debit",    # Expenses increase with debits
        "Liability": "credit", # Liabilities increase with credits
        "Equity": "credit",    # Equity increases with credits
        "Revenue": "credit"    # Revenue increases with credits
    }
    
    def __init__(self, db):
        self.db = db
    
    async def get_account_by_name(self, company_id: str, account_name: str):
        """Get account by name"""
        from app.models import Account
        
        account_doc = await self.db.chart_of_accounts.find_one({
            "company_id": company_id,
            "name": account_name,
            "is_active": True
        })
        
        if not account_doc:
            raise ValueError(f"Account '{account_name}' not found")
        
        # Convert datetime strings back to datetime objects
        if isinstance(account_doc.get('created_at'), str):
            account_doc['created_at'] = datetime.fromisoformat(account_doc['created_at'])
        
        return Account(**account_doc)
    
    async def create_journal_entry(
        self,
        company_id: str,
        user_id: str,
        description: str,
        lines: List[Dict],
        date: str,
        ai_generated: bool = False
    ):
        """
        Create a journal entry with double-entry validation.
        
        Args:
            lines: List of dicts with {"account_name": str, "debit": float, "credit": float, "description": str}
        """
        from app.models import JournalEntry, JournalLine
        
        # Generate reference number
        count = await self.db.journal_entries.count_documents({"company_id": company_id})
        reference = f"JE-{count + 1:06d}"
        
        # Build journal lines
        journal_lines = []
        total_debit = 0.0
        total_credit = 0.0
        
        for line in lines:
            # Get account details
            account = await self.get_account_by_name(company_id, line["account_name"])
            
            debit = float(line.get("debit", 0.0))
            credit = float(line.get("credit", 0.0))
            
            journal_line = JournalLine(
                account_id=account.id,
                account_code=account.code,
                account_name=account.name,
                debit=debit,
                credit=credit,
                description=line.get("description", description)
            )
            
            journal_lines.append(journal_line)
            total_debit += debit
            total_credit += credit
        
        # Validate double-entry (debits must equal credits)
        if abs(total_debit - total_credit) > 0.01:  # Allow 1 cent rounding difference
            raise ValueError(
                f"Journal entry not balanced: Debits={total_debit}, Credits={total_credit}"
            )
        
        # Create journal entry
        journal_entry = JournalEntry(
            company_id=company_id,
            user_id=user_id,
            date=date,
            reference=reference,
            description=description,
            lines=[line.model_dump() for line in journal_lines],
            total_debit=total_debit,
            total_credit=total_credit,
            ai_generated=ai_generated,
            approved=False
        )
        
        return journal_entry
    
    async def post_journal_entry(self, journal_entry) -> str:
        """
        Post approved journal entry to the ledger and update account balances.
        """
        
        # Mark as approved
        journal_entry.approved = True
        journal_entry.approved_at = datetime.now(timezone.utc)
        
        # Save journal entry
        entry_doc = journal_entry.model_dump()
        entry_doc['created_at'] = entry_doc['created_at'].isoformat()
        entry_doc['approved_at'] = entry_doc['approved_at'].isoformat()
        
        await self.db.journal_entries.insert_one(entry_doc)
        
        # Update account balances
        for line in journal_entry.lines:
            # Handle both dict and JournalLine object
            if isinstance(line, dict):
                account_id = line["account_id"]
                debit = line["debit"]
                credit = line["credit"]
            else:
                account_id = line.account_id
                debit = line.debit
                credit = line.credit
            
            account = await self.db.chart_of_accounts.find_one({
                "id": account_id,
                "company_id": journal_entry.company_id
            })
            
            if not account:
                logger.error(f"Account {account_id} not found")
                continue
            
            # Update balance based on account type
            account_type = account["type"]
            normal_balance = self.ACCOUNT_TYPES.get(account_type, "debit")
            
            current_balance = account.get("balance", 0.0)
            
            if normal_balance == "debit":
                # For debit-normal accounts: debits increase, credits decrease
                new_balance = current_balance + debit - credit
            else:
                # For credit-normal accounts: credits increase, debits decrease
                new_balance = current_balance + credit - debit
            
            await self.db.chart_of_accounts.update_one(
                {"id": account_id},
                {"$set": {"balance": new_balance}}
            )
        
        return journal_entry.id
    
    async def get_account_balance(self, company_id: str, account_name: str) -> float:
        """Get current balance of an account"""
        account = await self.get_account_by_name(company_id, account_name)
        return account.balance
    
    async def initialize_chart_of_accounts(self, company_id: str) -> None:
        """
        Initialize default chart of accounts for a new company.
        """
        from app.models import Account
        
        # Check if already initialized
        count = await self.db.chart_of_accounts.count_documents({"company_id": company_id})
        if count > 0:
            logger.info(f"Chart of accounts already initialized for company {company_id}")
            return
        
        default_accounts = [
            # Assets
            {"code": "1000", "name": "Bank", "type": "Asset", "subtype": "Current Asset"},
            {"code": "1100", "name": "Cash", "type": "Asset", "subtype": "Current Asset"},
            {"code": "1200", "name": "Accounts Receivable", "type": "Asset", "subtype": "Current Asset"},
            {"code": "1300", "name": "Inventory", "type": "Asset", "subtype": "Current Asset"},
            {"code": "1500", "name": "Equipment", "type": "Asset", "subtype": "Non-current Asset"},
            {"code": "1600", "name": "Furniture", "type": "Asset", "subtype": "Non-current Asset"},
            
            # Liabilities
            {"code": "2000", "name": "Accounts Payable", "type": "Liability", "subtype": "Current Liability"},
            {"code": "2100", "name": "Loans Payable", "type": "Liability", "subtype": "Non-current Liability"},
            {"code": "2200", "name": "VAT Payable", "type": "Liability", "subtype": "Current Liability"},
            
            # Equity
            {"code": "3000", "name": "Owner's Equity", "type": "Equity", "subtype": "Capital"},
            {"code": "3100", "name": "Retained Earnings", "type": "Equity", "subtype": "Retained Earnings"},
            
            # Revenue
            {"code": "4000", "name": "Sales Revenue", "type": "Revenue", "subtype": "Operating Revenue"},
            {"code": "4100", "name": "Consulting Income", "type": "Revenue", "subtype": "Operating Revenue"},
            {"code": "4200", "name": "Service Income", "type": "Revenue", "subtype": "Operating Revenue"},
            
            # Expenses
            {"code": "5000", "name": "Cost of Goods Sold", "type": "Expense", "subtype": "Direct Cost"},
            {"code": "5100", "name": "Salaries Expense", "type": "Expense", "subtype": "Operating Expense"},
            {"code": "5200", "name": "Rent Expense", "type": "Expense", "subtype": "Operating Expense"},
            {"code": "5300", "name": "Utilities Expense", "type": "Expense", "subtype": "Operating Expense"},
            {"code": "5400", "name": "Office Supplies Expense", "type": "Expense", "subtype": "Operating Expense"},
            {"code": "5500", "name": "Transport Expense", "type": "Expense", "subtype": "Operating Expense"},
        ]
        
        for acc_data in default_accounts:
            account = Account(
                company_id=company_id,
                **acc_data
            )
            
            doc = account.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            
            await self.db.chart_of_accounts.insert_one(doc)
        
        logger.info(f"Initialized {len(default_accounts)} accounts for company {company_id}")
