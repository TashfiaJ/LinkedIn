from fastapi import APIRouter, FastAPI, HTTPException
from model import User
from config import user_collection  # Import the user collection reference
import JWTtoken

router=APIRouter()

# API to create a new user
@router.post("/user/create")
async def create_user(user_data: User):
    # Check if the user already exists
    if user_collection.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Insert the user data into the MongoDB collection
    user_collection.insert_one(user_data.dict())
    print("Ki hoitese")
    return {"message": "User created successfully"}

# API for user login
@router.post("/user/login")
async def login_user(user_data: User):
    user = user_collection.find_one({"username": user_data.username, "email": user_data.email, "password": user_data.password})
    if user is None:
        raise HTTPException(status_code=401, detail="Login failed. Invalid credentials")

    access_token = JWTtoken.create_access_token(data={"sub": user_data.email})
    return {"access_token": access_token, "token_type": "bearer"}
