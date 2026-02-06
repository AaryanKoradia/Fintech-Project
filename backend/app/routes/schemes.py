from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas import SchemeResponse, SchemeCreate
from app.database import get_collection, SCHEMES_COLLECTION
from app.utils.auth import get_current_user, require_admin
from typing import List
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
    db_schemes = await schemes_collection.find({}).to_list(None)
    
    if db_schemes:
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
            for scheme in db_schemes
        ]
    return SAMPLE_SCHEMES

@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: str, current_user: dict = Depends(get_current_user)):
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    
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
