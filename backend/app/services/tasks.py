"""
Celery background tasks
"""

from typing import Dict, List, Any
from datetime import datetime
import asyncio

from app.services.celery_app import celery_app
from app.core.logging import get_logger


logger = get_logger(__name__)


@celery_app.task(bind=True, name="process_sms_batch")
def process_sms_batch(self, user_id: str, sms_list: List[str]) -> Dict[str, Any]:
    """
    Process batch of SMS messages for transaction extraction.
    
    Args:
        user_id: User ID
        sms_list: List of SMS messages
        
    Returns:
        Extraction results
    """
    from app.services.ocr_service import ocr_service
    
    logger.info(
        "Processing SMS batch",
        user_id=user_id,
        count=len(sms_list),
        task_id=self.request.id
    )
    
    # Run async function in sync context
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        results = loop.run_until_complete(
            ocr_service.batch_process_sms(sms_list)
        )
        
        return {
            "success": True,
            "user_id": user_id,
            "processed": len(results),
            "transactions": results
        }
    except Exception as e:
        logger.error("SMS batch processing failed", error=str(e))
        return {"success": False, "error": str(e)}
    finally:
        loop.close()


@celery_app.task(bind=True, name="sync_market_data")
def sync_market_data(self, symbols: List[str]) -> Dict[str, Any]:
    """
    Sync market data for watchlist symbols.
    
    Args:
        symbols: List of stock symbols
        
    Returns:
        Updated market data
    """
    from app.services.market_data_service import market_data_service
    
    logger.info(
        "Syncing market data",
        symbol_count=len(symbols),
        task_id=self.request.id
    )
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        results = {}
        for symbol in symbols:
            data = loop.run_until_complete(
                market_data_service.get_stock_price(symbol)
            )
            results[symbol] = data
        
        return {
            "success": True,
            "synced": len(results),
            "data": results
        }
    except Exception as e:
        logger.error("Market data sync failed", error=str(e))
        return {"success": False, "error": str(e)}
    finally:
        loop.close()


@celery_app.task(bind=True, name="generate_daily_insights")
def generate_daily_insights(self, user_id: str) -> Dict[str, Any]:
    """
    Generate daily financial insights for user.
    
    Args:
        user_id: User ID
        
    Returns:
        Generated insights
    """
    logger.info(
        "Generating daily insights",
        user_id=user_id,
        task_id=self.request.id
    )
    
    # This would use the agent system to generate insights
    return {
        "success": True,
        "user_id": user_id,
        "insights": [],
        "generated_at": datetime.utcnow().isoformat()
    }


@celery_app.task(bind=True, name="check_upcoming_payments")
def check_upcoming_payments(self, user_id: str) -> Dict[str, Any]:
    """
    Check for upcoming recurring payments.
    
    Args:
        user_id: User ID
        
    Returns:
        Upcoming payments
    """
    logger.info(
        "Checking upcoming payments",
        user_id=user_id,
        task_id=self.request.id
    )
    
    return {
        "success": True,
        "user_id": user_id,
        "upcoming": [],
        "checked_at": datetime.utcnow().isoformat()
    }


@celery_app.task(bind=True, name="process_bank_statement")
def process_bank_statement(
    self,
    user_id: str,
    file_path: str
) -> Dict[str, Any]:
    """
    Process uploaded bank statement.
    
    Args:
        user_id: User ID
        file_path: Path to uploaded file
        
    Returns:
        Extracted transactions
    """
    from app.services.ocr_service import ocr_service
    
    logger.info(
        "Processing bank statement",
        user_id=user_id,
        file_path=file_path,
        task_id=self.request.id
    )
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        with open(file_path, 'rb') as f:
            pdf_bytes = f.read()
        
        transactions = loop.run_until_complete(
            ocr_service.extract_from_pdf(pdf_bytes)
        )
        
        return {
            "success": True,
            "user_id": user_id,
            "transactions": transactions
        }
    except Exception as e:
        logger.error("Statement processing failed", error=str(e))
        return {"success": False, "error": str(e)}
    finally:
        loop.close()


@celery_app.task(name="send_payment_reminder")
def send_payment_reminder(
    user_id: str,
    payment_name: str,
    amount: float,
    due_date: str
) -> Dict[str, Any]:
    """
    Send payment reminder notification.
    
    Args:
        user_id: User ID
        payment_name: Name of payment
        amount: Amount due
        due_date: Due date
        
    Returns:
        Notification status
    """
    logger.info(
        "Sending payment reminder",
        user_id=user_id,
        payment=payment_name,
        amount=amount
    )
    
    # Would integrate with notification service
    return {
        "success": True,
        "user_id": user_id,
        "notification_sent": True
    }


# Periodic tasks (would be scheduled with Celery Beat)
@celery_app.task(name="daily_market_summary")
def daily_market_summary() -> Dict[str, Any]:
    """Generate daily market summary for all users."""
    from app.services.market_data_service import market_data_service
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    try:
        indices = loop.run_until_complete(
            market_data_service.get_market_indices()
        )
        
        return {
            "success": True,
            "indices": indices,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        loop.close()
