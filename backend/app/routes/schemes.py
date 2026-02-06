from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import SchemeResponse, SchemeCreate
from app.database import get_collection, SCHEMES_COLLECTION
from app.utils.auth import get_current_user, require_admin
from app.services.event_tracker import track_scheme_view
from typing import List, Dict, Any
from bson import ObjectId

router = APIRouter()

SAMPLE_SCHEMES = [
    {
        "id": "1",
        "name": "Pradhan Mantri Jan Dhan Yojana",
        "description": "Financial inclusion program for opening bank accounts",
        "category": "banking",
        "benefits": "Zero balance account, accident insurance, overdraft facility",
        "eligibility": "Any Indian citizen above 10 years of age",
        "howToApply": "Visit nearest bank branch with identity and address proof"
    },
    {
        "id": "2",
        "name": "PM Kisan Samman Nidhi",
        "description": "Income support for farmers",
        "category": "agriculture",
        "benefits": "₹6000 per year in three installments",
        "eligibility": "Small and marginal farmers with cultivable land",
        "howToApply": "Register online at pmkisan.gov.in or visit nearest Common Service Center"
    },
    {
        "id": "3",
        "name": "Mudra Loan Scheme",
        "description": "Loans for small businesses and entrepreneurs",
        "category": "business",
        "benefits": "Loans up to ₹10 lakh without collateral",
        "eligibility": "Small businesses, shopkeepers, self-employed individuals",
        "howToApply": "Apply through banks, NBFCs, or MFIs with business plan"
    },
    {
        "id": "4",
        "name": "Beti Bachao Beti Padhao",
        "description": "Scheme for girl child welfare and education",
        "category": "women",
        "benefits": "Education support and awareness programs",
        "eligibility": "Girl children and their families",
        "howToApply": "Register at district level or through schools"
    },
    {
        "id": "5",
        "name": "Ayushman Bharat",
        "description": "Health insurance for economically vulnerable families",
        "category": "health",
        "benefits": "Health coverage up to ₹5 lakh per family per year",
        "eligibility": "Families identified in SECC database",
        "howToApply": "Visit nearest Ayushman Mitra or empaneled hospital"
    },
    {
        "id": "6",
        "name": "Pradhan Mantri Awas Yojana",
        "description": "Housing for all scheme",
        "category": "housing",
        "benefits": "Financial assistance for building or purchasing house",
        "eligibility": "Economically weaker sections without pucca house",
        "howToApply": "Apply online at pmaymis.gov.in or through local authorities"
    }
]

