"""
Event Tracking Service
Unified event logging for analytics and audit trails
"""
from app.database import get_collection, EVENT_LOGS_COLLECTION
from app.schemas_extended import EventType, Channel
from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)

async def track_event(
    event_type: EventType,
    user_id: Optional[str] = None,
    agent_id: Optional[str] = None,
    village_code: Optional[str] = None,
    scheme_id: Optional[str] = None,
    application_id: Optional[str] = None,
    channel: Channel = Channel.WEB,
    session_id: Optional[str] = None,
    geo_location: Optional[dict] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    metadata: Optional[dict] = None
):
    """
    Track any event in the system
    
    Args:
        event_type: EventType (from EventType enum)
        user_id: User who triggered the event
        agent_id: Agent involved in the event
        village_code: Village where event occurred
        scheme_id: Related scheme
        application_id: Related application
        channel: How the event occurred (WEB, WHATSAPP, IVR, etc.)
        session_id: Session identifier for grouping events
        geo_location: {latitude, longitude, accuracy}
        ip_address: IP address
        user_agent: Browser/app user agent
        metadata: Additional context as dict
    """
    try:
        event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
        
        event = {
            "event_type": event_type.value if isinstance(event_type, EventType) else event_type,
            "user_id": user_id,
            "agent_id": agent_id,
            "village_code": village_code,
            "scheme_id": scheme_id,
            "application_id": application_id,
            "channel": channel.value if isinstance(channel, Channel) else channel,
            "session_id": session_id,
            "geo_location": geo_location,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow()
        }
        
        await event_logs_collection.insert_one(event)
        logger.info(f"Event tracked: {event_type} for user {user_id}")
        
    except Exception as e:
        logger.error(f"Failed to track event: {e}")
        # Don't raise - event tracking failures shouldn't break main flow

# ============= CONVENIENCE FUNCTIONS =============

async def track_scheme_view(user_id: str, scheme_id: str, channel: Channel = Channel.WEB, metadata: dict = None):
    """Track when a user views a scheme"""
    await track_event(
        event_type=EventType.SCHEME_VIEWED,
        user_id=user_id,
        scheme_id=scheme_id,
        channel=channel,
        metadata=metadata
    )

async def track_lesson_completion(user_id: str, lesson_id: str, metadata: dict = None):
    """Track when a user completes a lesson"""
    await track_event(
        event_type=EventType.LESSON_COMPLETED,
        user_id=user_id,
        metadata={"lesson_id": lesson_id, **(metadata or {})}
    )

async def track_whatsapp_interaction(user_id: str, message_type: str, metadata: dict = None):
    """Track WhatsApp bot interactions"""
    await track_event(
        event_type=EventType.WHATSAPP_INTERACTION,
        user_id=user_id,
        channel=Channel.WHATSAPP,
        metadata={"message_type": message_type, **(metadata or {})}
    )

async def track_ivr_call(user_id: str, call_duration: int, metadata: dict = None):
    """Track IVR call completion"""
    await track_event(
        event_type=EventType.IVR_CALL_COMPLETED,
        user_id=user_id,
        channel=Channel.IVR,
        metadata={"call_duration_seconds": call_duration, **(metadata or {})}
    )

async def track_document_scan(user_id: str, document_type: str, success: bool, metadata: dict = None):
    """Track document scanning"""
    await track_event(
        event_type=EventType.DOCUMENT_SCANNED,
        user_id=user_id,
        metadata={
            "document_type": document_type,
            "success": success,
            **(metadata or {})
        }
    )

async def track_agent_assistance(
    user_id: str,
    agent_id: str,
    village_code: str,
    action_type: str,
    geo_location: dict = None,
    metadata: dict = None
):
    """Track when an agent assists a villager"""
    await track_event(
        event_type=EventType.AGENT_ASSISTED,
        user_id=user_id,
        agent_id=agent_id,
        village_code=village_code,
        channel=Channel.AGENT_ASSISTED,
        geo_location=geo_location,
        metadata={"action_type": action_type, **(metadata or {})}
    )

async def track_nudge_sent(user_id: str, nudge_type: str, metadata: dict = None):
    """Track when a nudge is sent to user"""
    await track_event(
        event_type=EventType.NUDGE_SENT,
        user_id=user_id,
        metadata={"nudge_type": nudge_type, **(metadata or {})}
    )

async def track_milestone_completed(user_id: str, milestone_name: str, metadata: dict = None):
    """Track financial planning milestone completion"""
    await track_event(
        event_type=EventType.MILESTONE_COMPLETED,
        user_id=user_id,
        metadata={"milestone_name": milestone_name, **(metadata or {})}
    )

# ============= ANALYTICS HELPERS =============

async def get_user_journey(user_id: str, days: int = 30):
    """Get a user's complete event journey"""
    from datetime import timedelta
    
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    events = await event_logs_collection.find({
        "user_id": user_id,
        "timestamp": {"$gte": cutoff_date}
    }).sort("timestamp", 1).to_list(None)
    
    for event in events:
        event["id"] = str(event["_id"])
        del event["_id"]
    
    return events

async def get_funnel_metrics(scheme_id: str):
    """Get conversion funnel for a scheme"""
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    
    views = await event_logs_collection.count_documents({
        "scheme_id": scheme_id,
        "event_type": EventType.SCHEME_VIEWED.value
    })
    
    applications = await event_logs_collection.count_documents({
        "scheme_id": scheme_id,
        "event_type": EventType.APPLICATION_SUBMITTED.value
    })
    
    approvals = await event_logs_collection.count_documents({
        "scheme_id": scheme_id,
        "event_type": EventType.APPLICATION_APPROVED.value
    })
    
    deliveries = await event_logs_collection.count_documents({
        "scheme_id": scheme_id,
        "event_type": EventType.BENEFIT_DELIVERED.value
    })
    
    return {
        "scheme_id": scheme_id,
        "views": views,
        "applications": applications,
        "approvals": approvals,
        "deliveries": deliveries,
        "view_to_app_rate": (applications / views * 100) if views > 0 else 0,
        "app_to_approval_rate": (approvals / applications * 100) if applications > 0 else 0,
        "approval_to_delivery_rate": (deliveries / approvals * 100) if approvals > 0 else 0
    }
