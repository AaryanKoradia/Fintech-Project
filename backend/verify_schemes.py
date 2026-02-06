import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def verify():
    client = AsyncIOMotorClient('mongodb://localhost:27017/fintech_3c')
    db = client['fintech_3c']
    
    count = await db.schemes.count_documents({})
    print(f'\nTotal schemes in database: {count}\n')
    
    print('First 10 schemes:')
    async for scheme in db.schemes.find().limit(10):
        print(f"  - {scheme['name']} ({scheme['gov_name']}) - {scheme['purpose']}")
    
    pipeline = [
        {"$group": {"_id": "$gov_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    print('\nSchemes by Government:')
    async for result in db.schemes.aggregate(pipeline):
        print(f"  - {result['_id']}: {result['count']} schemes")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(verify())
