"""
Profile and user settings models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, DECIMAL, ARRAY, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class Profile(BaseModel):
    """User profile model"""
    __tablename__ = "profiles"
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    # full_name is a generated column in the database, not included in SQLAlchemy model
    date_of_birth = Column(Date)
    gender = Column(String(20))  # male, female, other, prefer_not_to_say
    bio = Column(Text)
    profile_picture_url = Column(Text)
    cover_photo_url = Column(Text)
    
    # Address information
    address_line1 = Column(String(255))
    address_line2 = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100), default="US")
    
    # Geolocation
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    location_accuracy = Column(Integer)  # in meters
    
    # User type and status
    user_type = Column(String(20), nullable=False)  # guard, consumer, admin
    status = Column(String(20), default="active")  # active, inactive, suspended, banned
    
    # Guard-specific fields
    years_experience = Column(Integer)
    certifications = Column(ARRAY(String))  # Array of certification names
    languages_spoken = Column(ARRAY(String))  # Array of language codes
    availability_schedule = Column(JSON)  # Weekly availability schedule
    max_travel_distance = Column(Integer)  # in miles/kilometers
    emergency_contact_name = Column(String(255))
    emergency_contact_phone = Column(String(20))
    
    # Social media links
    linkedin_url = Column(Text)
    instagram_handle = Column(String(100))
    twitter_handle = Column(String(100))
    
    # Relationships - temporarily commented out for basic functionality
    # user = relationship("User", back_populates="profile")
    
    def __repr__(self):
        return f"<Profile(id={self.id}, user_id={self.user_id}, user_type={self.user_type})>"


class UserSettings(BaseModel):
    """User settings and preferences"""
    __tablename__ = "user_settings"
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True, index=True)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)
    
    # Privacy settings
    profile_visibility = Column(String(20), default="public")  # public, friends, private
    location_sharing = Column(Boolean, default=True)
    show_online_status = Column(Boolean, default=True)
    
    # Security settings
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_method = Column(String(20))  # sms, email, authenticator
    login_notifications = Column(Boolean, default=True)
    
    # App preferences
    language = Column(String(10), default="en")
    timezone = Column(String(50), default="UTC")
    currency = Column(String(10), default="USD")
    distance_unit = Column(String(10), default="miles")  # miles, kilometers
    
    # Relationships - temporarily commented out for basic functionality
    # user = relationship("User", back_populates="settings")
    
    def __repr__(self):
        return f"<UserSettings(id={self.id}, user_id={self.user_id})>"
