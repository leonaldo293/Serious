import { toast } from 'sonner'
import { mockUserService, mockCourseService, mockProgramService } from './mock'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'student' | 'admin' | 'mentor' | 'instructor' | 'superadmin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin?: string
  phone?: string
  bio?: string
  location?: string
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  price: number
  status: 'active' | 'inactive' | 'draft'
  thumbnail?: string
  category: string
  enrolledCount: number
  createdAt: string
  updatedAt: string
}

export interface Program {
  id: string
  title: string
  description: string
  type: 'bootcamp' | 'course' | 'workshop'
  duration: string
  level: string
  price: number
  status: 'active' | 'inactive' | 'draft'
  thumbnail?: string
  category: string
  enrolledCount: number
  mentor?: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  featured: boolean
}

export interface Tutor {
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
}

export interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalPrograms: number
  totalTutors: number
  totalRevenue: number
  activeUsers: number
  monthlyRevenue: number
  completionRate: number
}

class AdminService {
  // USERS CRUD
  async getUsers(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    console.log("Admin API: Getting users with mock data:", params)
    return mockUserService.adminGetAll(params)
  }

  async createUser(userData: Partial<User>): Promise<User> {
    console.log("Admin API: Creating user (mock):", userData)
    const user = await mockUserService.adminCreate(userData)
    toast.success('Usuário criado com sucesso')
    return user
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    console.log("Admin API: Updating user (mock):", id, userData)
    const user = await mockUserService.adminUpdate(id, userData)
    toast.success('Usuário atualizado com sucesso')
    return user
  }

  async deleteUser(id: string): Promise<void> {
    console.log("Admin API: Deleting user (mock):", id)
    await mockUserService.adminDelete(id)
    toast.success('Usuário deletado com sucesso')
  }

  // COURSES CRUD
  async getCourses(params?: { page?: number; limit?: number; search?: string; category?: string }): Promise<{ courses: Course[]; total: number; page: number; totalPages: number }> {
    console.log("Admin API: Getting courses with mock data:", params)
    return mockCourseService.adminGetAll(params)
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    console.log("Admin API: Creating course (mock):", courseData)
    const course = await mockCourseService.adminCreate(courseData)
    toast.success('Curso criado com sucesso')
    return course
  }

  async updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
    console.log("Admin API: Updating course (mock):", id, courseData)
    const course = await mockCourseService.adminUpdate(id, courseData)
    toast.success('Curso atualizado com sucesso')
    return course
  }

  async deleteCourse(id: string): Promise<void> {
    console.log("Admin API: Deleting course (mock):", id)
    await mockCourseService.adminDelete(id)
    toast.success('Curso deletado com sucesso')
  }

  // PROGRAMS CRUD
  async getPrograms(params?: { page?: number; limit?: number; search?: string; type?: string }): Promise<{ programs: Program[]; total: number; page: number; totalPages: number }> {
    console.log("Admin API: Getting programs with mock data:", params)
    return mockProgramService.adminGetAll(params)
  }

  async createProgram(programData: Partial<Program>): Promise<Program> {
    console.log("Admin API: Creating program (mock):", programData)
    const program = await mockProgramService.adminCreate(programData)
    toast.success('Programa criado com sucesso')
    return program
  }

  async updateProgram(id: string, programData: Partial<Program>): Promise<Program> {
    console.log("Admin API: Updating program (mock):", id, programData)
    const program = await mockProgramService.adminUpdate(id, programData)
    toast.success('Programa atualizado com sucesso')
    return program
  }

  async deleteProgram(id: string): Promise<void> {
    console.log("Admin API: Deleting program (mock):", id)
    await mockProgramService.adminDelete(id)
    toast.success('Programa deletado com sucesso')
  }

  // TUTORS CRUD
  async getTutors(params?: { page?: number; limit?: number; search?: string; expertise?: string }): Promise<{ tutors: Tutor[]; total: number; page: number; totalPages: number }> {
    console.log("Admin API: Getting tutors with mock data:", params)
    // Return mock tutors data
    return {
      tutors: [
        {
          id: '1',
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          bio: 'Tutor experiente em desenvolvimento web',
          expertise: ['React', 'TypeScript', 'Node.js'],
          experience: '5 anos',
          rating: 4.5,
          status: 'active',
          courses: ['1', '2'],
          studentsCount: 25,
          hourlyRate: 50,
          availability: ['Segunda', 'Terça', 'Quarta'],
          createdAt: '2024-01-15T10:30:00Z'
        }
      ],
      total: 1,
      page: 1,
      totalPages: 1
    }
  }

  async createTutor(tutorData: Partial<Tutor>): Promise<Tutor> {
    console.log("Admin API: Creating tutor (mock):", tutorData)
    const tutor = {
      id: 'mock-' + Date.now(),
      ...tutorData,
      status: tutorData.status || 'active',
      createdAt: new Date().toISOString()
    } as Tutor
    toast.success('Tutor criado com sucesso')
    return tutor
  }

  async updateTutor(id: string, tutorData: Partial<Tutor>): Promise<Tutor> {
    console.log("Admin API: Updating tutor (mock):", id, tutorData)
    const tutor = {
      id,
      ...tutorData,
      updatedAt: new Date().toISOString()
    } as Tutor
    toast.success('Tutor atualizado com sucesso')
    return tutor
  }

  async deleteTutor(id: string): Promise<void> {
    console.log("Admin API: Deleting tutor (mock):", id)
    toast.success('Tutor deletado com sucesso')
  }

  // STATS
  async getStats(): Promise<AdminStats> {
    console.log("Admin API: Getting stats (mock)")
    return {
      totalUsers: 150,
      totalCourses: 25,
      totalPrograms: 10,
      totalTutors: 15,
      totalRevenue: 50000,
      activeUsers: 120,
      monthlyRevenue: 8000,
      completionRate: 85
    }
  }
}

export default new AdminService()
