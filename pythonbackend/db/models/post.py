"""
Social post models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, DECIMAL, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import BaseModel, Base


class Post(BaseModel):
    """Social media posts"""
    __tablename__ = "posts"
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text)
    post_type = Column(String(20), default="text")  # text, image, video, carousel, advertisement
    location_name = Column(String(255))
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    
    # Visibility settings
    visibility = Column(String(20), default="public")  # public, followers, private
    allow_comments = Column(Boolean, default=True)
    allow_sharing = Column(Boolean, default=True)
    
    # Engagement metrics
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)
    
    # Moderation
    is_flagged = Column(Boolean, default=False)
    flagged_reason = Column(Text)
    moderated_by = Column(Integer)  # Admin who moderated
    moderated_at = Column(DateTime(timezone=True))
    
    # Relationships
    user = relationship("User", back_populates="posts")
    media = relationship("PostMedia", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("PostComment", back_populates="post", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Post(id={self.id}, user_id={self.user_id}, type={self.post_type})>"


class PostMedia(Base):
    """Media attachments for posts"""
    __tablename__ = "post_media"
    
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    media_url = Column(Text, nullable=False)
    media_type = Column(String(20), nullable=False)  # image, video
    thumbnail_url = Column(Text)
    file_size = Column(Integer)
    duration = Column(Integer)  # For videos, in seconds
    width = Column(Integer)
    height = Column(Integer)
    sort_order = Column(Integer, default=0)
    
    # Relationships
    post = relationship("Post", back_populates="media")
    
    def __repr__(self):
        return f"<PostMedia(id={self.id}, post_id={self.post_id}, type={self.media_type})>"


class PostLike(BaseModel):
    """Post likes"""
    __tablename__ = "post_likes"
    
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Relationships
    post = relationship("Post", back_populates="likes")
    user = relationship("User", back_populates="post_likes")
    
    # Unique constraint
    __table_args__ = (UniqueConstraint('post_id', 'user_id', name='uq_post_like'),)
    
    def __repr__(self):
        return f"<PostLike(id={self.id}, post_id={self.post_id}, user_id={self.user_id})>"


class PostComment(BaseModel):
    """Post comments"""
    __tablename__ = "post_comments"
    
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    parent_comment_id = Column(Integer, ForeignKey("post_comments.id"), index=True)  # For replies
    content = Column(Text, nullable=False)
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime(timezone=True))
    like_count = Column(Integer, default=0)
    
    # Relationships
    post = relationship("Post", back_populates="comments")
    user = relationship("User", back_populates="post_comments")
    parent_comment = relationship("PostComment", remote_side="PostComment.id")
    replies = relationship("PostComment", back_populates="parent_comment")
    likes = relationship("CommentLike", back_populates="comment", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<PostComment(id={self.id}, post_id={self.post_id}, user_id={self.user_id})>"


class CommentLike(BaseModel):
    """Comment likes"""
    __tablename__ = "comment_likes"
    
    comment_id = Column(Integer, ForeignKey("post_comments.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Relationships
    comment = relationship("PostComment", back_populates="likes")
    user = relationship("User", back_populates="comment_likes")
    
    # Unique constraint
    __table_args__ = (UniqueConstraint('comment_id', 'user_id', name='uq_comment_like'),)
    
    def __repr__(self):
        return f"<CommentLike(id={self.id}, comment_id={self.comment_id}, user_id={self.user_id})>"


class UserFollow(BaseModel):
    """User follow relationships"""
    __tablename__ = "user_follows"
    
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    following_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Relationships
    follower = relationship("User", back_populates="follower_relationships", foreign_keys=[follower_id])
    following = relationship("User", back_populates="following_relationships", foreign_keys=[following_id])
    
    # Unique constraint
    __table_args__ = (UniqueConstraint('follower_id', 'following_id', name='uq_user_follow'),)
    
    def __repr__(self):
        return f"<UserFollow(id={self.id}, follower_id={self.follower_id}, following_id={self.following_id})>"
