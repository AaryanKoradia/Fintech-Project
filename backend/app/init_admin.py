"""
Initialize default admin account
Run this script once to create the default admin user
"""
import asyncio
from app.database import get_collection, USERS_COLLECTION
from app.utils.auth import hash_password
from datetime import datetime

async def init_admin():
    """Create default admin account if it doesn't exist"""
    users_collection = get_collection(USERS_COLLECTION)
    
    # Check if admin already exists
    existing_admin = await users_collection.find_one({"email": "prince@gmail.com"})
    
    if existing_admin:
        print("✅ Admin account already exists!")
        return
    
    # Create default admin
    admin_data = {
        "fullName": "Prince Maurya",
        "email": "prince@gmail.com",
        "hashedPassword": hash_password("Maurya@10"),
        "village": "Admin Panel",
        "role": "ADMIN",
        "createdAt": datetime.utcnow(),
        "progress": 0,
        "coins": 0,
        "badges": ["SUPER_ADMIN"],
        "isActive": True
    }
    
    result = await users_collection.insert_one(admin_data)
    print(f"✅ Default admin created successfully!")
    print(f"   Email: prince@gmail.com")
    print(f"   Password: Maurya@10")
    print(f"   ID: {result.inserted_id}")

if __name__ == "__main__":
    asyncio.run(init_admin())
