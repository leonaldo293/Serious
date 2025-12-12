// Frontend-only deployment - using mock data
import { mockCourseService } from '../lib/api/mock'

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  price: number
  rating: number
  status: 'active' | 'inactive' | 'draft'
  thumbnail?: string
  category: string
  enrolledCount: number
  createdAt: string
  updatedAt: string
}

class CourseService {
  async getAll(params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<{
    courses: Course[]
    total: number
    page: number
    totalPages: number
  }> {
    console.log("CourseService: Getting courses with mock data:", params)
    return mockCourseService.getAll()
  }

  async getById(id: string): Promise<Course | null> {
    console.log("CourseService: Getting course by ID (mock):", id)
    const courses = await mockCourseService.getAll()
    return courses.courses.find(course => course.id === id) || null
  }

  async create(courseData: Partial<Course>): Promise<Course> {
    console.log("CourseService: Creating course (mock):", courseData)
    return {
      id: 'mock-' + Date.now(),
      ...courseData,
      status: courseData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Course
  }

  async update(id: string, courseData: Partial<Course>): Promise<Course> {
    console.log("CourseService: Updating course (mock):", id, courseData)
    const courses = await mockCourseService.getAll()
    const course = courses.courses.find(c => c.id === id)
    if (!course) {
      throw new Error('Course not found')
    }
    return {
      ...course,
      ...courseData,
      updatedAt: new Date().toISOString()
    }
  }

  async delete(id: string): Promise<void> {
    console.log("CourseService: Deleting course (mock):", id)
  }

  async adminGetAll(params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<{
    courses: Course[]
    total: number
    page: number
    totalPages: number
  }> {
    console.log("CourseService: Getting admin courses with mock data:", params)
    return mockCourseService.adminGetAll(params)
  }

  async adminCreate(courseData: Partial<Course>): Promise<Course> {
    console.log("CourseService: Creating admin course (mock):", courseData)
    return this.create(courseData)
  }

  async adminUpdate(id: string, courseData: Partial<Course>): Promise<Course> {
    console.log("CourseService: Updating admin course (mock):", id, courseData)
    return this.update(id, courseData)
  }

  async adminDelete(id: string): Promise<void> {
    console.log("CourseService: Deleting admin course (mock):", id)
    return this.delete(id)
  }
}

export default new CourseService()
