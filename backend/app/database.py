from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/fintech_3c")
DB_NAME = "fintech_3c"
_client = None
_db = None

def get_database():
    global _client, _db
    
    if _db is None:
        _client = AsyncIOMotorClient(MONGODB_URI)
        _db = _client[DB_NAME]
    
    return _db

def get_collection(collection_name: str):
    db = get_database()
    return db[collection_name]

async def close_database():
    global _client
    if _client:
        _client.close()

USERS_COLLECTION = "users"
ADMINS_COLLECTION = "admins"
MENTORS_COLLECTION = "mentors"
LESSONS_COLLECTION = "lessons"
SCHEMES_COLLECTION = "schemes"
ACTIVITY_LOGS_COLLECTION = "activity_logs"
FILLED_FORMS_COLLECTION = "filled_forms"
FINANCIAL_PROFILES_COLLECTION = "financial_profiles"
EXPENSES_COLLECTION = "expenses"
AI_FINANCIAL_PLANS_COLLECTION = "ai_financial_plans"

# Agent Network & Analytics Collections
VILLAGES_COLLECTION = "villages"
AGENTS_COLLECTION = "agents"
SCHEME_APPLICATIONS_COLLECTION = "scheme_applications"
AGENT_ACTIONS_COLLECTION = "agent_actions"
EVENT_LOGS_COLLECTION = "event_logs"
INCENTIVES_COLLECTION = "incentives"
INSIGHTS_ALERTS_COLLECTION = "insights_alerts"
