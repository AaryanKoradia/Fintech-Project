import asyncio
from app.database import get_collection, AGENTS_COLLECTION

async def verify():
    agents_col = get_collection(AGENTS_COLLECTION)
    agent = await agents_col.find_one({"email": "agent@gmail.com"})
    
    if agent:
        print("Agent found in MongoDB!")
        print(f"Collection: agents")
        print(f"Email: {agent.get('email')}")
        print(f"Full Name: {agent.get('full_name')}")
        print(f"Role: {agent.get('role')}")
        print(f"Agent Type: {agent.get('agent_type')}")
        print(f"Is Active: {agent.get('is_active')}")
        print(f"Is Verified: {agent.get('is_verified')}")
        print(f"ID: {agent.get('_id')}")
        print(f"Password Hash: {agent.get('password')[:30]}...")
    else:
        print("Agent NOT found in database")

if __name__ == "__main__":
    asyncio.run(verify())
