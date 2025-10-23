"""
Verification models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class VerificationDocumentType(BaseModel):
    """Document types for verification"""
    __tablename__ = "verification_document_types"
    
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    required_for_guards = Column(Boolean, default=False)
    required_for_consumers = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    verifications = relationship("Verification", back_populates="document_type")
    
    def __repr__(self):
        return f"<VerificationDocumentType(id={self.id}, name={self.name})>"


class Verification(BaseModel):
    """User document verification"""
    __tablename__ = "verifications"
    
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    document_type_id = Column(Integer, ForeignKey('verification_document_types.id'), nullable=False, index=True)
    document_name = Column(String(255), nullable=False)
    document_url = Column(Text, nullable=False)
    document_hash = Column(String(255))  # For integrity checking
    file_size = Column(Integer)
    mime_type = Column(String(100))
    
    # Verification status
    status = Column(String(20), default="pending")  # pending, approved, rejected, expired
    verified_by = Column(Integer, ForeignKey('users.id'))  # Admin who verified
    verification_notes = Column(Text)
    verified_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    
    # Document details
    document_number = Column(String(255))  # ID number, license number, etc.
    issuing_authority = Column(String(255))
    issued_date = Column(Date)
    expiry_date = Column(Date)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    document_type = relationship("VerificationDocumentType", back_populates="verifications")
    
    def __repr__(self):
        return f"<Verification(id={self.id}, user_id={self.user_id}, status={self.status})>"


class BackgroundCheck(BaseModel):
    """Background check records"""
    __tablename__ = "background_checks"
    
    user_id = Column(Integer, nullable=False, index=True)
    check_type = Column(String(50), nullable=False)  # criminal, employment, education, reference
    provider = Column(String(100))  # Background check service provider
    reference_id = Column(String(255))  # External reference ID
    status = Column(String(20), default="pending")  # pending, passed, failed, expired
    result_data = Column(JSON)  # Store detailed results
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    expires_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="background_checks")
    
    def __repr__(self):
        return f"<BackgroundCheck(id={self.id}, user_id={self.user_id}, check_type={self.check_type})>"
