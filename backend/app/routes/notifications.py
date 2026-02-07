from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from ..database import get_database
from ..utils.auth import get_current_user, require_admin
from pydantic import BaseModel

router = APIRouter()

class NotificationCreate(BaseModel):
    title_en: str
    title_hi: str
    message_en: str
    message_hi: str
    contact_number: Optional[str] = None
    target_users: List[str] = ["all"]  # List of user IDs or ["all"]

class NotificationResponse(BaseModel):
    id: str
    title_en: str
    title_hi: str
    message_en: str
    message_hi: str
    contact_number: Optional[str]
    target_users: List[str]
    created_by: str
    created_at: str
    read_by: List[str] = []

@router.post("/", response_model=dict)
async def create_notification(
    notification: NotificationCreate,
    current_admin = Depends(require_admin)
):
    """Create a new notification (Admin only)"""
    db = get_database()
    
    notification_data = {
        "title_en": notification.title_en,
        "title_hi": notification.title_hi,
        "message_en": notification.message_en,
        "message_hi": notification.message_hi,
        "contact_number": notification.contact_number,
        "target_users": notification.target_users,
        "created_by": str(current_admin["sub"]),
        "created_at": datetime.utcnow().isoformat(),
        "read_by": []
    }
    
    result = await db.notifications.insert_one(notification_data)
    
    return {
        "message": "Notification created successfully",
        "notification_id": str(result.inserted_id)
    }

@router.get("/admin/all", response_model=List[NotificationResponse])
async def get_all_notifications_admin(
    current_admin = Depends(require_admin)
):
    """Get all notifications (Admin only)"""
    db = get_database()
    
    notifications = await db.notifications.find().sort("created_at", -1).to_list(100)
    
    return [
        {
            "id": str(notif["_id"]),
            "title_en": notif["title_en"],
            "title_hi": notif["title_hi"],
            "message_en": notif["message_en"],
            "message_hi": notif["message_hi"],
            "contact_number": notif.get("contact_number"),
            "target_users": notif["target_users"],
            "created_by": notif["created_by"],
            "created_at": notif["created_at"],
            "read_by": notif.get("read_by", [])
        }
        for notif in notifications
    ]

@router.get("/user", response_model=List[NotificationResponse])
async def get_user_notifications(
    current_user = Depends(get_current_user)
):
    """Get notifications for current user"""
    db = get_database()
    user_id = str(current_user["sub"])
    
    # Get notifications targeted to this user or all users
    notifications = await db.notifications.find({
        "$or": [
            {"target_users": "all"},
            {"target_users": {"$in": [user_id]}}
        ]
    }).sort("created_at", -1).to_list(50)
    
    return [
        {
            "id": str(notif["_id"]),
            "title_en": notif["title_en"],
            "title_hi": notif["title_hi"],
            "message_en": notif["message_en"],
            "message_hi": notif["message_hi"],
            "contact_number": notif.get("contact_number"),
            "target_users": notif["target_users"],
            "created_by": notif["created_by"],
            "created_at": notif["created_at"],
            "read_by": notif.get("read_by", [])
        }
        for notif in notifications
    ]

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user = Depends(get_current_user)
):
    """Mark notification as read"""
    db = get_database()
    user_id = str(current_user["sub"])
    
    try:
        result = await db.notifications.update_one(
            {"_id": ObjectId(notification_id)},
            {"$addToSet": {"read_by": user_id}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification marked as read"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_admin = Depends(require_admin)
):
    """Delete a notification (Admin only)"""
    db = get_database()
    
    try:
        result = await db.notifications.delete_one({"_id": ObjectId(notification_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/user/unread-count")
async def get_unread_count(
    current_user = Depends(get_current_user)
):
    """Get count of unread notifications for current user"""
    db = get_database()
    user_id = str(current_user["sub"])
    
    # Count notifications not in read_by array
    count = await db.notifications.count_documents({
        "$or": [
            {"target_users": "all"},
            {"target_users": {"$in": [user_id]}}
        ],
        "read_by": {"$ne": user_id}
    })
    
    return {"unread_count": count}
