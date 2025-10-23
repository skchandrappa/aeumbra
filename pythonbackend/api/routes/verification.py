"""
Verification routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from core.security import get_current_active_user, get_current_admin_user
from db.session import get_db
from db.models.user import User
from db.models.verification import VerificationDocumentType, Verification, BackgroundCheck
from schemas.verification import (
    VerificationDocumentTypeResponse,
    VerificationResponse,
    VerificationCreate,
    BackgroundCheckResponse,
    BackgroundCheckCreate
)
from services.verification_service import VerificationService

router = APIRouter()


@router.get("/document-types", response_model=List[VerificationDocumentTypeResponse])
async def get_document_types(
    db: AsyncSession = Depends(get_db)
):
    """Get all verification document types"""
    verification_service = VerificationService(db)
    document_types = await verification_service.get_document_types()
    return [VerificationDocumentTypeResponse.from_orm(dt) for dt in document_types]


@router.get("/documents", response_model=List[VerificationResponse])
async def get_user_verifications(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's verification documents"""
    verification_service = VerificationService(db)
    verifications = await verification_service.get_user_verifications(current_user.id)
    return [VerificationResponse.from_orm(v) for v in verifications]


@router.post("/documents", response_model=VerificationResponse)
async def create_verification(
    verification_data: VerificationCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit a verification document"""
    verification_service = VerificationService(db)
    verification = await verification_service.create_verification(
        current_user.id, verification_data
    )
    return VerificationResponse.from_orm(verification)


@router.get("/documents/{verification_id}", response_model=VerificationResponse)
async def get_verification(
    verification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific verification document"""
    verification_service = VerificationService(db)
    verification = await verification_service.get_verification(verification_id)
    
    if not verification or verification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return VerificationResponse.from_orm(verification)


@router.put("/documents/{verification_id}", response_model=VerificationResponse)
async def update_verification(
    verification_id: int,
    verification_data: VerificationCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a verification document"""
    verification_service = VerificationService(db)
    verification = await verification_service.update_verification(
        verification_id, current_user.id, verification_data
    )
    return VerificationResponse.from_orm(verification)


@router.delete("/documents/{verification_id}")
async def delete_verification(
    verification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a verification document"""
    verification_service = VerificationService(db)
    success = await verification_service.delete_verification(
        verification_id, current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return {"message": "Verification deleted successfully"}


@router.post("/documents/{verification_id}/submit")
async def submit_verification(
    verification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Submit a verification document for review"""
    verification_service = VerificationService(db)
    success = await verification_service.submit_verification(
        verification_id, current_user.id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return {"message": "Verification submitted for review"}


@router.get("/background-checks", response_model=List[BackgroundCheckResponse])
async def get_background_checks(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user's background checks"""
    verification_service = VerificationService(db)
    background_checks = await verification_service.get_user_background_checks(current_user.id)
    return [BackgroundCheckResponse.from_orm(bc) for bc in background_checks]


@router.post("/background-checks", response_model=BackgroundCheckResponse)
async def create_background_check(
    background_check_data: BackgroundCheckCreate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Initiate a background check"""
    verification_service = VerificationService(db)
    background_check = await verification_service.create_background_check(
        current_user.id, background_check_data
    )
    return BackgroundCheckResponse.from_orm(background_check)


# Admin routes
@router.get("/admin/pending", response_model=List[VerificationResponse])
async def get_pending_verifications(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get pending verifications for admin review"""
    verification_service = VerificationService(db)
    verifications = await verification_service.get_pending_verifications()
    return [VerificationResponse.from_orm(v) for v in verifications]


@router.post("/admin/{verification_id}/approve")
async def approve_verification(
    verification_id: int,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Approve a verification document"""
    verification_service = VerificationService(db)
    success = await verification_service.approve_verification(
        verification_id, current_user.id, notes
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return {"message": "Verification approved"}


@router.post("/admin/{verification_id}/reject")
async def reject_verification(
    verification_id: int,
    reason: str,
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Reject a verification document"""
    verification_service = VerificationService(db)
    success = await verification_service.reject_verification(
        verification_id, current_user.id, reason
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    return {"message": "Verification rejected"}


@router.get("/admin/statistics")
async def get_verification_statistics(
    current_user: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    """Get verification statistics for admin"""
    verification_service = VerificationService(db)
    stats = await verification_service.get_verification_statistics()
    return stats
