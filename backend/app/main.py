from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
from app.routes import auth, users, admin, lessons, schemes, ai

app = FastAPI(title="FinLit API", description="Financial Literacy & Empowerment Platform API", version="1.0.0")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

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

@app.get("/")
async def root():
    return { "message": "FinLit API is running", "version": "1.0.0", "status": "healthy" }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
