"""
User schemas
"""

from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime


class ProfileResponse(BaseModel):
    """Profile response schema"""
    id: int
    user_id: int
    first_name: str
    last_name: str
    full_name: str
    date_of_birth: Optional[datetime]
    gender: Optional[str]
    bio: Optional[str]
    profile_picture_url: Optional[str]
    cover_photo_url: Optional[str]
    address_line1: Optional[str]
    address_line2: Optional[str]
    city: Optional[str]
    state: Optional[str]
    postal_code: Optional[str]
    country: str
    latitude: Optional[float]
    longitude: Optional[float]
    location_accuracy: Optional[int]
    user_type: str
    status: str
    years_experience: Optional[int]
    certifications: Optional[List[str]]
    languages_spoken: Optional[List[str]]
    availability_schedule: Optional[dict]
    max_travel_distance: Optional[int]
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]
    linkedin_url: Optional[str]
    instagram_handle: Optional[str]
    twitter_handle: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    """Profile update schema"""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    bio: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_accuracy: Optional[int] = None
    years_experience: Optional[int] = None
    certifications: Optional[List[str]] = None
    languages_spoken: Optional[List[str]] = None
    availability_schedule: Optional[dict] = None
    max_travel_distance: Optional[int] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    twitter_handle: Optional[str] = None
    
    @validator('gender')
    def validate_gender(cls, v):
        if v and v not in ['male', 'female', 'other', 'prefer_not_to_say']:
            raise ValueError('Gender must be male, female, other, or prefer_not_to_say')
        return v


class UserSettingsResponse(BaseModel):
    """User settings response schema"""
    id: int
    user_id: int
    email_notifications: bool
    sms_notifications: bool
    push_notifications: bool
    marketing_emails: bool
    profile_visibility: str
    location_sharing: bool
    show_online_status: bool
    two_factor_enabled: bool
    two_factor_method: Optional[str]
    login_notifications: bool
    language: str
    timezone: str
    currency: str
    distance_unit: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserSettingsUpdate(BaseModel):
    """User settings update schema"""
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    marketing_emails: Optional[bool] = None
    profile_visibility: Optional[str] = None
    location_sharing: Optional[bool] = None
    show_online_status: Optional[bool] = None
    two_factor_enabled: Optional[bool] = None
    two_factor_method: Optional[str] = None
    login_notifications: Optional[bool] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None
    distance_unit: Optional[str] = None
    
    @validator('profile_visibility')
    def validate_profile_visibility(cls, v):
        if v and v not in ['public', 'friends', 'private']:
            raise ValueError('Profile visibility must be public, friends, or private')
        return v
    
    @validator('two_factor_method')
    def validate_two_factor_method(cls, v):
        if v and v not in ['sms', 'email', 'authenticator']:
            raise ValueError('Two factor method must be sms, email, or authenticator')
        return v
    
    @validator('distance_unit')
    def validate_distance_unit(cls, v):
        if v and v not in ['miles', 'kilometers']:
            raise ValueError('Distance unit must be miles or kilometers')
        return v
