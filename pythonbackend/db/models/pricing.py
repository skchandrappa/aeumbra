"""
Pricing system models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, DECIMAL, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class PricingZone(BaseModel):
    """Geographic pricing zones"""
    __tablename__ = "pricing_zones"
    
    name = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100))
    country = Column(String(100), default="US")
    center_latitude = Column(DECIMAL(10, 8))
    center_longitude = Column(DECIMAL(11, 8))
    radius_miles = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    guard_pricing = relationship("GuardPricing", back_populates="pricing_zone")
    
    def __repr__(self):
        return f"<PricingZone(id={self.id}, name={self.name}, city={self.city})>"


class GuardPricing(BaseModel):
    """Guard-specific pricing profiles"""
    __tablename__ = "guard_pricing"
    
    guard_id = Column(Integer, nullable=False, index=True)
    pricing_zone_id = Column(Integer, nullable=False, index=True)
    
    # Base rates
    base_hourly_rate = Column(DECIMAL(10, 2), nullable=False)
    minimum_hours = Column(Integer, default=1)
    maximum_hours = Column(Integer, default=24)
    
    # Time-based multipliers
    weekend_multiplier = Column(DECIMAL(3, 2), default=1.0)
    holiday_multiplier = Column(DECIMAL(3, 2), default=1.5)
    night_shift_multiplier = Column(DECIMAL(3, 2), default=1.2)  # 10 PM - 6 AM
    emergency_multiplier = Column(DECIMAL(3, 2), default=2.0)
    
    # Event type adjustments
    corporate_event_adjustment = Column(DECIMAL(3, 2), default=1.0)
    private_event_adjustment = Column(DECIMAL(3, 2), default=1.0)
    security_event_adjustment = Column(DECIMAL(3, 2), default=1.0)
    
    # Availability
    is_available = Column(Boolean, default=True)
    available_from = Column(DateTime(timezone=True))
    available_until = Column(DateTime(timezone=True))
    
    # Relationships
    guard = relationship("User", back_populates="guard_pricing")
    pricing_zone = relationship("PricingZone", back_populates="guard_pricing")
    
    # Unique constraint
    __table_args__ = (UniqueConstraint('guard_id', 'pricing_zone_id', name='uq_guard_pricing'),)
    
    def __repr__(self):
        return f"<GuardPricing(id={self.id}, guard_id={self.guard_id}, rate={self.base_hourly_rate})>"


class PricingFactor(BaseModel):
    """Dynamic pricing factors"""
    __tablename__ = "pricing_factors"
    
    factor_name = Column(String(100), unique=True, nullable=False)
    factor_type = Column(String(50), nullable=False)  # demand, supply, time, weather
    multiplier = Column(DECIMAL(3, 2), nullable=False)
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<PricingFactor(id={self.id}, name={self.factor_name}, type={self.factor_type})>"
