import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types';

// Use environment variable if available, otherwise fallback to mode-based URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://boholtraveltips.onrender.com/api' 
    : 'http://localhost:5000/api');

// Performance optimizations for API client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000, // Reduced from 10s for faster failures
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br', // Enable compression
  },
  // Performance optimizations
  maxRedirects: 3,
  validateStatus: (status) => status < 500, // Don't reject 4xx responses
  transformResponse: [
    (data) => {
      try {
        return typeof data === 'string' ? JSON.parse(data) : data;
      } catch {
        return data;
      }
    }
  ]
});

// Request cache for GET requests
const requestCache = new Map<string, {
  data: any;
  timestamp: number;
  expires: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default
const MAX_CACHE_SIZE = 100;

// Cache management
const getCacheKey = (config: AxiosRequestConfig): string => {
  return `${config.method?.toLowerCase()}-${config.url}-${JSON.stringify(config.params || {})}`;
};

const getCachedResponse = (key: string) => {
  const cached = requestCache.get(key);
  if (cached && Date.now() < cached.expires) {
    return cached.data;
  }
  requestCache.delete(key);
  return null;
};

const setCachedResponse = (key: string, data: any, duration = CACHE_DURATION) => {
  // Prevent cache overflow
  if (requestCache.size >= MAX_CACHE_SIZE) {
    const firstKey = requestCache.keys().next().value;
    requestCache.delete(firstKey);
  }
  
  requestCache.set(key, {
    data,
    timestamp: Date.now(),
    expires: Date.now() + duration
  });
};

// Request queue for retry mechanism
const requestQueue = new Set<string>();
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// Request interceptor with caching and performance optimizations
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check cache for GET requests
    if (config.method?.toLowerCase() === 'get') {
      const cacheKey = getCacheKey(config);
      const cached = getCachedResponse(cacheKey);
      
      if (cached) {
        // Return cached response (simulate axios response structure)
        return Promise.resolve({
          ...config,
          __cached: true,
          __cachedData: cached
        } as any);
      }
    }

    // Add request timestamp for performance monitoring
    config.metadata = {
      startTime: Date.now()
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with caching and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle cached responses
    if ((response.config as any).__cached) {
      return Promise.resolve({
        ...response,
        data: (response.config as any).__cachedData,
        status: 200,
        statusText: 'OK (cached)'
      });
    }

    // Calculate request duration for monitoring
    const duration = Date.now() - (response.config.metadata?.startTime || Date.now());
    if (duration > 2000) {
      console.warn(`Slow API request: ${response.config.url} took ${duration}ms`);
    }

    // Cache successful GET responses
    if (response.config.method?.toLowerCase() === 'get' && response.status === 200) {
      const cacheKey = getCacheKey(response.config);
      setCachedResponse(cacheKey, response.data);
    }

    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      requestCache.clear(); // Clear cache on auth error
      
      // Avoid infinite redirect loops
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Retry logic for network errors
    if (!config || config.__retryCount >= MAX_RETRY_ATTEMPTS) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    config.__retryCount++;

    // Only retry on network errors or 5xx errors
    const shouldRetry = 
      !error.response || 
      (error.response.status >= 500 && error.response.status < 600) ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT';

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    // Exponential backoff
    const delay = RETRY_DELAY * Math.pow(2, config.__retryCount - 1);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log(`Retrying request (${config.__retryCount}/${MAX_RETRY_ATTEMPTS}):`, config.url);
    return apiClient(config);
  }
);

// Performance monitoring
export const getApiPerformanceStats = () => {
  return {
    cacheSize: requestCache.size,
    queueSize: requestQueue.size,
    cacheHitRate: requestCache.size > 0 ? 
      Array.from(requestCache.values()).filter(item => Date.now() < item.expires).length / requestCache.size : 0
  };
};

// Cache management functions
export const clearApiCache = (pattern?: string) => {
  if (pattern) {
    const keysToDelete = Array.from(requestCache.keys()).filter(key => key.includes(pattern));
    keysToDelete.forEach(key => requestCache.delete(key));
  } else {
    requestCache.clear();
  }
};

export const preloadApiData = async (endpoints: string[]) => {
  const promises = endpoints.map(endpoint => 
    apiClient.get(endpoint).catch(error => {
      console.warn(`Failed to preload ${endpoint}:`, error.message);
    })
  );
  
  await Promise.allSettled(promises);
};

// Optimized request methods with better error handling
export const apiRequest = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config)
};

export { apiClient };
export default apiClient;
