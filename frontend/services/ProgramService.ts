import { api, handleResponse, handleError } from './api'

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
  image: string
  category: string
  enrolledCount: number
  students: number
  rating: number
  tags: string[]
  instructor: string
  mentor?: string
  startDate: string
  endDate: string
  nextClass: string
  originalPrice: number
  enrollmentOpen: boolean
  certificate: boolean
  materials: boolean
  support: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

class ProgramService {
  async getAll(params?: { page?: number; limit?: number; search?: string; type?: string }): Promise<{
    programs: Program[]
    total: number
    page: number
    totalPages: number
  }> {
    // Retorna dados mock diretamente para evitar erro de rede
    console.log("ProgramService: Using mock data for programs")
    return this.getMockPrograms()
  }

  private getMockPrograms(): {
    programs: Program[]
    total: number
    page: number
    totalPages: number
  } {
    const mockPrograms: Program[] = [
      {
        id: 'ingles-bootcamp',
        title: 'Inglês Bootcamp',
        description: 'Treinamento acelerado da língua inglesa com foco em comunicação profissional. E-book e plataforma digital, básico ao avançado.',
        type: 'bootcamp',
        duration: '4 semanas',
        level: 'beginner',
        price: 30000,
        status: 'active',
        category: 'Idiomas',
        enrolledCount: 2500,
        students: 2500,
        rating: 4.8,
        tags: ['inglês', 'bootcamp', 'profissional', 'comunicação'],
        instructor: 'ELTx Team',
        mentor: 'ELTx Team',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextClass: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        originalPrice: 35000,
        enrollmentOpen: true,
        certificate: true,
        materials: true,
        support: true,
        image: '/courses/1.png',
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'engenharia-prompt',
        title: 'Engenharia de Prompt',
        description: 'Técnicas avançadas de prompt para criação de negócios e gestão de projetos. E-books e plataforma digital, 1.000 prompts/business.',
        type: 'course',
        duration: '3 horas por sessão',
        level: 'advanced',
        price: 55000,
        status: 'active',
        category: 'IA & Tecnologia',
        enrolledCount: 1800,
        students: 1800,
        rating: 4.9,
        tags: ['prompt', 'IA', 'negócios', 'projetos', 'tecnologia'],
        instructor: 'ELTx Team',
        mentor: 'ELTx Team',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextClass: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        originalPrice: 65000,
        enrollmentOpen: true,
        certificate: true,
        materials: true,
        support: true,
        image: '/courses/2.png',
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'google-workspace',
        title: 'Pacote Google Workspace',
        description: 'Ferramentas modernas da Google: Gsheets, Gdocs, Gformulário, Gmail, Gdrive, Gmeet, etc. Ferramentas Google + IA.',
        type: 'workshop',
        duration: '3 horas por sessão',
        level: 'beginner',
        price: 45000,
        status: 'active',
        category: 'Produtividade',
        enrolledCount: 3200,
        students: 3200,
        rating: 4.7,
        tags: ['google', 'workspace', 'produtividade', 'ferramentas', 'IA'],
        instructor: 'ELTx Team',
        mentor: 'ELTx Team',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextClass: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        originalPrice: 50000,
        enrollmentOpen: true,
        certificate: true,
        materials: true,
        support: true,
        image: '/courses/Firefly_Gemini Flash_imagem que demostra Pacote Google Workspace 1281.png',
        featured: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return {
      programs: mockPrograms,
      total: mockPrograms.length,
      page: 1,
      totalPages: 1
    }
  }

  async getById(id: string): Promise<Program | null> {
    try {
      console.log("ProgramService: Getting program by ID:", id)
      const response = await api.get(`/programs/${id}`)
      console.log("ProgramService: Program response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgramService: Error getting program:", error)
      return handleError(error, null)
    }
  }

  async create(programData: Partial<Program>): Promise<Program> {
    try {
      console.log("ProgramService: Creating program:", programData)
      const response = await api.post('/programs', programData)
      console.log("ProgramService: Program created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgramService: Error creating program:", error)
      throw error
    }
  }

  async update(id: string, programData: Partial<Program>): Promise<Program> {
    try {
      console.log("ProgramService: Updating program:", id, programData)
      const response = await api.patch(`/programs/${id}`, programData)
      console.log("ProgramService: Program updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgramService: Error updating program:", error)
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log("ProgramService: Deleting program:", id)
      await api.delete(`/programs/${id}`)
      console.log("ProgramService: Program deleted:", id)
    } catch (error) {
      console.error("ProgramService: Error deleting program:", error)
      throw error
    }
  }

  // Admin specific methods
  async adminGetAll(params?: { page?: number; limit?: number; search?: string; type?: string }): Promise<{
    programs: Program[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      console.log("ProgramService: Getting admin programs with params:", params)
      const response = await api.get('/admin/programs', { params })
      console.log("ProgramService: Admin programs response:", response.data)
      
      const data = response.data
      if (Array.isArray(data)) {
        return {
          programs: data,
          total: data.length,
          page: 1,
          totalPages: 1
        }
      } else if (data && data.programs) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        const programs = Array.isArray(data) ? data : []
        return {
          programs,
          total: programs.length,
          page: 1,
          totalPages: 1
        }
      }
    } catch (error) {
      console.error("ProgramService: Error getting admin programs:", error)
      return handleError(error, { programs: [], total: 0, page: 1, totalPages: 1 })
    }
  }

  async adminCreate(programData: Partial<Program>): Promise<Program> {
    try {
      console.log("ProgramService: Creating admin program:", programData)
      const response = await api.post('/admin/programs', programData)
      console.log("ProgramService: Admin program created:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgramService: Error creating admin program:", error)
      throw error
    }
  }

  async adminUpdate(id: string, programData: Partial<Program>): Promise<Program> {
    try {
      console.log("ProgramService: Updating admin program:", id, programData)
      const response = await api.patch(`/admin/programs/${id}`, programData)
      console.log("ProgramService: Admin program updated:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("ProgramService: Error updating admin program:", error)
      throw error
    }
  }

  async adminDelete(id: string): Promise<void> {
    try {
      console.log("ProgramService: Deleting admin program:", id)
      await api.delete(`/admin/programs/${id}`)
      console.log("ProgramService: Admin program deleted:", id)
    } catch (error) {
      console.error("ProgramService: Error deleting admin program:", error)
      throw error
    }
  }
}

export default new ProgramService()
