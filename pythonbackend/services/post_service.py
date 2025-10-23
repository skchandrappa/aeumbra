"""
Post service for business logic
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import Optional, List
from fastapi import UploadFile

from db.models.post import Post, PostMedia, PostLike, PostComment, CommentLike
from schemas.post import PostCreate, PostUpdate


class PostService:
    """Post service for business logic"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_posts(
        self, skip: int = 0, limit: int = 20, user_id: Optional[int] = None,
        post_type: Optional[str] = None
    ) -> List[Post]:
        """Get posts with optional filters"""
        query = select(Post).where(Post.visibility == "public")
        
        if user_id:
            query = query.where(Post.user_id == user_id)
        
        if post_type:
            query = query.where(Post.post_type == post_type)
        
        query = query.order_by(desc(Post.created_at)).offset(skip).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def create_post(self, user_id: int, post_data: PostCreate) -> Post:
        """Create a new post"""
        post = Post(
            user_id=user_id,
            content=post_data.content,
            post_type=post_data.post_type,
            location_name=post_data.location_name,
            latitude=post_data.latitude,
            longitude=post_data.longitude,
            visibility=post_data.visibility,
            allow_comments=post_data.allow_comments,
            allow_sharing=post_data.allow_sharing
        )
        
        self.db.add(post)
        await self.db.commit()
        await self.db.refresh(post)
        
        return post
    
    async def get_post(self, post_id: int) -> Optional[Post]:
        """Get a specific post"""
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        return result.scalar_one_or_none()
    
    async def update_post(
        self, post_id: int, user_id: int, post_data: PostUpdate
    ) -> Optional[Post]:
        """Update a post"""
        post = await self.get_post(post_id)
        
        if not post or post.user_id != user_id:
            return None
        
        if post_data.content is not None:
            post.content = post_data.content
        if post_data.location_name is not None:
            post.location_name = post_data.location_name
        if post_data.latitude is not None:
            post.latitude = post_data.latitude
        if post_data.longitude is not None:
            post.longitude = post_data.longitude
        if post_data.visibility is not None:
            post.visibility = post_data.visibility
        if post_data.allow_comments is not None:
            post.allow_comments = post_data.allow_comments
        if post_data.allow_sharing is not None:
            post.allow_sharing = post_data.allow_sharing
        
        await self.db.commit()
        await self.db.refresh(post)
        
        return post
    
    async def delete_post(self, post_id: int, user_id: int) -> bool:
        """Delete a post"""
        post = await self.get_post(post_id)
        
        if not post or post.user_id != user_id:
            return False
        
        await self.db.delete(post)
        await self.db.commit()
        
        return True
    
    async def get_user_posts(
        self, user_id: int, skip: int = 0, limit: int = 20
    ) -> List[Post]:
        """Get posts by a specific user"""
        result = await self.db.execute(
            select(Post)
            .where(Post.user_id == user_id)
            .order_by(desc(Post.created_at))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def get_trending_posts(self, skip: int = 0, limit: int = 20) -> List[Post]:
        """Get trending posts based on engagement"""
        result = await self.db.execute(
            select(Post)
            .where(Post.visibility == "public")
            .order_by(desc(Post.like_count + Post.comment_count))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def add_media_to_post(
        self, post_id: int, user_id: int, file: UploadFile
    ) -> Optional[PostMedia]:
        """Add media to a post"""
        post = await self.get_post(post_id)
        
        if not post or post.user_id != user_id:
            return None
        
        # TODO: Implement file upload logic
        # For now, create a placeholder media record
        media = PostMedia(
            post_id=post_id,
            media_url=f"placeholder_url_{file.filename}",
            media_type="image",  # Determine from file type
            file_size=file.size if file.size else 0
        )
        
        self.db.add(media)
        await self.db.commit()
        await self.db.refresh(media)
        
        return media
    
    async def get_post_media(self, post_id: int) -> List[PostMedia]:
        """Get media for a post"""
        result = await self.db.execute(
            select(PostMedia)
            .where(PostMedia.post_id == post_id)
            .order_by(PostMedia.sort_order)
        )
        return result.scalars().all()
    
    async def delete_post_media(
        self, post_id: int, media_id: int, user_id: int
    ) -> bool:
        """Delete media from a post"""
        post = await self.get_post(post_id)
        
        if not post or post.user_id != user_id:
            return False
        
        result = await self.db.execute(
            select(PostMedia).where(
                PostMedia.id == media_id,
                PostMedia.post_id == post_id
            )
        )
        media = result.scalar_one_or_none()
        
        if not media:
            return False
        
        await self.db.delete(media)
        await self.db.commit()
        
        return True
    
    async def like_post(self, post_id: int, user_id: int) -> Optional[PostLike]:
        """Like a post"""
        # Check if already liked
        result = await self.db.execute(
            select(PostLike).where(
                PostLike.post_id == post_id,
                PostLike.user_id == user_id
            )
        )
        existing_like = result.scalar_one_or_none()
        
        if existing_like:
            return existing_like
        
        # Create new like
        like = PostLike(post_id=post_id, user_id=user_id)
        self.db.add(like)
        
        # Update like count
        post = await self.get_post(post_id)
        if post:
            post.like_count += 1
        
        await self.db.commit()
        await self.db.refresh(like)
        
        return like
    
    async def unlike_post(self, post_id: int, user_id: int) -> bool:
        """Unlike a post"""
        result = await self.db.execute(
            select(PostLike).where(
                PostLike.post_id == post_id,
                PostLike.user_id == user_id
            )
        )
        like = result.scalar_one_or_none()
        
        if not like:
            return False
        
        await self.db.delete(like)
        
        # Update like count
        post = await self.get_post(post_id)
        if post:
            post.like_count = max(0, post.like_count - 1)
        
        await self.db.commit()
        
        return True
    
    async def get_post_likes(
        self, post_id: int, skip: int = 0, limit: int = 20
    ) -> List[PostLike]:
        """Get likes for a post"""
        result = await self.db.execute(
            select(PostLike)
            .where(PostLike.post_id == post_id)
            .order_by(desc(PostLike.created_at))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def create_comment(
        self, post_id: int, user_id: int, content: str,
        parent_comment_id: Optional[int] = None
    ) -> Optional[PostComment]:
        """Create a comment on a post"""
        post = await self.get_post(post_id)
        
        if not post or not post.allow_comments:
            return None
        
        comment = PostComment(
            post_id=post_id,
            user_id=user_id,
            parent_comment_id=parent_comment_id,
            content=content
        )
        
        self.db.add(comment)
        
        # Update comment count
        post.comment_count += 1
        
        await self.db.commit()
        await self.db.refresh(comment)
        
        return comment
    
    async def get_post_comments(
        self, post_id: int, skip: int = 0, limit: int = 20
    ) -> List[PostComment]:
        """Get comments for a post"""
        result = await self.db.execute(
            select(PostComment)
            .where(PostComment.post_id == post_id)
            .order_by(desc(PostComment.created_at))
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def update_comment(
        self, comment_id: int, user_id: int, content: str
    ) -> Optional[PostComment]:
        """Update a comment"""
        result = await self.db.execute(
            select(PostComment).where(PostComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        
        if not comment or comment.user_id != user_id:
            return None
        
        comment.content = content
        comment.is_edited = True
        
        await self.db.commit()
        await self.db.refresh(comment)
        
        return comment
    
    async def delete_comment(self, comment_id: int, user_id: int) -> bool:
        """Delete a comment"""
        result = await self.db.execute(
            select(PostComment).where(PostComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        
        if not comment or comment.user_id != user_id:
            return False
        
        await self.db.delete(comment)
        
        # Update comment count
        post = await self.get_post(comment.post_id)
        if post:
            post.comment_count = max(0, post.comment_count - 1)
        
        await self.db.commit()
        
        return True
    
    async def like_comment(self, comment_id: int, user_id: int) -> Optional[CommentLike]:
        """Like a comment"""
        # Check if already liked
        result = await self.db.execute(
            select(CommentLike).where(
                CommentLike.comment_id == comment_id,
                CommentLike.user_id == user_id
            )
        )
        existing_like = result.scalar_one_or_none()
        
        if existing_like:
            return existing_like
        
        # Create new like
        like = CommentLike(comment_id=comment_id, user_id=user_id)
        self.db.add(like)
        
        # Update like count
        result = await self.db.execute(
            select(PostComment).where(PostComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        if comment:
            comment.like_count += 1
        
        await self.db.commit()
        await self.db.refresh(like)
        
        return like
    
    async def unlike_comment(self, comment_id: int, user_id: int) -> bool:
        """Unlike a comment"""
        result = await self.db.execute(
            select(CommentLike).where(
                CommentLike.comment_id == comment_id,
                CommentLike.user_id == user_id
            )
        )
        like = result.scalar_one_or_none()
        
        if not like:
            return False
        
        await self.db.delete(like)
        
        # Update like count
        result = await self.db.execute(
            select(PostComment).where(PostComment.id == comment_id)
        )
        comment = result.scalar_one_or_none()
        if comment:
            comment.like_count = max(0, comment.like_count - 1)
        
        await self.db.commit()
        
        return True
