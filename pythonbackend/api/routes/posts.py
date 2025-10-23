"""
Social posts routes
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime

from core.security import get_current_active_user
from db.session import get_db
from db.models.user import User

router = APIRouter()


@router.get("/")
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[int] = None,
    post_type: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get posts feed"""
    # For now, return mock data with sample images
    mock_posts = [
        {
            "id": 1,
            "content": "Just completed a successful security detail at a corporate event. Great team and professional environment!",
            "post_type": "work_update",
            "media_urls": [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=300&fit=crop"
            ],
            "likes_count": 5,
            "comments_count": 2,
            "created_at": "2025-10-23T10:00:00Z",
            "user": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "avatar_url": None
            }
        },
        {
            "id": 2,
            "content": "Looking for security work this weekend. Available for events, parties, or corporate security.",
            "post_type": "job_seeking",
            "media_urls": [
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
            ],
            "likes_count": 3,
            "comments_count": 1,
            "created_at": "2025-10-23T09:30:00Z",
            "user": {
                "id": 2,
                "first_name": "Jane",
                "last_name": "Smith",
                "avatar_url": None
            }
        },
        {
            "id": 3,
            "content": "Security training session completed! Always learning new techniques to better serve our clients.",
            "post_type": "training",
            "media_urls": [
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1581578731548-c6a0c3f2e6b8?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=300&fit=crop"
            ],
            "likes_count": 8,
            "comments_count": 4,
            "created_at": "2025-10-23T08:15:00Z",
            "user": {
                "id": 3,
                "first_name": "Mike",
                "last_name": "Johnson",
                "avatar_url": None
            }
        },
        {
            "id": 4,
            "content": "Night shift security at the downtown office building. Quiet night but always vigilant!",
            "post_type": "work_update",
            "media_urls": [
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop"
            ],
            "likes_count": 6,
            "comments_count": 1,
            "created_at": "2025-10-23T07:45:00Z",
            "user": {
                "id": 4,
                "first_name": "Sarah",
                "last_name": "Wilson",
                "avatar_url": None
            }
        },
        {
            "id": 5,
            "content": "URGENT: Need security guard for wedding event this Saturday evening in Brooklyn. Must have experience with large events. $50/hour for 6 hours. Please contact ASAP!",
            "post_type": "guard_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&h=300&fit=crop"
            ],
            "likes_count": 12,
            "comments_count": 8,
            "created_at": "2025-10-23T09:30:00Z",
            "user": {
                "id": 5,
                "first_name": "Emily",
                "last_name": "Brown",
                "avatar_url": None
            }
        },
        {
            "id": 6,
            "content": "Looking for experienced security guard for corporate event next Friday. Event will be at Manhattan Convention Center from 6 PM to 11 PM. Professional attire required.",
            "post_type": "guard_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop"
            ],
            "likes_count": 8,
            "comments_count": 5,
            "created_at": "2025-10-23T11:15:00Z",
            "user": {
                "id": 6,
                "first_name": "David",
                "last_name": "Williams",
                "avatar_url": None
            }
        },
        {
            "id": 7,
            "content": "Security needed for construction site in Queens. Night shift from 10 PM to 6 AM. Must have valid security license. $35/hour. Long-term opportunity available.",
            "post_type": "guard_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=300&fit=crop"
            ],
            "likes_count": 15,
            "comments_count": 12,
            "created_at": "2025-10-23T14:20:00Z",
            "user": {
                "id": 7,
                "first_name": "Robert",
                "last_name": "Anderson",
                "avatar_url": None
            }
        },
        {
            "id": 8,
            "content": "VIP personal protection needed for business executive. Must have experience with high-profile clients. Discretion and professionalism required. Excellent pay.",
            "post_type": "guard_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop"
            ],
            "likes_count": 20,
            "comments_count": 15,
            "created_at": "2025-10-23T16:45:00Z",
            "user": {
                "id": 8,
                "first_name": "Lisa",
                "last_name": "Rodriguez",
                "avatar_url": None
            }
        },
        {
            "id": 9,
            "content": "Looking for security work opportunities. 5+ years experience in corporate security, crowd control, and event security. Available for both day and night shifts.",
            "post_type": "work_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1581578731548-c6a0c3f2e6b8?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=300&fit=crop"
            ],
            "likes_count": 7,
            "comments_count": 3,
            "created_at": "2025-10-23T18:00:00Z",
            "user": {
                "id": 9,
                "first_name": "Alex",
                "last_name": "Thompson",
                "avatar_url": None
            }
        },
        {
            "id": 10,
            "content": "Security equipment showcase: Latest body cameras, communication devices, and safety gear. Professional quality for all security needs.",
            "post_type": "equipment_showcase",
            "media_urls": [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
            ],
            "likes_count": 12,
            "comments_count": 6,
            "created_at": "2025-10-23T19:15:00Z",
            "user": {
                "id": 10,
                "first_name": "Security",
                "last_name": "Pro",
                "avatar_url": None
            }
        },
        {
            "id": 11,
            "content": "Night patrol at the industrial complex. Everything secure and under control. Professional security services available for your business.",
            "post_type": "work_update",
            "media_urls": [
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop"
            ],
            "likes_count": 9,
            "comments_count": 2,
            "created_at": "2025-10-23T20:30:00Z",
            "user": {
                "id": 11,
                "first_name": "Marcus",
                "last_name": "Davis",
                "avatar_url": None
            }
        },
        {
            "id": 12,
            "content": "Security team training session: Advanced threat assessment and response protocols. Always improving our skills to better serve clients.",
            "post_type": "training",
            "media_urls": [
                "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1581578731548-c6a0c3f2e6b8?w=500&h=300&fit=crop"
            ],
            "likes_count": 15,
            "comments_count": 8,
            "created_at": "2025-10-23T21:00:00Z",
            "user": {
                "id": 12,
                "first_name": "Security",
                "last_name": "Training",
                "avatar_url": None
            }
        },
        {
            "id": 13,
            "content": "Available for immediate security work. Specialized in retail security, loss prevention, and customer service. Flexible schedule.",
            "post_type": "work_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=300&fit=crop"
            ],
            "likes_count": 5,
            "comments_count": 2,
            "created_at": "2025-10-23T22:15:00Z",
            "user": {
                "id": 13,
                "first_name": "Jennifer",
                "last_name": "Lee",
                "avatar_url": None
            }
        },
        {
            "id": 14,
            "content": "Security checkpoint at the corporate headquarters. All personnel and visitors properly screened. Maintaining high security standards.",
            "post_type": "work_update",
            "media_urls": [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop"
            ],
            "likes_count": 11,
            "comments_count": 4,
            "created_at": "2025-10-23T23:00:00Z",
            "user": {
                "id": 14,
                "first_name": "David",
                "last_name": "Miller",
                "avatar_url": None
            }
        },
        {
            "id": 15,
            "content": "Security awareness post: Always be vigilant and report suspicious activities. Safety is everyone's responsibility.",
            "post_type": "safety_tip",
            "media_urls": [
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
            ],
            "likes_count": 18,
            "comments_count": 7,
            "created_at": "2025-10-24T08:00:00Z",
            "user": {
                "id": 15,
                "first_name": "Safety",
                "last_name": "First",
                "avatar_url": None
            }
        },
        {
            "id": 16,
            "content": "Looking for security work in the downtown area. Experience with office buildings, retail security, and event management. Available immediately.",
            "post_type": "work_request",
            "media_urls": [
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop"
            ],
            "likes_count": 6,
            "comments_count": 3,
            "created_at": "2025-10-24T09:30:00Z",
            "user": {
                "id": 16,
                "first_name": "Ryan",
                "last_name": "Garcia",
                "avatar_url": None
            }
        },
        {
            "id": 17,
            "content": "Security team meeting: Planning for the upcoming corporate event. Coordination and communication are key to successful security operations.",
            "post_type": "team_update",
            "media_urls": [
                "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1581578731548-c6a0c3f2e6b8?w=500&h=300&fit=crop"
            ],
            "likes_count": 13,
            "comments_count": 5,
            "created_at": "2025-10-24T10:45:00Z",
            "user": {
                "id": 17,
                "first_name": "Team",
                "last_name": "Leader",
                "avatar_url": None
            }
        },
        {
            "id": 18,
            "content": "Security equipment maintenance day. All gear checked, cleaned, and ready for action. Professional equipment for professional security services.",
            "post_type": "equipment_update",
            "media_urls": [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=300&fit=crop"
            ],
            "likes_count": 8,
            "comments_count": 3,
            "created_at": "2025-10-24T11:30:00Z",
            "user": {
                "id": 18,
                "first_name": "Equipment",
                "last_name": "Manager",
                "avatar_url": None
            }
        },
        {
            "id": 19,
            "content": "🔥 SPECIAL OFFER! 🔥 Professional Security Uniforms at DISCOUNTED PRICES! Get 30% OFF on all security uniforms, tactical gear, and accessories. Premium quality materials, perfect fit guarantee, and fast shipping. Limited time offer - don't miss out! Contact us for bulk orders and additional discounts. #SecurityUniforms #TacticalGear #ProfessionalLook",
            "post_type": "advertisement",
            "media_urls": [
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&h=300&fit=crop",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"
            ],
            "likes_count": 25,
            "comments_count": 12,
            "created_at": "2025-10-24T12:00:00Z",
            "user": {
                "id": 19,
                "first_name": "Security",
                "last_name": "Training Pro",
                "avatar_url": None
            }
        }
    ]
    
    return mock_posts


