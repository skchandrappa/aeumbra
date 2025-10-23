"""
Verification service for business logic
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from datetime import datetime, timedelta

from db.models.verification import VerificationDocumentType, Verification, BackgroundCheck
from schemas.verification import VerificationCreate, BackgroundCheckCreate


class VerificationService:
    """Verification service for business logic"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_document_types(self) -> List[VerificationDocumentType]:
        """Get all active document types"""
        result = await self.db.execute(
            select(VerificationDocumentType).where(VerificationDocumentType.is_active == True)
        )
        return result.scalars().all()
    
    async def get_user_verifications(self, user_id: int) -> List[Verification]:
        """Get user's verification documents"""
        result = await self.db.execute(
            select(Verification).where(Verification.user_id == user_id)
        )
        return result.scalars().all()
    
    async def create_verification(
        self, user_id: int, verification_data: VerificationCreate
    ) -> Verification:
        """Create a new verification document"""
        verification = Verification(
            user_id=user_id,
            document_type_id=verification_data.document_type_id,
            document_name=verification_data.document_name,
            document_url=verification_data.document_url,
            document_hash=verification_data.document_hash,
            file_size=verification_data.file_size,
            mime_type=verification_data.mime_type,
            document_number=verification_data.document_number,
            issuing_authority=verification_data.issuing_authority,
            issued_date=verification_data.issued_date,
            expiry_date=verification_data.expiry_date,
            status="pending"
        )
        
        self.db.add(verification)
        await self.db.commit()
        await self.db.refresh(verification)
        
        return verification
    
    async def get_verification(self, verification_id: int) -> Optional[Verification]:
        """Get a specific verification document"""
        result = await self.db.execute(
            select(Verification).where(Verification.id == verification_id)
        )
        return result.scalar_one_or_none()
    
    async def update_verification(
        self, verification_id: int, user_id: int, verification_data: VerificationCreate
    ) -> Optional[Verification]:
        """Update a verification document"""
        verification = await self.get_verification(verification_id)
        
        if not verification or verification.user_id != user_id:
            return None
        
        verification.document_type_id = verification_data.document_type_id
        verification.document_name = verification_data.document_name
        verification.document_url = verification_data.document_url
        verification.document_hash = verification_data.document_hash
        verification.file_size = verification_data.file_size
        verification.mime_type = verification_data.mime_type
        verification.document_number = verification_data.document_number
        verification.issuing_authority = verification_data.issuing_authority
        verification.issued_date = verification_data.issued_date
        verification.expiry_date = verification_data.expiry_date
        
        await self.db.commit()
        await self.db.refresh(verification)
        
        return verification
    
    async def delete_verification(self, verification_id: int, user_id: int) -> bool:
        """Delete a verification document"""
        verification = await self.get_verification(verification_id)
        
        if not verification or verification.user_id != user_id:
            return False
        
        await self.db.delete(verification)
        await self.db.commit()
        
        return True
    
    async def submit_verification(self, verification_id: int, user_id: int) -> bool:
        """Submit a verification document for review"""
        verification = await self.get_verification(verification_id)
        
        if not verification or verification.user_id != user_id:
            return False
        
        verification.status = "pending"
        await self.db.commit()
        
        return True
    
    async def get_user_background_checks(self, user_id: int) -> List[BackgroundCheck]:
        """Get user's background checks"""
        result = await self.db.execute(
            select(BackgroundCheck).where(BackgroundCheck.user_id == user_id)
        )
        return result.scalars().all()
    
    async def create_background_check(
        self, user_id: int, background_check_data: BackgroundCheckCreate
    ) -> BackgroundCheck:
        """Create a new background check"""
        background_check = BackgroundCheck(
            user_id=user_id,
            check_type=background_check_data.check_type,
            provider=background_check_data.provider,
            reference_id=background_check_data.reference_id,
            status="pending"
        )
        
        self.db.add(background_check)
        await self.db.commit()
        await self.db.refresh(background_check)
        
        return background_check
    
    async def get_pending_verifications(self) -> List[Verification]:
        """Get pending verifications for admin review"""
        result = await self.db.execute(
            select(Verification).where(Verification.status == "pending")
        )
        return result.scalars().all()
    
    async def approve_verification(
        self, verification_id: int, admin_id: int, notes: Optional[str] = None
    ) -> bool:
        """Approve a verification document"""
        verification = await self.get_verification(verification_id)
        
        if not verification:
            return False
        
        verification.status = "approved"
        verification.verified_by = admin_id
        verification.verification_notes = notes
        verification.verified_at = datetime.utcnow()
        
        # Set expiry date if not provided (default 1 year)
        if not verification.expires_at:
            verification.expires_at = datetime.utcnow() + timedelta(days=365)
        
        await self.db.commit()
        
        return True
    
    async def reject_verification(
        self, verification_id: int, admin_id: int, reason: str
    ) -> bool:
        """Reject a verification document"""
        verification = await self.get_verification(verification_id)
        
        if not verification:
            return False
        
        verification.status = "rejected"
        verification.verified_by = admin_id
        verification.verification_notes = reason
        verification.verified_at = datetime.utcnow()
        
        await self.db.commit()
        
        return True
    
    async def get_verification_statistics(self) -> dict:
        """Get verification statistics"""
        # Get counts by status
        pending_count = await self.db.scalar(
            select(Verification).where(Verification.status == "pending")
        )
        approved_count = await self.db.scalar(
            select(Verification).where(Verification.status == "approved")
        )
        rejected_count = await self.db.scalar(
            select(Verification).where(Verification.status == "rejected")
        )
        
        return {
            "pending": pending_count,
            "approved": approved_count,
            "rejected": rejected_count,
            "total": pending_count + approved_count + rejected_count
        }
