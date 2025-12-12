import { api, handleResponse, handleError } from './api'

export interface Enrollment {
  id: string
  userId: string
  courseId?: string
  programId?: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  progress: number
  startedAt: string
  completedAt?: string
  lastAccessedAt: string
  certificateId?: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId?: string
  price: number
  discount?: number
  finalPrice: number
  currency: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

class EnrollmentService {
  // Get all enrollments (admin only)
  async getAll(params?: { 
    page?: number 
    limit?: number 
    userId?: string
    courseId?: string
    programId?: string
    status?: string
    paymentStatus?: string
  }): Promise<{
    enrollments: Enrollment[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("EnrollmentService: Getting enrollments with params:", params)
      const response = await api.get('/enrollments', { params })
      console.log("EnrollmentService: Enrollments response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          enrollments: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.enrollments) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const enrollments = Array.isArray(data) ? data : []
        return {
          enrollments,
          total: enrollments.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("EnrollmentService: Error getting enrollments:", error)
      return handleError(error, { enrollments: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  // Get enrollment by ID
  async getById(id: string): Promise<Enrollment | null> {
    try {
      console.log("EnrollmentService: Getting enrollment by ID:", id)
      const response = await api.get(`/enrollments/${id}`)
      console.log("EnrollmentService: Enrollment response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("EnrollmentService: Error getting enrollment:", error)
      return handleError(error, null)
    }
  }

  // Enroll in a course or program
  async enroll(enrollmentData: {
    courseId?: string
    programId?: string
    paymentMethod?: string
    couponCode?: string
  }): Promise<Enrollment> {
    try {
      console.log("EnrollmentService: Creating enrollment:", enrollmentData)
      const response = await api.post('/enrollments', enrollmentData)
      console.log("EnrollmentService: Enrollment created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("EnrollmentService: Error creating enrollment:", error)
      throw error
    }
  }

  // Update enrollment (admin only)
  async update(id: string, enrollmentData: Partial<Enrollment>): Promise<Enrollment> {
    try {
      console.log("EnrollmentService: Updating enrollment:", id, enrollmentData)
      const response = await api.patch(`/enrollments/${id}`, enrollmentData)
      console.log("EnrollmentService: Enrollment updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("EnrollmentService: Error updating enrollment:", error)
      throw error
    }
  }

  // Cancel enrollment
  async cancel(id: string): Promise<void> {
    try {
      console.log("EnrollmentService: Canceling enrollment:", id)
      await api.delete(`/enrollments/${id}`)
      console.log("EnrollmentService: Enrollment canceled:", id)
    } catch (error) {
      console.error("EnrollmentService: Error canceling enrollment:", error)
      throw error
    }
  }

  // Get user's enrollments
  async getUserEnrollments(userId: string, params?: { 
    status?: string
    page?: number
    limit?: number
  }): Promise<{
    enrollments: Enrollment[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("EnrollmentService: Getting user enrollments for:", userId, params)
      const response = await api.get(`/users/${userId}/enrollments`, { params })
      console.log("EnrollmentService: User enrollments response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          enrollments: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.enrollments) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const enrollments = Array.isArray(data) ? data : []
        return {
          enrollments,
          total: enrollments.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("EnrollmentService: Error getting user enrollments:", error)
      return handleError(error, { enrollments: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  // Get course/program enrollments
  async getCourseEnrollments(courseId: string, params?: { 
    status?: string
    page?: number
    limit?: number
  }): Promise<{
    enrollments: Enrollment[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("EnrollmentService: Getting course enrollments for:", courseId, params)
      const response = await api.get(`/courses/${courseId}/enrollments`, { params })
      console.log("EnrollmentService: Course enrollments response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          enrollments: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.enrollments) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const enrollments = Array.isArray(data) ? data : []
        return {
          enrollments,
          total: enrollments.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("EnrollmentService: Error getting course enrollments:", error)
      return handleError(error, { enrollments: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  // Update progress
  async updateProgress(enrollmentId: string, progressData: {
    progress: number
    completed?: boolean
    moduleId?: string
    lessonId?: string
  }): Promise<Enrollment> {
    try {
      console.log("EnrollmentService: Updating progress for enrollment:", enrollmentId, progressData)
      const response = await api.patch(`/enrollments/${enrollmentId}/progress`, progressData)
      console.log("EnrollmentService: Progress updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("EnrollmentService: Error updating progress:", error)
      throw error
    }
  }

  // Generate certificate
  async generateCertificate(enrollmentId: string): Promise<{ certificateUrl: string }> {
    try {
      console.log("EnrollmentService: Generating certificate for enrollment:", enrollmentId)
      const response = await api.post(`/enrollments/${enrollmentId}/certificate`)
      console.log("EnrollmentService: Certificate generated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("EnrollmentService: Error generating certificate:", error)
      throw error
    }
  }

  // Get certificate
  async getCertificate(enrollmentId: string): Promise<{ certificateUrl: string }> {
    try {
      console.log("EnrollmentService: Getting certificate for enrollment:", enrollmentId)
      const response = await api.get(`/enrollments/${enrollmentId}/certificate`)
      console.log("EnrollmentService: Certificate retrieved:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("EnrollmentService: Error getting certificate:", error)
      throw error
    }
  }
}

const enrollmentService = new EnrollmentService()
export default enrollmentService
