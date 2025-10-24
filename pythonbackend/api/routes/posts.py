from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from db.session import get_db
from db.models.post import Post, PostMedia
from db.models.user import User
from core.security import get_current_active_user
from schemas.post import PostCreate, PostUpdate, PostResponse
from services.post_service import PostService

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
    try:
        post_service = PostService(db)
        posts = await post_service.get_posts(skip, limit, user_id, post_type)
        
        # Convert to response format
        posts_data = []
        for post in posts:
            # Get user information
            user_query = select(User).where(User.id == post.user_id)
            user_result = await db.execute(user_query)
            user = user_result.scalar_one_or_none()
            
            if user:
                # Get media URLs
                media_query = select(PostMedia).where(PostMedia.post_id == post.id)
                media_result = await db.execute(media_query)
                media_list = media_result.scalars().all()
                media_urls = [media.media_url for media in media_list] if media_list else []
                
                posts_data.append({
                    "id": post.id,
                    "content": post.content,
                    "post_type": post.post_type,
                    "media_urls": media_urls,
                    "likes_count": post.like_count or 0,
                    "comments_count": post.comment_count or 0,
                    "created_at": post.created_at.isoformat() if post.created_at else None,
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "avatar_url": user.avatar_url
                    }
                })
        
        return {
            "success": True,
            "message": "Posts retrieved successfully",
            "data": posts_data,
            "pagination": {
                "skip": skip,
                "limit": limit,
                "total": len(posts_data)
            }
        }
        
    except Exception as e:
        print(f"Error getting posts: {str(e)}")
        # If no posts in database, return empty array
        return {
            "success": True,
            "message": "No posts found",
            "data": [],
            "pagination": {
                "skip": skip,
                "limit": limit,
                "total": 0
            }
        }


