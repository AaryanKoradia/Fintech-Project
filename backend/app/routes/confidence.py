"""
Confidence Score Routes
API endpoints for financial confidence scoring system
"""

from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.database import get_collection, USERS_COLLECTION
from app.utils.confidence_calculator import calculate_confidence_score, get_improvement_suggestions
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/score")
async def get_user_confidence_score(current_user: dict = Depends(get_current_user)):
    """
    Get current user's financial confidence score
    Returns score breakdown and improvement suggestions
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Prepare user data for calculation
    last_login = user.get("lastLogin", datetime.utcnow())
    days_ago = (datetime.utcnow() - last_login).days if isinstance(last_login, datetime) else 0
    
    user_data = {
        "lessonsCompleted": user.get("lessonsCompleted", 0),
        "schemesViewed": user.get("schemesViewed", 0),
        "practiceSessions": user.get("practiceSessions", 0),
        "daysActive": user.get("daysActive", 0),
        "lastLoginDaysAgo": days_ago
    }
    
    # Calculate score
    score_result = calculate_confidence_score(user_data)
    
    # Get improvement suggestions
    suggestions = get_improvement_suggestions(score_result["breakdown"])
    
    # Update user's confidence score in database
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {
            "$set": {
                "confidenceScore": score_result["totalScore"],
                "confidenceLevel": score_result["level"],
                "scoreUpdatedAt": datetime.utcnow()
            }
        }
    )
    
    return {
        "score": score_result,
        "suggestions": suggestions,
        "updatedAt": datetime.utcnow().isoformat()
    }


@router.post("/update-activity")
async def update_user_activity(
    activity_type: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user activity metrics
    Activity types: 'lesson', 'scheme', 'practice', 'login'
    """
    users_collection = get_collection(USERS_COLLECTION)
    
    update_data = {"lastLogin": datetime.utcnow()}
    
    if activity_type == "lesson":
        update_data["$inc"] = {"lessonsCompleted": 1}
    elif activity_type == "scheme":
        update_data["$inc"] = {"schemesViewed": 1}
    elif activity_type == "practice":
        update_data["$inc"] = {"practiceSessions": 1}
    elif activity_type == "login":
        update_data["$inc"] = {"daysActive": 1}
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {"$set": update_data} if "$inc" not in update_data else update_data
    )
    
    return {"message": "Activity updated", "type": activity_type}


@router.get("/leaderboard")
async def get_confidence_leaderboard(limit: int = 10):
    """
    Get top users by confidence score
    For village-level competition and motivation
    """
    users_collection = get_collection(USERS_COLLECTION)
    
    # Get top users by confidence score
    top_users = await users_collection.find(
        {"role": "USER"},
        {"fullName": 1, "village": 1, "confidenceScore": 1, "confidenceLevel": 1}
    ).sort("confidenceScore", -1).limit(limit).to_list(length=limit)
    
    # Format response
    leaderboard = []
    for idx, user in enumerate(top_users, 1):
        leaderboard.append({
            "rank": idx,
            "name": user.get("fullName", "Unknown"),
            "village": user.get("village", "Unknown"),
            "score": user.get("confidenceScore", 0),
            "level": user.get("confidenceLevel", "low")
        })
    
    return {"leaderboard": leaderboard}
