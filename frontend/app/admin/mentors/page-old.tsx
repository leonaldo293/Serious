'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield
} from 'lucide-react'
import { MentorsAPI } from '@/lib/api'
import Image from 'next/image'

// Tipos específicos para os dados
interface MentorCreateData {
  name: string
  email: string
  bio: string
  expertise: string[]
  title: string
  role: 'mentor' | 'senior_mentor' | 'lead_mentor'
}

interface MentorUpdateData extends Partial<MentorCreateData> {
  status?: 'active' | 'inactive' | 'pending' | 'suspended'
  permissions?: Record<string, boolean>
}

interface Mentor {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  bio: string
  expertise: string[]
  title: string
  company?: string
  linkedin?: string
  website?: string
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  role: 'mentor' | 'senior_mentor' | 'lead_mentor'
  permissions: {
    canCreateLessons: boolean
    canEditLessons: boolean
    canDeleteLessons: boolean
    canManageStudents: boolean
    canViewAnalytics: boolean
    canManageEnrollments: boolean
    canCreateTasks: boolean
    canGradeSubmissions: boolean
    canManageCommunity: boolean
    canScheduleEvents: boolean
  }
  assignedCourses: string[]
  studentCount: number
  averageRating: number
  totalSessions: number
  totalHours: number
  completionRate: number
  responseTime: number // in hours
  availability: {
    monday: { available: boolean; hours: string[] }
    tuesday: { available: boolean; hours: string[] }
    wednesday: { available: boolean; hours: string[] }
    thursday: { available: boolean; hours: string[] }
    friday: { available: boolean; hours: string[] }
    saturday: { available: boolean; hours: string[] }
    sunday: { available: boolean; hours: string[] }
  }
  hourlyRate?: number
  currency: string
  joinedAt: string
  lastActiveAt?: string
  certifications: {
    name: string
    issuer: string
    date: string
    expiryDate?: string
  }[]
  languages: string[]
  timezone: string
  notes?: string
  tags: string[]
}

interface Filters {
  search: string
  status: string
  role: string
  expertise: string
  availability: string
  rating: string
}

