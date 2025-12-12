'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Image,
  DollarSign,
  Users,
  Calendar,
  Star,
  Video,
  FileText,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import { ProgramsAPI } from '@/lib/api'

interface Program {
  id: string
  title: string
  description: string
  category: string
  price: number
  currency: string
  isFree: boolean
  isVisible: boolean
  featured: boolean
  thumbnail?: string
  videoUrl?: string
  duration: number // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructor: {
    id: string
    name: string
    avatar?: string
  }
  enrollmentsCount: number
  rating: number
  reviewsCount: number
  lessonsCount: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  publishedAt?: string
  tags: string[]
  prerequisites: string[]
  learningObjectives: string[]
}

interface Filters {
  search: string
  category: string
  status: string
  difficulty: string
  visibility: string
  dateFrom: string
  dateTo: string
}

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    status: 'all',
    difficulty: 'all',
    visibility: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const programsPerPage = 20

  useEffect(() => {
    fetchPrograms()
  }, [currentPage, filters])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      console.log("Admin API: Fetching programs")
      
      const params = {
        page: currentPage,
        limit: programsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.difficulty !== 'all' && { difficulty: filters.difficulty }),
        ...(filters.visibility !== 'all' && { visibility: filters.visibility === 'visible' }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo })
      }
      
      const response = await ProgramsAPI.getPrograms(params)
      console.log("Admin API programs response:", response)
      
      // Garantir que sempre temos array
      const programsData = Array.isArray(response?.data) ? response.data : 
                          Array.isArray(response?.programs) ? response.programs : 
                          Array.isArray(response) ? response : []
      
      setPrograms(programsData)
      setTotalPages(response?.pagination?.totalPages || response?.totalPages || 1)
    } catch (error) {
      console.error('Admin API Programs Error:', error)
      setPrograms([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProgram = async (programData: any) => {
    try {
      console.log("Admin API: Creating program:", programData)
      const response = await ProgramsAPI.createProgram(programData)
      console.log("Admin API create program response:", response)
      
      await fetchPrograms()
      setShowCreateModal(false)
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Create Program Error:', error)
      return { success: false, error }
    }
  }

  const handleUpdateProgram = async (id: string, programData: any) => {
    try {
      console.log("Admin API: Updating program:", id, programData)
      const response = await ProgramsAPI.updateProgram(id, programData)
      console.log("Admin API update program response:", response)
      
      setPrograms(prev => prev.map(program => 
        program.id === id ? { ...program, ...response } : program
      ))
      setEditingProgram(null)
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Update Program Error:', error)
      return { success: false, error }
    }
  }

  const handleDeleteProgram = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este programa?')) {
      try {
        console.log("Admin API: Deleting program:", id)
        await ProgramsAPI.deleteProgram(id)
        console.log("Admin API delete program success")
        
        setPrograms(prev => prev.filter(program => program.id !== id))
        return { success: true }
      } catch (error) {
        console.error('Admin API Delete Program Error:', error)
        return { success: false, error }
      }
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrograms(programs.map(program => program.id))
    } else {
      setSelectedPrograms([])
    }
  }

  const handleSelectProgram = (programId: string, checked: boolean) => {
    if (checked) {
      setSelectedPrograms(prev => [...prev, programId])
    } else {
      setSelectedPrograms(prev => prev.filter(id => id !== programId))
    }
  }

  const handleToggleVisibility = async (programId: string) => {
    const program = programs.find(p => p.id === programId)
    if (program) {
      await handleUpdateProgram(programId, { isVisible: !program.isVisible })
    }
  }

  const handleToggleFeatured = async (programId: string) => {
    const program = programs.find(p => p.id === programId)
    if (program) {
      await handleUpdateProgram(programId, { featured: !program.featured })
    }
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         program.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory = filters.category === 'all' || program.category === filters.category
    const matchesStatus = filters.status === 'all' || program.status === filters.status
    const matchesDifficulty = filters.difficulty === 'all' || program.difficulty === filters.difficulty
    const matchesVisibility = filters.visibility === 'all' || 
      (filters.visibility === 'visible' && program.isVisible) ||
      (filters.visibility === 'hidden' && !program.isVisible)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty && matchesVisibility
  })

  const getStatusBadge = (status: Program['status']) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    const labels = {
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getDifficultyBadge = (difficulty: Program['difficulty']) => {
    const styles = {
      beginner: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    }

    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[difficulty]}`}>
        {labels[difficulty]}
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
            Programas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os programas educacionais
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Programa
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
                placeholder="Buscar programas..."
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
            >
              📋
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
            >
              ⚏
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas Categorias</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos Status</option>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas Dificuldades</option>
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>

            <select
              value={filters.visibility}
              onChange={(e) => setFilters(prev => ({ ...prev, visibility: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas Visibilidades</option>
              <option value="visible">Visível</option>
              <option value="hidden">Oculto</option>
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Programs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPrograms.length === filteredPrograms.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Programa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Inscritos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program.id)}
                        onChange={(e) => handleSelectProgram(program.id, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {program.thumbnail ? (
                            <img
                              src={program.thumbnail}
                              alt={program.title}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {program.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {program.instructor.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {program.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {program.isFree ? 'Grátis' : `${program.currency} ${program.price}`}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(program.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {program.enrollmentsCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {program.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleVisibility(program.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={program.isVisible ? 'Ocultar' : 'Mostrar'}
                        >
                          {program.isVisible ? <Eye className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(program.id)}
                          className={`hover:text-yellow-500 ${program.featured ? 'text-yellow-500' : 'text-gray-400'}`}
                          title={program.featured ? 'Remover destaque' : 'Destacar'}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingProgram(program)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(program.id)}
                          className="text-red-600 hover:text-red-800"
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  {program.thumbnail ? (
                    <img
                      src={program.thumbnail}
                      alt={program.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {program.featured && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full">
                        Destaque
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(program.status)}
                      {getDifficultyBadge(program.difficulty)}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {program.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <span>{program.enrollmentsCount} inscritos</span>
                    <span>{program.lessonsCount} aulas</span>
                    <span>{program.duration}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      {program.isFree ? 'Grátis' : `${program.currency} ${program.price}`}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingProgram(program)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(program.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow">
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            Mostrando {((currentPage - 1) * programsPerPage) + 1} a {Math.min(currentPage * programsPerPage, filteredPrograms.length)} de {filteredPrograms.length} resultados
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

      {/* Create/Edit Modal */}
      {(showCreateModal || editingProgram) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingProgram ? 'Editar Programa' : 'Novo Programa'}
            </h2>
            
            {/* Form fields would go here - simplified for now */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  defaultValue={editingProgram?.title}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={4}
                  defaultValue={editingProgram?.description}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    defaultValue={editingProgram?.category}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dificuldade
                  </label>
                  <select
                    defaultValue={editingProgram?.difficulty}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingProgram(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Handle save
                  setShowCreateModal(false)
                  setEditingProgram(null)
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {editingProgram ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
