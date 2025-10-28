"""
Analytics routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_active_user, get_current_admin_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/user/dashboard")
async def get_user_analytics(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user analytics dashboard"""
    # TODO: Implement user analytics
    return {"message": "User analytics not implemented yet"}


@router.get("/platform/overview")
async def get_platform_analytics(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get platform analytics overview"""
    # TODO: Implement platform analytics
    return {"message": "Platform analytics not implemented yet"}
