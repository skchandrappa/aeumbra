import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // List,
  // ListItem,
  // ListItemText,
  // ListItemAvatar,
  // Divider,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  // Favorite,
  Comment,
  Share,
  MoreVert,
  // LocationOn,
  Schedule,
  // Star,
  // Security,
  BookmarkBorder,
  // Bookmark,
  ThumbUp,
  ThumbUpOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { usePosts, useCreatePost, useLikePost, useUnlikePost, useCreateComment } from '../hooks/usePosts';

// interface Post {
//   id: string;
//   user: {
//     name: string;
//     avatar: string;
//     title: string;
//     rating: number;
//   };
//   content: string;
//   images?: string[];
//   likes: number;
//   comments: number;
//   timeAgo: string;
//   location?: string;
//   isLiked: boolean;
// }

const FeedPage: React.FC = () => {
  const { user } = useAuth();
  const { data: posts = [], isLoading, error } = usePosts();
  const createPostMutation = useCreatePost();
  const likePostMutation = useLikePost();
  const unlikePostMutation = useUnlikePost();
  const createCommentMutation = useCreateComment();

  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [commentOpen, setCommentOpen] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    if (likedPosts.has(postId)) {
      unlikePostMutation.mutate(postId);
      setLikedPosts((prev: Set<string>) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } else {
      likePostMutation.mutate(postId);
      setLikedPosts((prev: Set<string>) => new Set(prev).add(postId));
    }
  };

  const handleComment = (postId: string) => {
    setCommentOpen(postId);
  };

  const handleSubmitComment = () => {
    if (commentText.trim() && commentOpen) {
      createCommentMutation.mutate({
        postId: commentOpen,
        content: commentText,
      });
      setCommentText('');
      setCommentOpen(null);
    }
  };

  const handleCloseComment = () => {
    setCommentText('');
    setCommentOpen(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files) as File[];
      setSelectedImages((prev: File[]) => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map((file: File) => URL.createObjectURL(file));
      setImagePreviewUrls((prev: string[]) => [...prev, ...newPreviewUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev: File[]) => prev.filter((_: File, i: number) => i !== index));
    setImagePreviewUrls((prev: string[]) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_: string, i: number) => i !== index);
    });
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      const formData = new FormData();
      formData.append('content', newPostContent);
      formData.append('post_type', 'general');
      
      // Add images to form data
      selectedImages.forEach((file: File, index: number) => {
        formData.append('files', file);
      });

      createPostMutation.mutate(formData);
      setNewPostContent('');
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setNewPostOpen(false);
    }
  };

  const handleBookPost = (postId: string) => {
    // Navigate to booking page with the post ID
    // This will be implemented to start the booking process
    console.log('Booking post:', postId);
    // TODO: Implement booking flow
    alert('Booking functionality will be implemented soon!');
  };

  const isGuard = user?.user_type === 'guard';

  return (
    <Layout>
      <Box>
        <>
        <Typography variant="h4" gutterBottom>
          {isGuard ? 'Security Community Feed' : 'Security Services Feed'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {isGuard
            ? 'Share your work updates and connect with other professionals'
            : 'Discover security services and connect with professionals'}
        </Typography>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error" gutterBottom>
              Failed to load posts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try refreshing the page
            </Typography>
          </Box>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!posts || !Array.isArray(posts) || posts.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              No posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isGuard 
                ? 'Be the first to share a work update!' 
                : 'No security services available at the moment'
              }
            </Typography>
          </Box>
        )}

        {/* Posts */}
        {!isLoading && !error && posts && Array.isArray(posts) && posts.map((post) => (
          <Card 
            key={post.id} 
            sx={{ 
              mb: 3,
              border: post.post_type === 'advertisement' ? '2px solid #f44336' : 'none',
              backgroundColor: post.post_type === 'advertisement' ? 'rgba(244, 67, 54, 0.02)' : 'inherit',
              position: 'relative'
            }}
          >
            {post.post_type === 'advertisement' && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: '#f44336',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  zIndex: 1
                }}
              >
                AD
              </Box>
            )}
            <CardContent>
              {/* Post Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2 }}>
                    {post.user.first_name?.[0] || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.user.first_name && post.user.last_name 
                        ? `${post.user.first_name} ${post.user.last_name}`
                        : post.user.first_name || 'Unknown User'
                      }
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        Security Guard
                      </Typography>
                      {post.post_type === 'advertisement' && (
                        <Chip
                          label="ADVERTISEMENT"
                          size="small"
                          color="error"
                          variant="filled"
                          sx={{ fontSize: '0.6rem', height: 18 }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" color="text.secondary">
                  <Schedule sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2">
                    {new Date(post.created_at).toLocaleDateString()}
                  </Typography>
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>

              {/* Post Content */}
              <Typography variant="body1" sx={{ mb: 2 }}>
                {post.content}
              </Typography>

              {/* Location - removed as not in Post interface */}

              {/* Post Images */}
              {post.media_urls && post.media_urls.length > 0 && (
                <Grid container spacing={1} sx={{ mb: 2 }}>
                  {post.media_urls.map((image: string, index: number) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={image}
                        alt={`Post image ${index + 1}`}
                        sx={{ borderRadius: 1 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

        {/* Post Actions */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={() => handleLike(post.id.toString())}
              color={likedPosts.has(post.id.toString()) ? "primary" : "default"}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.1)' 
                } 
              }}
            >
              {likedPosts.has(post.id.toString()) ? <ThumbUp /> : <ThumbUpOutlined />}
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2, ml: 0.5, fontWeight: 600 }}>
              {post.likes_count + (likedPosts.has(post.id.toString()) ? 1 : 0)}
            </Typography>
            <IconButton 
              onClick={() => handleComment(post.id.toString())}
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.1)' 
                } 
              }}
            >
              <Comment />
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2, ml: 0.5, fontWeight: 600 }}>
              {post.comments_count}
            </Typography>
            <IconButton
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(25, 118, 210, 0.1)' 
                } 
              }}
            >
              <Share />
            </IconButton>
          </Box>
          
          {/* Book Button for Consumers */}
          {user?.user_type === 'consumer' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<BookmarkBorder />}
              onClick={() => handleBookPost(post.id.toString())}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Book Now
            </Button>
          )}
        </Box>

              {/* Comments Section */}
              {commentOpen === post.id.toString() && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e: any) => setCommentText(e.target.value)}
                      size="small"
                      variant="outlined"
                      multiline
                      maxRows={3}
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || createCommentMutation.isLoading}
                      sx={{ minWidth: 80 }}
                    >
                      {createCommentMutation.isLoading ? 'Posting...' : 'Post'}
                    </Button>
                    <Button
                      onClick={handleCloseComment}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                  
                  {/* Sample Comments */}
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Sample comments will appear here...
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Floating Action Button for Creating Posts */}
        {isGuard && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{
              position: 'fixed',
              bottom: { xs: 80, sm: 24 },
              right: 24,
            }}
            onClick={() => setNewPostOpen(true)}
          >
            <Add />
          </Fab>
        )}

        {/* Create Post Dialog */}
        <Dialog open={newPostOpen} onClose={() => setNewPostOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Share Work Update</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="What's happening?"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newPostContent}
              onChange={(e: any) => setNewPostContent(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            {/* Image Upload Section */}
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<Add />}
                sx={{ position: 'relative' }}
              >
                Add Photos
                <Box
                  component="input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  multiple
                  type="file"
                  onChange={handleImageSelect}
                />
              </Button>
            </Box>

            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Images ({imagePreviewUrls.length})
                </Typography>
                <Grid container spacing={1}>
                  {imagePreviewUrls.map((url: string, index: number) => (
                    <Grid item xs={6} sm={4} key={index}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={url}
                          alt={`Preview ${index + 1}`}
                          sx={{ borderRadius: 1 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.7)',
                            },
                          }}
                        >
                          ×
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Loading indicator */}
            {createPostMutation.isLoading && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Creating post...
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewPostOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreatePost}
              variant="contained"
              disabled={!newPostContent.trim() || createPostMutation.isLoading}
            >
              {createPostMutation.isLoading ? 'Posting...' : 'Post'}
            </Button>
          </DialogActions>
        </Dialog>
        </>
      </Box>
    </Layout>
  );
};

export default FeedPage;
