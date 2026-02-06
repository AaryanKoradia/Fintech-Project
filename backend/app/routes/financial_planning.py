from fastapi import APIRouter, Depends, HTTPException
from app.schemas import (UserFinancialProfileCreate, UserFinancialProfileResponse, ExpenseCreate, ExpenseResponse, MonthlyBudgetSummary, AIFinancialPlanResponse)
from app.database import get_collection, FINANCIAL_PROFILES_COLLECTION, EXPENSES_COLLECTION, AI_FINANCIAL_PLANS_COLLECTION, SCHEMES_COLLECTION
from app.utils.auth import get_current_user
from bson import ObjectId
from datetime import datetime
from typing import List
import os
import logging
import google.generativeai as genai

router = APIRouter()
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@router.post("/profile", response_model=UserFinancialProfileResponse)
async def create_or_update_financial_profile(profile_data: UserFinancialProfileCreate, current_user: dict = Depends(get_current_user)):
    profiles_collection = get_collection(FINANCIAL_PROFILES_COLLECTION)
    existing_profile = await profiles_collection.find_one({"userId": current_user["sub"]})
    
    profile_dict = profile_data.dict()
    profile_dict["userId"] = current_user["sub"]
    
    if existing_profile:
        profile_dict["updatedAt"] = datetime.utcnow()
        await profiles_collection.update_one(
            {"userId": current_user["sub"]},
            {"$set": profile_dict}
        )
        profile_dict["id"] = str(existing_profile["_id"])
        profile_dict["createdAt"] = existing_profile["createdAt"]
    else:
        profile_dict["createdAt"] = datetime.utcnow()
        profile_dict["updatedAt"] = datetime.utcnow()
        result = await profiles_collection.insert_one(profile_dict.copy())
        profile_dict["id"] = str(result.inserted_id)
    
    if "_id" in profile_dict:
        del profile_dict["_id"]
    
    return profile_dict

@router.get("/profile", response_model=UserFinancialProfileResponse)
async def get_financial_profile(current_user: dict = Depends(get_current_user)):
    try:
        profiles_collection = get_collection(FINANCIAL_PROFILES_COLLECTION)
        profile = await profiles_collection.find_one({"userId": current_user["sub"]})
        
        if not profile:
            raise HTTPException(status_code=404, detail="Financial profile not found. Please create one first.")
        
        profile["id"] = str(profile["_id"])
        del profile["_id"]
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching financial profile: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

@router.post("/generate-plan", response_model=AIFinancialPlanResponse)
async def generate_ai_financial_plan(current_user: dict = Depends(get_current_user)):
    """Generate AI-powered financial plan based on user's profile"""
    
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    profiles_collection = get_collection(FINANCIAL_PROFILES_COLLECTION)
    profile = await profiles_collection.find_one({"userId": current_user["sub"]})
    
    if not profile:
        raise HTTPException(status_code=404, detail="Please create your financial profile first")
    
    schemes_collection = get_collection(SCHEMES_COLLECTION)
    all_schemes = await schemes_collection.find({"is_active": True}).to_list(100)
    
    family_context = ""
    if profile.get("familyMembers"):
        family_context = "\n".join([
            f"- {member['name']}: {member['relationship']}, {member['age']} years, {member['gender']}"
            for member in profile["familyMembers"]
        ])
    
    milestones_context = ""
    if profile.get("lifeMilestones"):
        milestones_context = "\n".join([
            f"- {milestone['goal']}: Target year {milestone['targetYear']}, Estimated ₹{milestone['estimatedCost']}, Priority: {milestone['priority']}"
            for milestone in profile["lifeMilestones"]
        ])
    
    prompt = f"""You are an expert financial advisor for Indian families. Create a comprehensive financial plan.

USER PROFILE:
- Monthly Income: ₹{profile.get('monthlyIncome', 0)}
- Occupation: {profile.get('occupation', 'Not specified')}
- Has Bank Account: {profile.get('hasBankAccount', False)}
- Has Insurance: {profile.get('hasInsurance', False)}

FAMILY MEMBERS:
{family_context if family_context else 'No family members specified'}

LIFE MILESTONES/GOALS:
{milestones_context if milestones_context else 'No specific goals mentioned'}

TASK: Create a detailed financial plan with the following structure (respond in valid JSON format):

{{
  "recommendedSavings": <monthly savings amount as number>,
  "budgetAllocation": {{
    "essentials": <percentage as number>,
    "savings": <percentage as number>,
    "investments": <percentage as number>,
    "insurance": <percentage as number>,
    "education": <percentage as number>,
    "entertainment": <percentage as number>
  }},
  "recommendedSchemes": [
    {{
      "name": "<scheme name>",
      "reason": "<why this scheme is relevant>",
      "estimatedBenefit": "<benefit amount or description>"
    }}
  ],
  "milestoneRoadmap": [
    {{
      "milestone": "<goal name>",
      "targetYear": <year as number>,
      "monthlySavingNeeded": <amount as number>,
      "strategy": "<how to achieve this goal>"
    }}
  ],
  "aiAdvice": "<3-4 paragraph personalized financial advice in simple language. If user has daughters, mention Sukanya Samriddhi Yojana. If sons, mention education savings. Include insurance advice if needed. Be specific and actionable.>"
}}

Consider:
1. For daughters: Sukanya Samriddhi Yojana, Beti Bachao Beti Padhao
2. For low income (<₹15000): PM Jan Dhan Yojana, Atal Pension Yojana
3. For farmers: PM Kisan, Kisan Credit Card
4. For business: Mudra Loan
5. General: Emergency fund (3-6 months expenses), Term insurance, Health insurance

Respond ONLY with valid JSON, no additional text."""
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        
        import json
        import re
        
        response_text = response.text.strip()
        response_text = re.sub(r'```json\s*', '', response_text)
        response_text = re.sub(r'```\s*', '', response_text)
        
        ai_plan = json.loads(response_text)
        plans_collection = get_collection(AI_FINANCIAL_PLANS_COLLECTION)
        month_year = datetime.utcnow().strftime("%Y-%m")
        
        plan_document = {
            "userId": current_user["sub"],
            "monthYear": month_year,
            "monthlyIncome": profile.get("monthlyIncome", 0),
            "recommendedSavings": ai_plan.get("recommendedSavings", 0),
            "recommendedSchemes": ai_plan.get("recommendedSchemes", []),
            "milestoneRoadmap": ai_plan.get("milestoneRoadmap", []),
            "budgetAllocation": ai_plan.get("budgetAllocation", {}),
            "aiAdvice": ai_plan.get("aiAdvice", ""),
            "createdAt": datetime.utcnow()
        }
        
        existing_plan = await plans_collection.find_one({
            "userId": current_user["sub"],
            "monthYear": month_year
        })
        
        if existing_plan:
            await plans_collection.update_one(
                {"_id": existing_plan["_id"]},
                {"$set": plan_document}
            )
        else:
            await plans_collection.insert_one(plan_document)
        
        logger.info(f"AI financial plan generated for user {current_user['sub']}")
        return plan_document
        
    except Exception as e:
        logger.error(f"Error generating AI plan: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate financial plan: {str(e)}")

