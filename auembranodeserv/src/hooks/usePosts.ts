import { useQuery, useMutation, useQueryClient } from 'react-query';
import { PostUpdate } from '../types';
import postService, { PostCreateData } from '../services/postService';

export const usePosts = (skip = 0, limit = 20, userId?: string, postType?: string) => {
  return useQuery(
    ['posts', skip, limit, userId, postType],
    () => postService.getPosts(skip, limit, userId, postType),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};

export const usePost = (postId: string) => {
  return useQuery(
    ['post', postId],
    () => postService.getPost(postId),
    {
      enabled: !!postId,
    }
  );
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (postData: PostCreateData) => postService.createPost(postData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    }
  );
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ postId, postData }: { postId: string; postData: PostUpdate }) =>
      postService.updatePost(postId, postData),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', variables.postId]);
      },
    }
  );
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (postId: string) => postService.deletePost(postId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['posts']);
      },
    }
  );
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (postId: string) => postService.likePost(postId),
    {
      onSuccess: (data, postId) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', postId]);
      },
    }
  );
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (postId: string) => postService.unlikePost(postId),
    {
      onSuccess: (data, postId) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', postId]);
      },
    }
  );
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ postId, content }: { postId: string; content: string }) =>
      postService.createComment(postId, { content }),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.invalidateQueries(['post', variables.postId]);
      },
    }
  );
};
