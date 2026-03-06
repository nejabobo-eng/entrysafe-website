"""
Test MongoDB Atlas Connection
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test_mongodb_atlas():
    """Test connection to MongoDB Atlas"""
    connection_string = "mongodb+srv://nejabobo_db_user:VyB78zBwuK1uPd7L@cluster0.bml72l4.mongodb.net/?retryWrites=true&w=majority"
    
    print("🔍 Testing MongoDB Atlas connection...")
    print(f"   Connection: cluster0.bml72l4.mongodb.net")
    print(f"   User: nejabobo_db_user")
    print()
    
    try:
        # Create client
        client = AsyncIOMotorClient(connection_string)
        
        # Test connection with ping
        result = await client.admin.command('ping')
        
        print("✅ MongoDB Atlas connected successfully!")
        print(f"   Ping result: {result}")
        print()
        
        # List databases
        databases = await client.list_database_names()
        print(f"📊 Available databases: {databases}")
        
        # Check if entrysafe database exists
        db = client.entrysafe
        collections = await db.list_collection_names()
        print(f"📁 Collections in 'entrysafe': {collections if collections else '(none yet)'}")
        
        print()
        print("🎉 MongoDB Atlas is ready for production!")
        print("   You can now deploy to Render with this connection string.")
        
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print()
        print("Troubleshooting:")
        print("1. Check your password is correct")
        print("2. Verify IP whitelist includes 0.0.0.0/0")
        print("3. Wait 2-3 minutes after setting up Atlas")
        return False
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test_mongodb_atlas())
