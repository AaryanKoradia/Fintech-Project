"""
Initialize the first admin account.
Run this once, with ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME set in the
environment -- it never hardcodes credentials into source.
"""
import asyncio
import os
import sys
from app.database import get_collection, USERS_COLLECTION
from app.utils.auth import hash_password
from datetime import datetime

async def init_admin():
    """Create the first admin account if it doesn't exist."""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_name = os.getenv("ADMIN_NAME", "Admin")

    if not admin_email or not admin_password:
        print("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.")
        print("Example: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' python -m app.init_admin")
        sys.exit(1)

    users_collection = get_collection(USERS_COLLECTION)

    existing_admin = await users_collection.find_one({"email": admin_email})
    if existing_admin:
        print("Admin account already exists for this email.")
        return

    admin_data = {
        "fullName": admin_name,
        "email": admin_email,
        "hashedPassword": hash_password(admin_password),
        "village": "Admin Panel",
        "role": "ADMIN",
        "createdAt": datetime.utcnow(),
        "progress": 0,
        "coins": 0,
        "badges": ["SUPER_ADMIN"],
        "isActive": True
    }

    result = await users_collection.insert_one(admin_data)
    print(f"Admin account created successfully (id: {result.inserted_id}).")
    print("Credentials were not printed -- use the ADMIN_EMAIL/ADMIN_PASSWORD you set.")

if __name__ == "__main__":
    asyncio.run(init_admin())
