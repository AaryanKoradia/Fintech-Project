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
