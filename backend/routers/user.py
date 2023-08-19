import requests
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Response, status, FastAPI
from typing import List
import models, schema, database, oauth2
from passlib.context import CryptContext
from JWTtoken import verify_token

from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from fastapi.middleware.cors import CORSMiddleware
import random

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


router = APIRouter(
    prefix="/user",
    tags=['User']
    )
app = FastAPI() 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with the origins that should be allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Password Hashing
pwt_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")



#Create a new user
@router.post('/createUser', response_model=schema.showUserInfo)
def createUserInfo(request: schema.userInfo, db: Session=Depends(database.get_db)):
    hashed_password = pwt_cxt.hash(request.password)
    password_original = request.password
    
    new_user = models.userInfo(email=request.email, password=hashed_password)

    email_found = db.query(models.userInfo).filter(models.userInfo.email == request.email).first()
    #if email is already taken
    if email_found:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail= "Email is already taken")
    
 
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    #registration_email(request.email, "Welcome to Mapping the World Website!", "Thanks for registration!")
    return {"email": new_user.email}

#Get user by email
@router.get('/{email}/userinformation', response_model=schema.showUserInfo)
def show(email:str, db: Session=Depends(database.get_db), 
         current_user: schema.userInfo=Depends(oauth2.get_current_user)):
    user = db.query(models.userInfo).filter(models.userInfo.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with the id {id} is not available")

    return user

#Show all user
@router.get('/allUser', response_model=List[schema.showUserInfo])
def allUser(db: Session = Depends(database.get_db), current_user:
        schema.userInfo=Depends(oauth2.get_current_user)):
    all_user = db.query(models.userInfo).all()
    return all_user

#Update user info
@router.put('/{email}/updateuser', status_code=status.HTTP_202_ACCEPTED)
def updateUser(email:str, request: schema.updateUserInfo, db:Session = Depends(database.get_db)):
    user = db.query(models.userInfo).filter(models.userInfo.email == email)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id {id} not found")

    user.update(request.dict(exclude_unset=True))
    db.commit()
    return 'updated'

#delete a user
@router.delete('/{email}/deleteUser')
def destroy(email:str, db:Session=Depends(database.get_db), current_user: schema.userInfo=Depends(oauth2.get_current_user)):
    user = db.query(models.userInfo).filter(models.userInfo.email==email)
    if not user.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id {id} not found")
    user.delete(synchronize_session=False)
    plays = db.query(models.user_plays_quiz).filter_by(email=email)
    plays.delete(synchronize_session=False)
    db.commit()
    return 'done'

 
    