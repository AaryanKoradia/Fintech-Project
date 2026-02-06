"""
Daily Nudges Routes
API endpoints for personalized daily action recommendations
"""

from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.database import get_collection, USERS_COLLECTION
from app.utils.nudge_engine import generate_daily_nudges, get_contextual_message
from app.utils.confidence_calculator import calculate_confidence_score
from bson import ObjectId
from datetime import datetime

router = APIRouter()


@router.get("/daily")
async def get_daily_nudges(current_user: dict = Depends(get_current_user)):
    """
    Get personalized daily action recommendations
    Returns 1-3 nudges based on user profile and activity
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Prepare user data
    last_login = user.get("lastLogin", datetime.utcnow())
    days_ago = (datetime.utcnow() - last_login).days if isinstance(last_login, datetime) else 0
    
    user_data = {
        "fullName": user.get("fullName", ""),
        "age": user.get("age"),
        "occupation": user.get("occupation", ""),
        "monthlyIncome": user.get("monthlyIncome"),
        "village": user.get("village", ""),
        "lessonsCompleted": user.get("lessonsCompleted", 0),
        "schemesViewed": user.get("schemesViewed", 0),
        "practiceSessions": user.get("practiceSessions", 0),
        "daysActive": user.get("daysActive", 0),
        "lastLoginDaysAgo": days_ago
    }
    
    # Calculate confidence score
    confidence_data = calculate_confidence_score(user_data)
    
    # Generate nudges
    nudges = generate_daily_nudges(user_data, confidence_data)
    
    # Get contextual greeting
    context = get_contextual_message(user_data)
    
    return {
        "context": context,
        "nudges": nudges,
        "confidenceScore": confidence_data["totalScore"],
        "generatedAt": datetime.utcnow().isoformat()
    }


@router.post("/complete/{nudge_id}")
async def complete_nudge(nudge_id: str, current_user: dict = Depends(get_current_user)):
    """
    Mark a nudge as completed
    Track user engagement with recommendations
    """
    users_collection = get_collection(USERS_COLLECTION)
    
    # Track completed nudges
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {
            "$push": {
                "completedNudges": {
                    "nudgeId": nudge_id,
                    "completedAt": datetime.utcnow()
                }
            },
            "$inc": {"daysActive": 1}
        }
    )
    
    return {
        "message": "Nudge completed",
        "nudgeId": nudge_id
    }


@router.get("/stats")
async def get_nudge_stats(current_user: dict = Depends(get_current_user)):
    """
    Get user's nudge completion statistics
    For tracking engagement and motivation
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    completed_nudges = user.get("completedNudges", [])
    
    # Count by type
    type_counts = {}
    for nudge in completed_nudges:
        nudge_type = nudge.get("nudgeId", "").split("_")[0]
        type_counts[nudge_type] = type_counts.get(nudge_type, 0) + 1
    
    return {
        "totalCompleted": len(completed_nudges),
        "byType": type_counts,
        "lastCompleted": completed_nudges[-1] if completed_nudges else None
    }
