import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/fintech_3c")
DB_NAME = "fintech_3c"
SCHEMES_COLLECTION = "schemes"

async def import_schemes():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    schemes_collection = db[SCHEMES_COLLECTION]
    
    try:
        json_file = "scraped_schemes/data.json"
        print(f"Reading schemes from {json_file}...")
        
        with open(json_file, 'r', encoding='utf-8') as f:
            schemes_data = json.load(f)
        
        print(f"Found {len(schemes_data)} schemes to import")
        print("Clearing existing schemes...")
        delete_result = await schemes_collection.delete_many({})
        print(f"Deleted {delete_result.deleted_count} existing schemes")
        
        scheme_ids_seen = {}
        for i, scheme in enumerate(schemes_data):
            scheme['created_at'] = datetime.utcnow()
            scheme['updated_at'] = datetime.utcnow()
            scheme['is_active'] = True
            base_id = scheme['name'].lower().replace(' ', '_').replace('(', '').replace(')', '').replace('-', '_').replace('.', '')
            
            if base_id in scheme_ids_seen:
                scheme_ids_seen[base_id] += 1
                scheme['scheme_id'] = f"{base_id}_{scheme_ids_seen[base_id]}"
            else:
                scheme_ids_seen[base_id] = 0
                scheme['scheme_id'] = base_id
        
        print("Inserting schemes into MongoDB...")
        result = await schemes_collection.insert_many(schemes_data)
        
        print(f"Successfully imported {len(result.inserted_ids)} schemes!")
        
        try:
            await schemes_collection.create_index("scheme_id", unique=True)
            await schemes_collection.create_index("gov_name")
            await schemes_collection.create_index("location")
            await schemes_collection.create_index("purpose")
            print("Created indexes on schemes collection")
        except Exception as idx_error:
            print(f"Note: Some indexes may already exist - {idx_error}")
            print("Continuing...")
            
        total = await schemes_collection.count_documents({})
        central = await schemes_collection.count_documents({"gov_name": "Central Gov"})
        state = await schemes_collection.count_documents({"gov_name": {"$ne": "Central Gov"}})
        
        print(f"\nStatistics:")
        print(f"Total schemes: {total}")
        print(f"Central Government: {central}")
        print(f"State Governments: {state}")
        print(f"\nSample schemes:")
        async for scheme in schemes_collection.find().limit(5):
            print(f"   - {scheme['name']} ({scheme['gov_name']})")
        
    except Exception as e:
        print(f"Error importing schemes: {e}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    print("Starting scheme import...\n")
    asyncio.run(import_schemes())
    print("\nImport completed!")
