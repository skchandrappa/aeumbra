"""
Booking system models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, DECIMAL, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class EventType(BaseModel):
    """Event types for bookings"""
    __tablename__ = "event_types"
    
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    icon_url = Column(Text)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    bookings = relationship("Booking", back_populates="event_type")
    
    def __repr__(self):
        return f"<EventType(id={self.id}, name={self.name})>"


class Booking(BaseModel):
    """Main booking records"""
    __tablename__ = "bookings"
    
    booking_reference = Column(String(20), unique=True, nullable=False, index=True)
    
    # Parties involved
    guard_id = Column(Integer, nullable=False, index=True)
    consumer_id = Column(Integer, nullable=False, index=True)
    
    # Event details
    event_type_id = Column(Integer, nullable=False, index=True)
    event_name = Column(String(255), nullable=False)
    event_description = Column(Text)
    
    # Location details
    venue_name = Column(String(255))
    address_line1 = Column(String(255), nullable=False)
    address_line2 = Column(String(255))
    city = Column(String(100), nullable=False)
    state = Column(String(100))
    postal_code = Column(String(20))
    country = Column(String(100), default="US")
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    
    # Timing
    start_datetime = Column(DateTime(timezone=True), nullable=False)
    end_datetime = Column(DateTime(timezone=True), nullable=False)
    duration_hours = Column(DECIMAL(4, 2))  # Generated column in DB
    
    # Pricing
    hourly_rate = Column(DECIMAL(10, 2), nullable=False)
    total_amount = Column(DECIMAL(10, 2))  # Generated column in DB
    platform_fee = Column(DECIMAL(10, 2), default=0.00)
    final_amount = Column(DECIMAL(10, 2))  # Generated column in DB
    
    # Status and workflow
    status = Column(String(20), default="pending")  # pending, confirmed, in_progress, completed, cancelled, disputed
    
    # Special requirements
    special_requirements = Column(Text)
    uniform_required = Column(Boolean, default=False)
    equipment_provided = Column(Boolean, default=True)
    
    # Communication
    consumer_notes = Column(Text)
    guard_notes = Column(Text)
    
    # Timestamps
    confirmed_at = Column(DateTime(timezone=True))
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    cancelled_at = Column(DateTime(timezone=True))
    cancelled_by = Column(Integer)  # User who cancelled
    cancellation_reason = Column(Text)
    
    # Relationships
    guard = relationship("User", back_populates="guard_bookings", foreign_keys=[guard_id])
    consumer = relationship("User", back_populates="consumer_bookings", foreign_keys=[consumer_id])
    event_type = relationship("EventType", back_populates="bookings")
    status_history = relationship("BookingStatusHistory", back_populates="booking", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="booking", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="booking", cascade="all, delete-orphan")
    complaints = relationship("Complaint", back_populates="booking", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Booking(id={self.id}, reference={self.booking_reference}, status={self.status})>"


class BookingStatusHistory(BaseModel):
    """Booking status change history"""
    __tablename__ = "booking_status_history"
    
    booking_id = Column(Integer, nullable=False, index=True)
    old_status = Column(String(20))
    new_status = Column(String(20), nullable=False)
    changed_by = Column(Integer)  # User who made the change
    reason = Column(Text)
    
    # Relationships
    booking = relationship("Booking", back_populates="status_history")
    
    def __repr__(self):
        return f"<BookingStatusHistory(id={self.id}, booking_id={self.booking_id}, new_status={self.new_status})>"
