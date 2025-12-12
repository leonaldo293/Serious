// Mock API services for frontend-only deployment
// This file replaces all API calls with mock data for demonstration purposes

// Mock data
const mockUsers = [
  {
    id: '1',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@example.com',
    role: 'student' as const,
    status: 'active' as const,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-10T15:20:00Z',
    lastLogin: '2024-12-10T15:20:00Z'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-12-11T08:45:00Z',
    lastLogin: '2024-12-11T08:45:00Z'
  }
];

const mockCourses = [
  {
    id: '1',
    title: 'Curso de React',
    description: 'Aprenda React do zero ao avançado',
    instructor: 'John Doe',
    duration: '40h',
    level: 'intermediate',
    price: 299.99,
    rating: 4.5,
    status: 'active' as const,
    category: 'Programação',
    enrolledCount: 150,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T14:20:00Z'
  },
  {
    id: '2',
    title: 'Curso de TypeScript',
    description: 'Domine TypeScript',
    instructor: 'Jane Smith',
    duration: '30h',
    level: 'advanced',
    price: 399.99,
    rating: 4.8,
    status: 'active' as const,
    category: 'Programação',
    enrolledCount: 89,
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-11-30T16:45:00Z'
  }
];

const mockPrograms = [
  {
    id: '1',
    title: 'Bootcamp Full Stack',
    description: 'Programa completo de desenvolvimento web',
    type: 'bootcamp' as const,
    duration: '12 semanas',
    level: 'intermediate',
    price: 999.99,
    rating: 4.8,
    status: 'active' as const,
    category: 'Desenvolvimento',
    enrolledCount: 75,
    featured: true,
    mentor: 'João Silva',
    startDate: '2024-01-15T09:00:00Z',
    endDate: '2024-04-15T18:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-12-05T10:30:00Z'
  }
];

const mockCommunityPosts = [
  {
    id: '1',
    title: 'Bem-vindo à comunidade',
    content: 'Este é um post de exemplo para a comunidade',
    author: 'Admin',
    authorId: '2',
    category: 'Geral',
    tags: ['boas-vindas', 'comunidade'],
    likes: 25,
    comments: 8,
    replies: 3,
    views: 150,
    status: 'published' as const,
    featured: true,
    isPinned: true,
    isLocked: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T14:20:00Z'
  }
];

// Mock API functions
export const mockApi = {
  // User functions
  async getAllUsers() {
    return Promise.resolve({
      users: mockUsers,
      total: mockUsers.length,
      page: 1,
      totalPages: 1
    });
  },

  // Course functions
  async getAllCourses() {
    return Promise.resolve({
      courses: mockCourses,
      total: mockCourses.length,
      page: 1,
      totalPages: 1
    });
  },

  // Program functions
  async getAllPrograms() {
    return Promise.resolve({
      programs: mockPrograms,
      total: mockPrograms.length,
      page: 1,
      totalPages: 1
    });
  },

  // Community functions
  async getAllCommunityPosts() {
    return Promise.resolve({
      posts: mockCommunityPosts,
      total: mockCommunityPosts.length,
      page: 1,
      totalPages: 1
    });
  },

  // Auth functions (mock)
  async login(email: string, password: string) {
    return Promise.resolve({
      success: true,
      user: mockUsers[0],
      token: 'mock-token-12345'
    });
  },

  async register(userData: any) {
    return Promise.resolve({
      success: true,
      user: {
        id: '3',
        ...userData,
        role: 'student',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    });
  }
};

// Export mock services that replace real API calls
export const mockUserService = {
  adminGetAll: (params?: any) => mockApi.getAllUsers(),
  adminCreate: (userData: Partial<any>) => ({
    id: 'mock-' + Date.now(),
    firstName: userData.firstName || 'Novo',
    lastName: userData.lastName || 'Usuário',
    email: userData.email || 'user@example.com',
    ...userData,
    role: userData.role || 'student',
    status: userData.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),
  adminUpdate: async (id: string, userData: Partial<any>) => {
    const existingUsers = await mockApi.getAllUsers()
    const user = existingUsers.users.find(u => u.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString()
    }
  },
  adminDelete: async (id?: string) => {},
  getAll: mockApi.getAllUsers
};

export const mockCourseService = {
  adminGetAll: (params?: any) => mockApi.getAllCourses(),
  adminCreate: async (courseData: Partial<any>) => ({
    id: 'mock-' + Date.now(),
    title: courseData.title || 'Novo Curso',
    description: courseData.description || 'Descrição do curso',
    instructor: courseData.instructor || 'Instrutor',
    duration: courseData.duration || '40h',
    level: courseData.level || 'intermediate',
    price: courseData.price || 299.99,
    category: courseData.category || 'Programação',
    enrolledCount: courseData.enrolledCount || 0,
    ...courseData,
    status: courseData.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),
  adminUpdate: async (id: string, courseData: Partial<any>) => {
    const existingCourses = await mockApi.getAllCourses()
    const course = existingCourses.courses.find(c => c.id === id)
    if (!course) {
      throw new Error('Course not found')
    }
    return {
      ...course,
      ...courseData,
      updatedAt: new Date().toISOString()
    }
  },
  adminDelete: async (id?: string) => {},
  getAll: mockApi.getAllCourses
};

export const mockProgramService = {
  adminGetAll: (params?: any) => mockApi.getAllPrograms(),
  adminCreate: async (programData: Partial<any>) => ({
    id: 'mock-' + Date.now(),
    title: programData.title || 'Novo Programa',
    description: programData.description || 'Descrição do programa',
    type: programData.type || 'bootcamp',
    duration: programData.duration || '12 semanas',
    level: programData.level || 'intermediate',
    price: programData.price || 999.99,
    category: programData.category || 'Desenvolvimento',
    enrolledCount: programData.enrolledCount || 0,
    mentor: programData.mentor || 'Mentor',
    startDate: programData.startDate || new Date().toISOString(),
    endDate: programData.endDate || new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString(),
    featured: programData.featured || false,
    ...programData,
    status: programData.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }),
  adminUpdate: async (id: string, programData: Partial<any>) => {
    const existingPrograms = await mockApi.getAllPrograms()
    const program = existingPrograms.programs.find(p => p.id === id)
    if (!program) {
      throw new Error('Program not found')
    }
    return {
      ...program,
      ...programData,
      updatedAt: new Date().toISOString()
    }
  },
  adminDelete: async (id?: string) => {},
  getAll: mockApi.getAllPrograms
};

export const mockCommunityService = {
  adminGetAll: (params?: any) => mockApi.getAllCommunityPosts(),
  getAll: mockApi.getAllCommunityPosts
};

export const mockAuthService = {
  login: mockApi.login,
  register: mockApi.register
};
