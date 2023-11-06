from pymongo import MongoClient

# MongoDB connection settings
client = MongoClient("mongodb://localhost:27017/")

# Select the database 
db = client["mydatabase_notification"]

# Create a reference to the "user" collection 
user_collection = db["notification"]
