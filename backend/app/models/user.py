from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    hosted_zones = relationship("HostedZone", back_populates="user", cascade="all, delete-orphan")