export default function AdminMentors() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMentors, setSelectedMentors] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    role: 'all',
    expertise: 'all',
    availability: 'all',
    rating: 'all'
  })

  const mentorsPerPage = 20

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true)
      console.log("Admin API: Fetching mentors")
      
      const params = {
        page: currentPage,
        limit: mentorsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.expertise !== 'all' && { expertise: filters.expertise }),
        ...(filters.availability !== 'all' && { availability: filters.availability === 'available' }),
        ...(filters.rating !== 'all' && { rating: filters.rating })
      }
      
      const response = await MentorsAPI.getMentors(params)
      console.log("Admin API mentors response:", response)
      
      // Garantir que sempre temos array
      const mentorsData = Array.isArray(response?.data) ? response.data : 
                         Array.isArray(response?.mentors) ? response.mentors : 
                         Array.isArray(response) ? response : []
      
      setMentors(mentorsData)
      setTotalPages(response?.pagination?.totalPages || response?.totalPages || 1)
    } catch (error) {
      console.error('Admin API Mentors Error:', error)
      setMentors([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters, mentorsPerPage])

  useEffect(() => {
    fetchMentors()
  }, [fetchMentors])

  const handleCreateMentor = async (mentorData: MentorCreateData) => {
    try {
      console.log("Admin API: Creating mentor:", mentorData)
      const response = await MentorsAPI.createMentor(mentorData)
      console.log("Admin API create mentor response:", response)
      
      await fetchMentors()
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Create Mentor Error:', error)
      return { success: false, error }
    }
  }

  const handleUpdateMentor = async (id: string, mentorData: MentorUpdateData) => {
    try {
      console.log("Admin API: Updating mentor:", id, mentorData)
      const response = await MentorsAPI.updateMentor(id, mentorData)
      console.log("Admin API update mentor response:", response)
      
      setMentors(prev => prev.map(mentor => 
        mentor.id === id ? { ...mentor, ...response } : mentor
      ))
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Update Mentor Error:', error)
      return { success: false, error }
    }
  }

  const handleDeleteMentor = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este mentor?')) {
      try {
        console.log("Admin API: Deleting mentor:", id)
        await MentorsAPI.deleteMentor(id)
        console.log("Admin API delete mentor success")
        
        setMentors(prev => prev.filter(mentor => mentor.id !== id))
        return { success: true }
      } catch (error) {
        console.error('Admin API Delete Mentor Error:', error)
        return { success: false, error }
      }
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMentors(mentors.map(mentor => mentor.id))
    } else {
      setSelectedMentors([])
    }
  }

  const handleSelectMentor = (mentorId: string, checked: boolean) => {
    if (checked) {
      setSelectedMentors(prev => [...prev, mentorId])
    } else {
      setSelectedMentors(prev => prev.filter(id => id !== mentorId))
    }
  }

  const handleUpdatePermissions = async (mentorId: string, permissions: string[]) => {
    try {
      console.log("Admin API: Updating mentor permissions:", mentorId, permissions)
      const response = await MentorsAPI.updateMentorPermissions(mentorId, permissions)
      console.log("Admin API update permissions response:", response)
      
      setMentors(prev => prev.map(mentor => 
        mentor.id === mentorId ? { ...mentor, ...response } : mentor
      ))
      setShowPermissionModal(false)
      setSelectedMentor(null)
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Update Permissions Error:', error)
      return { success: false, error }
    }
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         mentor.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                         mentor.bio.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || mentor.status === filters.status
    const matchesRole = filters.role === 'all' || mentor.role === filters.role
    const matchesExpertise = filters.expertise === 'all' || mentor.expertise.includes(filters.expertise)
    const matchesAvailability = filters.availability === 'all' || 
      (filters.availability === 'available' && Object.values(mentor.availability).some(day => day.available))
    const matchesRating = filters.rating === 'all' || 
      (filters.rating === '5' && mentor.averageRating >= 5) ||
      (filters.rating === '4' && mentor.averageRating >= 4 && mentor.averageRating < 5) ||
      (filters.rating === '3' && mentor.averageRating >= 3 && mentor.averageRating < 4)
    
    return matchesSearch && matchesStatus && matchesRole && matchesExpertise && matchesAvailability && matchesRating
  })

  const getStatusBadge = (status: Mentor['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      pending: 'Pendente',
      suspended: 'Suspenso'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getRoleBadge = (role: Mentor['role']) => {
    const styles = {
      mentor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      senior_mentor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      lead_mentor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    }

    const labels = {
      mentor: 'Mentor',
      senior_mentor: 'Mentor Sênior',
      lead_mentor: 'Mentor Líder'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role]}`}>
        {labels[role]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mentores
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os mentores e tutores
          </p>
        </div>
        <button
          onClick={() => {/* Handle create modal */}}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Mentor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar mentores..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos Status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="pending">Pendente</option>
              <option value="suspended">Suspenso</option>
            </select>

            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos Cargos</option>
              <option value="mentor">Mentor</option>
              <option value="senior_mentor">Mentor Sênior</option>
              <option value="lead_mentor">Mentor Líder</option>
            </select>

            <select
              value={filters.expertise}
              onChange={(e) => setFilters(prev => ({ ...prev, expertise: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas Especialidades</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
            </select>

            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas Disponibilidades</option>
              <option value="available">Disponível</option>
              <option value="unavailable">Indisponível</option>
            </select>

            <select
              value={filters.rating}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas Avaliações</option>
              <option value="5">5 Estrelas</option>
              <option value="4">4+ Estrelas</option>
              <option value="3">3+ Estrelas</option>
            </select>
          </div>
        )}
      </div>

      {/* Mentors List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedMentors.length === filteredMentors.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mentor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Especialidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Alunos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sessões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMentors.includes(mentor.id)}
                      onChange={(e) => handleSelectMentor(mentor.id, e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {mentor.avatar ? (
                          <Image
                            src={mentor.avatar}
                            alt={mentor.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {mentor.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {mentor.email}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {mentor.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.slice(0, 2).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {mentor.expertise.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 rounded">
                          +{mentor.expertise.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(mentor.status)}
                      {getRoleBadge(mentor.role)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {mentor.studentCount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      {mentor.averageRating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {mentor.totalSessions}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedMentor(mentor)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Handle edit */}}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMentor(mentor)
                          setShowPermissionModal(true)
                        }}
                        className="text-purple-600 hover:text-purple-800"
                        title="Gerenciar permissões"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMentor(mentor.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            Mostrando {((currentPage - 1) * mentorsPerPage) + 1} a {Math.min(currentPage * mentorsPerPage, filteredMentors.length)} de {filteredMentors.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Gerenciar Permissões - {selectedMentor.name}
            </h2>
            
            <div className="space-y-4">
              {Object.entries(selectedMentor.permissions).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => {
                      const updatedMentor = {
                        ...selectedMentor,
                        permissions: {
                          ...selectedMentor.permissions,
                          [key]: e.target.checked
                        }
                      }
                      setSelectedMentor(updatedMentor)
                    }}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowPermissionModal(false)
                  setSelectedMentor(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (selectedMentor) {
                    const permissions = Object.entries(selectedMentor.permissions)
                      .filter(([_, value]) => value)
                      .map(([key]) => key)
                    handleUpdatePermissions(selectedMentor.id, permissions)
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Salvar Permissões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
