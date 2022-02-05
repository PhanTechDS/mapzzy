from models import Base
from sqlalchemy import Column, Integer, String, Table
from hashlib import sha256

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True,autoincrement=True)
    email = Column(String(255),unique=True)
    password = Column(String(255))
    name = Column(String(255))
    phone = Column(String(10))

    def __init__(self,email,password,name,phone):
        self.email = email
        self.password = sha256(bytes(password,encoding="utf-8")).hexdigest()
        self.name = name
        self.phone = phone