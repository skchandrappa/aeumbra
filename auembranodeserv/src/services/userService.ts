import api from './api';
import { User, UserProfile } from '../types';

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  years_experience?: number;
  hourly_rate?: number;
  skills?: string[];
  certifications?: string[];
  availability?: string;
  service_areas?: string[];
}

export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  booking_updates: boolean;
  payment_updates: boolean;
  review_notifications: boolean;
  marketing_emails: boolean;
  profile_visibility: 'public' | 'connections' | 'private';
  show_contact_info: boolean;
  show_earnings: boolean;
  allow_direct_messages: boolean;
  two_factor_auth: boolean;
  login_alerts: boolean;
  session_timeout: number;
  language: string;
  timezone: string;
  dark_mode: boolean;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

export interface UserService {
  getProfile: () => Promise<UserProfile>;
  updateProfile: (profileData: ProfileUpdate) => Promise<UserProfile>;
  getPublicProfile: (userId: string) => Promise<UserProfile>;
  uploadAvatar: (file: File) => Promise<{ avatar_url: string }>;
  uploadCover: (file: File) => Promise<{ cover_url: string }>;
  getSettings: () => Promise<UserSettings>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<UserSettings>;
}

const userService: UserService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },

  async updateProfile(profileData: ProfileUpdate): Promise<UserProfile> {
    const response = await api.put<UserProfile>('/users/profile', profileData);
    return response.data;
  },

  async getPublicProfile(userId: string): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`/users/${userId}/public-profile`);
    return response.data;
  },

  async uploadAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<{ avatar_url: string }>('/users/profile/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async uploadCover(file: File): Promise<{ cover_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<{ cover_url: string }>('/users/profile/upload-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getSettings(): Promise<UserSettings> {
    const response = await api.get<UserSettings>('/users/settings');
    return response.data;
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const response = await api.put<UserSettings>('/users/settings', settings);
    return response.data;
  },
};

export default userService;
