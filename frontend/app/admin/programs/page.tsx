'use client'

import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Plus, Search, Filter, Edit, Trash2, Eye, Users, Clock, Star, Award } from 'lucide-react'
import { toast } from 'sonner'
import ProgramService from '@/services/ProgramService'
import AdminTable, { renderStatus, renderDate, renderPrice } from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminForm, { programFields } from '@/components/admin/AdminForm'

interface Program {
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
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
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
      key: 'type',
      label: 'Tipo'
    },
    {
      key: 'category',
      label: 'Categoria'
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
      key: 'enrolledCount',
      label: 'Inscritos'
    },
    {
      key: 'mentor',
      label: 'Mentor'
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
      key: 'startDate',
      label: 'Data Início',
      render: renderDate
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: renderDate
    }
  ]

  const loadPrograms = useCallback(async () => {
    try {
      setLoading(true)
      console.log("AdminProgramsPage: Loading programs...")
      const response = await ProgramService.adminGetAll({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("AdminProgramsPage: Programs loaded:", response)
      
      setPrograms(response.programs)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminProgramsPage: Error loading programs:", error)
      toast.error('Erro ao carregar programas')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    loadPrograms()
  }, [loadPrograms])

  const handleCreate = () => {
    setEditingProgram(null)
    setModalOpen(true)
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setModalOpen(true)
  }

  const handleDelete = async (program: Program) => {
    if (window.confirm(`Tem certeza que deseja excluir o programa ${program.title}?`)) {
      try {
        await ProgramService.adminDelete(program.id)
        toast.success('Programa deletado com sucesso')
        await loadPrograms()
      } catch (error) {
        console.error("AdminProgramsPage: Error deleting program:", error)
        toast.error('Erro ao deletar programa')
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingProgram) {
        await ProgramService.adminUpdate(editingProgram.id, data)
        toast.success('Programa atualizado com sucesso')
      } else {
        await ProgramService.adminCreate(data)
        toast.success('Programa criado com sucesso')
      }
      setModalOpen(false)
      await loadPrograms()
    } catch (error) {
      console.error("AdminProgramsPage: Error submitting program:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await ProgramService.adminGetAll({
        search: query,
        page: 1,
        limit: pagination.limit
      })
      setPrograms(response.programs)
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminProgramsPage: Error searching programs:", error)
      toast.error('Erro ao buscar programas')
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
  const activePrograms = programs.filter(p => p.status === 'active').length
  const bootcamps = programs.filter(p => p.type === 'bootcamp').length
  const totalStudents = programs.reduce((sum, program) => sum + program.enrolledCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Programas
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os programas e bootcamps da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Programa</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Programas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{programs.length}</p>
            </div>
            <Award className="w-8 h-8 text-african-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Programas Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activePrograms}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bootcamps</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{bootcamps}</p>
            </div>
            <BookOpen className="w-8 h-8 text-tech-teal" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        data={programs as unknown as Record<string, unknown>[]}
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
        title={editingProgram ? 'Editar Programa' : 'Novo Programa'}
        size="xl"
      >
        <AdminForm
          fields={programFields}
          initialData={editingProgram as unknown as Record<string, unknown> || {}}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitText={editingProgram ? 'Atualizar' : 'Criar'}
        />
      </AdminModal>
    </div>
  )
}
