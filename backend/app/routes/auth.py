from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import UserSignup, UserLogin, Token, UserResponse
from app.database import get_collection, USERS_COLLECTION, AGENTS_COLLECTION
from app.utils.auth import hash_password, verify_password, create_access_token, get_current_user
from bson import ObjectId
from datetime import datetime
from bson import ObjectId

router = APIRouter()

@router.post("/signup", response_model=Token)
async def signup(user_data: UserSignup):
    users_collection = get_collection(USERS_COLLECTION)
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email already exists")

    user_dict = {
        "fullName": user_data.fullName,
        "email": user_data.email,
        "hashedPassword": hash_password(user_data.password),
        "village": user_data.village,
        "role": user_data.role,
        "createdAt": datetime.utcnow(),
        "progress": 0,
        "coins": 0,
        "badges": [],
        "isActive": True
    }
    
    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    access_token = create_access_token(
        data={
            "sub": user_id,
            "email": user_data.email,
            "role": user_data.role
        }
    )
    
    user_response = {
        "id": user_id,
        "fullName": user_data.fullName,
        "email": user_data.email,
        "village": user_data.village,
        "role": user_data.role,
        "progress": 0,
        "coins": 0,
        "badges": []
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"email": credentials.email})
    
    if not user:
        agents_collection = get_collection(AGENTS_COLLECTION)
        agent = await agents_collection.find_one({"email": credentials.email})
        
        if not agent:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        if not agent.get("is_active", False):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Agent account is not active. Please contact admin.")
        
        if not verify_password(credentials.password, agent["password"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        user_id = str(agent["_id"])
        access_token = create_access_token(
            data={
                "sub": user_id,
                "email": agent["email"],
                "role": agent["role"]
            }
        )
        
        user_response = {
            "id": user_id,
            "fullName": agent.get("full_name", "Agent"),
            "email": agent["email"],
            "village": agent.get("assigned_villages", [""])[0] if agent.get("assigned_villages") else "",
            "role": agent["role"],
            "progress": 0,
            "coins": 0,
            "badges": []
        }
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_response
        }
    
    if not verify_password(credentials.password, user["hashedPassword"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(
        data={
            "sub": user_id,
            "email": user["email"],
            "role": user["role"]
        }
    )
    
    user_response = {
        "id": user_id,
        "fullName": user["fullName"],
        "email": user["email"],
        "village": user["village"],
        "role": user["role"],
        "progress": user.get("progress", 0),
        "coins": user.get("coins", 0),
        "badges": user.get("badges", [])
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if user:
        return {
            "id": str(user["_id"]),
            "fullName": user["fullName"],
            "email": user["email"],
            "village": user["village"],
            "role": user["role"],
            "progress": user.get("progress", 0),
            "coins": user.get("coins", 0),
            "badges": user.get("badges", []),
            "isActive": user.get("isActive", True)
        }
    
    agents_collection = get_collection(AGENTS_COLLECTION)
    agent = await agents_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if agent:
        return {
            "id": str(agent["_id"]),
            "fullName": agent.get("full_name", "Agent"),
            "email": agent["email"],
            "village": agent.get("assigned_villages", [""])[0] if agent.get("assigned_villages") else "",
            "role": agent["role"],
            "progress": 0,
            "coins": 0,
            "badges": [],
            "isActive": agent.get("is_active", True)
        }
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
