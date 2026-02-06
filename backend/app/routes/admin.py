from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import AdminStats, AdminCreate, AdminResponse
from app.database import get_collection, USERS_COLLECTION, SCHEMES_COLLECTION
from app.utils.auth import require_admin, hash_password
from typing import List
from datetime import datetime
from bson import ObjectId

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

# Admin Management Endpoints
@router.get("/admins", response_model=List[AdminResponse])
async def get_all_admins(current_user: dict = Depends(require_admin)):
    """Get all admin users"""
    users_collection = get_collection(USERS_COLLECTION)
    admins = await users_collection.find({"role": "ADMIN"}).to_list(None)
    
    return [
        {
            "id": str(admin["_id"]),
            "fullName": admin["fullName"],
            "email": admin["email"],
            "village": admin.get("village", "Admin Panel"),
            "role": admin["role"],
            "createdAt": admin.get("createdAt", datetime.utcnow()),
            "isActive": admin.get("isActive", True)
        }
        for admin in admins
    ]

@router.post("/admins", response_model=AdminResponse)
async def create_admin(admin_data: AdminCreate, current_user: dict = Depends(require_admin)):
    """Create a new admin user (only accessible by existing admins)"""
    users_collection = get_collection(USERS_COLLECTION)
    
    # Check if admin with this email already exists
    existing_admin = await users_collection.find_one({"email": admin_data.email})
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this email already exists"
        )
    
    # Create new admin
    new_admin = {
        "fullName": admin_data.fullName,
        "email": admin_data.email,
        "hashedPassword": hash_password(admin_data.password),
        "village": admin_data.village,
        "role": "ADMIN",
        "createdAt": datetime.utcnow(),
        "progress": 0,
        "coins": 0,
        "badges": ["ADMIN"],
        "isActive": True
    }
    
    result = await users_collection.insert_one(new_admin)
    
    return {
        "id": str(result.inserted_id),
        "fullName": new_admin["fullName"],
        "email": new_admin["email"],
        "village": new_admin["village"],
        "role": new_admin["role"],
        "createdAt": new_admin["createdAt"],
        "isActive": new_admin["isActive"]
    }

@router.delete("/admins/{admin_id}")
async def delete_admin(admin_id: str, current_user: dict = Depends(require_admin)):
    """Delete an admin user"""
    users_collection = get_collection(USERS_COLLECTION)
    
    # Prevent deleting yourself
    if current_user["sub"] == admin_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own admin account"
        )
    
    # Check if admin exists
    admin = await users_collection.find_one({"_id": ObjectId(admin_id), "role": "ADMIN"})
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    # Delete the admin
    await users_collection.delete_one({"_id": ObjectId(admin_id)})
    
    return {"message": "Admin deleted successfully", "id": admin_id}

@router.patch("/admins/{admin_id}/toggle-status")
async def toggle_admin_status(admin_id: str, current_user: dict = Depends(require_admin)):
    """Toggle admin active/inactive status"""
    users_collection = get_collection(USERS_COLLECTION)
    
    # Prevent toggling yourself
    if current_user["sub"] == admin_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot toggle your own admin status"
        )
    
    # Get admin
    admin = await users_collection.find_one({"_id": ObjectId(admin_id), "role": "ADMIN"})
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Admin not found"
        )
    
    # Toggle status
    new_status = not admin.get("isActive", True)
    await users_collection.update_one(
        {"_id": ObjectId(admin_id)},
        {"$set": {"isActive": new_status}}
    )
    
    return {"message": "Admin status updated", "id": admin_id, "isActive": new_status}
