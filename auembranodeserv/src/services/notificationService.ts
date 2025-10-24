import apiService from './api';
import { Notification } from '../types';

export interface NotificationService {
  getNotifications: (skip?: number, limit?: number) => Promise<Notification[]>;
  getUnreadCount: () => Promise<{ count: number }>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

const notificationService: NotificationService = {
  async getNotifications(skip = 0, limit = 20): Promise<Notification[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    const response = await apiService.get<Notification[]>(`/notifications?${params.toString()}`);
    return response;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiService.get<{ count: number }>('/notifications/unread-count');
    return response;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await apiService.post(`/notifications/${notificationId}/mark-read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiService.post('/notifications/mark-read');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await apiService.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;
