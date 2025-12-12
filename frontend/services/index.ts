// Export all services from a single entry point
export { default as api } from './api'
export { default as CourseService } from './CourseService'
export { default as ProgramService } from './ProgramService'
export { default as UserService } from './UserService'
export { default as MentorService } from './MentorService'
export { default as CommunityService } from './CommunityService'
export { default as AuthService } from './AuthService'

// Export types
export type { Course } from './CourseService'
export type { Program } from './ProgramService'
export type { User } from './UserService'
export type { Mentor } from './MentorService'
export type { CommunityPost, CommunityComment } from './CommunityService'
export type { LoginCredentials, RegisterData, AuthResponse } from './AuthService'
