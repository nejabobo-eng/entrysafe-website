import os
import json
import re
from datetime import datetime, date
from typing import Dict
import logging

logger = logging.getLogger(__name__)


class AIAccountingParser:
    """AI-powered parser for natural language accounting commands using GPT-4o"""

    def __init__(self):
        # Support both variable names for flexibility
        self.api_key = os.environ.get('OPENAI_KEY_ACCOUNTING') or os.environ.get('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OPENAI_KEY_ACCOUNTING (or OPENAI_API_KEY) not found in environment variables")

    def _normalize_command(self, command: str) -> str:
        """
        Normalize user input to improve AI parsing accuracy.

        - Remove greetings and conversational fluff
        - Normalize currency formats (r650 → 650 rand)
        - Fix common typos
        - Trim extra whitespace
        """

        normalized = command.strip()

        # Remove common greetings and conversational phrases
        greetings = [
            r'^hi[,.\s]+',
            r'^hello[,.\s]+',
            r'^hey[,.\s]+',
            r'^good\s+(morning|afternoon|evening)[,.\s]+',
            r'i\s+would\s+like\s+to\s+',
            r'i\s+want\s+to\s+',
            r'can\s+you\s+(please\s+)?',
            r'please\s+',
        ]

        for pattern in greetings:
            normalized = re.sub(pattern, '', normalized, flags=re.IGNORECASE)

        # Normalize currency formats
        # r650 or R650 → 650 rand
        normalized = re.sub(r'\br(\d+)\b', r'\1 rand', normalized, flags=re.IGNORECASE)

        # Fix common typos
        typo_fixes = {
            r'\btrtansaction\b': 'transaction',
            r'\btrasaction\b': 'transaction',
            r'\btransction\b': 'transaction',
            r'\breciept\b': 'receipt',
            r'\bexpence\b': 'expense',
            r'\bpayed\b': 'paid',
        }

        for typo, correction in typo_fixes.items():
            normalized = re.sub(typo, correction, normalized, flags=re.IGNORECASE)

        # Clean up multiple spaces
        normalized = re.sub(r'\s+', ' ', normalized).strip()

        logger.info(f"Command normalized: '{command}' → '{normalized}'")

        return normalized

    async def parse_accounting_command(self, command: str, company_id: str, currency: str = "ZAR") -> dict:
        """
        Parse natural language command into structured accounting transaction.

        Examples:
        - "Add 1500 rand income from consulting"
        - "Paid 500 rand for office supplies"
        - "Received 2000 from client ABC"
        - "Purchase equipment for 10000"
        """

        # Normalize command before sending to AI
        normalized_command = self._normalize_command(command)

        system_message = f"""You are an expert accounting AI that converts natural language commands into double-entry accounting transactions.

You can handle both direct commands and conversational messages. Extract the transaction details from the user's message, ignoring greetings and pleasantries.

Your task is to analyze the user's command and determine:
1. **Transaction type**: income, expense, asset purchase, liability, etc.
2. **Amount**: numeric value
3. **Currency**: {currency} (default)
4. **Description**: clear description of the transaction
5. **Date**: ISO format (YYYY-MM-DD). If not specified, use today's date.
6. **Accounts affected**: Determine which accounts should be debited and credited

**Available Account Types:**
Assets: Bank, Cash, Accounts Receivable, Inventory, Equipment, Furniture
Liabilities: Accounts Payable, Loans Payable, VAT Payable
Equity: Owner's Equity, Retained Earnings
Revenue: Sales Revenue, Consulting Income, Service Income
Expenses: Cost of Goods Sold, Salaries Expense, Rent Expense, Utilities Expense, Office Supplies Expense, Transport Expense

**Double-Entry Rules:**
- Every transaction must have at least one debit and one credit
- Total debits must equal total credits
- For INCOME (revenue): Debit Bank/Cash, Credit Revenue account
- For EXPENSES: Debit Expense account, Credit Bank/Cash
- For ASSET PURCHASES: Debit Asset account, Credit Bank/Cash
- For LOAN RECEIVED: Debit Bank, Credit Loans Payable
- For PAYMENT TO SUPPLIER: Debit Accounts Payable, Credit Bank

**Examples:**

Command: "Add 1500 rand income from consulting" OR "Hi, I'd like to add 1500 rand income from consulting"
Response:
{{
  "transaction_type": "income",
  "amount": 1500,
  "currency": "{currency}",
  "description": "Consulting income received",
  "date": "2025-01-05",
  "journal_lines": [
    {{"account_name": "Bank", "debit": 1500, "credit": 0, "description": "Consulting income received"}},
    {{"account_name": "Consulting Income", "debit": 0, "credit": 1500, "description": "Consulting income received"}}
  ]
}}

Command: "Paid 500 rand for office supplies" OR "I want to record that I paid 500 for office stuff"
Response:
{{
  "transaction_type": "expense",
  "amount": 500,
  "currency": "{currency}",
  "description": "Office supplies purchased",
  "date": "2025-01-05",
  "journal_lines": [
    {{"account_name": "Office Supplies Expense", "debit": 500, "credit": 0, "description": "Office supplies purchased"}},
    {{"account_name": "Bank", "debit": 0, "credit": 500, "description": "Payment for office supplies"}}
  ]
}}

Command: "Received 2000 from client ABC"
Response:
{{
  "transaction_type": "income",
  "amount": 2000,
  "currency": "{currency}",
  "description": "Payment received from client ABC",
  "date": "2025-01-05",
  "journal_lines": [
    {{"account_name": "Bank", "debit": 2000, "credit": 0, "description": "Payment from client ABC"}},
    {{"account_name": "Sales Revenue", "debit": 0, "credit": 2000, "description": "Revenue from client ABC"}}
  ]
}}

**Important Rules:**
1. Always return valid JSON only, no explanation
2. Ensure debits equal credits
3. Use account names exactly as listed above
4. Extract transaction details from conversational messages (ignore greetings like "hi", "hello", "please")
5. Handle various currency formats: "650", "r650", "R650", "650 rand" all mean 650 ZAR
6. Fix common typos automatically (e.g., "trtansaction" → "transaction")
7. Always include the currency
8. Date should be in YYYY-MM-DD format

Return ONLY a JSON object with the structure shown above.
"""

        try:
            # Use OpenAI API
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=self.api_key)

            # Add current date context
            today = date.today().isoformat()
            user_message = f"Today's date is {today}. Command: {normalized_command}"
            
            # Send message and get response
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,  # Low temperature for consistent accounting
                max_tokens=1000
            )
            
            # Extract response text
            response_text = response.choices[0].message.content
            
            # Parse JSON response
            parsed_data = self._extract_json(response_text)
            
            if not parsed_data:
                raise ValueError("Failed to parse AI response into JSON")
            
            # Validate required fields
            required_fields = ["transaction_type", "amount", "description", "date", "journal_lines"]
            for field in required_fields:
                if field not in parsed_data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Validate journal lines
            if not parsed_data["journal_lines"] or len(parsed_data["journal_lines"]) < 2:
                raise ValueError("Journal entry must have at least 2 lines (debit and credit)")
            
            # Validate debits = credits
            total_debit = sum(line.get("debit", 0) for line in parsed_data["journal_lines"])
            total_credit = sum(line.get("credit", 0) for line in parsed_data["journal_lines"])
            
            if abs(total_debit - total_credit) > 0.01:
                raise ValueError(f"Journal entry not balanced: Debits={total_debit}, Credits={total_credit}")
            
            return {
                "success": True,
                "data": parsed_data,
                "raw_response": response_text
            }
            
        except Exception as e:
            logger.error(f"Error parsing AI command: {str(e)}")
            logger.error(f"Original command: {command}")
            logger.error(f"Normalized command: {normalized_command}")

            # Log to error tracking system
            try:
                from app.services.error_logger import log_error
                log_error(
                    error_type="API_ERROR",
                    message="AI command parsing failed",
                    details={
                        "original_command": command,
                        "normalized_command": normalized_command,
                        "company_id": company_id,
                        "currency": currency
                    },
                    exception=e
                )
            except:
                pass  # Don't fail if error logging fails

            return {
                "success": False,
                "error": str(e),
                "data": None
            }
    
    def _extract_json(self, text: str) -> dict:
        """Extract JSON from AI response."""
        try:
            # Try direct JSON parse
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to find JSON in text using regex
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            
            # Try to find JSON in code blocks
            code_block_match = re.search(r'```(?:json)?\s*({.*?})\s*```', text, re.DOTALL)
            if code_block_match:
                try:
                    return json.loads(code_block_match.group(1))
                except json.JSONDecodeError:
                    pass
            
            return None
    
    async def validate_transaction(self, parsed_data: dict) -> Dict[str, any]:
        """
        Validate parsed transaction data before creating preview.
        """
        
        errors = []
        warnings = []
        
        # Check amount
        if parsed_data.get("amount", 0) <= 0:
            errors.append("Amount must be greater than 0")
        
        # Check journal lines
        journal_lines = parsed_data.get("journal_lines", [])
        if len(journal_lines) < 2:
            errors.append("Transaction must have at least 2 journal lines")
        
        # Check balance
        total_debit = sum(line.get("debit", 0) for line in journal_lines)
        total_credit = sum(line.get("credit", 0) for line in journal_lines)
        
        if abs(total_debit - total_credit) > 0.01:
            errors.append(f"Transaction not balanced: Debits={total_debit}, Credits={total_credit}")
        
        # Check date format
        try:
            datetime.fromisoformat(parsed_data.get("date", ""))
        except (ValueError, TypeError):
            errors.append("Invalid date format. Use YYYY-MM-DD")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }
