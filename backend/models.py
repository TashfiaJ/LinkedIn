from sqlalchemy import Column, Integer, String, ForeignKey, Table
from database import Base
from sqlalchemy.orm import relationship
from sqlalchemy_utils import EmailType


class userInfo(Base):
    __tablename__ = 'userInfo'

    #id = Column(Integer, primary_key=True, index=True)
    email = Column(String, primary_key=True)
    password = Column(String)
    


