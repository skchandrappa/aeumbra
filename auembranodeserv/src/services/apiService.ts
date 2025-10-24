import api from './api';
import { mockApi } from './mockApi';
import axios from 'axios';

// Enhanced API service with automatic fallback to mock data
class ApiService {
  private isBackendAvailable: boolean | null = null;
  private checkPromise: Promise<boolean> | null = null;

  // Check if backend is available
  private async checkBackendAvailability(): Promise<boolean> {
    if (this.isBackendAvailable !== null) {
      return this.isBackendAvailable;
    }

    if (this.checkPromise) {
      return this.checkPromise;
    }

    this.checkPromise = this.performBackendCheck();
    this.isBackendAvailable = await this.checkPromise;
    return this.isBackendAvailable;
  }

  private async performBackendCheck(): Promise<boolean> {
    try {
      // Try a simple health check endpoint
      // Use relative URL when on ngrok (proxy will handle it), absolute URL for localhost
      const healthUrl = window.location.hostname.includes('ngrok') 
        ? '/health' 
        : 'http://localhost:8000/health';
      
      console.log('Checking backend health at:', healthUrl);
      const response = await axios.get(healthUrl, { timeout: 5000 });
      console.log('Backend health check response:', response.status, response.data);
      return response.status < 500; // Consider 4xx as available but unauthorized
    } catch (error: any) {
      console.log('Backend check failed:', error.message);
      console.log('Error details:', error);
      return false;
    }
  }

  // Generic request method with automatic fallback
  async request<T>(config: any): Promise<T> {
    const isBackendAvailable = await this.checkBackendAvailability();
    
    console.log('Backend available:', isBackendAvailable, 'for request:', config.url);
    
    // TEMPORARILY DISABLE MOCK FALLBACK FOR DEBUGGING
    // if (!isBackendAvailable) {
    //   console.warn('Using mock API - Backend not available');
    //   localStorage.setItem('using_mock_api', 'true');
    //   return this.getMockResponse<T>(config);
    // }

    try {
      console.log('Making API request to:', config.url);
      const response = await api(config);
      console.log('API request successful:', response.status);
      return response.data;
    } catch (error: any) {
      // TEMPORARILY DISABLE MOCK FALLBACK FOR DEBUGGING
      console.error('Backend request failed:', error.message);
      console.log('Error details:', error);
      throw error; // Re-throw the error instead of falling back to mock
      // localStorage.setItem('using_mock_api', 'true');
      // return this.getMockResponse<T>(config);
    }
  }

  private async getMockResponse<T>(config: any): Promise<T> {
    const url = config.url || '';
    
    if (url.includes('/auth/login')) {
      return await mockApi.login('demo@aeumbra.com', 'password') as T;
    } else if (url.includes('/auth/register')) {
      return await mockApi.register({}) as T;
    } else if (url.includes('/auth/me')) {
      return await mockApi.getCurrentUser() as T;
    } else if (url.includes('/posts')) {
      return await mockApi.getPosts() as T;
    } else if (url.includes('/bookings')) {
      return await mockApi.getBookings() as T;
    } else if (url.includes('/notifications')) {
      return await mockApi.getNotifications() as T;
    }
    
    // Default mock response
    return { success: true, data: {} } as T;
  }

  // Convenience methods
  async get<T>(url: string, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;