@router.post("/")
async def create_post(
    content: str,
    post_type: str = "general",
    files: List[UploadFile] = File(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post with optional image uploads"""
    import os
    import uuid
    from datetime import datetime
    
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads/posts"
    os.makedirs(upload_dir, exist_ok=True)
    
    media_urls = []
    
    # Handle file uploads
    if files:
        for file in files:
            if file.filename:
                # Generate unique filename
                file_extension = os.path.splitext(file.filename)[1]
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                file_path = os.path.join(upload_dir, unique_filename)
                
                # Save file
                with open(file_path, "wb") as buffer:
                    content_bytes = await file.read()
                    buffer.write(content_bytes)
                
                # Add to media URLs (in production, this would be a proper URL)
                media_urls.append(f"/uploads/posts/{unique_filename}")
    
    # For now, return mock data with uploaded images
    return {
        "id": 5,
        "content": content,
        "post_type": post_type,
        "media_urls": media_urls,
        "likes_count": 0,
        "comments_count": 0,
        "created_at": datetime.now().isoformat() + "Z",
        "user": {
            "id": current_user.id,
            "first_name": current_user.first_name or "Current",
            "last_name": current_user.last_name or "User",
            "avatar_url": None
        }
    }


@router.get("/{post_id}")
async def get_post(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific post"""
    post_service = PostService(db)
    post = await post_service.get_post(post_id)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    return {"id": post_id, "content": "Mock post", "user": {"id": 1, "first_name": "Mock", "last_name": "User"}}


@router.put("/{post_id}")
async def update_post(
    post_id: int,
    post_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a post"""
    post_service = PostService(db)
    post = await post_service.update_post(post_id, current_user.id, post_data)
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or not authorized"
        )
    
    return {"id": post_id, "content": "Mock post", "user": {"id": 1, "first_name": "Mock", "last_name": "User"}}


@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a post"""
    post_service = PostService(db)
    success = await post_service.delete_post(post_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found or not authorized"
        )
    
    return {"message": "Post deleted successfully"}


@router.get("/user/{user_id}")
async def get_user_posts(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get posts by a specific user"""
    post_service = PostService(db)
    posts = await post_service.get_user_posts(user_id, skip=skip, limit=limit)
    return [{"id": post.id, "content": "Mock post", "user": {"id": 1, "first_name": "Mock", "last_name": "User"}} for post in posts]


@router.get("/feed/trending")
async def get_trending_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get trending posts"""
    post_service = PostService(db)
    posts = await post_service.get_trending_posts(skip=skip, limit=limit)
    return [{"id": post.id, "content": "Mock post", "user": {"id": 1, "first_name": "Mock", "last_name": "User"}} for post in posts]


# Media endpoints
@router.post("/{post_id}/media")
async def add_media_to_post(
    post_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Add media to a post"""
    post_service = PostService(db)
    media = await post_service.add_media_to_post(post_id, current_user.id, file)
    return PostMediaResponse.from_orm(media)


@router.get("/{post_id}/media")
async def get_post_media(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get media for a post"""
    post_service = PostService(db)
    media = await post_service.get_post_media(post_id)
    return [PostMediaResponse.from_orm(m) for m in media]


@router.delete("/{post_id}/media/{media_id}")
async def delete_post_media(
    post_id: int,
    media_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete media from a post"""
    post_service = PostService(db)
    success = await post_service.delete_post_media(post_id, media_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found or not authorized"
        )
    
    return {"message": "Media deleted successfully"}


# Like endpoints
@router.post("/{post_id}/like")
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a post"""
    post_service = PostService(db)
    like = await post_service.like_post(post_id, current_user.id)
    return PostLikeResponse.from_orm(like)


@router.delete("/{post_id}/like")
async def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a post"""
    post_service = PostService(db)
    success = await post_service.unlike_post(post_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )
    
    return {"message": "Post unliked successfully"}


@router.get("/{post_id}/likes")
async def get_post_likes(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get likes for a post"""
    post_service = PostService(db)
    likes = await post_service.get_post_likes(post_id, skip=skip, limit=limit)
    return [PostLikeResponse.from_orm(like) for like in likes]


# Comment endpoints
@router.post("/{post_id}/comments")
async def create_comment(
    post_id: int,
    content: str,
    parent_comment_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a comment on a post"""
    post_service = PostService(db)
    comment = await post_service.create_comment(
        post_id, current_user.id, content, parent_comment_id
    )
    return PostCommentResponse.from_orm(comment)


@router.get("/{post_id}/comments")
async def get_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a post"""
    post_service = PostService(db)
    comments = await post_service.get_post_comments(post_id, skip=skip, limit=limit)
    return [PostCommentResponse.from_orm(comment) for comment in comments]


@router.put("/comments/{comment_id}")
async def update_comment(
    comment_id: int,
    content: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a comment"""
    post_service = PostService(db)
    comment = await post_service.update_comment(comment_id, current_user.id, content)
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or not authorized"
        )
    
    return PostCommentResponse.from_orm(comment)


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a comment"""
    post_service = PostService(db)
    success = await post_service.delete_comment(comment_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or not authorized"
        )
    
    return {"message": "Comment deleted successfully"}


@router.post("/comments/{comment_id}/like")
async def like_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a comment"""
    post_service = PostService(db)
    like = await post_service.like_comment(comment_id, current_user.id)
    return CommentLikeResponse.from_orm(like)


@router.delete("/comments/{comment_id}/like")
async def unlike_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a comment"""
    post_service = PostService(db)
    success = await post_service.unlike_comment(comment_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )
    
    return {"message": "Comment unliked successfully"}
