from models import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

class PassReset(Base):
    __tablename__ = "pass_reset"
    usr_id = Column(Integer, ForeignKey("user.id"), primary_key=True)
    reset_id = Column(String(255))
    user = relationship("User")

    def __init__(self, usr_id, reset_id):
        self.usr_id = usr_id
        self.reset_id = reset_id