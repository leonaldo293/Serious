'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Star, Shield, Award, Clock, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import MentorService from '@/services/MentorService'
import AdminTable, { renderStatus, renderDate } from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminForm, { tutorFields } from '@/components/admin/AdminForm'

interface Mentor {
  id: string
  firstName: string
  lastName: string
  email: string
  bio: string
  expertise: string[]
  experience: string
  rating: number
  status: 'active' | 'inactive'
  courses: string[]
  studentsCount: number
  hourlyRate: number
  availability: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null)
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
      render: (value: string, row: Mentor) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'expertise',
      label: 'Especialização',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((skill, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-african-gold/10 text-african-gold rounded-full">
              {skill}
            </span>
          ))}
          {value.length > 2 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{value.length - 2}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'experience',
      label: 'Experiência'
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
      key: 'studentsCount',
      label: 'Alunos'
    },
    {
      key: 'hourlyRate',
      label: 'Taxa/Hora',
      render: (value: number) => (
        <span className="font-medium">
          {value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
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

  const loadMentors = useCallback(async () => {
    try {
      setLoading(true)
      console.log("AdminMentorsPage: Loading mentors...")
      const response = await MentorService.adminGetAll({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("AdminMentorsPage: Mentors loaded:", response)
      
      setMentors(response.mentors)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminMentorsPage: Error loading mentors:", error)
      toast.error('Erro ao carregar tutores')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    loadMentors()
  }, [loadMentors])

  const handleCreate = () => {
    setEditingMentor(null)
    setModalOpen(true)
  }

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor)
    setModalOpen(true)
  }

  const handleDelete = async (mentor: Mentor) => {
    if (window.confirm(`Tem certeza que deseja excluir o tutor ${mentor.firstName} ${mentor.lastName}?`)) {
      try {
        await MentorService.adminDelete(mentor.id)
        toast.success('Tutor deletado com sucesso')
        await loadMentors()
      } catch (error) {
        console.error("AdminMentorsPage: Error deleting mentor:", error)
        toast.error('Erro ao deletar tutor')
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingMentor) {
        await MentorService.adminUpdate(editingMentor.id, data)
        toast.success('Tutor atualizado com sucesso')
      } else {
        await MentorService.adminCreate(data)
        toast.success('Tutor criado com sucesso')
      }
      setModalOpen(false)
      await loadMentors()
    } catch (error) {
      console.error("AdminMentorsPage: Error submitting mentor:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await MentorService.adminGetAll({
        search: query,
        page: 1,
        limit: pagination.limit
      })
      setMentors(response.mentors)
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminMentorsPage: Error searching mentors:", error)
      toast.error('Erro ao buscar tutores')
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
  const activeMentors = mentors.filter(m => m.status === 'active').length
  const totalStudents = mentors.reduce((sum, mentor) => sum + mentor.studentsCount, 0)
  const averageRating = mentors.length > 0 ? mentors.reduce((sum, mentor) => sum + mentor.rating, 0) / mentors.length : 0
  const averageHourlyRate = mentors.length > 0 ? mentors.reduce((sum, mentor) => sum + mentor.hourlyRate, 0) / mentors.length : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Tutores
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os tutores e mentores da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Tutor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tutores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mentors.length}</p>
            </div>
            <Users className="w-8 h-8 text-african-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tutores Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeMentors}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
            <Shield className="w-8 h-8 text-tech-teal" />
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
        data={mentors as unknown as Record<string, unknown>[]}
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
        title={editingMentor ? 'Editar Tutor' : 'Novo Tutor'}
        size="lg"
      >
        <AdminForm
          fields={tutorFields}
          initialData={editingMentor as unknown as Record<string, unknown> || {}}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitText={editingMentor ? 'Atualizar' : 'Criar'}
        />
      </AdminModal>
    </div>
  )
}
