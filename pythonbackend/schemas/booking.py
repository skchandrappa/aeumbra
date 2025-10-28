"""
Booking schemas
"""

from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal


class BookingResponse(BaseModel):
    """Booking response schema"""
    id: int
    booking_reference: str
    guard_id: int
    consumer_id: int
    event_type_id: int
    event_name: str
    event_description: Optional[str]
    venue_name: Optional[str]
    address_line1: str
    address_line2: Optional[str]
    city: str
    state: Optional[str]
    postal_code: Optional[str]
    country: str
    latitude: Optional[float]
    longitude: Optional[float]
    start_datetime: datetime
    end_datetime: datetime
    duration_hours: Optional[Decimal]
    hourly_rate: Decimal
    total_amount: Optional[Decimal]
    platform_fee: Decimal
    final_amount: Optional[Decimal]
    status: str
    special_requirements: Optional[str]
    uniform_required: bool
    equipment_provided: bool
    consumer_notes: Optional[str]
    guard_notes: Optional[str]
    created_at: datetime
    confirmed_at: Optional[datetime]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    cancelled_at: Optional[datetime]
    cancelled_by: Optional[int]
    cancellation_reason: Optional[str]
    
    class Config:
        orm_mode = True


class BookingCreate(BaseModel):
    """Booking creation schema"""
    guard_id: int
    event_type_id: int
    event_name: str
    event_description: Optional[str] = None
    venue_name: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "US"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_datetime: datetime
    end_datetime: datetime
    hourly_rate: Decimal
    platform_fee: Decimal = 0.00
    special_requirements: Optional[str] = None
    uniform_required: bool = False
    equipment_provided: bool = True
    consumer_notes: Optional[str] = None
    
    @validator('end_datetime')
    def validate_end_datetime(cls, v, values):
        if 'start_datetime' in values and v <= values['start_datetime']:
            raise ValueError('End datetime must be after start datetime')
        return v


class BookingUpdate(BaseModel):
    """Booking update schema"""
    event_name: Optional[str] = None
    event_description: Optional[str] = None
    venue_name: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    hourly_rate: Optional[Decimal] = None
    special_requirements: Optional[str] = None
    uniform_required: Optional[bool] = None
    equipment_provided: Optional[bool] = None
    consumer_notes: Optional[str] = None
    guard_notes: Optional[str] = None
