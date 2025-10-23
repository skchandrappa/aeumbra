import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Notification } from '../types';
import notificationService from '../services/notificationService';

export const useNotifications = (skip = 0, limit = 20) => {
  return useQuery(
    ['notifications', skip, limit],
    () => notificationService.getNotifications(skip, limit),
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 60 * 1000, // Refetch every minute
    }
  );
};

export const useUnreadCount = () => {
  return useQuery(
    ['notifications', 'unread-count'],
    () => notificationService.getUnreadCount(),
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
    }
  );
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (notificationId: string) => notificationService.markAsRead(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    () => notificationService.markAllAsRead(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (notificationId: string) => notificationService.deleteNotification(notificationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
        queryClient.invalidateQueries(['notifications', 'unread-count']);
      },
    }
  );
};
