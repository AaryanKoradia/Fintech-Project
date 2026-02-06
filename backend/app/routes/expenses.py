"""
Expense Tracker Routes
Simple expense tracking with AI-powered suggestions
Designed for rural users - habit-based, not theory-based
"""

from fastapi import APIRouter, Depends
from app.utils.auth import get_current_user
from app.database import get_collection, USERS_COLLECTION
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional, List
import google.generativeai as genai
import os

router = APIRouter()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')


class ExpenseCreate(BaseModel):
    amount: float
    description: str
    category: str
    date: Optional[str] = None


@router.post("/add")
async def add_expense(
    expense: ExpenseCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Add a daily expense
    Simple - just amount, description, category
    """
    users_collection = get_collection(USERS_COLLECTION)
    
    expense_data = {
        "amount": expense.amount,
        "description": expense.description,
        "category": expense.category,
        "date": expense.date if expense.date else datetime.utcnow().isoformat(),
        "createdAt": datetime.utcnow()
    }
    
    # Add to user's expenses
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {
            "$push": {"expenses": expense_data},
            "$inc": {"totalExpenses": expense.amount}
        }
    )
    
    return {
        "message": "Expense added",
        "expense": expense_data
    }


@router.get("/list")
async def get_expenses(
    days: int = 30,
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's expenses for last N days
    Default: 30 days
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    expenses = user.get("expenses", [])
    
    # Filter by date
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    filtered_expenses = [
        exp for exp in expenses 
        if datetime.fromisoformat(exp.get("date", exp.get("createdAt").isoformat())) >= cutoff_date
    ]
    
    return {
        "expenses": filtered_expenses,
        "count": len(filtered_expenses)
    }


@router.get("/analytics")
async def get_expense_analytics(
    current_user: dict = Depends(get_current_user)
):
    """
    Get expense analytics with AI suggestions
    Category-wise breakdown + Gemini AI advice
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    expenses = user.get("expenses", [])
    
    # Last 30 days
    cutoff_date = datetime.utcnow() - timedelta(days=30)
    recent_expenses = [
        exp for exp in expenses 
        if datetime.fromisoformat(exp.get("date", exp.get("createdAt").isoformat())) >= cutoff_date
    ]
    
    # Category-wise totals
    category_totals = {}
    total_amount = 0
    
    for exp in recent_expenses:
        cat = exp.get("category", "others")
        amt = exp.get("amount", 0)
        category_totals[cat] = category_totals.get(cat, 0) + amt
        total_amount += amt
    
    # Get AI suggestion
    ai_suggestion = await get_ai_suggestion(recent_expenses, category_totals, user)
    
    return {
        "totalExpense": total_amount,
        "categoryBreakdown": category_totals,
        "expenseCount": len(recent_expenses),
        "averageDaily": total_amount / 30 if total_amount > 0 else 0,
        "aiSuggestion": ai_suggestion
    }


async def get_ai_suggestion(expenses: List, category_totals: dict, user: dict):
    """
    Get AI-powered expense suggestions from Gemini
    Rural-friendly, practical advice
    """
    try:
        # Build simple context
        monthly_income = user.get("monthlyIncome", "Not specified")
        occupation = user.get("occupation", "Not specified")
        
        # Top spending categories
        top_categories = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:3]
        
        # Prepare prompt for Gemini
        prompt = f"""
You are a financial advisor for rural India. Give VERY SHORT, PRACTICAL advice in simple language.

User Profile:
- Occupation: {occupation}
- Monthly Income: {monthly_income}

Recent Expenses (Last 30 days):
"""
        for cat, amount in top_categories:
            prompt += f"- {cat}: ₹{amount:.0f}\n"
        
        prompt += """
Give 2-3 SHORT suggestions:
1. One expense category to REDUCE
2. One practical action (like "ask for receipt", "write in notebook")
3. One saving tip

Keep it VERY simple - max 2 lines per point. No complex financial terms.
"""
        
        # Call Gemini API
        response = model.generate_content(prompt)
        
        return {
            "text": response.text,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    except Exception as e:
        # Fallback suggestion if API fails
        highest_category = max(category_totals.items(), key=lambda x: x[1])[0] if category_totals else "shopping"
        
        return {
            "text": f"""💡 Simple Tips:
1. Reduce {highest_category} expenses this week
2. Write every expense in a notebook daily
3. Save ₹20 every day = ₹600 per month!

Remember: Small savings add up!""",
            "timestamp": datetime.utcnow().isoformat()
        }


@router.delete("/{expense_index}")
async def delete_expense(
    expense_index: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an expense by index
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    if not user:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    expenses = user.get("expenses", [])
    
    if expense_index < 0 or expense_index >= len(expenses):
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid index")
    
    # Remove expense
    deleted_expense = expenses.pop(expense_index)
    
    await users_collection.update_one(
        {"_id": ObjectId(current_user["sub"])},
        {
            "$set": {"expenses": expenses},
            "$inc": {"totalExpenses": -deleted_expense.get("amount", 0)}
        }
    )
    
    return {"message": "Expense deleted"}


@router.get("/today-nudge")
async def get_today_expense_nudge(current_user: dict = Depends(get_current_user)):
    """
    Get today's expense-related action nudge
    "Write today's expense", "Ask for receipt", etc.
    """
    users_collection = get_collection(USERS_COLLECTION)
    user = await users_collection.find_one({"_id": ObjectId(current_user["sub"])})
    
    # Check if user added expense today
    expenses = user.get("expenses", [])
    today = datetime.utcnow().date()
    
    has_today_expense = any(
        datetime.fromisoformat(exp.get("date", exp.get("createdAt").isoformat())).date() == today
        for exp in expenses
    )
    
    if not has_today_expense:
        return {
            "nudge": {
                "en": "Write today's expense",
                "hi": "आज का खर्च लिखें"
            },
            "action": "add_expense",
            "icon": "pen"
        }
    else:
        return {
            "nudge": {
                "en": "Good! You tracked today. Save ₹20 today.",
                "hi": "बढ़िया! आज ट्रैक किया। आज ₹20 बचाएं।"
            },
            "action": "save_money",
            "icon": "piggy-bank"
        }
