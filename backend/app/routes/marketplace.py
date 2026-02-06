from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_collection, USERS_COLLECTION
from app.utils.auth import get_current_user
from app.services.event_tracker import track_event
from typing import List, Dict, Any
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

# Redemption categories with government subsidies
MARKETPLACE_ITEMS = [
    {
        "id": "electricity_bill",
        "name": "Electricity Bill Payment",
        "name_hi": "बिजली बिल भुगतान",
        "category": "utilities",
        "icon": "⚡",
        "coins_required": 100,
        "rupees_value": 200,
        "description": "Pay your electricity bill with coins. Government subsidy doubles the value!",
        "description_hi": "सिक्कों से बिजली बिल भुगतान करें। सरकारी सब्सिडी मूल्य को दोगुना करती है!",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "water_bill",
        "name": "Water Bill Payment",
        "name_hi": "पानी बिल भुगतान",
        "category": "utilities",
        "icon": "💧",
        "coins_required": 50,
        "rupees_value": 100,
        "description": "Pay your water bill with government subsidy",
        "description_hi": "सरकारी सब्सिडी के साथ पानी का बिल भुगतान करें",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "ration",
        "name": "Ration/Food Grains",
        "name_hi": "राशन/खाद्यान्न",
        "category": "food",
        "icon": "🌾",
        "coins_required": 150,
        "rupees_value": 300,
        "description": "Redeem for monthly ration supply worth ₹300",
        "description_hi": "₹300 मूल्य की मासिक राशन आपूर्ति के लिए भुनाएं",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "lpg_cylinder",
        "name": "LPG Cylinder Subsidy",
        "name_hi": "एलपीजी सिलेंडर सब्सिडी",
        "category": "fuel",
        "icon": "🔥",
        "coins_required": 200,
        "rupees_value": 400,
        "description": "Get LPG cylinder at subsidized rate",
        "description_hi": "सब्सिडी दर पर एलपीजी सिलेंडर प्राप्त करें",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "mobile_recharge",
        "name": "Mobile Recharge",
        "name_hi": "मोबाइल रिचार्ज",
        "category": "communication",
        "icon": "📱",
        "coins_required": 50,
        "rupees_value": 100,
        "description": "Recharge your mobile with government support",
        "description_hi": "सरकारी सहायता से मोबाइल रिचार्ज करें",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "school_fees",
        "name": "School Fee Support",
        "name_hi": "स्कूल शुल्क सहायता",
        "category": "education",
        "icon": "🎓",
        "coins_required": 300,
        "rupees_value": 600,
        "description": "Support for children's school fees",
        "description_hi": "बच्चों के स्कूल शुल्क के लिए सहायता",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "medicine",
        "name": "Medicine Purchase",
        "name_hi": "दवा खरीद",
        "category": "healthcare",
        "icon": "💊",
        "coins_required": 80,
        "rupees_value": 160,
        "description": "Purchase essential medicines at subsidized rates",
        "description_hi": "सब्सिडी दरों पर आवश्यक दवाएं खरीदें",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "transport",
        "name": "Transport/Bus Pass",
        "name_hi": "परिवहन/बस पास",
        "category": "transport",
        "icon": "🚌",
        "coins_required": 100,
        "rupees_value": 200,
        "description": "Monthly bus pass or transport subsidy",
        "description_hi": "मासिक बस पास या परिवहन सब्सिडी",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "grocery",
        "name": "Grocery Essentials",
        "name_hi": "किराना आवश्यक सामान",
        "category": "food",
        "icon": "🛒",
        "coins_required": 120,
        "rupees_value": 240,
        "description": "Purchase basic grocery items",
        "description_hi": "बुनियादी किराना सामान खरीदें",
        "subsidy_percent": 100,
        "available": True
    },
    {
        "id": "clothing",
        "name": "Clothing Voucher",
        "name_hi": "कपड़ों का वाउचर",
        "category": "lifestyle",
        "icon": "👕",
        "coins_required": 250,
        "rupees_value": 500,
        "description": "Voucher for clothing and essentials",
        "description_hi": "कपड़े और आवश्यक वस्तुओं के लिए वाउचर",
        "subsidy_percent": 100,
        "available": True
    }
]

class RedeemRequest(BaseModel):
    item_id: str
    quantity: int = 1

