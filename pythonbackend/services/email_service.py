"""
Email service for sending emails
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from core.config import settings


class EmailService:
    """Email service for sending emails"""
    
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_use_tls = settings.SMTP_USE_TLS
    
    async def send_email(
        self, 
        to_email: str, 
        subject: str, 
        body: str, 
        is_html: bool = False
    ) -> bool:
        """Send email"""
        if not all([self.smtp_host, self.smtp_username, self.smtp_password]):
            print(f"Email not configured. Would send to {to_email}: {subject}")
            return True
        
        try:
            msg = MIMEMultipart()
            msg['From'] = self.smtp_username
            msg['To'] = to_email
            msg['Subject'] = subject
            
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            if self.smtp_use_tls:
                server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False
    
    async def send_verification_email(self, email: str, token: str) -> bool:
        """Send email verification email"""
        subject = "Verify Your Email - Security Guard App"
        body = f"""
        Please click the link below to verify your email address:
        
        {settings.FRONTEND_URL}/verify-email?token={token}
        
        This link will expire in 24 hours.
        
        If you didn't create an account, please ignore this email.
        """
        
        return await self.send_email(email, subject, body)
    
    async def send_password_reset_email(self, email: str, token: str) -> bool:
        """Send password reset email"""
        subject = "Reset Your Password - Security Guard App"
        body = f"""
        Please click the link below to reset your password:
        
        {settings.FRONTEND_URL}/reset-password?token={token}
        
        This link will expire in 1 hour.
        
        If you didn't request a password reset, please ignore this email.
        """
        
        return await self.send_email(email, subject, body)
    
    async def send_welcome_email(self, email: str, name: str) -> bool:
        """Send welcome email"""
        subject = "Welcome to Security Guard App!"
        body = f"""
        Hi {name},
        
        Welcome to the Security Guard Freelancing Platform!
        
        You can now:
        - Create your profile
        - Browse available security jobs
        - Connect with other security professionals
        - Start earning money as a freelance security guard
        
        Get started by completing your profile at {settings.FRONTEND_URL}/profile
        
        Best regards,
        The Security Guard App Team
        """
        
        return await self.send_email(email, subject, body)
    
    async def send_booking_confirmation_email(
        self, 
        email: str, 
        booking_details: dict
    ) -> bool:
        """Send booking confirmation email"""
        subject = "Booking Confirmed - Security Guard App"
        body = f"""
        Your booking has been confirmed!
        
        Event: {booking_details.get('event_name')}
        Date: {booking_details.get('start_datetime')}
        Location: {booking_details.get('venue_name')}
        Guard: {booking_details.get('guard_name')}
        
        Please arrive 15 minutes early for your security assignment.
        
        If you need to make changes, please contact us.
        """
        
        return await self.send_email(email, subject, body)
