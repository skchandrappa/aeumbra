"""
Authentication schemas
"""

from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    """User registration schema"""
    email: EmailStr
    password: str
    phone_number: Optional[str] = None
    first_name: str
    last_name: str
    user_type: str  # guard, consumer, admin
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
    
    @validator('user_type')
    def validate_user_type(cls, v):
        if v not in ['guard', 'consumer', 'admin']:
            raise ValueError('User type must be guard, consumer, or admin')
        return v


class UserLogin(BaseModel):
    """User login schema"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int


class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    phone_number: Optional[str]
    user_type: str
    is_active: bool
    is_verified: bool
    last_login: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login response schema with user data"""
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema"""
    refresh_token: str


class PasswordResetRequest(BaseModel):
    """Password reset request schema"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema"""
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v
