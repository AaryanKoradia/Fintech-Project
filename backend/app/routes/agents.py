"""
Agent Network Management Routes
Handles agent registration, authentication, actions, and scorecards
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from app.schemas_extended import (
    AgentCreate, AgentResponse, AgentUpdate, AgentAction, AgentActionResponse,
    AgentScorecard, EventType, Channel
)
from app.database import get_collection, AGENTS_COLLECTION, USERS_COLLECTION, AGENT_ACTIONS_COLLECTION, SCHEME_APPLICATIONS_COLLECTION, EVENT_LOGS_COLLECTION
from app.utils.auth import get_current_user, hash_password, create_access_token
from bson import ObjectId
from datetime import datetime, timedelta
from typing import List, Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# ============= AGENT AUTHENTICATION =============

@router.post("/register", response_model=AgentResponse)
async def register_agent(agent_data: AgentCreate):
    """Register a new agent (requires admin approval)"""
    agents_collection = get_collection(AGENTS_COLLECTION)
    
    # Check if email already exists
    existing = await agents_collection.find_one({"email": agent_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    agent_dict = agent_data.dict()
    agent_dict["password"] = hash_password(agent_data.password)
    agent_dict["role"] = "AGENT"
    agent_dict["is_active"] = False  # Requires admin verification
    agent_dict["is_verified"] = False
    agent_dict["created_at"] = datetime.utcnow()
    agent_dict["performance_score"] = 0.0
    agent_dict["total_assisted"] = 0
    
    result = await agents_collection.insert_one(agent_dict.copy())
    agent_dict["id"] = str(result.inserted_id)
    
    if "_id" in agent_dict:
        del agent_dict["_id"]
    if "password" in agent_dict:
        del agent_dict["password"]
    
    return agent_dict

@router.get("/me", response_model=AgentResponse)
async def get_current_agent(current_user: dict = Depends(get_current_user)):
    """Get current agent profile"""
    if current_user.get("role") != "AGENT":
        raise HTTPException(status_code=403, detail="Agent access only")
    
    agents_collection = get_collection(AGENTS_COLLECTION)
    agent = await agents_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent["id"] = str(agent["_id"])
    del agent["_id"]
    if "password" in agent:
        del agent["password"]
    
    return agent

# ============= AGENT ACTIONS & TRACKING =============

@router.post("/actions", response_model=AgentActionResponse)
async def log_agent_action(
    action: AgentAction,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Log an agent action with geo-location and metadata"""
    if current_user.get("role") != "AGENT":
        raise HTTPException(status_code=403, detail="Agent access only")
    
    actions_collection = get_collection(AGENT_ACTIONS_COLLECTION)
    
    action_dict = action.dict()
    action_dict["agent_id"] = current_user["sub"]
    
    # Capture IP and User-Agent
    action_dict["ip_address"] = request.client.host if request.client else None
    action_dict["user_agent"] = request.headers.get("user-agent")
    action_dict["timestamp"] = datetime.utcnow()
    
    result = await actions_collection.insert_one(action_dict.copy())
    action_dict["id"] = str(result.inserted_id)
    
    if "_id" in action_dict:
        del action_dict["_id"]
    
    # Also log to event_logs for unified analytics
    await log_event(
        user_id=action.user_id,
        agent_id=current_user["sub"],
        village_code=action.village_code,
        scheme_id=action.scheme_id,
        event_type=EventType.AGENT_ASSISTED,
        channel=Channel.AGENT_ASSISTED,
        metadata=action.metadata,
        geo_location=action.geo_location
    )
    
    return action_dict

@router.get("/actions/my-history")
async def get_agent_action_history(
    days: int = 30,
    current_user: dict = Depends(get_current_user)
):
    """Get agent's action history"""
    if current_user.get("role") != "AGENT":
        raise HTTPException(status_code=403, detail="Agent access only")
    
    actions_collection = get_collection(AGENT_ACTIONS_COLLECTION)
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    actions = await actions_collection.find({
        "agent_id": current_user["sub"],
        "timestamp": {"$gte": cutoff_date}
    }).sort("timestamp", -1).to_list(100)
    
    for action in actions:
        action["id"] = str(action["_id"])
        del action["_id"]
    
    return {"actions": actions, "total": len(actions)}

