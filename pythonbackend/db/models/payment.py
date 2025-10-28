"""
Payment system models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, DECIMAL, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel


class PaymentMethod(BaseModel):
    """User payment methods"""
    __tablename__ = "payment_methods"
    
    user_id = Column(Integer, nullable=False, index=True)
    method_type = Column(String(20), nullable=False)  # card, bank_account, wallet, paypal
    provider = Column(String(50), nullable=False)  # stripe, paypal, square
    provider_method_id = Column(String(255), nullable=False)  # External reference
    is_default = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # Card details (if applicable)
    last_four_digits = Column(String(4))
    card_brand = Column(String(50))
    expiry_month = Column(Integer)
    expiry_year = Column(Integer)
    
    # Bank details (if applicable)
    bank_name = Column(String(100))
    account_type = Column(String(20))
    
    # Relationships
    user = relationship("User", back_populates="payment_methods")
    transactions = relationship("Transaction", back_populates="payment_method")
    
    def __repr__(self):
        return f"<PaymentMethod(id={self.id}, user_id={self.user_id}, type={self.method_type})>"


class Transaction(BaseModel):
    """Financial transactions"""
    __tablename__ = "transactions"
    
    transaction_reference = Column(String(50), unique=True, nullable=False, index=True)
    
    # Related entities
    booking_id = Column(Integer, index=True)
    payer_id = Column(Integer, nullable=False, index=True)
    payee_id = Column(Integer, nullable=False, index=True)
    
    # Amount details
    amount = Column(DECIMAL(12, 2), nullable=False)
    currency = Column(String(10), default="USD")
    platform_fee = Column(DECIMAL(12, 2), default=0.00)
    processing_fee = Column(DECIMAL(12, 2), default=0.00)
    total_amount = Column(DECIMAL(12, 2))  # Generated column in DB
    
    # Transaction details
    transaction_type = Column(String(30), nullable=False)  # booking_payment, refund, payout, adjustment, platform_fee, penalty
    payment_method_id = Column(Integer, index=True)
    provider_transaction_id = Column(String(255))  # External payment provider ID
    
    # Status
    status = Column(String(20), default="pending")  # pending, processing, completed, failed, refunded, cancelled
    
    # Metadata
    description = Column(Text)
    transaction_metadata = Column(JSON)
    initiated_by = Column(Integer)  # User who initiated
    
    # Relationships
    booking = relationship("Booking", back_populates="transactions")
    payer = relationship("User", back_populates="payer_transactions", foreign_keys=[payer_id])
    payee = relationship("User", back_populates="payee_transactions", foreign_keys=[payee_id])
    payment_method = relationship("PaymentMethod", back_populates="transactions")
    status_history = relationship("TransactionStatusHistory", back_populates="transaction", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Transaction(id={self.id}, reference={self.transaction_reference}, amount={self.amount})>"


class TransactionStatusHistory(BaseModel):
    """Transaction status change history"""
    __tablename__ = "transaction_status_history"
    
    transaction_id = Column(Integer, nullable=False, index=True)
    old_status = Column(String(20))
    new_status = Column(String(20), nullable=False)
    changed_by = Column(Integer)  # User who made the change
    reason = Column(Text)
    
    # Relationships
    transaction = relationship("Transaction", back_populates="status_history")
    
    def __repr__(self):
        return f"<TransactionStatusHistory(id={self.id}, transaction_id={self.transaction_id}, new_status={self.new_status})>"
