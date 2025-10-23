export interface User {
  id: number;
  email: string;
  phone_number?: string;
  user_type: 'guard' | 'consumer' | 'admin';
  is_verified: boolean;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
  first_name?: string;
  last_name?: string;
  rating?: number;
  phone?: string;
  experience_years?: number;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  location?: string;
  years_experience?: number;
  certifications?: string[];
  skills?: string[];
  availability?: string;
  service_areas?: string[];
  hourly_rate?: number;
  rating?: number;
  total_reviews?: number;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterData {
  email: string;
  password: string;
  user_type: 'guard' | 'consumer';
  first_name: string;
  last_name: string;
  phone: string;
}

export interface Booking {
  id: string;
  consumer_id: string;
  guard_id?: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  special_requirements?: string;
  created_at: string;
  updated_at: string;
  guard?: User;
  requester?: User;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  post_type?: 'guard_request' | 'advertisement' | 'event' | 'general';
  user: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export interface Notification {
  id: number;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface BookingCreate {
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  special_requirements?: string;
  guard_id?: string;
  total_amount: number;
}

export interface BookingUpdate {
  event_type?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  description?: string;
  special_requirements?: string;
  total_amount?: number;
}

export interface PostCreate {
  content: string;
  media_urls?: string[];
  post_type?: string;
}

export interface PostUpdate {
  content?: string;
  media_urls?: string[];
}

export interface UnreadCountData {
  unread_count: number;
}
