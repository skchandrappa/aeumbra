"""
Notification routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timedelta

from core.security import get_current_active_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/")
async def get_notifications(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user notifications"""
    # Mock notifications data
    mock_notifications = [
        {
            "id": 1,
            "title": "New Booking Request",
            "message": "You have received a new booking request for Corporate Event Security on January 25th.",
            "type": "booking_request",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(hours=2)).isoformat() + "Z",
            "data": {
                "booking_id": 123,
                "event_type": "Corporate Event Security",
                "event_date": "2025-01-25",
                "action_required": True
            }
        },
        {
            "id": 2,
            "title": "Booking Confirmed",
            "message": "Your booking for Wedding Security has been confirmed by Sarah Williams.",
            "type": "booking_confirmed",
            "is_read": True,
            "created_at": (datetime.now() - timedelta(days=1)).isoformat() + "Z",
            "data": {
                "booking_id": 122,
                "client_name": "Sarah Williams",
                "event_type": "Wedding Security"
            }
        },
        {
            "id": 3,
            "title": "Payment Received",
            "message": "Payment of $400 has been received for your Corporate Event Security service.",
            "type": "payment_received",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(hours=5)).isoformat() + "Z",
            "data": {
                "amount": 400,
                "booking_id": 121,
                "payment_method": "Credit Card"
            }
        },
        {
            "id": 4,
            "title": "New Review Received",
            "message": "John Smith left you a 5-star review for your security services.",
            "type": "review_received",
            "is_read": True,
            "created_at": (datetime.now() - timedelta(days=2)).isoformat() + "Z",
            "data": {
                "reviewer_name": "John Smith",
                "rating": 5,
                "review_id": 45
            }
        },
        {
            "id": 5,
            "title": "Profile Update Required",
            "message": "Please update your security license information to continue receiving bookings.",
            "type": "profile_update",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(days=3)).isoformat() + "Z",
            "data": {
                "required_fields": ["security_license", "insurance_info"],
                "action_required": True
            }
        },
        {
            "id": 6,
            "title": "Booking Cancelled",
            "message": "Your booking for Office Building Security on January 20th has been cancelled.",
            "type": "booking_cancelled",
            "is_read": True,
            "created_at": (datetime.now() - timedelta(days=4)).isoformat() + "Z",
            "data": {
                "booking_id": 120,
                "event_type": "Office Building Security",
                "cancellation_reason": "Client request"
            }
        },
        {
            "id": 7,
            "title": "System Maintenance",
            "message": "Scheduled maintenance will occur on January 30th from 2:00 AM to 4:00 AM EST.",
            "type": "system",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(hours=12)).isoformat() + "Z",
            "data": {
                "maintenance_date": "2025-01-30",
                "start_time": "02:00",
                "end_time": "04:00"
            }
        },
        {
            "id": 8,
            "title": "New Feature Available",
            "message": "You can now upload multiple photos to your posts! Try it out in the Feed section.",
            "type": "feature_update",
            "is_read": True,
            "created_at": (datetime.now() - timedelta(days=5)).isoformat() + "Z",
            "data": {
                "feature_name": "Multiple Photo Upload",
                "location": "Feed Section"
            }
        }
    ]
    
    # Filter notifications based on user type if needed
    if current_user.user_type == 'consumer':
        # For consumers, show booking-related notifications
        filtered_notifications = [n for n in mock_notifications if n['type'] in ['booking_confirmed', 'payment_received', 'review_received', 'booking_cancelled', 'system', 'feature_update']]
    else:
        # For guards, show all notifications
        filtered_notifications = mock_notifications
    
    return filtered_notifications


@router.post("/mark-read/{notification_id}")
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark specific notification as read"""
    # Mock implementation - in real app, update database
    return {"success": True, "message": f"Notification {notification_id} marked as read"}


@router.post("/mark-all-read")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read"""
    # Mock implementation - in real app, update database
    return {"success": True, "message": "All notifications marked as read"}


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get unread notification count"""
    # Get notifications and count unread ones
    notifications = await get_notifications(current_user, db)
    unread_count = sum(1 for notification in notifications if not notification['is_read'])
    
    return {"unread_count": unread_count}