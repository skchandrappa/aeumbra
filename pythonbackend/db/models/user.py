"""
User model
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class User(BaseModel):
    """User model for authentication"""
    __tablename__ = "users"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=False)
    phone_number = Column(String(20), unique=True, index=True)
    user_type = Column(String(20), nullable=False, default="consumer")  # guard, consumer, admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    last_login = Column(DateTime(timezone=True))
    
    # Relationships - temporarily commented out for basic functionality
    # profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    # settings = relationship("UserSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
