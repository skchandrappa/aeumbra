"""
User service for business logic
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import Optional

from db.models.user import User
from db.models.profile import Profile, UserSettings
from schemas.auth import UserRegister
from core.security import get_password_hash


class UserService:
    """User service for business logic"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def get_user_by_phone(self, phone_number: str) -> Optional[User]:
        """Get user by phone number"""
        result = await self.db.execute(select(User).where(User.phone_number == phone_number))
        return result.scalar_one_or_none()
    
    async def create_user(self, user_data: UserRegister) -> User:
        """Create a new user"""
        # Create user
        user = User(
            email=user_data.email,
            password_hash=get_password_hash(user_data.password),
            phone_number=user_data.phone_number,
            user_type=user_data.user_type,
            is_active=True,
            is_verified=False
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
    
    async def update_last_login(self, user_id: int) -> None:
        """Update user's last login time"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.last_login = datetime.utcnow()
            await self.db.flush()
            await self.db.commit()
    
    async def update_password(self, user_id: int, new_password: str) -> None:
        """Update user's password"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.password_hash = get_password_hash(new_password)
            await self.db.commit()
    
    async def verify_email(self, user_id: int) -> None:
        """Mark user's email as verified"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.is_verified = True
            await self.db.commit()
    
    async def deactivate_user(self, user_id: int) -> None:
        """Deactivate user account"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.is_active = False
            await self.db.commit()
    
    async def activate_user(self, user_id: int) -> None:
        """Activate user account"""
        user = await self.get_user_by_id(user_id)
        if user:
            user.is_active = True
            await self.db.commit()
    
    async def get_user_profile(self, user_id: int) -> Optional[Profile]:
        """Get user profile"""
        result = await self.db.execute(
            select(Profile).where(Profile.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def update_user_profile(self, user_id: int, profile_data) -> Optional[Profile]:
        """Update user profile"""
        profile = await self.get_user_profile(user_id)
        if not profile:
            return None
        
        # Update profile fields
        for field, value in profile_data.dict(exclude_unset=True).items():
            if hasattr(profile, field):
                setattr(profile, field, value)
        
        await self.db.commit()
        await self.db.refresh(profile)
        return profile
    
    async def get_user_settings(self, user_id: int) -> Optional[UserSettings]:
        """Get user settings"""
        result = await self.db.execute(
            select(UserSettings).where(UserSettings.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def update_user_settings(self, user_id: int, settings_data) -> Optional[UserSettings]:
        """Update user settings"""
        settings = await self.get_user_settings(user_id)
        if not settings:
            return None
        
        # Update settings fields
        for field, value in settings_data.dict(exclude_unset=True).items():
            if hasattr(settings, field):
                setattr(settings, field, value)
        
        await self.db.commit()
        await self.db.refresh(settings)
        return settings
