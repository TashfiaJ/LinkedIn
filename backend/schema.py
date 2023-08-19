from pydantic import BaseModel, EmailStr
from typing import Optional, List
#from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType

class userInfo(BaseModel):
    email: EmailStr
    password: str
    class Config():
        orm_mode = True

class showUserInfo(BaseModel):
    email: EmailStr

class updateUserInfo(BaseModel):
    email: Optional[EmailStr]
    password: Optional[str]
    class Config():
        orm_mode = True

class login(BaseModel):
    username:str
    password:str

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

class PasswordReset(BaseModel):
    email: EmailStr
