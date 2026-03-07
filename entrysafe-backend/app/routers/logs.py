"""
Error Logging Router for Entry Safe
Author: Mlungisi Mncube
Purpose: Endpoints to view and download error logs without accessing Render
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import json
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

# Create router
logs_router = APIRouter(prefix="/api/logs", tags=["logs"])

LOGS_DIR = Path("/tmp/entrysafe-logs")


@logs_router.get("/errors/recent")
async def get_recent_errors(limit: int = 50):
    """
    Get recent error logs (last N errors).
    
    Query params:
        limit: Maximum number of errors to return (default: 50, max: 500)
    
    Returns:
        JSON with error entries
    """
    try:
        if limit > 500:
            limit = 500
        
        today_log = LOGS_DIR / f"entrysafe-{datetime.now().strftime('%Y-%m-%d')}.log"
        
        if not today_log.exists():
            return {
                "count": 0,
                "errors": [],
                "message": "No errors logged today"
            }
        
        errors = []
        
        with open(today_log, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Parse lines looking for ERROR entries
        for line in reversed(lines[-limit*10:]):  # Read more than needed
            if '| ERROR' in line or '❌' in line:
                try:
                    # Extract timestamp
                    timestamp = line.split('|')[0].strip()
                    
                    # Try to extract JSON error data
                    if '{' in line:
                        json_start = line.index('{')
                        error_data = json.loads(line[json_start:])
                        error_data['log_timestamp'] = timestamp
                        errors.append(error_data)
                    else:
                        # Plain text error
                        message = line.split('|')[-1].strip()
                        errors.append({
                            "type": "UNKNOWN",
                            "message": message,
                            "log_timestamp": timestamp
                        })
                    
                    if len(errors) >= limit:
                        break
                        
                except Exception as parse_error:
                    logger.debug(f"Failed to parse error line: {parse_error}")
                    continue
        
        return {
            "count": len(errors),
            "errors": list(reversed(errors)),  # Chronological order
            "log_file": str(today_log),
            "retrieved_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Failed to retrieve errors: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@logs_router.get("/errors/download")
async def download_error_log():
    """
    Download today's complete error log file.
    
    Returns:
        Log file as downloadable attachment
    """
    try:
        today_log = LOGS_DIR / f"entrysafe-{datetime.now().strftime('%Y-%m-%d')}.log"
        
        if not today_log.exists():
            raise HTTPException(status_code=404, detail="No log file found for today")
        
        return FileResponse(
            path=str(today_log),
            filename=f"entrysafe-errors-{datetime.now().strftime('%Y-%m-%d')}.log",
            media_type="text/plain"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to download log: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@logs_router.get("/errors/stats")
async def get_error_stats():
    """
    Get error statistics for the last 7 days.
    
    Returns:
        Error counts by type and date
    """
    try:
        stats = {
            "last_7_days": [],
            "total_errors": 0,
            "errors_by_type": {}
        }
        
        # Check last 7 days
        for days_ago in range(7):
            date = datetime.now() - timedelta(days=days_ago)
            date_str = date.strftime('%Y-%m-%d')
            log_file = LOGS_DIR / f"entrysafe-{date_str}.log"
            
            if log_file.exists():
                with open(log_file, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                
                error_count = sum(1 for line in lines if '| ERROR' in line or '❌' in line)
                
                day_stats = {
                    "date": date_str,
                    "error_count": error_count
                }
                stats["last_7_days"].append(day_stats)
                stats["total_errors"] += error_count
                
                # Count by type
                for line in lines:
                    if '| ERROR' in line and '{' in line:
                        try:
                            json_start = line.index('{')
                            error_data = json.loads(line[json_start:])
                            error_type = error_data.get("type", "UNKNOWN")
                            stats["errors_by_type"][error_type] = stats["errors_by_type"].get(error_type, 0) + 1
                        except:
                            pass
        
        return stats
        
    except Exception as e:
        logger.error(f"Failed to get error stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@logs_router.get("/health")
async def logs_health_check():
    """Check if logging system is operational"""
    try:
        LOGS_DIR.mkdir(exist_ok=True)
        
        log_files = list(LOGS_DIR.glob("*.log"))
        
        return {
            "status": "healthy",
            "logs_directory": str(LOGS_DIR),
            "log_files_count": len(log_files),
            "today_log_exists": (LOGS_DIR / f"entrysafe-{datetime.now().strftime('%Y-%m-%d')}.log").exists()
        }
        
    except Exception as e:
        logger.error(f"Logging health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
