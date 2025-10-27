import api from './api';

// Simple API service - NO MOCK DATA, ONLY REAL BACKEND
class ApiService {
  // Generic request method - NO MOCK FALLBACK
  async request<T>(config: any): Promise<T> {
    try {
      const response = await api(config);
      // Backend returns {success: true, data: {...}, message: "..."}
      // Extract data from the response
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
        return response.data.data || response.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Backend request failed:', error.message);
      throw error; // Re-throw error instead of falling back to mock
    }
  }

  // Convenience methods - these now correctly return the extracted data
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