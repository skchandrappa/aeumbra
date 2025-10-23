"""
Notification service for sending notifications
"""

from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from db.models.notification import Notification, NotificationType
from db.models.user import User
from services.email_service import EmailService
from services.push_notification_service import PushNotificationService


class NotificationService:
    """Notification service for sending notifications"""
    
    def __init__(self):
        self.email_service = EmailService()
        self.push_service = PushNotificationService()
    
    async def send_notification(
        self,
        db: AsyncSession,
        user_id: int,
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        send_email: bool = True,
        send_push: bool = True
    ) -> bool:
        """Send notification to user"""
        try:
            # Get notification type
            result = await db.execute(
                select(NotificationType).where(NotificationType.name == notification_type)
            )
            notification_type_obj = result.scalar_one_or_none()
            
            if not notification_type_obj:
                return False
            
            # Create notification record
            notification = Notification(
                user_id=user_id,
                type_id=notification_type_obj.id,
                title=title,
                message=message,
                data=data or {}
            )
            
            db.add(notification)
            await db.flush()
            
            # Send email if requested
            if send_email:
                user = await db.get(User, user_id)
                if user and user.settings.email_notifications:
                    await self.email_service.send_email(
                        user.email,
                        title,
                        message
                    )
                    notification.sent_email = True
            
            # Send push notification if requested
            if send_push:
                user = await db.get(User, user_id)
                if user and user.settings.push_notifications:
                    success = await self.push_service.send_notification(
                        user_id,
                        title,
                        message,
                        data
                    )
                    if success:
                        notification.sent_push = True
            
            await db.commit()
            return True
            
        except Exception as e:
            print(f"Error sending notification: {e}")
            return False
    
    async def send_booking_notification(
        self,
        db: AsyncSession,
        user_id: int,
        booking_details: Dict[str, Any]
    ) -> bool:
        """Send booking-related notification"""
        title = "New Booking Update"
        message = f"Your booking for {booking_details.get('event_name')} has been updated."
        
        return await self.send_notification(
            db=db,
            user_id=user_id,
            notification_type="booking_update",
            title=title,
            message=message,
            data=booking_details
        )
    
    async def send_payment_notification(
        self,
        db: AsyncSession,
        user_id: int,
        payment_details: Dict[str, Any]
    ) -> bool:
        """Send payment-related notification"""
        title = "Payment Update"
        message = f"Payment of ${payment_details.get('amount')} has been processed."
        
        return await self.send_notification(
            db=db,
            user_id=user_id,
            notification_type="payment_update",
            title=title,
            message=message,
            data=payment_details
        )
    
    async def send_review_notification(
        self,
        db: AsyncSession,
        user_id: int,
        review_details: Dict[str, Any]
    ) -> bool:
        """Send review-related notification"""
        title = "New Review"
        message = f"You received a {review_details.get('rating')}-star review!"
        
        return await self.send_notification(
            db=db,
            user_id=user_id,
            notification_type="review_received",
            title=title,
            message=message,
            data=review_details
        )
    
    async def mark_notification_read(
        self,
        db: AsyncSession,
        notification_id: int,
        user_id: int
    ) -> bool:
        """Mark notification as read"""
        try:
            result = await db.execute(
                select(Notification).where(
                    Notification.id == notification_id,
                    Notification.user_id == user_id
                )
            )
            notification = result.scalar_one_or_none()
            
            if notification:
                notification.is_read = True
                notification.read_at = datetime.utcnow()
                await db.commit()
                return True
            
            return False
        except Exception as e:
            print(f"Error marking notification as read: {e}")
            return False
    
    async def get_user_notifications(
        self,
        db: AsyncSession,
        user_id: int,
        limit: int = 20,
        offset: int = 0
    ) -> list:
        """Get user notifications"""
        result = await db.execute(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()
    
    async def get_unread_count(
        self,
        db: AsyncSession,
        user_id: int
    ) -> int:
        """Get unread notification count"""
        result = await db.execute(
            select(Notification)
            .where(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
        )
        return len(result.scalars().all())
