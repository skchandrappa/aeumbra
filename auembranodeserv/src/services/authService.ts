import apiService from './apiService';
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
    const response = await apiService.post<{success: boolean, message: string, data: LoginResponse}>('/auth/login', {
      email,
      password,
    });
    
    console.log('Login API response:', response);
    
    // The backend returns {success: true, data: {access_token, refresh_token, user}}
    const loginData = (response as any).data || response;
    
    // Store tokens
    if (loginData.access_token) {
      localStorage.setItem('auth_token', loginData.access_token);
    }
    if (loginData.refresh_token) {
      localStorage.setItem('refresh_token', loginData.refresh_token);
    }
    
    return loginData;
  },

  async register(userData: RegisterData): Promise<TokenResponse> {
    const response = await apiService.post<TokenResponse>('/auth/register', {
      email: userData.email,
      password: userData.password,
      user_type: userData.user_type,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone,
    });
    
    // Store tokens
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await apiService.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    // Update stored tokens
    localStorage.setItem('auth_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    
    return response;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{success: boolean, data: User}>('/auth/me');
    console.log('GetCurrentUser API response:', response);
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiService.post<{success: boolean, message: string}>('/auth/forgot-password', {
      email,
    });
    return { message: response.message };
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiService.post<{success: boolean, message: string}>('/auth/reset-password', {
      token,
      new_password: newPassword,
    });
    return { message: response.message };
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiService.post<{success: boolean, message: string}>('/auth/verify-email', {
      token,
    });
    return { message: response.message };
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await apiService.post<{success: boolean, message: string}>('/auth/resend-verification', {
      email,
    });
    return { message: response.message };
  },
};

export default authService;
