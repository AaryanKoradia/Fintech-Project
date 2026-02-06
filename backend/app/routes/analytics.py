from fastapi import APIRouter, Depends, HTTPException
from app.schemas_extended import (VillageMetrics, DistrictMetrics, SchemePerformance, GovernmentDashboardStats, InsightAlert)
from app.database import get_collection, EVENT_LOGS_COLLECTION, SCHEME_APPLICATIONS_COLLECTION, AGENTS_COLLECTION, VILLAGES_COLLECTION
from app.utils.auth import get_current_user
from datetime import datetime, timedelta
from typing import List, Optional
from collections import Counter

router = APIRouter()

@router.get("/villages/{village_code}", response_model=VillageMetrics)
async def get_village_metrics(village_code: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER", "MINISTRY"]:
        raise HTTPException(status_code=403, detail="Government access required")
    
    villages_collection = get_collection(VILLAGES_COLLECTION)
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    village = await villages_collection.find_one({"village_code": village_code})
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
    
    population = village.get("population", 0)
    awareness_events = await event_logs_collection.distinct(
        "user_id",
        {"village_code": village_code, "event_type": {"$in": ["SCHEME_VIEWED", "WHATSAPP_INTERACTION", "IVR_CALL_COMPLETED"]}}
    )
    unique_aware = len(awareness_events)
    awareness_percentage = (unique_aware / population * 100) if population > 0 else 0.0
    applications = await applications_collection.find({"village_code": village_code}).to_list(None)
    total_applications = len(applications)
    total_approved = sum(1 for app in applications if app.get("status") == "approved")
    total_rejected = sum(1 for app in applications if app.get("status") == "rejected")
    
    approval_rate = (total_approved / total_applications * 100) if total_applications > 0 else 0.0
    processing_times = []
    for app in applications:
        if app.get("submitted_at") and (app.get("approved_at") or app.get("rejected_at")):
            end_time = app.get("approved_at") or app.get("rejected_at")
            delta = end_time - app["submitted_at"]
            processing_times.append(delta.days)
    
    avg_processing_days = sum(processing_times) / len(processing_times) if processing_times else 0.0
    rejection_reasons = [app.get("rejection_reason") for app in applications if app.get("status") == "rejected" and app.get("rejection_reason")]
    top_rejection = Counter(rejection_reasons).most_common(1)[0][0] if rejection_reasons else None
    cost_per_beneficiary = 0.0  
    
    return {
        "village_code": village_code,
        "village_name": village["village_name"],
        "population": population,
        "awareness_percentage": awareness_percentage,
        "total_applications": total_applications,
        "total_approved": total_approved,
        "approval_rate": approval_rate,
        "avg_processing_days": avg_processing_days,
        "top_rejection_reason": top_rejection,
        "cost_per_beneficiary": cost_per_beneficiary
    }

@router.get("/districts/{district_code}", response_model=DistrictMetrics)
async def get_district_metrics(district_code: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER", "MINISTRY"]:
        raise HTTPException(status_code=403, detail="Government access required")
    
    villages_collection = get_collection(VILLAGES_COLLECTION)
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    agents_collection = get_collection(AGENTS_COLLECTION)
    villages = await villages_collection.find({"district_code": district_code}).to_list(None)
    total_villages = len(villages)
    total_population = sum(v.get("population", 0) for v in villages)
    all_applications = await applications_collection.find({"district_code": district_code}).to_list(None)
    total_applications = len(all_applications)
    total_approved = sum(1 for app in all_applications if app.get("status") == "approved")
    approval_rate = (total_approved / total_applications * 100) if total_applications > 0 else 0.0
    active_agents = await agents_collection.count_documents({
        "assigned_villages": {"$in": [v["village_code"] for v in villages]},
        "is_active": True
    })
    
    return {
        "district_code": district_code,
        "district_name": f"District {district_code}",  # TODO: Load from master
        "total_villages": total_villages,
        "total_population": total_population,
        "total_applications": total_applications,
        "total_approved": total_approved,
        "approval_rate": approval_rate,
        "active_agents": active_agents,
        "avg_village_approval_rate": approval_rate  # Simplified aggregate
    }

@router.get("/schemes/{scheme_id}/performance", response_model=SchemePerformance)
async def get_scheme_performance( scheme_id: str, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER", "MINISTRY"]:
        raise HTTPException(status_code=403, detail="Government access required")
    
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    total_views = await event_logs_collection.count_documents({
        "scheme_id": scheme_id,
        "event_type": "SCHEME_VIEWED"
    })
    
    applications = await applications_collection.find({"scheme_id": scheme_id}).to_list(None)
    total_applications = len(applications)
    total_approved = sum(1 for app in applications if app.get("status") == "approved")
    total_delivered = sum(1 for app in applications if app.get("status") == "delivered")
    view_to_application_rate = (total_applications / total_views * 100) if total_views > 0 else 0.0
    application_to_approval_rate = (total_approved / total_applications * 100) if total_applications > 0 else 0.0
    approval_to_delivery_rate = (total_delivered / total_approved * 100) if total_approved > 0 else 0.0
    overall_success_rate = (total_delivered / total_applications * 100) if total_applications > 0 else 0.0
    processing_times = []
    for app in applications:
        if app.get("submitted_at") and app.get("delivered_at"):
            delta = app["delivered_at"] - app["submitted_at"]
            processing_times.append(delta.days)
    
    avg_time_to_delivery = sum(processing_times) / len(processing_times) if processing_times else 0.0
    
    return {
        "scheme_id": scheme_id,
        "scheme_name": "Scheme Name",  
        "total_views": total_views,
        "total_applications": total_applications,
        "total_approved": total_approved,
        "total_delivered": total_delivered,
        "view_to_application_rate": view_to_application_rate,
        "application_to_approval_rate": application_to_approval_rate,
        "approval_to_delivery_rate": approval_to_delivery_rate,
        "overall_success_rate": overall_success_rate,
        "avg_time_to_delivery_days": avg_time_to_delivery
    }

@router.get("/insights", response_model=List[InsightAlert])
async def get_insights(priority: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["ADMIN", "DISTRICT_OFFICER", "STATE_OFFICER", "MINISTRY"]:
        raise HTTPException(status_code=403, detail="Government access required")
    
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    
    insights = []
    all_applications = await applications_collection.find({
        "status": "rejected",
        "created_at": {"$gte": datetime.utcnow() - timedelta(days=30)}
    }).to_list(None)
    
    if all_applications:
        rejection_reasons = Counter([app.get("rejection_reason") for app in all_applications if app.get("rejection_reason")])
        for reason, count in rejection_reasons.most_common(3):
            if count > 10:  # Threshold
                insights.append({
                    "insight_type": "documentation_confusion",
                    "title": f"High rejections due to: {reason}",
                    "description": f"{count} applications rejected in last 30 days due to '{reason}'. Consider awareness campaign.",
                    "affected_entity": reason,
                    "priority": "high" if count > 50 else "medium",
                    "created_at": datetime.utcnow()
                })
    
    pending_apps = await applications_collection.find({
        "status": "pending",
        "submitted_at": {"$lt": datetime.utcnow() - timedelta(days=30)}
    }).to_list(None)
    
    if len(pending_apps) > 5:
        insights.append({
            "insight_type": "delay",
            "title": f"{len(pending_apps)} applications pending for >30 days",
            "description": "Review bottlenecks in approval process",
            "affected_entity": "approval_workflow",
            "priority": "high",
            "created_at": datetime.utcnow()
        })
    
    if priority:
        insights = [i for i in insights if i["priority"] == priority]
    
    return insights

@router.get("/government/stats", response_model=GovernmentDashboardStats)
async def get_government_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Get top-level government dashboard statistics"""
    if current_user.get("role") not in ["ADMIN", "MINISTRY"]:
        raise HTTPException(status_code=403, detail="Ministry access required")
    
    villages_collection = get_collection(VILLAGES_COLLECTION)
    applications_collection = get_collection(SCHEME_APPLICATIONS_COLLECTION)
    agents_collection = get_collection(AGENTS_COLLECTION)
    event_logs_collection = get_collection(EVENT_LOGS_COLLECTION)
    
    # Aggregate counts
    total_villages = await villages_collection.count_documents({})
    total_agents = await agents_collection.count_documents({"is_active": True})
    
    applications = await applications_collection.find({}).to_list(None)
    total_applications = len(applications)
    total_approved = sum(1 for app in applications if app.get("status") == "approved")
    
    overall_approval_rate = (total_approved / total_applications * 100) if total_applications > 0 else 0.0
    
    # Unique beneficiaries
    unique_beneficiaries = await applications_collection.distinct("user_id", {"status": "approved"})
    total_beneficiaries = len(unique_beneficiaries)
    
   # Hot districts (most activity)
    recent_apps = await applications_collection.find({
        "created_at": {"$gte": datetime.utcnow() - timedelta(days=30)}
    }).to_list(None)
    
    district_activity = Counter([app.get("district_code") for app in recent_apps if app.get("district_code")])
    top_districts = [{"district_code": code, "activity_count": count} for code, count in district_activity.most_common(5)]
    
    # Top agents
    top_agents = []  # TODO: Calculate from scorecards
    
    return {
        "total_villages": total_villages,
        "total_agents": total_agents,
        "total_applications": total_applications,
        "total_approved": total_approved,
        "overall_approval_rate": overall_approval_rate,
        "total_beneficiaries": total_beneficiaries,
        "top_performing_districts": top_districts,
        "top_performing_agents": top_agents
    }
