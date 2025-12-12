'use client'

import { useState, useEffect } from 'react'
import AdminTable, { renderRole, renderStatus, renderDate, Column } from './AdminTable'
import AdminModal from './AdminModal'
import AdminForm, { userFields } from './AdminForm'
import AdminService, { User } from '@/lib/api/AdminService'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersManagement() {
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

  useEffect(() => {
    loadUsers()
  }, [pagination.page, pagination.limit])

  const loadUsers = async () => {
    try {
      setLoading(true)
      console.log("UsersManagement: Loading users...")
      const response = await AdminService.getUsers({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("UsersManagement: Users loaded:", response)
      
      setUsers(response.users)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("UsersManagement: Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

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
        await AdminService.deleteUser(user.id)
        await loadUsers()
      } catch (error) {
        console.error("UsersManagement: Error deleting user:", error)
      }
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingUser) {
        await AdminService.updateUser(editingUser.id, data)
      } else {
        await AdminService.createUser(data)
      }
      setModalOpen(false)
      await loadUsers()
    } catch (error) {
      console.error("UsersManagement: Error submitting user:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await AdminService.getUsers({
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
      console.error("UsersManagement: Error searching users:", error)
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
            Gestão de Usuários
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os usuários da plataforma
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-african-gold text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {/* Table */}
      <AdminTable
        data={users as unknown as Record<string, unknown>[]}
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
