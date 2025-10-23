"""
Admin routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.security import get_current_admin_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/users")
async def get_all_users(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all users for admin"""
    # TODO: Implement admin user management
    return {"message": "Admin user management not implemented yet"}


@router.get("/dashboard")
async def get_admin_dashboard(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get admin dashboard"""
    # TODO: Implement admin dashboard
    return {"message": "Admin dashboard not implemented yet"}


@router.get("/moderation/posts")
async def get_posts_for_moderation(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get posts for moderation"""
    # TODO: Implement content moderation
    return {"message": "Content moderation not implemented yet"}
