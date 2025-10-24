import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../config/api';
import { mockApi, shouldUseMockApi } from './mockApi';

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and network errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors (backend not available)
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || 
        error.message?.includes('Network Error') || 
        error.message?.includes('Failed to fetch')) {
      
      console.warn('Backend not available, using mock data for demonstration');
      
      // Store that we're using mock API
      localStorage.setItem('using_mock_api', 'true');
      
      // Return a mock response based on the request
      if (originalRequest.url?.includes('/auth/login')) {
        return { data: await mockApi.login('demo@aeumbra.com', 'password') };
      } else if (originalRequest.url?.includes('/auth/register')) {
        return { data: await mockApi.register({}) };
      } else if (originalRequest.url?.includes('/auth/me')) {
        return { data: await mockApi.getCurrentUser() };
      } else if (originalRequest.url?.includes('/posts')) {
        return { data: await mockApi.getPosts() };
      } else if (originalRequest.url?.includes('/bookings')) {
        return { data: await mockApi.getBookings() };
      } else if (originalRequest.url?.includes('/notifications')) {
        return { data: await mockApi.getNotifications() };
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token } = response.data.data;
          localStorage.setItem('auth_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
