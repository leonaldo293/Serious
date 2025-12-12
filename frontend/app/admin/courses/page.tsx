'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Plus, Search, Filter, Edit, Trash2, Eye, Users, Clock, Star } from 'lucide-react'
import { toast } from 'sonner'
import CourseService from '@/services/CourseService'
import AdminTable, { renderStatus, renderDate, renderPrice } from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminForm, { courseFields } from '@/components/admin/AdminForm'

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: string
  duration: string
  enrolledCount: number
  rating: number
  price: number
  status: 'active' | 'inactive' | 'draft'
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 25
  })

  const columns = [
    {
      key: 'title',
      label: 'Título'
    },
    {
      key: 'instructor',
      label: 'Instrutor'
    },
    {
      key: 'category',
      label: 'Categoria'
    },
    {
      key: 'level',
      label: 'Nível'
    },
    {
      key: 'duration',
      label: 'Duração'
    },
    {
      key: 'enrolledCount',
      label: 'Inscritos'
    },
    {
      key: 'rating',
      label: 'Avaliação',
      render: (value: number) => (
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 mr-1" />
          <span>{value.toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Preço',
      render: renderPrice
    },
    {
      key: 'status',
      label: 'Status',
      render: renderStatus
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: renderDate
    }
  ]

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true)
      console.log("AdminCoursesPage: Loading courses...")
      const response = await CourseService.adminGetAll({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("AdminCoursesPage: Courses loaded:", response)
      
      setCourses(response.courses)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminCoursesPage: Error loading courses:", error)
      toast.error('Erro ao carregar cursos')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    loadCourses()
  }, [loadCourses])

  const handleCreate = () => {
    setEditingCourse(null)
    setModalOpen(true)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setModalOpen(true)
  }

  const handleDelete = async (course: Course) => {
    if (window.confirm(`Tem certeza que deseja excluir o curso ${course.title}?`)) {
      try {
        await CourseService.adminDelete(course.id)
        toast.success('Curso deletado com sucesso')
        await loadCourses()
      } catch (error) {
        console.error("AdminCoursesPage: Error deleting course:", error)
        toast.error('Erro ao deletar curso')
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingCourse) {
        await CourseService.adminUpdate(editingCourse.id, data)
        toast.success('Curso atualizado com sucesso')
      } else {
        await CourseService.adminCreate(data)
        toast.success('Curso criado com sucesso')
      }
      setModalOpen(false)
      await loadCourses()
    } catch (error) {
      console.error("AdminCoursesPage: Error submitting course:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await CourseService.adminGetAll({
        search: query,
        page: 1,
        limit: pagination.limit
      })
      setCourses(response.courses)
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminCoursesPage: Error searching courses:", error)
      toast.error('Erro ao buscar cursos')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
  }

  // Stats calculations
  const activeCourses = courses.filter(c => c.status === 'active').length
  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledCount, 0)
  const averageRating = courses.length > 0 ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os cursos da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Curso</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Cursos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-african-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cursos Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCourses}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-tech-teal" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Média de Avaliação</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        data={courses as unknown as Record<string, unknown>[]}
        columns={columns as any}
        loading={loading}
        onEdit={handleEdit as unknown as (item: Record<string, unknown>) => void}
        onDelete={handleDelete as unknown as (item: Record<string, unknown>) => void}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange
        }}
        onSearch={handleSearch}
      />

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCourse ? 'Editar Curso' : 'Novo Curso'}
        size="lg"
      >
        <AdminForm
          fields={courseFields}
          initialData={editingCourse as unknown as Record<string, unknown> || {}}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitText={editingCourse ? 'Atualizar' : 'Criar'}
        />
      </AdminModal>
    </div>
  )
}
