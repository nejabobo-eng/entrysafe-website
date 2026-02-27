from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "entrysafe")

# MongoDB Client
client = None
database = None

async def connect_to_mongo():
    """Connect to MongoDB"""
    global client, database
    try:
        client = AsyncIOMotorClient(
            MONGODB_URL,
            server_api=ServerApi('1')
        )
        database = client[MONGODB_DB_NAME]
        
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {MONGODB_DB_NAME}")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("❌ Closed MongoDB connection")

async def create_indexes():
    """Create database indexes for better performance"""
    # Users collection indexes
    await database.users.create_index("uid", unique=True)
    await database.users.create_index("email", unique=True)
    await database.users.create_index("role")
    
    # Documents collection indexes
    await database.documents.create_index("userId")
    await database.documents.create_index("uploadedAt")
    
    # Admin actions log indexes
    await database.admin_actions.create_index("adminId")
    await database.admin_actions.create_index("timestamp")
    
    print("✅ Database indexes created")

def get_database():
    """Get database instance"""
    return database
