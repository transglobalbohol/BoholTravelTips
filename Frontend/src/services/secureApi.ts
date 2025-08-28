import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { SecureStorage, generateCSRFToken, logSecurityEvent } from '../utils/security';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Request retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance with security configurations
const createSecureClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });

  // Request interceptor for authentication and security
  client.interceptors.request.use(
    (config) => {
      // Add authentication token
      const token = SecureStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add CSRF token for state-changing requests
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
        const csrfToken = generateCSRFToken();
        config.headers['X-CSRF-Token'] = csrfToken;
      }

      // Add request timestamp for replay attack prevention
      config.headers['X-Request-Timestamp'] = Date.now().toString();

      // Add request ID for tracking
      config.headers['X-Request-ID'] = crypto.randomUUID();

      // Log outgoing requests (development only)
      if (import.meta.env.DEV) {
        console.log(`🔐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      logSecurityEvent('request_interceptor_error', { error: error.message });
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and security
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful responses (development only)
      if (import.meta.env.DEV) {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      }

      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

      // Handle authentication errors
      if (error.response?.status === 401) {
        logSecurityEvent('unauthorized_access', {
          url: originalRequest?.url,
          method: originalRequest?.method
        });

        // Clear authentication data
        SecureStorage.removeItem('authToken');
        SecureStorage.removeItem('userProfile');

        // Redirect to login (you may want to handle this differently)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        logSecurityEvent('rate_limit_exceeded', {
          url: originalRequest?.url,
          method: originalRequest?.method
        });

        // Don't retry rate-limited requests
        return Promise.reject(error);
      }

      // Retry logic for network errors and 5xx errors
      if (
        originalRequest &&
        !originalRequest._retry &&
        (
          !error.response ||
          (error.response.status >= 500 && error.response.status < 600) ||
          error.code === 'NETWORK_ERROR' ||
          error.code === 'TIMEOUT'
        )
      ) {
        originalRequest._retryCount = originalRequest._retryCount || 0;

        if (originalRequest._retryCount < MAX_RETRIES) {
          originalRequest._retry = true;
          originalRequest._retryCount++;

          // Exponential backoff
          const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
          
          await new Promise(resolve => setTimeout(resolve, delay));

          return client(originalRequest);
        }
      }

      // Log security-relevant errors
      if (error.response?.status && [400, 403, 404, 422, 500, 502, 503].includes(error.response.status)) {
        logSecurityEvent('api_error', {
          status: error.response.status,
          url: originalRequest?.url,
          method: originalRequest?.method,
          message: error.response?.data?.message || error.message
        });
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create the secure API client instance
export const apiClient = createSecureClient();

// Secure API service class
export class SecureApiService {
  // Authentication endpoints
  static async login(credentials: { email: string; password: string }) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        SecureStorage.setItem('authToken', response.data.token);
        SecureStorage.setItem('userProfile', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      logSecurityEvent('login_failed', { email: credentials.email });
      throw error;
    }
  }

  static async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      logSecurityEvent('registration_failed', { email: userData.email });
      throw error;
    }
  }

  static async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Log out locally even if server request fails
      console.warn('Logout request failed:', error);
    } finally {
      SecureStorage.clear();
      window.location.href = '/';
    }
  }

  static async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      
      if (response.data.token) {
        SecureStorage.setItem('authToken', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      // Clear auth data on refresh failure
      SecureStorage.clear();
      throw error;
    }
  }

  // Profile management
  static async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  static async updateProfile(profileData: any) {
    const response = await apiClient.put('/auth/profile', profileData);
    
    if (response.data.success) {
      SecureStorage.setItem('userProfile', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  static async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }) {
    const response = await apiClient.put('/auth/change-password', passwordData);
    return response.data;
  }

  // Secure file upload
  static async uploadFile(file: File, endpoint: string = '/upload') {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000, // 30 seconds for file uploads
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      }
    });

    return response.data;
  }

  // Generic CRUD operations with security
  static async get(endpoint: string, params?: any) {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  }

  static async post(endpoint: string, data: any) {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  }

  static async put(endpoint: string, data: any) {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  }

  static async delete(endpoint: string) {
    const response = await apiClient.delete(endpoint);
    return response.data;
  }

  // Health check with authentication
  static async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      logSecurityEvent('health_check_failed');
      throw error;
    }
  }
}

// Export default instance
export default SecureApiService;
