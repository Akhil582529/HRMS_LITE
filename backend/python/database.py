from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

client = None
db = None
employee_collection = None
attendance_collection = None

try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ MongoDB connected successfully!")
    
    db = client["employee_db"]
    employee_collection = db["employees"]
    attendance_collection = db["attendance"]
    
except ConnectionFailure as e:
    print(f"❌ MongoDB connection failed: {e}")
    print("Please start MongoDB with: brew services start mongodb-community")
except Exception as e:
    print(f"❌ Unexpected error: {e}")