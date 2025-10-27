"""
Verification schemas
"""

from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime


class VerificationDocumentTypeResponse(BaseModel):
    """Verification document type response schema"""
    id: int
    name: str
    description: Optional[str]
    required_for_guards: bool
    required_for_consumers: bool
    is_active: bool
    
    class Config:
        orm_mode = True


class VerificationResponse(BaseModel):
    """Verification response schema"""
    id: int
    user_id: int
    document_type_id: int
    document_name: str
    document_url: str
    document_hash: Optional[str]
    file_size: Optional[int]
    mime_type: Optional[str]
    status: str
    verified_by: Optional[int]
    verification_notes: Optional[str]
    verified_at: Optional[datetime]
    expires_at: Optional[datetime]
    document_number: Optional[str]
    issuing_authority: Optional[str]
    issued_date: Optional[datetime]
    expiry_date: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class VerificationCreate(BaseModel):
    """Verification creation schema"""
    document_type_id: int
    document_name: str
    document_url: str
    document_hash: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    document_number: Optional[str] = None
    issuing_authority: Optional[str] = None
    issued_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None


class BackgroundCheckResponse(BaseModel):
    """Background check response schema"""
    id: int
    user_id: int
    check_type: str
    provider: Optional[str]
    reference_id: Optional[str]
    status: str
    result_data: Optional[dict]
    initiated_at: datetime
    completed_at: Optional[datetime]
    expires_at: Optional[datetime]
    
    class Config:
        orm_mode = True


class BackgroundCheckCreate(BaseModel):
    """Background check creation schema"""
    check_type: str
    provider: Optional[str] = None
    reference_id: Optional[str] = None
    
    @validator('check_type')
    def validate_check_type(cls, v):
        if v not in ['criminal', 'employment', 'education', 'reference']:
            raise ValueError('Check type must be criminal, employment, education, or reference')
        return v
