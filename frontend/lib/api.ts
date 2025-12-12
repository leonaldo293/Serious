'use client'

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useAuth } from '@/contexts/AuthContext'

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig

    if (error.response?.status === 401 && originalRequest) {
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data
        
        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry the original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API Service classes
export class AuthAPI {
  static async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  }

  static async register(userData: any) {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  }

  static async logout() {
    const response = await apiClient.post('/auth/logout')
    return response.data
  }

  static async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  }

  static async verifyToken() {
    const response = await apiClient.get('/auth/verify')
    return response.data
  }
}

export class UsersAPI {
  static async getUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }) {
    const response = await apiClient.get('/admin/users', { params })
    return response.data
  }

  static async getUser(id: string) {
    const response = await apiClient.get(`/admin/users/${id}`)
    return response.data
  }

  static async createUser(userData: any) {
    const response = await apiClient.post('/admin/users', userData)
    return response.data
  }

  static async updateUser(id: string, userData: any) {
    const response = await apiClient.put(`/admin/users/${id}`, userData)
    return response.data
  }

  static async deleteUser(id: string) {
    const response = await apiClient.delete(`/admin/users/${id}`)
    return response.data
  }

  static async impersonateUser(id: string) {
    const response = await apiClient.post(`/admin/users/${id}/impersonate`)
    return response.data
  }

  static async exportUsers(format: 'csv' | 'pdf' = 'csv', filters?: any) {
    const response = await apiClient.get('/admin/users/export', {
      params: { format, ...filters },
      responseType: 'blob'
    })
    return response.data
  }
}

export class ProgramsAPI {
  static async getPrograms(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
  }) {
    const response = await apiClient.get('/admin/programs', { params })
    return response.data
  }

  static async getProgram(id: string) {
    const response = await apiClient.get(`/admin/programs/${id}`)
    return response.data
  }

  static async createProgram(programData: any) {
    const response = await apiClient.post('/admin/programs', programData)
    return response.data
  }

  static async updateProgram(id: string, programData: any) {
    const response = await apiClient.put(`/admin/programs/${id}`, programData)
    return response.data
  }

  static async deleteProgram(id: string) {
    const response = await apiClient.delete(`/admin/programs/${id}`)
    return response.data
  }

  static async addLesson(programId: string, lessonData: any) {
    const response = await apiClient.post(`/admin/programs/${programId}/lessons`, lessonData)
    return response.data
  }

  static async getProgramLessons(programId: string) {
    const response = await apiClient.get(`/admin/programs/${programId}/lessons`)
    return response.data
  }
}

export class BootcampsAPI {
  static async getBootcamps(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) {
    const response = await apiClient.get('/admin/bootcamps', { params })
    return response.data
  }

  static async getBootcamp(id: string) {
    const response = await apiClient.get(`/admin/bootcamps/${id}`)
    return response.data
  }

  static async createBootcamp(bootcampData: any) {
    const response = await apiClient.post('/admin/bootcamps', bootcampData)
    return response.data
  }

  static async updateBootcamp(id: string, bootcampData: any) {
    const response = await apiClient.put(`/admin/bootcamps/${id}`, bootcampData)
    return response.data
  }

  static async deleteBootcamp(id: string) {
    const response = await apiClient.delete(`/admin/bootcamps/${id}`)
    return response.data
  }
}

export class LessonsAPI {
  static async getLessons(params?: {
    page?: number
    limit?: number
    search?: string
    programId?: string
  }) {
    const response = await apiClient.get('/admin/lessons', { params })
    return response.data
  }

  static async getLesson(id: string) {
    const response = await apiClient.get(`/admin/lessons/${id}`)
    return response.data
  }

  static async createLesson(lessonData: any) {
    const response = await apiClient.post('/admin/lessons', lessonData)
    return response.data
  }

  static async updateLesson(id: string, lessonData: any) {
    const response = await apiClient.put(`/admin/lessons/${id}`, lessonData)
    return response.data
  }

  static async deleteLesson(id: string) {
    const response = await apiClient.delete(`/admin/lessons/${id}`)
    return response.data
  }

