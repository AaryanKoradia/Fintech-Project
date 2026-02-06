from fastapi import APIRouter, Depends, HTTPException
from app.schemas_extended import (SchemeApplicationCreate, SchemeApplicationResponse, EventType, Channel)
from app.database import get_collection, SCHEME_APPLICATIONS_COLLECTION, VILLAGES_COLLECTION, SCHEMES_COLLECTION
from app.utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

router = APIRouter()

@router.post("/submit", response_model=SchemeApplicationResponse)
async def submit_application(application: SchemeApplicationCreate, current_user: dict = Depends(get_current_user)):
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    villages_collection = get_collection(VILLAGES_COLLECTION)
    scheme = await schemes_collection.find_one({"_id": ObjectId(application.scheme_id)})
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    village = await villages_collection.find_one({"village_code": application.village_code})
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    
    app_dict = application.dict()
    app_dict["user_id"] = current_user["sub"]
    app_dict["status"] = "pending"
    app_dict["submitted_at"] = datetime.utcnow()
    app_dict["district_code"] = village.get("district_code")
    app_dict["state_code"] = village.get("state_code")
    app_dict["created_at"] = datetime.utcnow()
    
    result = await applications_collection.insert_one(app_dict.copy())
    app_dict["id"] = str(result.inserted_id)
    
    if "_id" in app_dict:
        del app_dict["_id"]
    
    await log_application_event(
        user_id=current_user["sub"],
        application_id=app_dict["id"],
        event_type=EventType.APPLICATION_SUBMITTED,
        village_code=application.village_code,
        scheme_id=application.scheme_id
    )
    
    return app_dict

@router.get("/{application_id}", response_model=SchemeApplicationResponse)
async def get_application( application_id: str, current_user: dict = Depends(get_current_user)):
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    application = await applications_collection.find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    is_owner = application.get("user_id") == current_user["sub"]
    is_agent = application.get("agent_id") == current_user["sub"]
    is_admin = current_user.get("role") in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER"]
    
    if not (is_owner or is_agent or is_admin):
        raise HTTPException(status_code=403, detail="Not authorized to view this application")
    
    application["id"] = str(application["_id"])
    del application["_id"]
    
    return application

@router.get("/my/applications", response_model=List[SchemeApplicationResponse])
async def get_my_applications(status: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    query = {"user_id": current_user["sub"]}
    if status:
        query["status"] = status
    
    applications = await applications_collection.find(query).sort("created_at", -1).to_list(None)
    
    result = []
    for app in applications:
        app["id"] = str(app["_id"])
        del app["_id"]
        result.append(app)
    
    return result

@router.patch("/{application_id}/status")
async def update_application_status(application_id: str, status: str, rejection_reason: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    if status not in ["pending", "approved", "rejected", "delivered"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    update_data = {"status": status}
    
    if status == "approved":
        update_data["approved_at"] = datetime.utcnow()
    elif status == "rejected":
        update_data["rejected_at"] = datetime.utcnow()
        if rejection_reason:
            update_data["rejection_reason"] = rejection_reason
        else:
            raise HTTPException(status_code=400, detail="Rejection reason required")
    elif status == "delivered":
        update_data["delivered_at"] = datetime.utcnow()
    
    application = await applications_collection.find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if status in ["approved", "rejected"] and application.get("submitted_at"):
        processing_time = datetime.utcnow() - application["submitted_at"]
        update_data["processing_time_days"] = processing_time.days
    
    result = await applications_collection.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    event_map = {
        "approved": EventType.APPLICATION_APPROVED,
        "rejected": EventType.APPLICATION_REJECTED,
        "delivered": EventType.BENEFIT_DELIVERED
    }
    
    if status in event_map:
        await log_application_event(
            user_id=application["user_id"],
            application_id=application_id,
            event_type=event_map[status],
            village_code=application["village_code"],
            scheme_id=application["scheme_id"]
        )
    
    return {"message": f"Application {status}", "application_id": application_id}

@router.get("/agent/assisted")
async def get_agent_assisted_applications(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "AGENT":
        raise HTTPException(status_code=403, detail="Agent access only")
    
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    applications = await applications_collection.find({
        "agent_id": current_user["sub"]
    }).sort("created_at", -1).to_list(None)
    
    result = []
    for app in applications:
        app["id"] = str(app["_id"])
        del app["_id"]
        result.append(app)
    
    return {"applications": result, "total": len(result)}

async def log_application_event(user_id: str, application_id: str, event_type: EventType, village_code: str, scheme_id: str):
    from app.database import EVENT_LOGS_COLLECTION
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    
    event = {
        "user_id": user_id,
        "application_id": application_id,
        "event_type": event_type.value,
        "village_code": village_code,
        "scheme_id": scheme_id,
        "channel": Channel.WEB.value,
        "timestamp": datetime.utcnow()
    }
    
    await event_logs_collection.insert_one(event)
