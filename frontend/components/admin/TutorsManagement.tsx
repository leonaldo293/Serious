'use client'

import { useState, useEffect } from 'react'
import AdminTable, { renderStatus, renderDate, Column } from './AdminTable'
import AdminModal from './AdminModal'
import AdminForm, { tutorFields } from './AdminForm'
import AdminService, { Tutor } from '@/lib/api/AdminService'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function TutorsManagement() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 25
  })

  const columns = [
    {
      key: 'firstName',
      label: 'Nome',
      render: (value: string, row: Tutor) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'expertise',
      label: 'Especialização'
    },
    {
      key: 'experience',
      label: 'Experiência'
    },
    {
      key: 'rating',
      label: 'Avaliação',
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1">{(value as number).toFixed(1)}</span>
        </div>
      )
    },
    {
      key: 'studentsCount',
      label: 'Alunos'
    },
    {
      key: 'hourlyRate',
      label: 'Taxa/Hora',
      render: (value: unknown, row: Record<string, unknown>) => (
        <span className="font-medium">
          {(value as number).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
        </span>
      )
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

  useEffect(() => {
    loadTutors()
  }, [pagination.page, pagination.limit])

  const loadTutors = async () => {
    try {
      setLoading(true)
      console.log("TutorsManagement: Loading tutors...")
      const response = await AdminService.getTutors({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("TutorsManagement: Tutors loaded:", response)
      
      setTutors(response.tutors)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("TutorsManagement: Error loading tutors:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTutor(null)
    setModalOpen(true)
  }

  const handleEdit = (tutor: Tutor) => {
    setEditingTutor(tutor)
    setModalOpen(true)
  }

  const handleDelete = async (tutor: Tutor) => {
    if (window.confirm(`Tem certeza que deseja excluir o tutor ${tutor.firstName} ${tutor.lastName}?`)) {
      try {
        await AdminService.deleteTutor(tutor.id)
        await loadTutors()
      } catch (error) {
        console.error("TutorsManagement: Error deleting tutor:", error)
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingTutor) {
        await AdminService.updateTutor(editingTutor.id, data)
      } else {
        await AdminService.createTutor(data)
      }
      setModalOpen(false)
      await loadTutors()
    } catch (error) {
      console.error("TutorsManagement: Error submitting tutor:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await AdminService.getTutors({
        search: query,
        page: 1,
        limit: pagination.limit
      })
      setTutors(response.tutors)
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("TutorsManagement: Error searching tutors:", error)
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
            Gestão de Tutores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os tutores e mentores da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-african-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Tutor
        </button>
      </div>

      {/* Table */}
      <AdminTable
        data={tutors as unknown as Record<string, unknown>[]}
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
        title={editingTutor ? 'Editar Tutor' : 'Novo Tutor'}
        size="lg"
      >
        <AdminForm
          fields={tutorFields}
          initialData={editingTutor as unknown as Record<string, unknown> || {}}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitText={editingTutor ? 'Atualizar' : 'Criar'}
        />
      </AdminModal>
    </div>
  )
}
