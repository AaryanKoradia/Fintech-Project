"""
Initialize test agent account
Run this script to create a test agent user
"""
import asyncio
from app.database import get_collection, AGENTS_COLLECTION, get_database
from app.utils.auth import hash_password
from datetime import datetime

async def init_agent():
    """Create test agent account"""
    try:
        # Test database connection
        print("🔄 Connecting to MongoDB...")
        db = get_database()
        agents_collection = get_collection(AGENTS_COLLECTION)
        
        # Test connection by listing collections
        collections = await db.list_collection_names()
        print(f"✅ Connected to database: fintech_3c")
        print(f"📂 Found {len(collections)} collections")
        
        # Check if agent already exists
        print(f"🔍 Checking for existing agent...")
        existing_agent = await agents_collection.find_one({"email": "agent@gmail.com"})
        
        if existing_agent:
            print("✅ Agent account already exists!")
            print(f"   Email: agent@gmail.com")
            print(f"   Password: 1234")
            print(f"   ID: {existing_agent.get('_id')}")
            return
        
        # Create test agent
        print(f"➕ Creating new agent account...")
        agent_data = {
            "email": "agent@gmail.com",
            "password": hash_password("1234"),
            "full_name": "Test Agent",
            "phone": "+919876543210",
            "agent_type": "csc_operator",
            "assigned_villages": ["VIL001", "VIL002"],
            "role": "AGENT",
            "is_active": True,  # Pre-approved for testing
            "is_verified": True,
            "created_at": datetime.utcnow(),
            "performance_score": 75.0,
            "total_assisted": 15
        }
        
        result = await agents_collection.insert_one(agent_data)
        
        # Verify creation
        created_agent = await agents_collection.find_one({"_id": result.inserted_id})
        if created_agent:
            print(f"✅ Test agent created successfully!")
            print(f"   Email: agent@gmail.com")
            print(f"   Password: 1234")
            print(f"   Role: AGENT")
            print(f"   Type: CSC Operator")
            print(f"   Villages: VIL001, VIL002")
            print(f"   ID: {result.inserted_id}")
            print(f"\n🚀 Login at: http://localhost:5173/login")
            print(f"📱 Agent Portal: http://localhost:5173/agent/portal")
        else:
            print(f"❌ Failed to verify agent creation")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print(f"   Type: {type(e).__name__}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(init_agent())
