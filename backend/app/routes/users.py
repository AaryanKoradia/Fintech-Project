from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import UserStats
from app.database import get_collection, USERS_COLLECTION, LESSONS_COLLECTION
from app.utils.auth import get_current_user, require_user
from bson import ObjectId

router = APIRouter()

@router.get("/stats", response_model=UserStats)
async def get_user_stats(current_user: dict = Depends(get_current_user)):
    users_collection = get_collection(USERS_COLLECTION)
    lessons_collection = get_collection(LESSONS_COLLECTION)
    
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    total_lessons = await lessons_collection.count_documents({})
    
    return {
        "lessonsCompleted": user.get("lessonsCompleted", 0),
        "totalLessons": total_lessons if total_lessons > 0 else 10,
        "coinsEarned": user.get("coins", 0),
        "badges": user.get("badges", []),
        "progress": user.get("progress", 0)
    }

@router.put("/profile")
async def update_profile(update_data: dict, current_user: dict = Depends(get_current_user)):
    users_collection = get_collection(USERS_COLLECTION)
    allowed_fields = {"fullName", "village"}
    filtered_data = {k: v for k, v in update_data.items() if k in allowed_fields}
    
    if not filtered_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No valid fields to update")
    
    result = await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {"$set": filtered_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return {"message": "Profile updated successfully"}
