from pydantic import BaseModel
from fastapi import UploadFile
from typing import Optional


class POSTS(BaseModel):
    id: str = ""
    username: str = ""
    texts: Optional[str]=None
    image_url: Optional[str]=None

class PostCreation(BaseModel):
    username: str = ""
    texts: str = ""
    image_file: Optional[UploadFile]=None