@router.get("/items", response_model=List[Dict[str, Any]])
async def get_marketplace_items(current_user: dict = Depends(get_current_user)):
    """Get all available marketplace items"""
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    user_coins = user.get("coins", 0)
    
    # Add affordability status to each item
    items_with_status = []
    for item in MARKETPLACE_ITEMS:
        item_copy = item.copy()
        item_copy["can_afford"] = user_coins >= item["coins_required"]
        item_copy["user_coins"] = user_coins
        items_with_status.append(item_copy)
    
    return items_with_status

@router.get("/redemptions", response_model=List[Dict[str, Any]])
async def get_redemption_history(current_user: dict = Depends(get_current_user)):
    """Get user's redemption history"""
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    redemptions = user.get("redemptions", [])
    
    # Sort by date descending
    redemptions.sort(key=lambda x: x.get("redeemed_at", ""), reverse=True)
    
    return redemptions

@router.post("/redeem")
async def redeem_item(redemption: RedeemRequest, current_user: dict = Depends(get_current_user)):
    """Redeem coins for marketplace items"""
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Find the item
    item = next((i for i in MARKETPLACE_ITEMS if i["id"] == redemption.item_id), None)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    
    if not item["available"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Item not available")
    
    # Calculate total cost
    total_coins = item["coins_required"] * redemption.quantity
    total_rupees = item["rupees_value"] * redemption.quantity
    
    # Check if user has enough coins
    user_coins = user.get("coins", 0)
    if user_coins < total_coins:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Insufficient coins. You have {user_coins}, need {total_coins}"
        )
    
    # Create redemption record
    redemption_record = {
        "id": str(ObjectId()),
        "item_id": item["id"],
        "item_name": item["name"],
        "item_name_hi": item["name_hi"],
        "category": item["category"],
        "icon": item["icon"],
        "quantity": redemption.quantity,
        "coins_spent": total_coins,
        "rupees_value": total_rupees,
        "subsidy_percent": item["subsidy_percent"],
        "status": "approved",  # Government auto-approves learning rewards
        "redeemed_at": datetime.utcnow().isoformat(),
        "disbursement_method": "direct_benefit_transfer",
        "transaction_id": f"DBT-{ObjectId()}"
    }
    
    # Update user: deduct coins and add redemption
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {
            "$inc": {
                "coins": -total_coins,
                "total_redeemed_coins": total_coins,
                "total_redeemed_rupees": total_rupees
            },
            "$push": {
                "redemptions": redemption_record
            }
        }
    )
    
    # Track redemption event
    await track_event(
        user_id=current_user["sub"],
        event_type="REDEMPTION",
        metadata={
            "item_id": item["id"],
            "item_name": item["name"],
            "quantity": redemption.quantity,
            "coins_spent": total_coins,
            "rupees_value": total_rupees,
            "category": item["category"]
        }
    )
    
    return {
        "success": True,
        "message": f"Successfully redeemed {item['name']}!",
        "message_hi": f"{item['name_hi']} सफलतापूर्वक भुनाया गया!",
        "coins_spent": total_coins,
        "rupees_value": total_rupees,
        "transaction_id": redemption_record["transaction_id"],
        "remaining_coins": user_coins - total_coins,
        "redemption": redemption_record
    }

@router.get("/stats")
async def get_marketplace_stats(current_user: dict = Depends(get_current_user)):
    """Get user's marketplace statistics"""
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    total_redeemed_coins = user.get("total_redeemed_coins", 0)
    total_redeemed_rupees = user.get("total_redeemed_rupees", 0)
    redemptions = user.get("redemptions", [])
    current_coins = user.get("coins", 0)
    
    # Calculate potential value
    potential_rupees = current_coins * 2  # 1 coin = ₹2 with subsidy
    
    # Category breakdown
    category_breakdown = {}
    for redemption in redemptions:
        category = redemption.get("category", "other")
        if category not in category_breakdown:
            category_breakdown[category] = {
                "count": 0,
                "coins": 0,
                "rupees": 0
            }
        category_breakdown[category]["count"] += 1
        category_breakdown[category]["coins"] += redemption.get("coins_spent", 0)
        category_breakdown[category]["rupees"] += redemption.get("rupees_value", 0)
    
    return {
        "current_coins": current_coins,
        "potential_rupees": potential_rupees,
        "conversion_rate": 2,  # 1 coin = ₹2
        "total_redeemed_coins": total_redeemed_coins,
        "total_redeemed_rupees": total_redeemed_rupees,
        "total_redemptions": len(redemptions),
        "category_breakdown": category_breakdown,
        "total_saved": total_redeemed_rupees  # Actual benefit received
    }
