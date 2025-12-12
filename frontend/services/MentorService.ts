import { api, handleResponse, handleError } from './api'

export interface Mentor {
  id: string
  firstName: string
  lastName: string
  email: string
  bio: string
  expertise: string[]
  experience: string
  rating: number
  status: 'active' | 'inactive'
  courses: string[]
  studentsCount: number
  hourlyRate: number
  availability: string[]
  createdAt: string
  updatedAt: string
}

class MentorService {
  async getAll(params?: { page?: number; limit?: number; search?: string; expertise?: string }): Promise<{
    mentors: Mentor[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("MentorService: Getting mentors with params:", params)
      const response = await api.get('/mentors', { params })
      console.log("MentorService: Mentors response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          mentors: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.mentors) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const mentors = Array.isArray(data) ? data : []
        return {
          mentors,
          total: mentors.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("MentorService: Error getting mentors:", error)
      return handleError(error, { mentors: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  async getById(id: string): Promise<Mentor | null> {
    try {
      console.log("MentorService: Getting mentor by ID:", id)
      const response = await api.get(`/mentors/${id}`)
      console.log("MentorService: Mentor response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error getting mentor:", error)
      return handleError(error, null)
    }
  }

  async create(mentorData: Partial<Mentor>): Promise<Mentor> {
    try {
      console.log("MentorService: Creating mentor:", mentorData)
      const response = await api.post('/mentors', mentorData)
      console.log("MentorService: Mentor created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error creating mentor:", error)
      throw error
    }
  }

  async update(id: string, mentorData: Partial<Mentor>): Promise<Mentor> {
    try {
      console.log("MentorService: Updating mentor:", id, mentorData)
      const response = await api.patch(`/mentors/${id}`, mentorData)
      console.log("MentorService: Mentor updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error updating mentor:", error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log("MentorService: Deleting mentor:", id)
      await api.delete(`/mentors/${id}`)
      console.log("MentorService: Mentor deleted:", id)
    } catch (error) {
      console.error("MentorService: Error deleting mentor:", error)
      throw error
    }
  }

  // Admin specific methods
  async adminGetAll(params?: { page?: number; limit?: number; search?: string; expertise?: string }): Promise<{
    mentors: Mentor[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("MentorService: Getting admin mentors with params:", params)
      const response = await api.get('/admin/mentors', { params })
      console.log("MentorService: Admin mentors response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          mentors: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.mentors) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const mentors = Array.isArray(data) ? data : []
        return {
          mentors,
          total: mentors.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("MentorService: Error getting admin mentors:", error)
      return handleError(error, { mentors: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  async adminCreate(mentorData: Partial<Mentor>): Promise<Mentor> {
    try {
      console.log("MentorService: Creating admin mentor:", mentorData)
      const response = await api.post('/admin/mentors', mentorData)
      console.log("MentorService: Admin mentor created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error creating admin mentor:", error)
      throw error
    }
  }

  async adminUpdate(id: string, mentorData: Partial<Mentor>): Promise<Mentor> {
    try {
      console.log("MentorService: Updating admin mentor:", id, mentorData)
      const response = await api.patch(`/admin/mentors/${id}`, mentorData)
      console.log("MentorService: Admin mentor updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error updating admin mentor:", error)
      throw error
    }
  }

  async adminDelete(id: string): Promise<void> {
    try {
      console.log("MentorService: Deleting admin mentor:", id)
      await api.delete(`/admin/mentors/${id}`)
      console.log("MentorService: Admin mentor deleted:", id)
    } catch (error) {
      console.error("MentorService: Error deleting admin mentor:", error)
      throw error
    }
  }

  // Get mentor courses
  async getCourses(id: string): Promise<any[]> {
    try {
      console.log("MentorService: Getting mentor courses:", id)
      const response = await api.get(`/mentors/${id}/courses`)
      console.log("MentorService: Mentor courses response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error getting mentor courses:", error)
      return handleError(error, [])
    }
  }

  // Get mentor students
  async getStudents(id: string): Promise<any[]> {
    try {
      console.log("MentorService: Getting mentor students:", id)
      const response = await api.get(`/mentors/${id}/students`)
      console.log("MentorService: Mentor students response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("MentorService: Error getting mentor students:", error)
      return handleError(error, [])
    }
  }
}

export default new MentorService()
