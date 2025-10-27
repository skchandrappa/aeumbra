"""
Post schemas
"""

from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime


class PostMediaResponse(BaseModel):
    """Post media response schema"""
    id: int
    post_id: int
    media_url: str
    media_type: str
    thumbnail_url: Optional[str]
    file_size: Optional[int]
    duration: Optional[int]
    width: Optional[int]
    height: Optional[int]
    sort_order: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PostLikeResponse(BaseModel):
    """Post like response schema"""
    id: int
    post_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PostCommentResponse(BaseModel):
    """Post comment response schema"""
    id: int
    post_id: int
    user_id: int
    parent_comment_id: Optional[int]
    content: str
    is_edited: bool
    edited_at: Optional[datetime]
    like_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CommentLikeResponse(BaseModel):
    """Comment like response schema"""
    id: int
    comment_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class PostResponse(BaseModel):
    """Post response schema"""
    id: int
    user_id: int
    content: Optional[str]
    post_type: str
    location_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    visibility: str
    allow_comments: bool
    allow_sharing: bool
    like_count: int
    comment_count: int
    share_count: int
    is_flagged: bool
    flagged_reason: Optional[str]
    moderated_by: Optional[int]
    moderated_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PostCreate(BaseModel):
    """Post creation schema"""
    content: Optional[str] = None
    post_type: str = "text"
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    visibility: str = "public"
    allow_comments: bool = True
    allow_sharing: bool = True
    
    @validator('post_type')
    def validate_post_type(cls, v):
        if v not in ['text', 'image', 'video', 'carousel', 'advertisement']:
            raise ValueError('Post type must be text, image, video, carousel, or advertisement')
        return v
    
    @validator('visibility')
    def validate_visibility(cls, v):
        if v not in ['public', 'followers', 'private']:
            raise ValueError('Visibility must be public, followers, or private')
        return v


class PostUpdate(BaseModel):
    """Post update schema"""
    content: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    visibility: Optional[str] = None
    allow_comments: Optional[bool] = None
    allow_sharing: Optional[bool] = None
    
    @validator('visibility')
    def validate_visibility(cls, v):
        if v and v not in ['public', 'followers', 'private']:
            raise ValueError('Visibility must be public, followers, or private')
        return v
