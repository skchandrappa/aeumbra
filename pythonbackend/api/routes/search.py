"""
Search routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.security import get_current_active_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/guards")
async def search_guards(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Search for guards"""
    # TODO: Implement guard search
    return {"message": "Guard search not implemented yet"}


@router.get("/events")
async def search_events(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Search for events"""
    # TODO: Implement event search
    return {"message": "Event search not implemented yet"}


@router.get("/")
async def general_search(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """General search"""
    # TODO: Implement general search
    return {"message": "General search not implemented yet"}
