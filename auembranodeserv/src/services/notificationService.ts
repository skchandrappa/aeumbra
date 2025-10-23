import api from './api';
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
    
    const response = await api.get<Notification[]>(`/notifications?${params.toString()}`);
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await api.post(`/notifications/${notificationId}/mark-read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/mark-read');
  },

  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationService;
