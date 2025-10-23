"""
Booking routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from core.security import get_current_active_user, get_current_guard_user, get_current_consumer_user
from db.session import get_db
from db.models.user import User
# from schemas.booking import BookingResponse, BookingCreate, BookingUpdate

router = APIRouter()


@router.get("/")
async def get_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get bookings for current user"""
    # Mock data for bookings - filter by current user
    all_mock_bookings = [
        {
            "id": "1",
            "event_type": "Corporate Event Security",
            "event_date": "2025-10-25",
            "start_time": "18:00",
            "end_time": "23:00",
            "location": "Downtown Convention Center, 123 Main St, New York, NY",
            "status": "pending",
            "total_amount": 400.00,
            "description": "Security for annual company gala event. Expected 200+ attendees.",
            "special_requirements": "Black suit required, must be comfortable with large crowds",
            "created_at": "2025-10-23T10:00:00Z",
            "requester": {
                "id": "101",
                "first_name": "Sarah",
                "last_name": "Johnson",
                "avatar_url": None,
                "rating": 4.8,
                "phone": "+1-555-0123"
            },
            "guard": {
                "id": "201",
                "first_name": "Mike",
                "last_name": "Chen",
                "avatar_url": None,
                "rating": 4.9,
                "experience_years": 5
            }
        },
        {
            "id": "2",
            "event_type": "VIP Personal Protection",
            "event_date": "2025-10-26",
            "start_time": "09:00",
            "end_time": "17:00",
            "location": "Private Residence, 456 Park Ave, New York, NY",
            "status": "confirmed",
            "total_amount": 600.00,
            "description": "Personal security detail for high-profile client during business meetings.",
            "special_requirements": "Discrete, professional appearance, background check required",
            "created_at": "2025-10-22T14:30:00Z",
            "requester": {
                "id": "102",
                "first_name": "David",
                "last_name": "Williams",
                "avatar_url": None,
                "rating": 4.9,
                "phone": "+1-555-0456"
            },
            "guard": {
                "id": "202",
                "first_name": "Lisa",
                "last_name": "Rodriguez",
                "avatar_url": None,
                "rating": 4.7,
                "experience_years": 7
            }
        },
        {
            "id": "3",
            "event_type": "Wedding Security",
            "event_date": "2025-10-27",
            "start_time": "16:00",
            "end_time": "01:00",
            "location": "Garden Venue, 789 Oak St, Brooklyn, NY",
            "status": "pending",
            "total_amount": 350.00,
            "description": "Security for outdoor wedding ceremony and reception.",
            "special_requirements": "Formal attire, experience with wedding events preferred",
            "created_at": "2025-10-23T08:15:00Z",
            "requester": {
                "id": "103",
                "first_name": "Emily",
                "last_name": "Brown",
                "avatar_url": None,
                "rating": 4.6,
                "phone": "+1-555-0789"
            },
            "guard": None
        },
        {
            "id": "4",
            "event_type": "Night Club Security",
            "event_date": "2025-10-24",
            "start_time": "22:00",
            "end_time": "06:00",
            "location": "Club Neon, 321 Night St, Manhattan, NY",
            "status": "in_progress",
            "total_amount": 280.00,
            "description": "Security for weekend night club operations.",
            "special_requirements": "Experience with nightlife venues, crowd control skills",
            "created_at": "2025-10-21T20:00:00Z",
            "requester": {
                "id": "104",
                "first_name": "James",
                "last_name": "Taylor",
                "avatar_url": None,
                "rating": 4.5,
                "phone": "+1-555-0321"
            },
            "guard": {
                "id": "203",
                "first_name": "Alex",
                "last_name": "Martinez",
                "avatar_url": None,
                "rating": 4.8,
                "experience_years": 3
            }
        },
        {
            "id": "5",
            "event_type": "Construction Site Security",
            "event_date": "2025-10-28",
            "start_time": "06:00",
            "end_time": "18:00",
            "location": "Construction Site, 555 Build Ave, Queens, NY",
            "status": "completed",
            "total_amount": 320.00,
            "description": "Overnight security for construction site equipment and materials.",
            "special_requirements": "Valid security license, experience with construction sites",
            "created_at": "2025-10-20T12:00:00Z",
            "requester": {
                "id": "105",
                "first_name": "Robert",
                "last_name": "Anderson",
                "avatar_url": None,
                "rating": 4.7,
                "phone": "+1-555-0654"
            },
            "guard": {
                "id": "204",
                "first_name": "Chris",
                "last_name": "Wilson",
                "avatar_url": None,
                "rating": 4.6,
                "experience_years": 4
            }
        }
    ]
    
    # Filter bookings based on user type and current user
    if current_user.user_type == 'guard':
        # For guards, show bookings where they are assigned or pending requests
        mock_bookings = [
            b for b in all_mock_bookings 
            if b["guard"] and b["guard"]["id"] == str(current_user.id)
        ]
        # Also include pending bookings (no guard assigned yet)
        pending_bookings = [
            b for b in all_mock_bookings 
            if b["status"] == "pending" and not b["guard"]
        ]
        mock_bookings.extend(pending_bookings)
    else:
        # For consumers, show their own bookings
        mock_bookings = [
            b for b in all_mock_bookings 
            if b["requester"]["id"] == str(current_user.id)
        ]
    
    # Filter by status if provided
    if status:
        mock_bookings = [b for b in mock_bookings if b["status"] == status]
    
    # Sort by event_date (most recent first)
    mock_bookings.sort(key=lambda x: x["event_date"], reverse=True)
    
    return mock_bookings[skip:skip + limit]


@router.post("/")
async def create_booking(
    booking_data: dict,
    current_user: User = Depends(get_current_consumer_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new booking"""
    # TODO: Implement booking creation
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Booking creation not implemented yet"
    )


@router.get("/{booking_id}")
async def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific booking"""
    # TODO: Implement booking retrieval
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Booking retrieval not implemented yet"
    )


@router.put("/{booking_id}")
async def update_booking(
    booking_id: int,
    booking_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a booking"""
    # TODO: Implement booking update
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Booking update not implemented yet"
    )


@router.post("/{booking_id}/confirm")
async def confirm_booking(
    booking_id: int,
    current_user: User = Depends(get_current_guard_user),
    db: AsyncSession = Depends(get_db)
):
    """Confirm a booking"""
    # TODO: Implement booking confirmation
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Booking confirmation not implemented yet"
    )


@router.post("/{booking_id}/cancel")
async def cancel_booking(
    booking_id: int,
    reason: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Cancel a booking"""
    # TODO: Implement booking cancellation
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Booking cancellation not implemented yet"
    )


@router.post("/{booking_id}/complete")
async def complete_booking(
    booking_id: int,
    current_user: User = Depends(get_current_guard_user),
    db: AsyncSession = Depends(get_db)
):
    """Complete a booking"""
    # TODO: Implement booking completion
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Booking completion not implemented yet"
    )