@router.get("/plan", response_model=AIFinancialPlanResponse)
async def get_current_financial_plan(current_user: dict = Depends(get_current_user)):
    plans_collection = get_collection(AI_FINANCIAL_PLANS_COLLECTION)
    month_year = datetime.utcnow().strftime("%Y-%m")
    
    plan = await plans_collection.find_one({ "userId": current_user["sub"], "monthYear": month_year })
    
    if not plan:
        raise HTTPException(status_code=404, detail="No financial plan found for this month. Please generate one first.")
    
    if "_id" in plan:
        del plan["_id"]
    
    return plan

@router.post("/expenses", response_model=ExpenseResponse)
async def add_expense( expense_data: ExpenseCreate, current_user: dict = Depends(get_current_user)):
    expenses_collection = get_collection(EXPENSES_COLLECTION)
    expense_dict = expense_data.dict()
    expense_dict["userId"] = current_user["sub"]
    expense_dict["monthYear"] = datetime.utcnow().strftime("%Y-%m")
    expense_dict["createdAt"] = datetime.utcnow()
    
    if not expense_dict.get("date"):
        expense_dict["date"] = datetime.utcnow()
    unnecessary_categories = ["entertainment", "shopping", "luxury", "dining out", "subscriptions"]
    expense_dict["isUnnecessary"] = expense_data.category.lower() in unnecessary_categories
    
    result = await expenses_collection.insert_one(expense_dict.copy())
    expense_dict["id"] = str(result.inserted_id)
    
    if "_id" in expense_dict:
        del expense_dict["_id"]
    
    return expense_dict

@router.get("/expenses/monthly", response_model=MonthlyBudgetSummary)
async def get_monthly_summary( month_year: str = None, current_user: dict = Depends(get_current_user)):
    
    if not month_year:
        month_year = datetime.utcnow().strftime("%Y-%m")
    
    profiles_collection = get_collection(FINANCIAL_PROFILES_COLLECTION)
    profile = await profiles_collection.find_one({"userId": current_user["sub"]})
    
    if not profile:
        raise HTTPException(status_code=404, detail="Please create your financial profile first")
    
    monthly_income = profile.get("monthlyIncome", 0)
    expenses_collection = get_collection(EXPENSES_COLLECTION)
    expenses = await expenses_collection.find({
        "userId": current_user["sub"],
        "monthYear": month_year
    }).to_list(None)
    
    total_expenses = sum(exp["amount"] for exp in expenses)
    unnecessary_expenses = sum(exp["amount"] for exp in expenses if exp.get("isUnnecessary", False))
    plans_collection = get_collection(AI_FINANCIAL_PLANS_COLLECTION)
    ai_plan = await plans_collection.find_one({
        "userId": current_user["sub"],
        "monthYear": month_year
    })
    
    recommended_savings = ai_plan.get("recommendedSavings", monthly_income * 0.2) if ai_plan else monthly_income * 0.2
    
    remaining = monthly_income - total_expenses
    actual_savings = max(0, remaining)
    
    if remaining >= recommended_savings:
        budget_status = "on-track"
    elif remaining >= 0:
        budget_status = "warning"
    else:
        budget_status = "exceeded"
    
    formatted_expenses = []
    for exp in expenses:
        exp["id"] = str(exp["_id"])
        formatted_expenses.append(exp)
    
    return {
        "monthYear": month_year,
        "totalIncome": monthly_income,
        "totalExpenses": total_expenses,
        "remaining": remaining,
        "savings": actual_savings,
        "expenses": formatted_expenses,
        "unnecessaryExpenses": unnecessary_expenses,
        "budgetStatus": budget_status
    }

@router.delete("/expenses/{expense_id}")
async def delete_expense( expense_id: str, current_user: dict = Depends(get_current_user)):
    expenses_collection = get_collection(EXPENSES_COLLECTION)
    
    result = await expenses_collection.delete_one({
        "_id": ObjectId(expense_id),
        "userId": current_user["sub"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    return {"message": "Expense deleted successfully"}
