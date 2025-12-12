'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminTable, { renderStatus, renderDate, renderPrice, Column } from './AdminTable'
import AdminModal from './AdminModal'
import AdminForm, { courseFields } from './AdminForm'
import AdminService, { Course } from '@/lib/api/AdminService'
import { Plus } from 'lucide-react'

export default function CoursesManagement() {
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
      key: 'duration',
      label: 'Duração'
    },
    {
      key: 'level',
      label: 'Nível'
    },
    {
      key: 'price',
      label: 'Preço',
      render: renderPrice
    },
    {
      key: 'enrolledCount',
      label: 'Inscritos'
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
      console.log("CoursesManagement: Loading courses...")
      const response = await AdminService.getCourses({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("CoursesManagement: Courses loaded:", response)
      
      setCourses(response.courses)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("CoursesManagement: Error loading courses:", error)
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
        await AdminService.deleteCourse(course.id)
        await loadCourses()
      } catch (error) {
        console.error("CoursesManagement: Error deleting course:", error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingCourse) {
        await AdminService.updateCourse(editingCourse.id, data)
      } else {
        await AdminService.createCourse(data)
      }
      setModalOpen(false)
      await loadCourses()
    } catch (error) {
      console.error("CoursesManagement: Error submitting course:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await AdminService.getCourses({
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
      console.error("CoursesManagement: Error searching courses:", error)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestão de Cursos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os cursos da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-african-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </button>
      </div>

      {/* Table */}
      <AdminTable
        data={courses as unknown as Record<string, unknown>[]}
        columns={columns as Column[]}
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
