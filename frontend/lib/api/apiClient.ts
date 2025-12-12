import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000", // Backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and logging
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful response
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      console.error(`❌ API Error ${status}:`, data);
      
      // Handle specific error codes
      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
          break;
          
        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access denied: Insufficient permissions');
          break;
          
        case 404:
          // Not found
          console.error('Resource not found');
          break;
          
        case 429:
          // Too many requests
          console.error('Rate limit exceeded');
          break;
          
        case 500:
          // Server error
          console.error('Internal server error');
          break;
          
        default:
          console.error(`Unhandled error: ${status}`);
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      console.error('❌ Network Error: No response received', error.request);
    } else {
      // Other errors
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Utility functions for common API operations
export const apiClient = {
  // GET request
  get: (url: string, config?: any) => api.get(url, config),
  
  // POST request
  post: (url: string, data?: any, config?: any) => api.post(url, data, config),
  
  // PUT request
  put: (url: string, data?: any, config?: any) => api.put(url, data, config),
  
  // PATCH request
  patch: (url: string, data?: any, config?: any) => api.patch(url, data, config),
  
  // DELETE request
  delete: (url: string, config?: any) => api.delete(url, config),
  
  // File upload
  upload: (url: string, formData: FormData, config?: any) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  },
  
  // File download
  download: (url: string, config?: any) => {
    return api.get(url, {
      ...config,
      responseType: 'blob',
    });
  },
};

export default api;
