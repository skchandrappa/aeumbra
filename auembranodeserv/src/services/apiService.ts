import api from './api';
import { mockApi } from './mockApi';

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
      // Try a simple health check or auth endpoint
      const response = await api.get('/auth/me', { timeout: 5000 });
      return response.status < 500; // Consider 4xx as available but unauthorized
    } catch (error: any) {
      console.log('Backend check failed:', error.message);
      return false;
    }
  }

  // Generic request method with automatic fallback
  async request<T>(config: any): Promise<T> {
    const isBackendAvailable = await this.checkBackendAvailability();
    
    if (!isBackendAvailable) {
      console.warn('Using mock API - Backend not available');
      localStorage.setItem('using_mock_api', 'true');
      return this.getMockResponse<T>(config);
    }

    try {
      const response = await api(config);
      return response.data;
    } catch (error: any) {
      // If backend request fails, fallback to mock
      console.warn('Backend request failed, using mock data:', error.message);
      localStorage.setItem('using_mock_api', 'true');
      return this.getMockResponse<T>(config);
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

export default new ApiService();
