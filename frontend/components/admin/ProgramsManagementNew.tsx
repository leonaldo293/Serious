'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminTable, { renderStatus, renderDate, renderPrice, Column } from './AdminTable'
import AdminModal from './AdminModal'
import AdminForm, { programFields } from './AdminForm'
import AdminService, { Program } from '@/lib/api/AdminService'
import { Plus } from 'lucide-react'

export default function ProgramsManagementNew() {
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
      key: 'mentor',
      label: 'Mentor'
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
    }
  ]

  const loadPrograms = useCallback(async () => {
    try {
      setLoading(true)
      console.log("ProgramsManagement: Loading programs...")
      const response = await AdminService.getPrograms({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("ProgramsManagement: Programs loaded:", response)
      
      setPrograms(response.programs)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("ProgramsManagement: Error loading programs:", error)
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
        await AdminService.deleteProgram(program.id)
        await loadPrograms()
      } catch (error) {
        console.error("ProgramsManagement: Error deleting program:", error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingProgram) {
        await AdminService.updateProgram(editingProgram.id, data)
      } else {
        await AdminService.createProgram(data)
      }
      setModalOpen(false)
      await loadPrograms()
    } catch (error) {
      console.error("ProgramsManagement: Error submitting program:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await AdminService.getPrograms({
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
      console.error("ProgramsManagement: Error searching programs:", error)
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
            Gestão de Programas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os programas e bootcamps da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-african-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Programa
        </button>
      </div>

      {/* Table */}
      <AdminTable
        data={programs as unknown as Record<string, unknown>[]}
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
