from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserSignup(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6, max_length=72)  
    village: str = Field(..., min_length=2, max_length=100)
    role: str = Field(default="USER", pattern="^(USER|ADMIN)$")

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserBase(BaseModel):
    fullName: str
    email: str
    village: str
    role: str = "USER"

class UserInDB(UserBase):
    id: str
    hashedPassword: str
    createdAt: datetime
    progress: int = 0
    coins: int = 0
    badges: List[str] = []
    isActive: bool = True

class UserResponse(UserBase):
    id: str
    progress: int = 0
    coins: int = 0
    badges: List[str] = []
    isActive: bool = True

class LessonBase(BaseModel):
    title: str
    description: str
    category: str
    content: str
    icon: Optional[str] = "📖"
    coins: int = 10
    duration: Optional[int] = 15 

class LessonCreate(LessonBase):
    pass

class LessonResponse(LessonBase):
    id: str
    progress: Optional[int] = 0

class SchemeBase(BaseModel):
    name: str
    description: str
    category: str
    benefits: str
    eligibility: str
    howToApply: str

class SchemeCreate(SchemeBase):
    pass

class SchemeResponse(SchemeBase):
    id: str

class AIQuestion(BaseModel):
    question: str = Field(..., min_length=5, max_length=500)

class AIResponse(BaseModel):
    question: str
    answer: str

class UserStats(BaseModel):
    lessonsCompleted: int = 0
    totalLessons: int = 10
    coinsEarned: int = 0
    badges: List[str] = []
    progress: int = 0

class AdminStats(BaseModel):
    totalUsers: int = 0
    activeUsers: int = 0
    averageProgress: int = 0
    totalSchemes: int = 0

class AdminCreate(BaseModel):
    fullName: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)
    village: str = Field(default="Admin Panel")

class AdminResponse(BaseModel):
    id: str
    fullName: str
    email: str
    village: str
    role: str
    createdAt: datetime
    isActive: bool

# Financial Planning & Expense Tracking Schemas
class FamilyMember(BaseModel):
    name: str
    relationship: str  # "spouse", "son", "daughter", "parent"
    age: int
    gender: str  # "male", "female"

class LifeMilestone(BaseModel):
    goal: str
    targetYear: int
    estimatedCost: float
    priority: str  # "high", "medium", "low"

class UserFinancialProfileCreate(BaseModel):
    monthlyIncome: float = Field(..., gt=0)
    familyMembers: List[FamilyMember] = []
    lifeMilestones: List[LifeMilestone] = []
    occupation: Optional[str] = None
    hasInsurance: bool = False
    hasBankAccount: bool = False

class UserFinancialProfileResponse(UserFinancialProfileCreate):
    id: str
    userId: str
    createdAt: datetime
    updatedAt: datetime

class AIFinancialPlanResponse(BaseModel):
    userId: str
    monthYear: str  # "2026-02"
    monthlyIncome: float
    recommendedSavings: float
    recommendedSchemes: List[dict]
    milestoneRoadmap: List[dict]
    budgetAllocation: dict
    aiAdvice: str
    createdAt: datetime

class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0)
    category: str
    description: str
    date: Optional[datetime] = None

class ExpenseResponse(ExpenseCreate):
    id: str
    userId: str
    monthYear: str
    isUnnecessary: bool = False
    createdAt: datetime

class MonthlyBudgetSummary(BaseModel):
    monthYear: str
    totalIncome: float
    totalExpenses: float
    remaining: float
    savings: float
    expenses: List[ExpenseResponse]
    unnecessaryExpenses: float
    budgetStatus: str  # "on-track", "warning", "exceeded"
