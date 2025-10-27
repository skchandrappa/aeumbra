"""
Security Guard Freelancing App - FastAPI Main Application
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
import logging
import os
from contextlib import asynccontextmanager

from core.config import settings
from core.security import get_current_user
from db.session import engine, Base
from api.routes import api_router
# from services.notification_service import NotificationService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Security Guard App...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Initialize notification service
    # app.state.notification_service = NotificationService()
    
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Security Guard App...")


# Create FastAPI application
app = FastAPI(
    title="Security Guard Freelancing Platform",
    description="A comprehensive platform for security guard freelancing with social features",
    version="1.0.0",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan
)

# Add middleware with dynamic Tailscale support
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001",
        # Production frontend URLs - add your Vercel/Netlify URL here
        "https://your-app.vercel.app",
        # Allow all origins in development
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)


# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
            "data": None,
            "errors": [],
            "timestamp": None
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation failed",
            "data": None,
            "errors": [
                {
                    "field": error["loc"][-1] if error["loc"] else "unknown",
                    "code": "VALIDATION_ERROR",
                    "message": error["msg"]
                }
                for error in exc.errors()
            ],
            "timestamp": None
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "data": None,
            "errors": [],
            "timestamp": None
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "success": True,
        "message": "Service is healthy",
        "data": {
            "status": "healthy",
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT
        },
        "timestamp": None
    }


# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Mount static files for uploaded images
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )
