from pydantic import BaseModel
from fastapi import UploadFile
from typing import Optional


class POSTS(BaseModel):
    id: str
    username: str
    image_url: Optional[str]=None
    texts: Optional[str]=None