  static async uploadVideo(lessonId: string, videoFile: File) {
    const formData = new FormData()
    formData.append('video', videoFile)
    
    const response = await apiClient.post(`/admin/lessons/${lessonId}/upload-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  static async uploadDocument(lessonId: string, documentFile: File) {
    const formData = new FormData()
    formData.append('document', documentFile)
    
    const response = await apiClient.post(`/admin/lessons/${lessonId}/upload-document`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export class EnrollmentsAPI {
  static async getEnrollments(params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
    programId?: string
  }) {
    const response = await apiClient.get('/admin/enrollments', { params })
    return response.data
  }

  static async getEnrollment(id: string) {
    const response = await apiClient.get(`/admin/enrollments/${id}`)
    return response.data
  }

  static async createEnrollment(enrollmentData: any) {
    const response = await apiClient.post('/admin/enrollments', enrollmentData)
    return response.data
  }

  static async updateEnrollment(id: string, enrollmentData: any) {
    const response = await apiClient.put(`/admin/enrollments/${id}`, enrollmentData)
    return response.data
  }

  static async cancelEnrollment(id: string) {
    const response = await apiClient.post(`/admin/enrollments/${id}/cancel`)
    return response.data
  }

  static async activateEnrollment(id: string) {
    const response = await apiClient.post(`/admin/enrollments/${id}/activate`)
    return response.data
  }
}

export class PaymentsAPI {
  static async getPayments(params?: {
    page?: number
    limit?: number
    status?: string
    method?: string
    dateFrom?: string
    dateTo?: string
  }) {
    const response = await apiClient.get('/admin/payments', { params })
    return response.data
  }

  static async getPayment(id: string) {
    const response = await apiClient.get(`/admin/payments/${id}`)
    return response.data
  }

  static async capturePayment(paymentId: string) {
    const response = await apiClient.post(`/admin/payments/${paymentId}/capture`)
    return response.data
  }

  static async refundPayment(paymentId: string, amount?: number) {
    const response = await apiClient.post(`/admin/payments/${paymentId}/refund`, { amount })
    return response.data
  }

  static async createPayPalOrder(orderData: any) {
    const response = await apiClient.post('/payments/paypal/create-order', orderData)
    return response.data
  }

  static async capturePayPalOrder(orderId: string) {
    const response = await apiClient.post('/payments/paypal/capture-order', { orderId })
    return response.data
  }

  static async initiateWhatsAppPayment(paymentData: any) {
    const response = await apiClient.post('/payments/whatsapp/initiate', paymentData)
    return response.data
  }
}

export class MentorsAPI {
  static async getMentors(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }) {
    const response = await apiClient.get('/admin/mentors', { params })
    return response.data
  }

  static async getMentor(id: string) {
    const response = await apiClient.get(`/admin/mentors/${id}`)
    return response.data
  }

  static async createMentor(mentorData: any) {
    const response = await apiClient.post('/admin/mentors', mentorData)
    return response.data
  }

  static async updateMentor(id: string, mentorData: any) {
    const response = await apiClient.put(`/admin/mentors/${id}`, mentorData)
    return response.data
  }

  static async deleteMentor(id: string) {
    const response = await apiClient.delete(`/admin/mentors/${id}`)
    return response.data
  }

  static async assignMentorToProgram(mentorId: string, programId: string) {
    const response = await apiClient.post(`/admin/mentors/${mentorId}/assign-program`, { programId })
    return response.data
  }

  static async updateMentorPermissions(mentorId: string, permissions: string[]) {
    const response = await apiClient.put(`/admin/mentors/${mentorId}/permissions`, { permissions })
    return response.data
  }
}

export class TasksAPI {
  static async getTasks(params?: {
    page?: number
    limit?: number
    status?: string
    mentorId?: string
    programId?: string
  }) {
    const response = await apiClient.get('/admin/tasks', { params })
    return response.data
  }

  static async getTask(id: string) {
    const response = await apiClient.get(`/admin/tasks/${id}`)
    return response.data
  }

  static async createTask(taskData: any) {
    const response = await apiClient.post('/admin/tasks', taskData)
    return response.data
  }

  static async updateTask(id: string, taskData: any) {
    const response = await apiClient.put(`/admin/tasks/${id}`, taskData)
    return response.data
  }

  static async deleteTask(id: string) {
    const response = await apiClient.delete(`/admin/tasks/${id}`)
    return response.data
  }

  static async getSubmissions(taskId: string) {
    const response = await apiClient.get(`/admin/tasks/${taskId}/submissions`)
    return response.data
  }

  static async gradeSubmission(submissionId: string, grade: number, feedback: string) {
    const response = await apiClient.post(`/admin/tasks/submissions/${submissionId}/grade`, { grade, feedback })
    return response.data
  }
}

export class BlogAPI {
  static async getPosts(params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
  }) {
    const response = await apiClient.get('/admin/blog', { params })
    return response.data
  }

  static async getPost(id: string) {
    const response = await apiClient.get(`/admin/blog/${id}`)
    return response.data
  }

  static async createPost(postData: any) {
    const response = await apiClient.post('/admin/blog', postData)
    return response.data
  }

  static async updatePost(id: string, postData: any) {
    const response = await apiClient.put(`/admin/blog/${id}`, postData)
    return response.data
  }

  static async deletePost(id: string) {
    const response = await apiClient.delete(`/admin/blog/${id}`)
    return response.data
  }

  static async uploadFeaturedImage(postId: string, imageFile: File) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await apiClient.post(`/admin/blog/${postId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export class ReportsAPI {
  static async generateSalesReport(params: {
    format: 'pdf' | 'csv'
    dateFrom: string
    dateTo: string
  }) {
    const response = await apiClient.get('/admin/reports/sales', {
      params,
      responseType: 'blob'
    })
    return response.data
  }

  static async generateEnrollmentsReport(params: {
    format: 'pdf' | 'csv'
    dateFrom: string
    dateTo: string
  }) {
    const response = await apiClient.get('/admin/reports/enrollments', {
      params,
      responseType: 'blob'
    })
    return response.data
  }

  static async generateProgressReport(params: {
    format: 'pdf' | 'csv'
    programId?: string
    dateFrom: string
    dateTo: string
  }) {
    const response = await apiClient.get('/admin/reports/progress', {
      params,
      responseType: 'blob'
    })
    return response.data
  }

  static async generateAttendanceReport(params: {
    format: 'pdf' | 'csv'
    mentorId?: string
    dateFrom: string
    dateTo: string
  }) {
    const response = await apiClient.get('/admin/reports/attendance', {
      params,
      responseType: 'blob'
    })
    return response.data
  }
}

export class AnalyticsAPI {
  static async getOverview() {
    const response = await apiClient.get('/admin/analytics/overview')
    return response.data
  }

  static async getSalesData(params?: {
    period: 'day' | 'week' | 'month' | 'year'
    dateFrom?: string
    dateTo?: string
  }) {
    const response = await apiClient.get('/admin/analytics/sales', { params })
    return response.data
  }

  static async getCoursePopularity() {
    const response = await apiClient.get('/admin/analytics/courses-popular')
    return response.data
  }

  static async getUserEngagement() {
    const response = await apiClient.get('/admin/analytics/user-engagement')
    return response.data
  }

  static async getRevenueData(params?: {
    period: 'day' | 'week' | 'month' | 'year'
    dateFrom?: string
    dateTo?: string
  }) {
    const response = await apiClient.get('/admin/analytics/revenue', { params })
    return response.data
  }
}

export class SettingsAPI {
  static async getSettings() {
    const response = await apiClient.get('/admin/settings')
    return response.data
  }

  static async updateSettings(settingsData: any) {
    const response = await apiClient.put('/admin/settings', settingsData)
    return response.data
  }

  static async uploadLogo(logoFile: File) {
    const formData = new FormData()
    formData.append('logo', logoFile)
    
    const response = await apiClient.post('/admin/settings/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  static async testEmailConfig() {
    const response = await apiClient.post('/admin/settings/test-email')
    return response.data
  }
}

export class UploadAPI {
  static async uploadFile(file: File, type: 'image' | 'video' | 'document' = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await apiClient.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  static async deleteFile(filename: string) {
    const response = await apiClient.delete(`/uploads/${filename}`)
    return response.data
  }
}

// Default export
export default apiClient
