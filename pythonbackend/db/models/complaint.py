"""
Complaint and dispute resolution models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class ComplaintCategory(BaseModel):
    """Complaint categories"""
    __tablename__ = "complaint_categories"
    
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    complaints = relationship("Complaint", back_populates="category")
    
    def __repr__(self):
        return f"<ComplaintCategory(id={self.id}, name={self.name})>"


class Complaint(BaseModel):
    """Complaint records"""
    __tablename__ = "complaints"
    
    complaint_reference = Column(String(20), unique=True, nullable=False, index=True)
    
    # Parties involved
    complainant_id = Column(Integer, nullable=False, index=True)
    defendant_id = Column(Integer, nullable=False, index=True)
    booking_id = Column(Integer, index=True)
    
    # Complaint details
    category_id = Column(Integer, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), default="medium")  # low, medium, high, urgent
    
    # Status and resolution
    status = Column(String(20), default="open")  # open, investigating, resolved, dismissed, escalated
    resolution = Column(Text)
    resolved_by = Column(Integer)  # Admin who resolved
    resolved_at = Column(DateTime(timezone=True))
    
    # Relationships
    complainant = relationship("User", back_populates="complainant_complaints", foreign_keys=[complainant_id])
    defendant = relationship("User", back_populates="defendant_complaints", foreign_keys=[defendant_id])
    booking = relationship("Booking", back_populates="complaints")
    category = relationship("ComplaintCategory", back_populates="complaints")
    updates = relationship("ComplaintUpdate", back_populates="complaint", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Complaint(id={self.id}, reference={self.complaint_reference}, status={self.status})>"


class ComplaintUpdate(BaseModel):
    """Complaint update communications"""
    __tablename__ = "complaint_updates"
    
    complaint_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    message = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False)  # Internal admin notes
    
    # Relationships
    complaint = relationship("Complaint", back_populates="updates")
    user = relationship("User", back_populates="complaint_updates")
    
    def __repr__(self):
        return f"<ComplaintUpdate(id={self.id}, complaint_id={self.complaint_id}, user_id={self.user_id})>"
