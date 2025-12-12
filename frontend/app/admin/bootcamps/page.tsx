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
  Clock,
  Target,
  Award,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { BootcampsAPI } from '@/lib/api'

interface Bootcamp {
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
  startDate: string
  endDate: string
  schedule: {
    type: 'live' | 'self-paced' | 'hybrid'
    days: string[]
    time: string
    timezone: string
  }
  capacity: number
  availableSlots: number
  prerequisites: string[]
  learningObjectives: string[]
  materials: {
    name: string
    type: 'video' | 'document' | 'link'
    url: string
  }[]
  assignments: {
    id: string
    title: string
    dueDate: string
    points: number
  }[]
  certificate: {
    enabled: boolean
    template: string
    requirements: string[]
  }
  community: {
    enabled: boolean
    type: 'slack' | 'discord' | 'forum'
    link?: string
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
  tags: string[]
}

interface Filters {
  search: string
  category: string
  status: string
  difficulty: string
  schedule: string
  availability: string
  dateFrom: string
  dateTo: string
}

export default function AdminBootcamps() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBootcamps, setSelectedBootcamps] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    status: 'all',
    difficulty: 'all',
    schedule: 'all',
    availability: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const bootcampsPerPage = 20

  useEffect(() => {
    fetchBootcamps()
  }, [currentPage, filters])

  const fetchBootcamps = async () => {
    try {
      setLoading(true)
      console.log("Admin API: Fetching bootcamps")
      
      const params = {
        page: currentPage,
        limit: bootcampsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.difficulty !== 'all' && { difficulty: filters.difficulty }),
        ...(filters.schedule !== 'all' && { schedule: filters.schedule }),
        ...(filters.availability !== 'all' && { availability: filters.availability === 'available' }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo })
      }
      
      const response = await BootcampsAPI.getBootcamps(params)
      console.log("Admin API bootcamps response:", response)
      
      // Garantir que sempre temos array
      const bootcampsData = Array.isArray(response?.data) ? response.data : 
                           Array.isArray(response?.bootcamps) ? response.bootcamps : 
                           Array.isArray(response) ? response : []
      
      setBootcamps(bootcampsData)
      setTotalPages(response?.pagination?.totalPages || response?.totalPages || 1)
    } catch (error) {
      console.error('Admin API Bootcamps Error:', error)
      setBootcamps([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBootcamp = async (bootcampData: any) => {
    try {
      console.log("Admin API: Creating bootcamp:", bootcampData)
      const response = await BootcampsAPI.createBootcamp(bootcampData)
      console.log("Admin API create bootcamp response:", response)
      
      await fetchBootcamps()
      setShowCreateModal(false)
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Create Bootcamp Error:', error)
      return { success: false, error }
    }
  }

  const handleUpdateBootcamp = async (id: string, bootcampData: any) => {
    try {
      console.log("Admin API: Updating bootcamp:", id, bootcampData)
      const response = await BootcampsAPI.updateBootcamp(id, bootcampData)
      console.log("Admin API update bootcamp response:", response)
      
      setBootcamps(prev => prev.map(bootcamp => 
        bootcamp.id === id ? { ...bootcamp, ...response } : bootcamp
      ))
      setEditingBootcamp(null)
      return { success: true, data: response }
    } catch (error) {
      console.error('Admin API Update Bootcamp Error:', error)
      return { success: false, error }
    }
  }

  const handleDeleteBootcamp = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este bootcamp?')) {
      try {
        console.log("Admin API: Deleting bootcamp:", id)
        await BootcampsAPI.deleteBootcamp(id)
        console.log("Admin API delete bootcamp success")
        
        setBootcamps(prev => prev.filter(bootcamp => bootcamp.id !== id))
        return { success: true }
      } catch (error) {
        console.error('Admin API Delete Bootcamp Error:', error)
        return { success: false, error }
      }
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBootcamps(bootcamps.map(bootcamp => bootcamp.id))
    } else {
      setSelectedBootcamps([])
    }
  }

  const handleSelectBootcamp = (bootcampId: string, checked: boolean) => {
    if (checked) {
      setSelectedBootcamps(prev => [...prev, bootcampId])
    } else {
      setSelectedBootcamps(prev => prev.filter(id => id !== bootcampId))
    }
  }

  const filteredBootcamps = bootcamps.filter(bootcamp => {
    const matchesSearch = bootcamp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         bootcamp.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory = filters.category === 'all' || bootcamp.category === filters.category
    const matchesStatus = filters.status === 'all' || bootcamp.status === filters.status
    const matchesDifficulty = filters.difficulty === 'all' || bootcamp.difficulty === filters.difficulty
    const matchesSchedule = filters.schedule === 'all' || bootcamp.schedule.type === filters.schedule
    const matchesAvailability = filters.availability === 'all' || 
      (filters.availability === 'available' && bootcamp.availableSlots > 0) ||
      (filters.availability === 'full' && bootcamp.availableSlots === 0)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty && matchesSchedule && matchesAvailability
  })

  const getStatusBadge = (status: Bootcamp['status']) => {
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

  const getDifficultyBadge = (difficulty: Bootcamp['difficulty']) => {
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

  const getScheduleBadge = (schedule: Bootcamp['schedule']) => {
    const styles = {
      live: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'self-paced': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      hybrid: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    }

    const labels = {
      live: 'Ao Vivo',
      'self-paced': 'Auto Ritmo',
      hybrid: 'Híbrido'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[schedule.type]}`}>
        {labels[schedule.type]}
      </span>
    )
  }

  const getAvailabilityBadge = (bootcamp: Bootcamp) => {
    const isAvailable = bootcamp.availableSlots > 0
    const percentage = ((bootcamp.capacity - bootcamp.availableSlots) / bootcamp.capacity) * 100
    
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
          {bootcamp.availableSlots}/{bootcamp.capacity}
        </span>
      </div>
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
            Bootcamps
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os bootcamps intensivos
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Bootcamp
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
                placeholder="Buscar bootcamps..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              value={filters.schedule}
              onChange={(e) => setFilters(prev => ({ ...prev, schedule: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todos Horários</option>
              <option value="live">Ao Vivo</option>
              <option value="self-paced">Auto Ritmo</option>
              <option value="hybrid">Híbrido</option>
            </select>
          </div>
        )}
      </div>

      {/* Bootcamps List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedBootcamps.length === filteredBootcamps.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bootcamp
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
                    Duração
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBootcamps.map((bootcamp) => (
                  <tr key={bootcamp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBootcamps.includes(bootcamp.id)}
                        onChange={(e) => handleSelectBootcamp(bootcamp.id, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {bootcamp.thumbnail ? (
                            <img
                              src={bootcamp.thumbnail}
                              alt={bootcamp.title}
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
                            {bootcamp.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {bootcamp.instructor.name}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(bootcamp.startDate).toLocaleDateString()} - {new Date(bootcamp.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {bootcamp.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {bootcamp.isFree ? 'Grátis' : `${bootcamp.currency} ${bootcamp.price}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(bootcamp.status)}
                        {getScheduleBadge(bootcamp.schedule)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getAvailabilityBadge(bootcamp)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {bootcamp.duration}h
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingBootcamp(bootcamp)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBootcamp(bootcamp.id)}
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
            {filteredBootcamps.map((bootcamp) => (
              <div key={bootcamp.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  {bootcamp.thumbnail ? (
                    <img
                      src={bootcamp.thumbnail}
                      alt={bootcamp.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {bootcamp.featured && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-medium rounded-full">
                        Destaque
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {bootcamp.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {bootcamp.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(bootcamp.status)}
                      {getDifficultyBadge(bootcamp.difficulty)}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {bootcamp.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                    <span>{bootcamp.enrollmentsCount} inscritos</span>
                    <span>{bootcamp.lessonsCount} aulas</span>
                    <span>{bootcamp.duration}h</span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Vagas disponíveis</span>
                      <span>{bootcamp.availableSlots}/{bootcamp.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${((bootcamp.capacity - bootcamp.availableSlots) / bootcamp.capacity) >= 0.9 ? 'bg-red-500' : ((bootcamp.capacity - bootcamp.availableSlots) / bootcamp.capacity) >= 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${((bootcamp.capacity - bootcamp.availableSlots) / bootcamp.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      {bootcamp.isFree ? 'Grátis' : `${bootcamp.currency} ${bootcamp.price}`}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingBootcamp(bootcamp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBootcamp(bootcamp.id)}
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
            Mostrando {((currentPage - 1) * bootcampsPerPage) + 1} a {Math.min(currentPage * bootcampsPerPage, filteredBootcamps.length)} de {filteredBootcamps.length} resultados
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
      {(showCreateModal || editingBootcamp) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingBootcamp ? 'Editar Bootcamp' : 'Novo Bootcamp'}
            </h2>
            
            {/* Form fields would go here - simplified for now */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  defaultValue={editingBootcamp?.title}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={4}
                  defaultValue={editingBootcamp?.description}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoria
                  </label>
                  <select
                    defaultValue={editingBootcamp?.category}
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
                    defaultValue={editingBootcamp?.difficulty}
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
                  setEditingBootcamp(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Handle save
                  setShowCreateModal(false)
                  setEditingBootcamp(null)
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {editingBootcamp ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
