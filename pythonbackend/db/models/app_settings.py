"""
Application settings model
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class AppSetting(BaseModel):
    """Application configuration settings"""
    __tablename__ = "app_settings"
    
    setting_key = Column(String(100), unique=True, nullable=False, index=True)
    setting_value = Column(Text)
    setting_type = Column(String(20), default="string")  # string, number, boolean, json
    description = Column(Text)
    is_public = Column(Boolean, default=False)
    updated_by = Column(Integer)  # User who updated the setting
    
    # Relationships
    updater = relationship("User", foreign_keys=[updated_by])
    
    def __repr__(self):
        return f"<AppSetting(id={self.id}, key={self.setting_key}, type={self.setting_type})>"
