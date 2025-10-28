"""
Review routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.security import get_current_active_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/")
async def get_reviews(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get reviews"""
    # TODO: Implement reviews
    return {"message": "Reviews not implemented yet"}


@router.post("/")
async def create_review(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a review"""
    # TODO: Implement review creation
    return {"message": "Review creation not implemented yet"}
