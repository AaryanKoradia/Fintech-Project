from fastapi import APIRouter, Depends, Query
from app.schemas import LessonResponse
from app.database import get_collection, LESSONS_COLLECTION
from app.utils.auth import get_current_user
from typing import List, Optional

router = APIRouter()
SAMPLE_LESSONS = [
    {
        "id": "1",
        "title": "Understanding Savings",
        "description": "Learn the basics of saving money and building wealth",
        "category": "savings",
        "content": "Savings is the foundation of financial security...",
        "icon": "💰",
        "coins": 10,
        "duration": 15,
        "progress": 0
    },
    {
        "id": "2",
        "title": "Creating a Budget",
        "description": "Master the art of budgeting and expense tracking",
        "category": "budgeting",
        "content": "A budget helps you control your spending...",
        "icon": "📊",
        "coins": 10,
        "duration": 20,
        "progress": 0
    },
    {
        "id": "3",
        "title": "Starting a Small Business",
        "description": "Learn how to start and grow a small business",
        "category": "business",
        "content": "Small businesses can transform your financial future...",
        "icon": "🏪",
        "coins": 15,
        "duration": 30,
        "progress": 0
    },
    {
        "id": "4",
        "title": "Banking Basics",
        "description": "Understand bank accounts, deposits, and withdrawals",
        "category": "banking",
        "content": "Banks are essential for managing money safely...",
        "icon": "🏦",
        "coins": 10,
        "duration": 15,
        "progress": 0
    },
    {
        "id": "5",
        "title": "Understanding Insurance",
        "description": "Learn about different types of insurance and protection",
        "category": "insurance",
        "content": "Insurance protects you from unexpected events...",
        "icon": "🛡️",
        "coins": 12,
        "duration": 25,
        "progress": 0
    },
    {
        "id": "6",
        "title": "Investment Basics",
        "description": "Introduction to investing and growing your money",
        "category": "investments",
        "content": "Investing helps your money grow over time...",
        "icon": "📈",
        "coins": 15,
        "duration": 30,
        "progress": 0
    }
]

@router.get("/", response_model=List[LessonResponse])
async def get_lessons(category: Optional[str] = Query(None), current_user: dict = Depends(get_current_user)):
    lessons = SAMPLE_LESSONS.copy()
    
    if category and category != "all":
        lessons = [l for l in lessons if l["category"] == category]
    
    return lessons

@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(lesson_id: str, current_user: dict = Depends(get_current_user)):
    lesson = next((l for l in SAMPLE_LESSONS if l["id"] == lesson_id), None)
    
    if not lesson:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson

@router.post("/{lesson_id}/complete")
async def complete_lesson(lesson_id: str, current_user: dict = Depends(get_current_user)):
    from app.database import get_collection, USERS_COLLECTION
    from bson import ObjectId
    
    lesson = next((l for l in SAMPLE_LESSONS if l["id"] == lesson_id), None)
    
    if not lesson:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    completed_lessons = user.get("completedLessons", [])
    
    if lesson_id in completed_lessons:
        return {
            "message": "Lesson already completed!",
            "coinsEarned": 0
        }
    
    current_coins = user.get("coins", 0)
    new_coins = current_coins + lesson["coins"]
    current_badges = user.get("badges", [])
    new_badge = None
    
    if new_coins >= 50 and "50_coins" not in current_badges:
        current_badges.append("50_coins")
        new_badge = "First 50 Coins!"
    if new_coins >= 100 and "100_coins" not in current_badges:
        current_badges.append("100_coins")
        new_badge = "Century Achiever!"
    if new_coins >= 200 and "200_coins" not in current_badges:
        current_badges.append("200_coins")
        new_badge = "Double Century!"
    if new_coins >= 500 and "500_coins" not in current_badges:
        current_badges.append("500_coins")
        new_badge = "Elite Learner!"
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {
            "$inc": {
                "coins": lesson["coins"],
                "lessonsCompleted": 1
            },
            "$push": {
                "completedLessons": lesson_id
            },
            "$set": {
                "badges": current_badges
            }
        }
    )
    
    response_data = {
        "message": "Lesson completed!",
        "coinsEarned": lesson["coins"],
        "totalCoins": new_coins
    }
    
    if new_badge:
        response_data["newBadge"] = new_badge
    
    return response_data
