from typing import Optional
from pydantic import BaseModel
class User(BaseModel):
    username: str = ""
    email: str = ""
    password: str = ""

class Token(BaseModel):
    access_token: str = ""
    token_type: str = ""


class TokenData(BaseModel):
    email: Optional[str] = None