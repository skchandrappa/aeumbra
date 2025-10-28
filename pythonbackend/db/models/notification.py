"""
Notification system models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class NotificationType(BaseModel):
    """Notification types and templates"""
    __tablename__ = "notification_types"
    
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    template_subject = Column(Text)
    template_body = Column(Text)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    notifications = relationship("Notification", back_populates="notification_type")
    
    def __repr__(self):
        return f"<NotificationType(id={self.id}, name={self.name})>"


class Notification(BaseModel):
    """User notifications"""
    __tablename__ = "notifications"
    
    user_id = Column(Integer, nullable=False, index=True)
    type_id = Column(Integer, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON)  # Additional data for the notification
    
    # Delivery status
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True))
    
    # Delivery methods
    sent_email = Column(Boolean, default=False)
    sent_sms = Column(Boolean, default=False)
    sent_push = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="notifications")
    notification_type = relationship("NotificationType", back_populates="notifications")
    
    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, title={self.title})>"
