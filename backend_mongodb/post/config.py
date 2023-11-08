from pymongo import MongoClient

# MongoDB connection settings
client = MongoClient("mongodb://mongodb/27017")

# Select the database 
db = client["mydatabase_post"]

# Create a reference to the "post" collection 
user_collection = db["post"]



