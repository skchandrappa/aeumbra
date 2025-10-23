"""
Payment routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from core.security import get_current_active_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/methods")
async def get_payment_methods(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's payment methods"""
    # TODO: Implement payment methods
    return {"message": "Payment methods not implemented yet"}


@router.post("/methods")
async def add_payment_method(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a payment method"""
    # TODO: Implement payment method addition
    return {"message": "Add payment method not implemented yet"}


@router.post("/process")
async def process_payment(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Process a payment"""
    # TODO: Implement payment processing
    return {"message": "Payment processing not implemented yet"}
