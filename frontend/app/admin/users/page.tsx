'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Mail, Phone, Calendar, Shield, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import UserService from '@/services/UserService'
import AdminTable, { renderRole, renderStatus, renderDate } from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminForm, { userFields } from '@/components/admin/AdminForm'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  avatar?: string
  role: 'user' | 'student' | 'admin' | 'mentor' | 'instructor' | 'superadmin'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
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
      render: (value: string, row: User) => `${row.firstName} ${row.lastName}`
    },
    {
      key: 'email',
      label: 'Email'
    },
    {
      key: 'phone',
      label: 'Telefone'
    },
    {
      key: 'role',
      label: 'Função',
      render: renderRole
    },
    {
      key: 'status',
      label: 'Status',
      render: renderStatus
    },
    {
      key: 'location',
      label: 'Localização'
    },
    {
      key: 'createdAt',
      label: 'Data de Registro',
      render: renderDate
    },
    {
      key: 'lastLogin',
      label: 'Último Login',
      render: (value: unknown, row: Record<string, unknown>) => value ? renderDate(value, row) : '-'
    }
  ]

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      console.log("AdminUsersPage: Loading users...")
      const response = await UserService.adminGetAll({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("AdminUsersPage: Users loaded:", response)
      
      setUsers(response.users)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminUsersPage: Error loading users:", error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleCreate = () => {
    setEditingUser(null)
    setModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setModalOpen(true)
  }

  const handleDelete = async (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.firstName} ${user.lastName}?`)) {
      try {
        await UserService.adminDelete(user.id)
        toast.success('Usuário deletado com sucesso')
        await loadUsers()
      } catch (error) {
        console.error("AdminUsersPage: Error deleting user:", error)
        toast.error('Erro ao deletar usuário')
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (editingUser) {
        await UserService.adminUpdate(editingUser.id, data)
        toast.success('Usuário atualizado com sucesso')
      } else {
        await UserService.adminCreate(data)
        toast.success('Usuário criado com sucesso')
      }
      setModalOpen(false)
      await loadUsers()
    } catch (error) {
      console.error("AdminUsersPage: Error submitting user:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await UserService.adminGetAll({
        search: query,
        page: 1,
        limit: pagination.limit
      })
      setUsers(response.users)
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminUsersPage: Error searching users:", error)
      toast.error('Erro ao buscar usuários')
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
  const activeUsers = users.filter(u => u.status === 'active').length
  const admins = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length
  const mentors = users.filter(u => u.role === 'mentor' || u.role === 'instructor').length
  const students = users.filter(u => u.role === 'student').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão de Usuários
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todos os usuários da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
            <Users className="w-8 h-8 text-african-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usuários Ativos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeUsers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Administradores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{admins}</p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estudantes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{students}</p>
            </div>
            <UserX className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        data={users as unknown as Record<string, unknown>[]}
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
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        size="lg"
      >
        <AdminForm
          fields={userFields}
          initialData={editingUser as unknown as Record<string, unknown> || {}}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitText={editingUser ? 'Atualizar' : 'Criar'}
        />
      </AdminModal>
    </div>
  )
}
