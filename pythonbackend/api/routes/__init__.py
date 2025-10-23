"""
API routes package
"""

from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
# from .verification import router as verification_router
from .posts import router as posts_router
from .bookings import router as bookings_router
# from .payments import router as payments_router
# from .reviews import router as reviews_router
# from .complaints import router as complaints_router
from .notifications import router as notifications_router
# from .search import router as search_router
# from .analytics import router as analytics_router
# from .admin import router as admin_router

api_router = APIRouter()

# Include all routers
api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
# api_router.include_router(verification_router, prefix="/verification", tags=["Verification"])
api_router.include_router(posts_router, prefix="/posts", tags=["Posts"])
api_router.include_router(bookings_router, prefix="/bookings", tags=["Bookings"])
# api_router.include_router(payments_router, prefix="/payments", tags=["Payments"])
# api_router.include_router(reviews_router, prefix="/reviews", tags=["Reviews"])
# api_router.include_router(complaints_router, prefix="/complaints", tags=["Complaints"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
# api_router.include_router(search_router, prefix="/search", tags=["Search"])
# api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
# api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