# ============= AGENT SCORECARD =============

@router.get("/scorecard/{agent_id}", response_model=AgentScorecard)
async def get_agent_scorecard(
    agent_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get agent performance scorecard (admin or self)"""
    # Check authorization
    if current_user.get("role") not in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER"] and current_user["sub"] != agent_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    agents_collection = get_collection(AGENTS_COLLECTION)
    actions_collection = get_collection(AGENT_ACTIONS_COLLECTION)
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    # Get agent info
    agent = await agents_collection.find_one({"_id": ObjectId(agent_id)})
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    # Calculate metrics
    total_actions = await actions_collection.count_documents({"agent_id": agent_id})
    
    # Get applications assisted
    assisted_apps = await applications_collection.find({"agent_id": agent_id}).to_list(None)
    total_submitted = len(assisted_apps)
    total_approved = sum(1 for app in assisted_apps if app.get("status") == "approved")
    
    approval_rate = (total_approved / total_submitted * 100) if total_submitted > 0 else 0.0
    
    # Calculate average completion time
    completion_times = []
    for app in assisted_apps:
        if app.get("submitted_at") and app.get("approved_at"):
            delta = app["approved_at"] - app["submitted_at"]
            completion_times.append(delta.total_seconds() / 3600)  # hours
    
    avg_completion = sum(completion_times) / len(completion_times) if completion_times else 0.0
    
    # Performance score (0-100)
    performance_score = min(100, (approval_rate * 0.6) + (min(total_approved, 50) * 0.8))
    
    # Get last activity
    last_action = await actions_collection.find_one(
        {"agent_id": agent_id},
        sort=[("timestamp", -1)]
    )
    last_activity = last_action["timestamp"] if last_action else agent["created_at"]
    
    return {
        "agent_id": agent_id,
        "agent_name": agent["full_name"],
        "villagers assisted": total_actions,
        "applications_submitted": total_submitted,
        "applications_approved": total_approved,
        "approval_rate": approval_rate,
        "avg_completion_time_hours": avg_completion,
        "performance_score": performance_score,
        "last_activity": last_activity,
        "fraud_flags": 0  # TODO: Implement fraud detection
    }

# ============= ADMIN FUNCTIONS =============

@router.get("/all", response_model=List[AgentResponse])
async def get_all_agents(current_user: dict = Depends(get_current_user)):
    """Get all agents (admin only)"""
    if current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    agents_collection = get_collection(AGENTS_COLLECTION)
    agents = await agents_collection.find({}).to_list(None)
    
    result = []
    for agent in agents:
        agent["id"] = str(agent["_id"])
        del agent["_id"]
        if "password" in agent:
            del agent["password"]
        result.append(agent)
    
    return result

@router.patch("/{agent_id}", response_model=AgentResponse)
async def update_agent(
    agent_id: str,
    update_data: AgentUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update agent (admin only)"""
    if current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    agents_collection = get_collection(AGENTS_COLLECTION)
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    result = await agents_collection.update_one(
        {"_id": ObjectId(agent_id)},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = await agents_collection.find_one({"_id": ObjectId(agent_id)})
    agent["id"] = str(agent["_id"])
    del agent["_id"]
    if "password" in agent:
        del agent["password"]
    
    return agent

# ============= HELPER FUNCTIONS =============

async def log_event(
    user_id: Optional[str],
    agent_id: Optional[str],
    village_code: str,
    scheme_id: Optional[str],
    event_type: EventType,
    channel: Channel,
    metadata: dict = None,
    geo_location: dict = None
):
    """Helper function to log events to event_logs collection"""
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    
    event = {
        "user_id": user_id,
        "agent_id": agent_id,
        "village_code": village_code,
        "scheme_id": scheme_id,
        "event_type": event_type.value,
        "channel": channel.value,
        "metadata": metadata or {},
        "geo_location": geo_location,
        "timestamp": datetime.utcnow()
    }
    
    await event_logs_collection.insert_one(event)
