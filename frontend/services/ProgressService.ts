import { api, handleResponse, handleError } from './api'

export interface Progress {
  id: string
  userId: string
  courseId?: string
  programId?: string
  moduleId?: string
  lessonId?: string
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
  progress: number // 0-100
  score?: number
  timeSpent: number // in seconds
  completedAt?: string
  lastAccessedAt: string
  startedAt: string
  metadata?: Record<string, unknown>
}

export interface ProgressStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalPrograms: number
  completedPrograms: number
  inProgressPrograms: number
  totalTimeSpent: number // in minutes
  averageScore: number
  completionRate: number // 0-100
  lastActive: string
  streak: number // days
  achievements: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedAt: string
  }>
}

class ProgressService {
  // Get progress for a specific course or program
  async getProgress(
    type: 'course' | 'program', 
    id: string,
    userId?: string
  ): Promise<Progress> {
    try {
      console.log(`ProgressService: Getting ${type} progress for ${id}`)
      const response = await api.get(`/progress/${type}s/${id}`, {
        params: { userId }
      })
      console.log(`ProgressService: ${type} progress:`, response.data)
      return handleResponse(response)
    } catch (error) {
      console.error(`ProgressService: Error getting ${type} progress:`, error)
      return handleError(error, {
        id: '',
        userId: userId || '',
        [type === 'course' ? 'courseId' : 'programId']: id,
        status: 'not_started',
        progress: 0,
        timeSpent: 0,
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString()
      } as Progress)
    }
  }

  // Update progress for a course, module, or lesson
  async updateProgress(data: {
    courseId?: string
    programId?: string
    moduleId?: string
    lessonId?: string
    status?: 'not_started' | 'in_progress' | 'completed' | 'failed'
    progress?: number
    score?: number
    timeSpent?: number // in seconds
    metadata?: Record<string, unknown>
  }): Promise<Progress> {
    try {
      console.log("ProgressService: Updating progress:", data)
      const response = await api.post('/progress', data)
      console.log("ProgressService: Progress updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgressService: Error updating progress:", error)
      throw error
    }
  }

  // Get user's progress statistics
  async getStats(userId?: string): Promise<ProgressStats> {
    try {
      console.log("ProgressService: Getting progress stats for user:", userId)
      const response = await api.get('/progress/stats', {
        params: { userId }
      })
      console.log("ProgressService: Progress stats:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgressService: Error getting progress stats:", error)
      return handleError(error, {
        totalCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        totalPrograms: 0,
        completedPrograms: 0,
        inProgressPrograms: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        completionRate: 0,
        lastActive: new Date().toISOString(),
        streak: 0,
        achievements: []
      })
    }
  }

  // Get all user's enrollments with progress
  async getUserEnrollments(
    userId?: string,
    params?: {
      status?: 'not_started' | 'in_progress' | 'completed' | 'failed'
      type?: 'course' | 'program'
      page?: number
      limit?: number
    }
  ): Promise<{
    enrollments: Array<{
      id: string
      userId: string
      courseId?: string
      programId?: string
      status: 'not_started' | 'in_progress' | 'completed' | 'failed'
      progress: number
      startedAt: string
      completedAt?: string
      lastAccessedAt: string
      course?: {
        id: string
        title: string
        description: string
        thumbnail?: string
        instructor: string
        duration: number
        level: string
      }
      program?: {
        id: string
        title: string
        description: string
        thumbnail?: string
        duration: number
        level: string
      }
    }>
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("ProgressService: Getting user enrollments:", { userId, ...params })
      const response = await api.get('/progress/enrollments', {
        params: { userId, ...params }
      })
      console.log("ProgressService: User enrollments:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgressService: Error getting user enrollments:", error)
      return handleError(error, {
        enrollments: [],
        total: 0,
        page: 1,
        totalPages: 1
      })
    }
  }

  // Get course or program completion certificate
  async getCertificate(
    type: 'course' | 'program',
    id: string,
    userId?: string
  ): Promise<{
    id: string
    url: string
    issuedAt: string
    expiresAt?: string
    metadata: Record<string, unknown>
  }> {
    try {
      console.log(`ProgressService: Getting ${type} certificate for ${id}`)
      const response = await api.get(`/progress/${type}s/${id}/certificate`, {
        params: { userId }
      })
      console.log(`ProgressService: ${type} certificate:`, response.data)
      return handleResponse(response)
    } catch (error) {
      console.error(`ProgressService: Error getting ${type} certificate:`, error)
      throw error
    }
  }

  // Generate a completion certificate
  async generateCertificate(
    type: 'course' | 'program',
    id: string,
    userId?: string
  ): Promise<{
    id: string
    url: string
    issuedAt: string
    expiresAt?: string
  }> {
    try {
      console.log(`ProgressService: Generating ${type} certificate for ${id}`)
      const response = await api.post(`/progress/${type}s/${id}/certificate`, {
        userId
      })
      console.log(`ProgressService: ${type} certificate generated:`, response.data)
      return handleResponse(response)
    } catch (error) {
      console.error(`ProgressService: Error generating ${type} certificate:`, error)
      throw error
    }
  }

  // Get time spent on a course or program
  async getTimeSpent(
    type: 'course' | 'program',
    id: string,
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalTimeSpent: number // in minutes
    dailyAverage: number // in minutes
    dailyBreakdown: Array<{
      date: string
      timeSpent: number // in minutes
    }>
  }> {
    try {
      console.log(`ProgressService: Getting time spent on ${type} ${id}`)
      const response = await api.get(`/progress/${type}s/${id}/time`, {
        params: { userId, startDate, endDate }
      })
      console.log(`ProgressService: Time spent on ${type}:`, response.data)
      return handleResponse(response)
    } catch (error) {
      console.error(`ProgressService: Error getting time spent on ${type}:`, error)
      return handleError(error, {
        totalTimeSpent: 0,
        dailyAverage: 0,
        dailyBreakdown: []
      })
    }
  }

  // Get user's learning activity
  async getActivity(
    userId?: string,
    params?: {
      startDate?: string
      endDate?: string
      limit?: number
    }
  ): Promise<Array<{
    id: string
    type: 'course' | 'program' | 'module' | 'lesson' | 'quiz' | 'assignment'
    action: 'started' | 'completed' | 'submitted' | 'viewed' | 'updated'
    title: string
    description: string
    timestamp: string
    metadata: Record<string, unknown>
  }>> {
    try {
      console.log("ProgressService: Getting user activity:", { userId, ...params })
      const response = await api.get('/progress/activity', {
        params: { userId, ...params }
      })
      console.log("ProgressService: User activity:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgressService: Error getting user activity:", error)
      return handleError(error, [])
    }
  }
}

const progressService = new ProgressService()
export default progressService
