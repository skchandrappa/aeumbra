"""
Complaint routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.security import get_current_active_user, get_current_admin_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/")
async def get_complaints(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get complaints"""
    # TODO: Implement complaints
    return {"message": "Complaints not implemented yet"}


@router.post("/")
async def create_complaint(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a complaint"""
    # TODO: Implement complaint creation
    return {"message": "Complaint creation not implemented yet"}


@router.get("/admin/pending")
async def get_pending_complaints(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get pending complaints for admin"""
    # TODO: Implement admin complaints
    return {"message": "Admin complaints not implemented yet"}
