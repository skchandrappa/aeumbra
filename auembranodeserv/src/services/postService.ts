import api from './api';
import { Post } from '../types';

export interface PostCreate {
  content: string;
  post_type?: string;
  media_urls?: string[];
}

export type PostCreateData = PostCreate | FormData;

export interface PostUpdate {
  content?: string;
  post_type?: string;
}

export interface CommentCreate {
  content: string;
}

export interface PostService {
  getPosts: (skip?: number, limit?: number, userId?: string, postType?: string) => Promise<Post[]>;
  createPost: (postData: PostCreateData) => Promise<Post>;
  getPost: (postId: string) => Promise<Post>;
  updatePost: (postId: string, postData: PostUpdate) => Promise<Post>;
  deletePost: (postId: string) => Promise<void>;
  getUserPosts: (userId: string) => Promise<Post[]>;
  getTrendingPosts: () => Promise<Post[]>;
  addMediaToPost: (postId: string, file: File) => Promise<{ media_url: string }>;
  getPostMedia: (postId: string) => Promise<{ media_urls: string[] }>;
  deletePostMedia: (postId: string, mediaId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  getPostLikes: (postId: string) => Promise<{ likes: any[] }>;
  createComment: (postId: string, commentData: CommentCreate) => Promise<any>;
  getPostComments: (postId: string) => Promise<{ comments: any[] }>;
  updateComment: (commentId: string, content: string) => Promise<any>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  unlikeComment: (commentId: string) => Promise<void>;
}

const postService: PostService = {
  async getPosts(skip = 0, limit = 20, userId?: string, postType?: string): Promise<Post[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    if (userId) params.append('user_id', userId);
    if (postType) params.append('post_type', postType);
    
    const response = await api.get<Post[]>(`/posts?${params.toString()}`);
    return response.data;
  },

  async createPost(postData: PostCreateData): Promise<Post> {
    const config = postData instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    
    const response = await api.post<Post>('/posts', postData, config);
    return response.data;
  },

  async getPost(postId: string): Promise<Post> {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  async updatePost(postId: string, postData: PostUpdate): Promise<Post> {
    const response = await api.put<Post>(`/posts/${postId}`, postData);
    return response.data;
  },

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  async getUserPosts(userId: string): Promise<Post[]> {
    const response = await api.get<Post[]>(`/posts/user/${userId}`);
    return response.data;
  },

  async getTrendingPosts(): Promise<Post[]> {
    const response = await api.get<Post[]>('/posts/feed/trending');
    return response.data;
  },

  async addMediaToPost(postId: string, file: File): Promise<{ media_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<{ media_url: string }>(`/posts/${postId}/media`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPostMedia(postId: string): Promise<{ media_urls: string[] }> {
    const response = await api.get<{ media_urls: string[] }>(`/posts/${postId}/media`);
    return response.data;
  },

  async deletePostMedia(postId: string, mediaId: string): Promise<void> {
    await api.delete(`/posts/${postId}/media/${mediaId}`);
  },

  async likePost(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  },

  async unlikePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}/like`);
  },

  async getPostLikes(postId: string): Promise<{ likes: any[] }> {
    const response = await api.get<{ likes: any[] }>(`/posts/${postId}/likes`);
    return response.data;
  },

  async createComment(postId: string, commentData: CommentCreate): Promise<any> {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  async getPostComments(postId: string): Promise<{ comments: any[] }> {
    const response = await api.get<{ comments: any[] }>(`/posts/${postId}/comments`);
    return response.data;
  },

  async updateComment(commentId: string, content: string): Promise<any> {
    const response = await api.put(`/posts/comments/${commentId}`, { content });
    return response.data;
  },

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/posts/comments/${commentId}`);
  },

  async likeComment(commentId: string): Promise<void> {
    await api.post(`/posts/comments/${commentId}/like`);
  },

  async unlikeComment(commentId: string): Promise<void> {
    await api.delete(`/posts/comments/${commentId}/like`);
  },
};

export default postService;
