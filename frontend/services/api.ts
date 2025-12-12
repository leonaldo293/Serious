import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// Create axios instance with configuration
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - Clear token and redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Forbidden - User doesn't have permission
      console.error('Access forbidden')
    } else if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found')
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      console.error('Request timeout')
    } else if (!navigator.onLine) {
      // Network error
      console.error('Network error - No internet connection')
    }

    // Return safe error response
    return Promise.reject(error)
  }
)

// Generic API response handler
const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

// Error handler with fallback
const handleError = (error: unknown, fallbackData: any = null) => {
  console.error('API Error:', error)
  if (fallbackData !== null) {
    return fallbackData
  }
  throw error
}

export { api, handleResponse, handleError }
export default api
