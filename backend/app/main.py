from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
from app.routes import auth, users, admin, lessons, schemes, ai, confidence, nudges, expenses, document_scanner, whatsapp, voice_call, financial_planning, money_translator, agents, analytics, applications, marketplace

app = FastAPI(title="FinLit API", description="Financial Literacy & Empowerment Platform API", version="1.0.0")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,https://fintech-3c.vercel.app").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["Lessons"])
app.include_router(schemes.router, prefix="/api/schemes", tags=["Schemes"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Advisor"])
app.include_router(confidence.router, prefix="/api/confidence", tags=["Confidence Score"])
app.include_router(nudges.router, prefix="/api/nudges", tags=["Daily Nudges"])
app.include_router(expenses.router, prefix="/api/expenses", tags=["Expense Tracker"])
app.include_router(financial_planning.router, prefix="/api/financial-planning", tags=["AI Financial Planning"])
app.include_router(document_scanner.router, prefix="/api/document-scanner", tags=["Document Scanner"])
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["WhatsApp Messaging"])
app.include_router(voice_call.router, prefix="/api/voice-call", tags=["Voice Call AI Assistant"])
app.include_router(money_translator.router, prefix="/api/money-translator", tags=["Money Translator"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agent Network"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Government Analytics"])
app.include_router(applications.router, prefix="/api/applications", tags=["Scheme Applications"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Marketplace & Redemptions"])

@app.get("/")
async def root():
    return { "message": "FinLit API is running", "version": "1.0.0", "status": "healthy" }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
