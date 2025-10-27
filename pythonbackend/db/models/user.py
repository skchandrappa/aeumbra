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
    
    # Relationships
    posts = relationship("Post", back_populates="user", cascade="all, delete-orphan")
    post_likes = relationship("PostLike", back_populates="user", cascade="all, delete-orphan")
    post_comments = relationship("PostComment", back_populates="user", cascade="all, delete-orphan")
    comment_likes = relationship("CommentLike", back_populates="user", cascade="all, delete-orphan")
    follower_relationships = relationship("UserFollow", back_populates="follower", foreign_keys="UserFollow.follower_id", cascade="all, delete-orphan")
    following_relationships = relationship("UserFollow", back_populates="following", foreign_keys="UserFollow.following_id", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
