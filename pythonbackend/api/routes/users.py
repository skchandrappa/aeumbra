"""
User management routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from core.security import get_current_active_user
from db.session import get_db
from db.models.user import User
from db.models.profile import Profile, UserSettings
from schemas.user import ProfileResponse, ProfileUpdate, UserSettingsResponse, UserSettingsUpdate
from services.user_service import UserService

router = APIRouter()


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile"""
    user_service = UserService(db)
    profile = await user_service.get_user_profile(current_user.id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return ProfileResponse.from_orm(profile)


@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    user_service = UserService(db)
    profile = await user_service.update_user_profile(current_user.id, profile_data)
    
    return ProfileResponse.from_orm(profile)


@router.get("/{user_id}/public-profile", response_model=ProfileResponse)
async def get_public_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get public profile of a user"""
    user_service = UserService(db)
    profile = await user_service.get_user_profile(user_id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Only return public information
    return ProfileResponse.from_orm(profile)


@router.post("/profile/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload profile avatar"""
    # TODO: Implement file upload logic
    return {"message": "Avatar upload not implemented yet"}


@router.post("/profile/upload-cover")
async def upload_cover(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload cover photo"""
    # TODO: Implement file upload logic
    return {"message": "Cover photo upload not implemented yet"}


@router.get("/settings", response_model=UserSettingsResponse)
async def get_user_settings(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's settings"""
    user_service = UserService(db)
    settings = await user_service.get_user_settings(current_user.id)
    
    if not settings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Settings not found"
        )
    
    return UserSettingsResponse.from_orm(settings)


@router.put("/settings", response_model=UserSettingsResponse)
async def update_user_settings(
    settings_data: UserSettingsUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update current user's settings"""
    user_service = UserService(db)
    settings = await user_service.update_user_settings(current_user.id, settings_data)
    
    return UserSettingsResponse.from_orm(settings)
