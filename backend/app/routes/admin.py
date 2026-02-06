from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import AdminStats
from app.database import get_collection, USERS_COLLECTION, SCHEMES_COLLECTION
from app.utils.auth import require_admin
from typing import List

router = APIRouter()

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(current_user: dict = Depends(require_admin)):
    users_collection = get_collection(USERS_COLLECTION)
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    total_users = await users_collection.count_documents({"role": "USER"})
    active_users = await users_collection.count_documents({
        "role": "USER",
        "isActive": True
    })

    pipeline = [
        {"$match": {"role": "USER"}},
        {"$group": {"_id": None, "avgProgress": {"$avg": "$progress"}}}
    ]
    result = await users_collection.aggregate(pipeline).to_list(1)
    average_progress = int(result[0]["avgProgress"]) if result else 0
    total_schemes = await schemes_collection.count_documents({})
    
    return { "totalUsers": total_users, "activeUsers": active_users, "averageProgress": average_progress, "totalSchemes": total_schemes}
@router.get("/users")
async def get_all_users(current_user: dict = Depends(require_admin)):
    users_collection = get_collection(USERS_COLLECTION)
    users = await users_collection.find({"role": "USER"}).to_list(None)
    
    return [
        {
            "id": str(user["_id"]),
            "fullName": user["fullName"],
            "email": user["email"],
            "village": user["village"],
            "progress": user.get("progress", 0),
            "coins": user.get("coins", 0),
            "isActive": user.get("isActive", True)
        }
        for user in users
    ]

@router.get("/users/recent")
async def get_recent_users(current_user: dict = Depends(require_admin)):
    users_collection = get_collection(USERS_COLLECTION)
    users = await users_collection.find({"role": "USER"}).sort("createdAt", -1).limit(10).to_list(10)
    
    return [
        {
            "fullName": user["fullName"],
            "village": user["village"],
            "progress": user.get("progress", 0)
        }
        for user in users
    ]

@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(require_admin)):
    users_collection = get_collection(USERS_COLLECTION)
    total_users = await users_collection.count_documents({"role": "USER"})
    active_users = await users_collection.count_documents({"role": "USER", "isActive": True})
    pipeline = [
        {"$match": {"role": "USER"}},
        {"$group": {"_id": None, "avgProgress": {"$avg": "$progress"}}}
    ]
    result = await users_collection.aggregate(pipeline).to_list(1)
    average_progress = int(result[0]["avgProgress"]) if result else 0

    village_pipeline = [
        {"$match": {"role": "USER"}},
        {
            "$group": {
                "_id": "$village",
                "totalUsers": {"$sum": 1},
                "activeUsers": {"$sum": {"$cond": ["$isActive", 1, 0]}},
                "avgProgress": {"$avg": "$progress"}
            }
        }
    ]
    village_stats = await users_collection.aggregate(village_pipeline).to_list(None)
    
    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "averageProgress": average_progress,
        "totalLessonsCompleted": 0,  
        "totalCoinsEarned": 0,  
        "popularLessons": [],  
        "villageStats": [
            {
                "name": stat["_id"],
                "totalUsers": stat["totalUsers"],
                "activeUsers": stat["activeUsers"],
                "avgProgress": int(stat["avgProgress"])
            }
            for stat in village_stats
        ]
    }

@router.get("/schemes")
async def get_all_schemes_admin(current_user: dict = Depends(require_admin)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    schemes = await schemes_collection.find({}).to_list(None)
    
    return [
        {
            "id": str(scheme["_id"]),
            "name": scheme["name"],
            "description": scheme["description"],
            "category": scheme["category"],
            "benefits": scheme["benefits"],
            "eligibility": scheme["eligibility"],
            "howToApply": scheme["howToApply"]
        }
        for scheme in schemes
    ]