@router.get("/", response_model=List[SchemeResponse])
async def get_schemes(current_user: dict = Depends(get_current_user)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    
    try:
        db_schemes = await schemes_collection.find({"is_active": True}).to_list(None)
        
        if db_schemes:
            schemes_list = []
            for scheme in db_schemes:
                purpose_to_category = {
                    "Financial Support": "agriculture",
                    "Health Insurance": "health",
                    "Business Loans": "business",
                    "Social Security": "banking",
                    "Savings": "banking",
                    "Street Vendors": "business",
                    "Housing": "housing",
                    "Education": "education",
                    "Women Empowerment": "women",
                    "Employment": "business",
                    "Agriculture": "agriculture",
                    "Pension": "banking",
                }
                
                category = purpose_to_category.get(scheme.get("purpose", ""), "other")
                
                schemes_list.append({
                    "id": str(scheme["_id"]),
                    "name": scheme.get("name", ""),
                    "description": scheme.get("description", ""),
                    "category": category,
                    "benefits": scheme.get("description", ""), 
                    "eligibility": f"Available in {scheme.get('location', 'India')} under {scheme.get('gov_name', 'Government')}",
                    "howToApply": f"Visit your nearest government office or apply online through the official portal. This scheme is managed by {scheme.get('gov_name', 'Government')}."
                })
            
            return schemes_list
    except Exception as e:
        print(f"Error fetching schemes from DB: {e}")
    return SAMPLE_SCHEMES

@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: str, current_user: dict = Depends(get_current_user)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    await track_scheme_view(user_id=current_user["sub"], scheme_id=scheme_id)
    
    try:
        scheme = await schemes_collection.find_one({"_id": ObjectId(scheme_id)})
        if scheme:
            return {
                "id": str(scheme["_id"]),
                "name": scheme["name"],
                "description": scheme["description"],
                "category": scheme["category"],
                "benefits": scheme["benefits"],
                "eligibility": scheme["eligibility"],
                "howToApply": scheme["howToApply"]
            }
    except:
        pass

    scheme = next((s for s in SAMPLE_SCHEMES if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    
    return scheme

@router.post("/", response_model=SchemeResponse)
async def create_scheme(scheme_data: SchemeCreate, current_user: dict = Depends(require_admin)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    scheme_dict = scheme_data.dict()
    result = await schemes_collection.insert_one(scheme_dict)
    
    return {
        "id": str(result.inserted_id),
        **scheme_dict
    }

@router.delete("/{scheme_id}")
async def delete_scheme(scheme_id: str, current_user: dict = Depends(require_admin)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    result = await schemes_collection.delete_one({"_id": ObjectId(scheme_id)})
    
    if result.deleted_count == 0:
        raise HTTPException( status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    
    return {"message": "Scheme deleted successfully"}

@router.get("/map/locations", response_model=List[Dict[str, Any]])
async def get_scheme_locations(current_user: dict = Depends(get_current_user)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    NEW_DELHI_COORDS = {"lat": 28.6139, "lng": 77.2090}
    
    STATE_COORDINATES = {
        "Pan-India": NEW_DELHI_COORDS, 
        "Rural India": NEW_DELHI_COORDS,  
        "Andhra Pradesh": {"lat": 15.9129, "lng": 79.7400},
        "Bihar": {"lat": 25.0961, "lng": 85.3131},
        "Chhattisgarh": {"lat": 21.2787, "lng": 81.8661},
        "Gujarat": {"lat": 22.2587, "lng": 71.1924},
        "Jharkhand": {"lat": 23.6102, "lng": 85.2799},
        "Karnataka": {"lat": 15.3173, "lng": 75.7139},
        "Kerala": {"lat": 10.8505, "lng": 76.2711},
        "Madhya Pradesh": {"lat": 22.9734, "lng": 78.6569},
        "Maharashtra": {"lat": 19.7515, "lng": 75.7139},
        "Odisha": {"lat": 20.9517, "lng": 85.0985},
        "Punjab": {"lat": 31.1471, "lng": 75.3412},
        "Rajasthan": {"lat": 27.0238, "lng": 74.2179},
        "Tamil Nadu": {"lat": 11.1271, "lng": 78.6569},
        "Telangana": {"lat": 18.1124, "lng": 79.0193},
        "Uttar Pradesh": {"lat": 26.8467, "lng": 80.9462},
        "West Bengal": {"lat": 22.9868, "lng": 87.8550},
        "NCR Region": {"lat": 28.7041, "lng": 77.1025},
        "Northeast India": {"lat": 26.2006, "lng": 92.9376},
    }
    
    try:
        schemes = await schemes_collection.find({"is_active": True}).to_list(None)
        location_schemes = {}
        for scheme in schemes:
            location = scheme.get("location", "Pan-India")
            
            if location not in location_schemes:
                location_schemes[location] = {
                    "location": location,
                    "coordinates": STATE_COORDINATES.get(location, NEW_DELHI_COORDS),
                    "schemes": []
                }
            
            location_schemes[location]["schemes"].append({
                "id": str(scheme["_id"]),
                "name": scheme.get("name", ""),
                "gov_name": scheme.get("gov_name", ""),
                "purpose": scheme.get("purpose", ""),
                "description": scheme.get("description", "")
            })
        result = sorted(location_schemes.values(), key=lambda x: len(x["schemes"]), reverse=True)
        
        return result
        
    except Exception as e:
        print(f"Error fetching scheme locations: {e}")
        raise HTTPException(status_code=500, detail=str(e))
