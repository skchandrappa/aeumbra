"""
Review and rating models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class Review(BaseModel):
    """User reviews and ratings"""
    __tablename__ = "reviews"
    
    reviewer_id = Column(Integer, nullable=False, index=True)
    reviewed_user_id = Column(Integer, nullable=False, index=True)
    booking_id = Column(Integer, index=True)
    
    # Rating details
    overall_rating = Column(Integer, nullable=False)  # 1-5
    punctuality_rating = Column(Integer)  # 1-5
    professionalism_rating = Column(Integer)  # 1-5
    communication_rating = Column(Integer)  # 1-5
    
    # Review content
    review_text = Column(Text)
    is_public = Column(Boolean, default=True)
    is_anonymous = Column(Boolean, default=False)
    
    # Moderation
    is_flagged = Column(Boolean, default=False)
    flagged_reason = Column(Text)
    moderated_by = Column(Integer)  # Admin who moderated
    moderated_at = Column(DateTime(timezone=True))
    
    # Relationships
    reviewer = relationship("User", back_populates="reviewer_reviews", foreign_keys=[reviewer_id])
    reviewed_user = relationship("User", back_populates="reviewed_reviews", foreign_keys=[reviewed_user_id])
    booking = relationship("Booking", back_populates="reviews")
    responses = relationship("ReviewResponse", back_populates="review", cascade="all, delete-orphan")
    votes = relationship("ReviewVote", back_populates="review", cascade="all, delete-orphan")
    
    # Unique constraint - one review per booking
    __table_args__ = (UniqueConstraint('reviewer_id', 'booking_id', name='uq_review_booking'),)
    
    def __repr__(self):
        return f"<Review(id={self.id}, reviewer_id={self.reviewer_id}, rating={self.overall_rating})>"


class ReviewResponse(BaseModel):
    """Review responses from guards"""
    __tablename__ = "review_responses"
    
    review_id = Column(Integer, nullable=False, index=True)
    responder_id = Column(Integer, nullable=False, index=True)
    response_text = Column(Text, nullable=False)
    
    # Relationships
    review = relationship("Review", back_populates="responses")
    responder = relationship("User", back_populates="review_responses")
    
    def __repr__(self):
        return f"<ReviewResponse(id={self.id}, review_id={self.review_id}, responder_id={self.responder_id})>"


class ReviewVote(BaseModel):
    """Review helpfulness votes"""
    __tablename__ = "review_votes"
    
    review_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    is_helpful = Column(Boolean, nullable=False)
    
    # Relationships
    review = relationship("Review", back_populates="votes")
    user = relationship("User", back_populates="review_votes")
    
    # Unique constraint - one vote per user per review
    __table_args__ = (UniqueConstraint('review_id', 'user_id', name='uq_review_vote'),)
    
    def __repr__(self):
        return f"<ReviewVote(id={self.id}, review_id={self.review_id}, user_id={self.user_id})>"
