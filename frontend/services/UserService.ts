// Frontend-only deployment - using mock data
import { mockUserService } from '../lib/api/mock'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  avatar?: string
  role: 'user' | 'student' | 'admin' | 'mentor' | 'instructor' | 'superadmin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

class UserService {
  async getAll(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<{
    users: User[]
    total: number
    page: number
    totalPages: number
  }> {
    console.log("UserService: Getting users with mock data:", params)
    return mockUserService.getAll()
  }

  async getById(id: string): Promise<User | null> {
    console.log("UserService: Getting user by ID (mock):", id)
    const users = await mockUserService.getAll()
    return users.users.find(user => user.id === id) || null
  }

  async create(userData: Partial<User>): Promise<User> {
    console.log("UserService: Creating user (mock):", userData)
    return {
      id: 'mock-' + Date.now(),
      ...userData,
      role: userData.role || 'student',
      status: userData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as User
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    console.log("UserService: Updating user (mock):", id, userData)
    const users = await mockUserService.getAll()
    const user = users.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString()
    }
  }

  async delete(id: string): Promise<void> {
    console.log("UserService: Deleting user (mock):", id)
  }

  async adminGetAll(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<{
    users: User[]
    total: number
    page: number
    totalPages: number
  }> {
    console.log("UserService: Getting admin users with mock data:", params)
    return mockUserService.adminGetAll(params)
  }

  async adminCreate(userData: Partial<User>): Promise<User> {
    console.log("UserService: Creating admin user (mock):", userData)
    return this.create(userData)
  }

  async adminUpdate(id: string, userData: Partial<User>): Promise<User> {
    console.log("UserService: Updating admin user (mock):", id, userData)
    return this.update(id, userData)
  }

  async adminDelete(id: string): Promise<void> {
    console.log("UserService: Deleting admin user (mock):", id)
    return this.delete(id)
  }

  async getProfile(): Promise<User | null> {
    console.log("UserService: Getting user profile (mock)")
    const users = await mockUserService.getAll()
    return users.users[0] || null
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    console.log("UserService: Updating profile (mock):", userData)
    const profile = await this.getProfile()
    if (!profile) {
      throw new Error('Profile not found')
    }
    return this.update(profile.id, userData)
  }
}

export default new UserService()