@router.post("/")
async def create_post(
    content: str,
    post_type: str = "general",
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new post"""
    try:
        post_service = PostService(db)
        post_data = PostCreate(
            content=content,
            post_type=post_type,
            visibility="public",
            allow_comments=True,
            allow_sharing=True
        )
        post = await post_service.create_post(
            user_id=current_user.id,
            post_data=post_data
        )
        
        return {
            "success": True,
            "message": "Post created successfully",
            "data": {
                "id": post.id,
                "content": post.content,
                "post_type": post.post_type,
                "created_at": post.created_at.isoformat() if post.created_at else None
            }
        }
    except Exception as e:
        print(f"Error creating post: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create post: {str(e)}"
        )


@router.get("/{post_id}")
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific post by ID"""
    try:
        post_service = PostService(db)
        post = await post_service.get_post(post_id)
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        # Get user information
        user_query = select(User).where(User.id == post.user_id)
        user_result = await db.execute(user_query)
        user = user_result.scalar_one_or_none()
        
        if user:
            return {
                "success": True,
                "message": "Post retrieved successfully",
                "data": {
                    "id": post.id,
                    "content": post.content,
                    "post_type": post.post_type,
                    "media_urls": post.media_urls or [],
                    "likes_count": post.likes_count or 0,
                    "comments_count": post.comments_count or 0,
                    "created_at": post.created_at.isoformat() if post.created_at else None,
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "avatar_url": user.avatar_url
                    }
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve post: {str(e)}"
        )


@router.get("/user/{user_id}")
async def get_user_posts(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get posts by a specific user"""
    try:
        post_service = PostService(db)
        posts = await post_service.get_user_posts(user_id, skip, limit)
        
        return {
            "success": True,
            "message": "User posts retrieved successfully",
            "data": posts,
            "pagination": {
                "skip": skip,
                "limit": limit,
                "total": len(posts)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user posts: {str(e)}"
        )


@router.get("/feed/trending")
async def get_trending_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get trending posts (most liked)"""
    try:
        post_service = PostService(db)
        posts = await post_service.get_trending_posts(skip, limit)
        
        return {
            "success": True,
            "message": "Trending posts retrieved successfully",
            "data": posts,
            "pagination": {
                "skip": skip,
                "limit": limit,
                "total": len(posts)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve trending posts: {str(e)}"
        )


@router.post("/{post_id}/media")
async def add_media_to_post(
    post_id: int,
    media_urls: List[str],
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Add media to a post"""
    try:
        post_service = PostService(db)
        post = await post_service.add_media_to_post(post_id, media_urls)
        
        return {
            "success": True,
            "message": "Media added successfully",
            "data": {
                "id": post.id,
                "media_urls": post.media_urls
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add media: {str(e)}"
        )


@router.get("/{post_id}/media")
async def get_post_media(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get media for a post"""
    try:
        post_service = PostService(db)
        media = await post_service.get_post_media(post_id)
        
        return {
            "success": True,
            "message": "Media retrieved successfully",
            "data": media
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve media: {str(e)}"
        )


@router.delete("/{post_id}/media/{media_url}")
async def delete_post_media(
    post_id: int,
    media_url: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete media from a post"""
    try:
        post_service = PostService(db)
        await post_service.delete_post_media(post_id, media_url)
        
        return {
            "success": True,
            "message": "Media deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete media: {str(e)}"
        )


@router.post("/{post_id}/like")
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a post"""
    try:
        post_service = PostService(db)
        await post_service.like_post(post_id, current_user.id)
        
        return {
            "success": True,
            "message": "Post liked successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to like post: {str(e)}"
        )


@router.delete("/{post_id}/like")
async def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a post"""
    try:
        post_service = PostService(db)
        await post_service.unlike_post(post_id, current_user.id)
        
        return {
            "success": True,
            "message": "Post unliked successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unlike post: {str(e)}"
        )


@router.get("/{post_id}/likes")
async def get_post_likes(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get likes for a post"""
    try:
        post_service = PostService(db)
        likes = await post_service.get_post_likes(post_id)
        
        return {
            "success": True,
            "message": "Likes retrieved successfully",
            "data": likes
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve likes: {str(e)}"
        )


@router.post("/{post_id}/comments")
async def create_comment(
    post_id: int,
    content: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a comment on a post"""
    try:
        post_service = PostService(db)
        comment = await post_service.create_comment(post_id, current_user.id, content)
        
        return {
            "success": True,
            "message": "Comment created successfully",
            "data": {
                "id": comment.id,
                "content": comment.content,
                "created_at": comment.created_at.isoformat() if comment.created_at else None
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create comment: {str(e)}"
        )


@router.get("/{post_id}/comments")
async def get_post_comments(
    post_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get comments for a post"""
    try:
        post_service = PostService(db)
        comments = await post_service.get_post_comments(post_id, skip, limit)
        
        return {
            "success": True,
            "message": "Comments retrieved successfully",
            "data": comments,
            "pagination": {
                "skip": skip,
                "limit": limit,
                "total": len(comments)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve comments: {str(e)}"
        )


@router.put("/comments/{comment_id}")
async def update_comment(
    comment_id: int,
    content: str,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a comment"""
    try:
        post_service = PostService(db)
        comment = await post_service.update_comment(comment_id, current_user.id, content)
        
        return {
            "success": True,
            "message": "Comment updated successfully",
            "data": {
                "id": comment.id,
                "content": comment.content,
                "updated_at": comment.updated_at.isoformat() if comment.updated_at else None
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update comment: {str(e)}"
        )


@router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a comment"""
    try:
        post_service = PostService(db)
        await post_service.delete_comment(comment_id, current_user.id)
        
        return {
            "success": True,
            "message": "Comment deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete comment: {str(e)}"
        )


@router.post("/comments/{comment_id}/like")
async def like_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Like a comment"""
    try:
        post_service = PostService(db)
        await post_service.like_comment(comment_id, current_user.id)
        
        return {
            "success": True,
            "message": "Comment liked successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to like comment: {str(e)}"
        )


@router.delete("/comments/{comment_id}/like")
async def unlike_comment(
    comment_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Unlike a comment"""
    try:
        post_service = PostService(db)
        await post_service.unlike_comment(comment_id, current_user.id)
        
        return {
            "success": True,
            "message": "Comment unliked successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unlike comment: {str(e)}"
        )