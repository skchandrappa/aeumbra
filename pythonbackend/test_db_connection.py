"""
Test database connection script
"""

import asyncio
import asyncpg
from core.config import settings


async def test_connection():
    """Test database connection"""
    try:
        # Parse the database URL
        db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
        
        print(f"Testing connection to: {db_url}")
        
        # Test connection
        conn = await asyncpg.connect(db_url)
        
        # Test query
        result = await conn.fetchval("SELECT version()")
        print(f"✅ Database connection successful!")
        print(f"PostgreSQL version: {result}")
        
        # Test table count
        table_count = await conn.fetchval("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
        print(f"✅ Found {table_count} tables in the database")
        
        # Test sample data
        event_types = await conn.fetch("SELECT name FROM event_types LIMIT 3")
        print(f"✅ Sample event types: {[row['name'] for row in event_types]}")
        
        await conn.close()
        print("✅ Database connection test completed successfully!")
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")


if __name__ == "__main__":
    asyncio.run(test_connection())
