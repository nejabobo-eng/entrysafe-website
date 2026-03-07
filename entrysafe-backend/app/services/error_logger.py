"""
Error Logging Service for Entry Safe
Author: Mlungisi Mncube
Purpose: Centralized error logging with downloadable log files
"""

import logging
import os
from datetime import datetime
from pathlib import Path
import traceback
import json

# Create logs directory
LOGS_DIR = Path("/tmp/entrysafe-logs")
LOGS_DIR.mkdir(exist_ok=True)

# Configure logging
LOG_FILE = LOGS_DIR / f"entrysafe-{datetime.now().strftime('%Y-%m-%d')}.log"

# Create formatter
formatter = logging.Formatter(
    '%(asctime)s | %(levelname)-8s | %(name)-20s | %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# File handler
file_handler = logging.FileHandler(LOG_FILE, mode='a', encoding='utf-8')
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)

# Console handler (for Render logs)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)

# Root logger configuration
root_logger = logging.getLogger()
root_logger.setLevel(logging.DEBUG)
root_logger.addHandler(file_handler)
root_logger.addHandler(console_handler)

# Service-specific loggers
api_logger = logging.getLogger("API")
ai_logger = logging.getLogger("AI")
db_logger = logging.getLogger("DATABASE")
auth_logger = logging.getLogger("AUTH")

# Export loggers
__all__ = ['api_logger', 'ai_logger', 'db_logger', 'auth_logger', 'log_error', 'get_recent_errors']


def log_error(error_type: str, message: str, details: dict = None, exception: Exception = None):
    """
    Log error with full context for debugging.
    
    Args:
        error_type: Type of error (ENV_ERROR, API_ERROR, CRASH_ERROR, etc.)
        message: Human-readable error message
        details: Additional context (user_id, company_id, request data, etc.)
        exception: Exception object if available
    """
    error_data = {
        "timestamp": datetime.now().isoformat(),
        "type": error_type,
        "message": message,
        "details": details or {},
    }
    
    if exception:
        error_data["exception"] = str(exception)
        error_data["traceback"] = traceback.format_exc()
    
    # Log to file
    api_logger.error(json.dumps(error_data, indent=2))
    
    # Also print to console for Render logs
    print(f"❌ [{error_type}] {message}")
    if details:
        print(f"   Details: {json.dumps(details, indent=2)}")
    if exception:
        print(f"   Exception: {exception}")


def get_recent_errors(limit: int = 100) -> list:
    """
    Get recent errors from log file.
    
    Args:
        limit: Maximum number of errors to return
    
    Returns:
        List of error dictionaries
    """
    errors = []
    
    try:
        if not LOG_FILE.exists():
            return errors
        
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Parse last N lines looking for ERROR entries
        for line in reversed(lines[-limit*5:]):  # Read more lines than needed
            if '| ERROR' in line or '❌' in line:
                try:
                    # Try to extract JSON from the line
                    if '{' in line:
                        json_start = line.index('{')
                        error_json = json.loads(line[json_start:])
                        errors.append(error_json)
                        
                        if len(errors) >= limit:
                            break
                except:
                    # If not JSON, store as text
                    errors.append({
                        "type": "UNKNOWN",
                        "message": line.strip(),
                        "timestamp": datetime.now().isoformat()
                    })
        
        return list(reversed(errors))  # Return chronologically
    
    except Exception as e:
        api_logger.error(f"Failed to read error log: {e}")
        return []


def get_log_file_path() -> str:
    """Get current log file path for downloading"""
    return str(LOG_FILE)


# Usage examples:
# from app.services.error_logger import log_error, api_logger
# 
# try:
#     result = await some_operation()
# except Exception as e:
#     log_error("API_ERROR", "Failed to process AI command", 
#               details={"user_id": user_id, "message": message}, 
#               exception=e)
#     raise HTTPException(status_code=500, detail=str(e))
