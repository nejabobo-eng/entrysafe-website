from typing import Dict, List, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class RegistersGenerator:
    """Generate read-only registers from journal entries"""
    
    def __init__(self, db):
        self.db = db
    
    async def generate_sales_ledger(
        self,
        company_id: str,
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Generate Sales Ledger - all customer invoices and payments received.
        """
        
        journal_entries = await self.db.journal_entries.find({
            "company_id": company_id,
            "approved": True,
            "date": {"$gte": start_date, "$lte": end_date}
        }).sort("date", 1).to_list(10000)
        
        sales_entries = []
        total_sales = 0
        total_received = 0
        
        for entry in journal_entries:
            for line in entry["lines"]:
                account = await self.db.chart_of_accounts.find_one({"id": line["account_id"]})
                
                if account and account["type"] == "Revenue":
                    amount = line.get("credit", 0) - line.get("debit", 0)
                    
                    debit_account = None
                    for other_line in entry["lines"]:
                        if other_line["account_id"] != line["account_id"] and other_line.get("debit", 0) > 0:
                            debit_acc = await self.db.chart_of_accounts.find_one({"id": other_line["account_id"]})
                            if debit_acc:
                                debit_account = debit_acc["name"]
                                break
                    
                    sales_entries.append({
                        "date": entry["date"],
                        "reference": entry["reference"],
                        "description": entry["description"],
                        "revenue_account": account["name"],
                        "amount": amount,
                        "received_in": debit_account or "Unknown",
                        "paid": debit_account == "Bank" or debit_account == "Cash",
                        "journal_entry_id": entry["id"]
                    })
                    
                    total_sales += amount
                    if debit_account in ["Bank", "Cash"]:
                        total_received += amount
        
        outstanding = total_sales - total_received
        
        return {
            "register_type": "sales_ledger",
            "period": {"start_date": start_date, "end_date": end_date},
            "entries": sales_entries,
            "summary": {
                "total_sales": total_sales,
                "total_received": total_received,
                "outstanding_receivables": outstanding
            },
            "entry_count": len(sales_entries)
        }
    
    async def generate_expenses_register(
        self,
        company_id: str,
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Generate Expenses Register - all business expenses.
        """
        
        journal_entries = await self.db.journal_entries.find({
            "company_id": company_id,
            "approved": True,
            "date": {"$gte": start_date, "$lte": end_date}
        }).sort("date", 1).to_list(10000)
        
        expense_entries = []
        total_expenses = 0
        total_paid = 0
        by_category = {}
        
        for entry in journal_entries:
            for line in entry["lines"]:
                account = await self.db.chart_of_accounts.find_one({"id": line["account_id"]})
                
                if account and account["type"] == "Expense":
                    amount = line.get("debit", 0) - line.get("credit", 0)
                    
                    credit_account = None
                    for other_line in entry["lines"]:
                        if other_line["account_id"] != line["account_id"] and other_line.get("credit", 0) > 0:
                            credit_acc = await self.db.chart_of_accounts.find_one({"id": other_line["account_id"]})
                            if credit_acc:
                                credit_account = credit_acc["name"]
                                break
                    
                    expense_category = account["name"]
                    
                    expense_entries.append({
                        "date": entry["date"],
                        "reference": entry["reference"],
                        "description": entry["description"],
                        "category": expense_category,
                        "amount": amount,
                        "paid_from": credit_account or "Unknown",
                        "paid": credit_account == "Bank" or credit_account == "Cash",
                        "journal_entry_id": entry["id"]
                    })
                    
                    total_expenses += amount
                    if credit_account in ["Bank", "Cash"]:
                        total_paid += amount
                    
                    if expense_category not in by_category:
                        by_category[expense_category] = 0
                    by_category[expense_category] += amount
        
        outstanding = total_expenses - total_paid
        
        return {
            "register_type": "expenses_register",
            "period": {"start_date": start_date, "end_date": end_date},
            "entries": expense_entries,
            "summary": {
                "total_expenses": total_expenses,
                "total_paid": total_paid,
                "outstanding_payables": outstanding,
                "by_category": [
                    {"category": cat, "amount": amt}
                    for cat, amt in sorted(by_category.items(), key=lambda x: x[1], reverse=True)
                ]
            },
            "entry_count": len(expense_entries)
        }
    
    async def get_bank_register(
        self,
        company_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 100
    ) -> Dict:
        """
        Generate Bank Register.
        """
        
        query = {"company_id": company_id, "approved": True}
        if start_date or end_date:
            date_query = {}
            if start_date:
                date_query["$gte"] = start_date
            if end_date:
                date_query["$lte"] = end_date
            query["date"] = date_query
        
        bank_account = await self.db.chart_of_accounts.find_one({
            "company_id": company_id,
            "name": "Bank",
            "is_active": True
        })
        
        if not bank_account:
            raise ValueError("Bank account not found")
        
        all_entries = await self.db.journal_entries.find(query).sort("date", 1).to_list(1000)
        
        register_entries = []
        running_balance = 0.0
        
        for entry in all_entries:
            for line in entry["lines"]:
                if line["account_id"] == bank_account["id"]:
                    debit = line.get("debit", 0)
                    credit = line.get("credit", 0)
                    
                    running_balance += debit - credit
                    
                    register_entries.append({
                        "date": entry["date"],
                        "reference": entry["reference"],
                        "description": line.get("description", entry["description"]),
                        "debit": debit,
                        "credit": credit,
                        "balance": running_balance,
                        "journal_entry_id": entry["id"]
                    })
        
        register_entries = register_entries[-limit:]
        
        return {
            "register_type": "bank",
            "account_name": "Bank",
            "account_code": bank_account["code"],
            "current_balance": bank_account.get("balance", 0),
            "entries": register_entries,
            "entry_count": len(register_entries)
        }
    
    async def get_cash_register(
        self,
        company_id: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 100
    ) -> Dict:
        """
        Generate Cash Register.
        """
        
        query = {"company_id": company_id, "approved": True}
        if start_date or end_date:
            date_query = {}
            if start_date:
                date_query["$gte"] = start_date
            if end_date:
                date_query["$lte"] = end_date
            query["date"] = date_query
        
        cash_account = await self.db.chart_of_accounts.find_one({
            "company_id": company_id,
            "name": "Cash",
            "is_active": True
        })
        
        if not cash_account:
            raise ValueError("Cash account not found")
        
        all_entries = await self.db.journal_entries.find(query).sort("date", 1).to_list(1000)
        
        register_entries = []
        running_balance = 0.0
        
        for entry in all_entries:
            for line in entry["lines"]:
                if line["account_id"] == cash_account["id"]:
                    debit = line.get("debit", 0)
                    credit = line.get("credit", 0)
                    
                    running_balance += debit - credit
                    
                    register_entries.append({
                        "date": entry["date"],
                        "reference": entry["reference"],
                        "description": line.get("description", entry["description"]),
                        "debit": debit,
                        "credit": credit,
                        "balance": running_balance,
                        "journal_entry_id": entry["id"]
                    })
        
        register_entries = register_entries[-limit:]
        
        return {
            "register_type": "cash",
            "account_name": "Cash",
            "account_code": cash_account["code"],
            "current_balance": cash_account.get("balance", 0),
            "entries": register_entries,
            "entry_count": len(register_entries)
        }
    
    async def generate_payroll_register(
        self,
        company_id: str,
        start_date: str,
        end_date: str
    ) -> Dict:
        """
        Generate Payroll Register.
        """
        
        journal_entries = await self.db.journal_entries.find({
            "company_id": company_id,
            "approved": True,
            "date": {"$gte": start_date, "$lte": end_date}
        }).sort("date", 1).to_list(10000)
        
        payroll_entries = []
        total_gross = 0
        total_deductions = 0
        total_net = 0
        
        for entry in journal_entries:
            for line in entry["lines"]:
                account = await self.db.chart_of_accounts.find_one({"id": line["account_id"]})
                
                if account and "Salaries" in account["name"]:
                    gross_amount = line.get("debit", 0) - line.get("credit", 0)
                    
                    paid_from = None
                    for other_line in entry["lines"]:
                        if other_line["account_id"] != line["account_id"] and other_line.get("credit", 0) > 0:
                            paid_acc = await self.db.chart_of_accounts.find_one({"id": other_line["account_id"]})
                            if paid_acc:
                                paid_from = paid_acc["name"]
                                break
                    
                    payroll_entries.append({
                        "date": entry["date"],
                        "reference": entry["reference"],
                        "description": entry["description"],
                        "gross_salary": gross_amount,
                        "deductions": 0,
                        "net_pay": gross_amount,
                        "paid_from": paid_from or "Unknown",
                        "journal_entry_id": entry["id"]
                    })
                    
                    total_gross += gross_amount
                    total_net += gross_amount
        
        return {
            "register_type": "payroll",
            "period": {"start_date": start_date, "end_date": end_date},
            "entries": payroll_entries,
            "summary": {
                "total_gross_salaries": total_gross,
                "total_deductions": total_deductions,
                "total_net_pay": total_net
            },
            "entry_count": len(payroll_entries)
        }
    
    async def generate_asset_register(
        self,
        company_id: str,
        as_of_date: str
    ) -> Dict:
        """
        Generate Asset Register.
        """
        
        asset_accounts = await self.db.chart_of_accounts.find({
            "company_id": company_id,
            "type": "Asset",
            "is_active": True
        }).to_list(1000)
        
        assets = []
        total_cost = 0
        total_depreciation = 0
        
        for account in asset_accounts:
            if account.get("subtype") == "Current Asset":
                continue
            
            balance = account.get("balance", 0)
            
            if balance > 0:
                estimated_depreciation = balance * 0.20
                net_book_value = balance - estimated_depreciation
                
                assets.append({
                    "asset_name": account["name"],
                    "account_code": account["code"],
                    "original_cost": balance,
                    "accumulated_depreciation": estimated_depreciation,
                    "net_book_value": net_book_value,
                    "depreciation_rate": 0.20
                })
                
                total_cost += balance
                total_depreciation += estimated_depreciation
        
        total_net_value = total_cost - total_depreciation
        
        return {
            "register_type": "asset_register",
            "as_of_date": as_of_date,
            "assets": assets,
            "summary": {
                "total_original_cost": total_cost,
                "total_accumulated_depreciation": total_depreciation,
                "total_net_book_value": total_net_value
            },
            "asset_count": len(assets)
        }
    
    async def generate_equity_register(
        self,
        company_id: str,
        as_of_date: str
    ) -> Dict:
        """
        Generate Equity Register.
        """
        
        equity_accounts = await self.db.chart_of_accounts.find({
            "company_id": company_id,
            "type": "Equity",
            "is_active": True
        }).to_list(1000)
        
        equity_items = []
        total_equity = 0
        
        for account in equity_accounts:
            balance = account.get("balance", 0)
            
            all_entries = await self.db.journal_entries.find({
                "company_id": company_id,
                "approved": True,
                "date": {"$lte": as_of_date}
            }).sort("date", 1).to_list(10000)
            
            transactions = []
            for entry in all_entries:
                for line in entry["lines"]:
                    if line["account_id"] == account["id"]:
                        transactions.append({
                            "date": entry["date"],
                            "reference": entry["reference"],
                            "description": entry["description"],
                            "debit": line.get("debit", 0),
                            "credit": line.get("credit", 0)
                        })
            
            equity_items.append({
                "equity_account": account["name"],
                "account_code": account["code"],
                "balance": balance,
                "transactions": transactions[-10:]
            })
            
            total_equity += balance
        
        return {
            "register_type": "equity_register",
            "as_of_date": as_of_date,
            "equity_accounts": equity_items,
            "total_equity": total_equity
        }
    
    async def generate_liability_register(
        self,
        company_id: str,
        as_of_date: str
    ) -> Dict:
        """
        Generate Liability Register.
        """
        
        liability_accounts = await self.db.chart_of_accounts.find({
            "company_id": company_id,
            "type": "Liability",
            "is_active": True
        }).to_list(1000)
        
        liabilities = []
        total_current = 0
        total_non_current = 0
        
        for account in liability_accounts:
            balance = account.get("balance", 0)
            
            if balance > 0:
                all_entries = await self.db.journal_entries.find({
                    "company_id": company_id,
                    "approved": True,
                    "date": {"$lte": as_of_date}
                }).sort("date", 1).to_list(10000)
                
                transactions = []
                for entry in all_entries:
                    for line in entry["lines"]:
                        if line["account_id"] == account["id"]:
                            transactions.append({
                                "date": entry["date"],
                                "reference": entry["reference"],
                                "description": entry["description"],
                                "increase": line.get("credit", 0),
                                "decrease": line.get("debit", 0)
                            })
                
                liability_item = {
                    "liability_name": account["name"],
                    "account_code": account["code"],
                    "type": account.get("subtype", "Unknown"),
                    "balance": balance,
                    "recent_transactions": transactions[-10:]
                }
                
                liabilities.append(liability_item)
                
                if account.get("subtype") == "Current Liability":
                    total_current += balance
                else:
                    total_non_current += balance
        
        total_liabilities = total_current + total_non_current
        
        return {
            "register_type": "liability_register",
            "as_of_date": as_of_date,
            "liabilities": liabilities,
            "summary": {
                "total_current_liabilities": total_current,
                "total_non_current_liabilities": total_non_current,
                "total_liabilities": total_liabilities
            },
            "liability_count": len(liabilities)
        }
    
    async def generate_inventory_register(
        self,
        company_id: str,
        as_of_date: str
    ) -> Dict:
        """
        Generate Inventory Register.
        """
        
        inventory_account = await self.db.chart_of_accounts.find_one({
            "company_id": company_id,
            "name": "Inventory",
            "is_active": True
        })
        
        if not inventory_account:
            return {
                "register_type": "inventory_register",
                "as_of_date": as_of_date,
                "total_inventory_value": 0,
                "items": [],
                "message": "No inventory account found"
            }
        
        total_inventory_value = inventory_account.get("balance", 0)
        
        all_entries = await self.db.journal_entries.find({
            "company_id": company_id,
            "approved": True,
            "date": {"$lte": as_of_date}
        }).sort("date", 1).to_list(10000)
        
        inventory_movements = []
        
        for entry in all_entries:
            for line in entry["lines"]:
                if line["account_id"] == inventory_account["id"]:
                    movement_type = "purchase" if line.get("debit", 0) > 0 else "sale"
                    amount = line.get("debit", 0) or line.get("credit", 0)
                    
                    inventory_movements.append({
                        "date": entry["date"],
                        "reference": entry["reference"],
                        "description": entry["description"],
                        "movement_type": movement_type,
                        "amount": amount,
                        "journal_entry_id": entry["id"]
                    })
        
        return {
            "register_type": "inventory_register",
            "as_of_date": as_of_date,
            "total_inventory_value": total_inventory_value,
            "movements": inventory_movements[-50:],
            "movement_count": len(inventory_movements)
        }
