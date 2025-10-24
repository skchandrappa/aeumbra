import api from './api';
import { User, RegisterData, TokenResponse, LoginResponse } from '../types';

export interface AuthService {
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (userData: RegisterData) => Promise<TokenResponse>;
  logout: () => Promise<void>;
  refreshToken: (refreshToken: string) => Promise<TokenResponse>;
  getCurrentUser: () => Promise<User>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ message: string }>;
  verifyEmail: (token: string) => Promise<{ message: string }>;
  resendVerification: (email: string) => Promise<{ message: string }>;
}

const authService: AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<{success: boolean, data: LoginResponse}>('/auth/login', {
      email,
      password,
    });
    
    // Store tokens
    localStorage.setItem('auth_token', response.data.data.access_token);
    localStorage.setItem('refresh_token', response.data.data.refresh_token);
    
    return response.data.data;
  },

  async register(userData: RegisterData): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/register', {
      email: userData.email,
      password: userData.password,
      user_type: userData.user_type,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone,
    });
    
    // Store tokens
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    // Update stored tokens
    localStorage.setItem('auth_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{success: boolean, data: User}>('/auth/me');
    return response.data.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{success: boolean, message: string}>('/auth/forgot-password', {
      email,
    });
    return { message: response.data.message };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{success: boolean, message: string}>('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return { message: response.data.message };
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post<{success: boolean, message: string}>('/auth/verify-email', {
      token,
    });
    return { message: response.data.message };
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await api.post<{success: boolean, message: string}>('/auth/resend-verification', {
      email,
    });
    return { message: response.data.message };
  },
};

export default authService;
