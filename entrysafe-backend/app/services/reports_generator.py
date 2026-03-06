from typing import Dict, List, Optional
from datetime import datetime
import logging
import io

logger = logging.getLogger(__name__)


class ReportsGenerator:
    """Generate financial reports with optional PDF export"""
    
    def __init__(self, db):
        self.db = db
    
    async def generate_income_statement(
        self,
        company_id: str,
        start_date: str,
        end_date: str,
        format: str = "json"
    ) -> Dict:
        """
        Generate Income Statement (Profit & Loss Statement).
        
        Revenue - Expenses = Net Profit
        """
        
        # Get company details
        company = await self.db.companies.find_one({"id": company_id})
        if not company:
            raise ValueError("Company not found")
        
        # Get all approved journal entries in date range
        journal_entries = await self.db.journal_entries.find({
            "company_id": company_id,
            "approved": True,
            "date": {"$gte": start_date, "$lte": end_date}
        }).to_list(10000)
        
        # Calculate revenue and expenses by account
        revenue_accounts = {}
        expense_accounts = {}
        
        for entry in journal_entries:
            for line in entry["lines"]:
                account = await self.db.chart_of_accounts.find_one({"id": line["account_id"]})
                
                if not account:
                    continue
                
                account_type = account["type"]
                account_name = account["name"]
                
                if account_type == "Revenue":
                    # Revenue increases with credits
                    amount = line["credit"] - line["debit"]
                    revenue_accounts[account_name] = revenue_accounts.get(account_name, 0) + amount
                
                elif account_type == "Expense":
                    # Expenses increase with debits
                    amount = line["debit"] - line["credit"]
                    expense_accounts[account_name] = expense_accounts.get(account_name, 0) + amount
        
        # Calculate totals
        total_revenue = sum(revenue_accounts.values())
        total_expenses = sum(expense_accounts.values())
        net_profit = total_revenue - total_expenses
        
        statement_data = {
            "company": {
                "name": company["name"],
                "registration_number": company["registration_number"],
                "representative_name": company.get("representative_name", ""),
                "currency": company.get("currency", "ZAR")
            },
            "period": {
                "start_date": start_date,
                "end_date": end_date
            },
            "revenue": [
                {"account": name, "amount": amount}
                for name, amount in sorted(revenue_accounts.items())
            ],
            "total_revenue": total_revenue,
            "expenses": [
                {"account": name, "amount": amount}
                for name, amount in sorted(expense_accounts.items())
            ],
            "total_expenses": total_expenses,
            "net_profit": net_profit,
            "generated_at": datetime.now().isoformat()
        }
        
        if format == "json":
            return statement_data
        elif format == "pdf":
            return await self._generate_income_statement_pdf(statement_data)
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    async def _generate_income_statement_pdf(self, data: Dict) -> bytes:
        """Generate PDF of income statement with company letterhead"""
        try:
            from reportlab.lib.pagesizes import A4
            from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
            from reportlab.lib.units import inch
            from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
            from reportlab.lib import colors
            from reportlab.lib.enums import TA_CENTER
            
            buffer = io.BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.5*inch)
            
            elements = []
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=18,
                textColor=colors.HexColor('#1a1a1a'),
                spaceAfter=6,
                alignment=TA_CENTER
            )
            
            company_style = ParagraphStyle(
                'CompanyStyle',
                parent=styles['Normal'],
                fontSize=12,
                textColor=colors.HexColor('#333333'),
                alignment=TA_CENTER,
                spaceAfter=3
            )
            
            heading_style = ParagraphStyle(
                'HeadingStyle',
                parent=styles['Heading2'],
                fontSize=14,
                textColor=colors.HexColor('#2c3e50'),
                spaceAfter=10,
                spaceBefore=15
            )
            
            # Company Letterhead
            company = data["company"]
            elements.append(Paragraph(company["name"], title_style))
            elements.append(Paragraph(f"Reg No: {company['registration_number']}", company_style))
            if company.get("representative_name"):
                elements.append(Paragraph(f"Representative: {company['representative_name']}", company_style))
            elements.append(Spacer(1, 0.3*inch))
            
            # Report Title
            elements.append(Paragraph("INCOME STATEMENT", heading_style))
            period = data["period"]
            elements.append(Paragraph(f"Period: {period['start_date']} to {period['end_date']}", company_style))
            elements.append(Spacer(1, 0.2*inch))
            
            currency = company["currency"]
            
            # Revenue Section
            elements.append(Paragraph("REVENUE", heading_style))
            
            revenue_data = [["Account", "Amount"]]
            for item in data["revenue"]:
                revenue_data.append([item["account"], f"{currency} {item['amount']:,.2f}"])
            
            if data["revenue"]:
                revenue_table = Table(revenue_data, colWidths=[4*inch, 2*inch])
                revenue_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ]))
                elements.append(revenue_table)
            
            elements.append(Spacer(1, 0.1*inch))
            
            # Total Revenue
            total_revenue_data = [["TOTAL REVENUE", f"{currency} {data['total_revenue']:,.2f}"]]
            total_revenue_table = Table(total_revenue_data, colWidths=[4*inch, 2*inch])
            total_revenue_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#27ae60')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.whitesmoke),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 14),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
            ]))
            elements.append(total_revenue_table)
            elements.append(Spacer(1, 0.3*inch))
            
            # Expenses Section
            elements.append(Paragraph("EXPENSES", heading_style))
            
            expense_data = [["Account", "Amount"]]
            for item in data["expenses"]:
                expense_data.append([item["account"], f"{currency} {item['amount']:,.2f}"])
            
            if data["expenses"]:
                expense_table = Table(expense_data, colWidths=[4*inch, 2*inch])
                expense_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e74c3c')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                ]))
                elements.append(expense_table)
            
            elements.append(Spacer(1, 0.1*inch))
            
            # Total Expenses
            total_expense_data = [["TOTAL EXPENSES", f"{currency} {data['total_expenses']:,.2f}"]]
            total_expense_table = Table(total_expense_data, colWidths=[4*inch, 2*inch])
            total_expense_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#c0392b')),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.whitesmoke),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 14),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
            ]))
            elements.append(total_expense_table)
            elements.append(Spacer(1, 0.3*inch))
            
            # Net Profit/Loss
            net_profit = data["net_profit"]
            profit_label = "NET PROFIT" if net_profit >= 0 else "NET LOSS"
            profit_color = colors.HexColor('#27ae60') if net_profit >= 0 else colors.HexColor('#e74c3c')
            
            net_profit_data = [[profit_label, f"{currency} {abs(net_profit):,.2f}"]]
            net_profit_table = Table(net_profit_data, colWidths=[4*inch, 2*inch])
            net_profit_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), profit_color),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.whitesmoke),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 16),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
                ('TOPPADDING', (0, 0), (-1, -1), 15),
            ]))
            elements.append(net_profit_table)
            
            # Footer
            elements.append(Spacer(1, 0.5*inch))
            footer_style = ParagraphStyle(
                'FooterStyle',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.grey,
                alignment=TA_CENTER
            )
            elements.append(Paragraph(f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", footer_style))
            elements.append(Paragraph("EntrySafe AI Accounting Platform", footer_style))
            
            # Build PDF
            doc.build(elements)
            
            pdf_bytes = buffer.getvalue()
            buffer.close()
            
            return pdf_bytes
            
        except ImportError:
            raise ValueError("PDF generation requires reportlab library. Install with: pip install reportlab")
    
    async def generate_balance_sheet(
        self,
        company_id: str,
        as_of_date: str,
        format: str = "json"
    ) -> Dict:
        """
        Generate Balance Sheet.
        Assets = Liabilities + Equity
        """
        
        company = await self.db.companies.find_one({"id": company_id})
        if not company:
            raise ValueError("Company not found")
        
        accounts = await self.db.chart_of_accounts.find({
            "company_id": company_id,
            "is_active": True
        }).to_list(1000)
        
        assets = {"current": [], "non_current": [], "total": 0}
        liabilities = {"current": [], "non_current": [], "total": 0}
        equity = {"items": [], "total": 0}
        
        for account in accounts:
            account_data = {
                "account": account["name"],
                "amount": account.get("balance", 0)
            }
            
            if account["type"] == "Asset":
                if account.get("subtype") == "Current Asset":
                    assets["current"].append(account_data)
                else:
                    assets["non_current"].append(account_data)
                assets["total"] += account_data["amount"]
            
            elif account["type"] == "Liability":
                if account.get("subtype") == "Current Liability":
                    liabilities["current"].append(account_data)
                else:
                    liabilities["non_current"].append(account_data)
                liabilities["total"] += account_data["amount"]
            
            elif account["type"] == "Equity":
                equity["items"].append(account_data)
                equity["total"] += account_data["amount"]
        
        return {
            "company": {
                "name": company["name"],
                "registration_number": company["registration_number"],
                "representative_name": company.get("representative_name", ""),
                "currency": company.get("currency", "ZAR")
            },
            "as_of_date": as_of_date,
            "assets": assets,
            "liabilities": liabilities,
            "equity": equity,
            "total_liabilities_and_equity": liabilities["total"] + equity["total"],
            "balanced": abs(assets["total"] - (liabilities["total"] + equity["total"])) < 0.01,
            "generated_at": datetime.now().isoformat()
        }
    
    async def generate_trial_balance(
        self,
        company_id: str,
        as_of_date: str,
        format: str = "json"
    ) -> Dict:
        """
        Generate Trial Balance.
        Lists all accounts with their debit and credit balances.
        """
        
        company = await self.db.companies.find_one({"id": company_id})
        if not company:
            raise ValueError("Company not found")
        
        accounts = await self.db.chart_of_accounts.find({
            "company_id": company_id,
            "is_active": True
        }).sort("code", 1).to_list(1000)
        
        trial_balance_items = []
        total_debit = 0
        total_credit = 0
        
        for account in accounts:
            balance = account.get("balance", 0)
            account_type = account["type"]
            
            if account_type in ["Asset", "Expense"]:
                debit_balance = balance if balance > 0 else 0
                credit_balance = abs(balance) if balance < 0 else 0
            else:
                credit_balance = balance if balance > 0 else 0
                debit_balance = abs(balance) if balance < 0 else 0
            
            trial_balance_items.append({
                "code": account["code"],
                "account": account["name"],
                "type": account_type,
                "debit": debit_balance,
                "credit": credit_balance
            })
            
            total_debit += debit_balance
            total_credit += credit_balance
        
        return {
            "company": {
                "name": company["name"],
                "registration_number": company["registration_number"],
                "currency": company.get("currency", "ZAR")
            },
            "as_of_date": as_of_date,
            "accounts": trial_balance_items,
            "total_debit": total_debit,
            "total_credit": total_credit,
            "balanced": abs(total_debit - total_credit) < 0.01,
            "difference": total_debit - total_credit,
            "generated_at": datetime.now().isoformat()
        }
