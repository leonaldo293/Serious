'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, Plus, Search, Filter, Edit, Trash2, Eye, Heart, MessageCircle, TrendingUp, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import CommunityService, { CommunityPost } from '@/services/CommunityService'
import AdminTable, { renderStatus, renderDate } from '@/components/admin/AdminTable'
import AdminModal from '@/components/admin/AdminModal'
import AdminForm from '@/components/admin/AdminForm'

interface CommunityForm {
  title: string
  content: string
  category: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  featured: boolean
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 25
  })

  const communityFields = [
    {
      name: 'title',
      label: 'Título',
      type: 'text' as const,
      placeholder: 'Título da postagem',
      required: true
    },
    {
      name: 'content',
      label: 'Conteúdo',
      type: 'textarea' as const,
      placeholder: 'Conteúdo da postagem',
      required: true
    },
    {
      name: 'category',
      label: 'Categoria',
      type: 'select' as const,
      options: [
        { value: 'general', label: 'Geral' },
        { value: 'tech', label: 'Tecnologia' },
        { value: 'business', label: 'Negócios' },
        { value: 'design', label: 'Design' },
        { value: 'marketing', label: 'Marketing' }
      ],
      required: true
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text' as const,
      placeholder: 'Tags separadas por vírgula'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'published', label: 'Publicado' },
        { value: 'draft', label: 'Rascunho' },
        { value: 'archived', label: 'Arquivado' }
      ],
      required: true
    },
    {
      name: 'featured',
      label: 'Destaque',
      type: 'select' as const,
      options: [
        { value: 'true', label: 'Sim' },
        { value: 'false', label: 'Não' }
      ]
    }
  ]

  const columns = [
    {
      key: 'title',
      label: 'Título'
    },
    {
      key: 'author',
      label: 'Autor'
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (value: unknown) => (
        <span className="px-2 py-1 text-xs bg-african-gold/10 text-african-gold rounded-full">
          {String(value)}
        </span>
      )
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (value: unknown) => {
        const tags = Array.isArray(value) ? value : []
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                {String(tag)}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )
      }
    },
    {
      key: 'likes',
      label: 'Likes',
      render: (value: unknown) => (
        <div className="flex items-center">
          <Heart className="w-4 h-4 text-red-500 mr-1" />
          <span>{String(value)}</span>
        </div>
      )
    },
    {
      key: 'comments',
      label: 'Comentários',
      render: (value: unknown) => (
        <div className="flex items-center">
          <MessageCircle className="w-4 h-4 text-blue-500 mr-1" />
          <span>{String(value)}</span>
        </div>
      )
    },
    {
      key: 'views',
      label: 'Visualizações'
    },
    {
      key: 'featured',
      label: 'Destaque',
      render: (value: unknown) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
        }`}>
          {value ? 'Sim' : 'Não'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown, row: Record<string, unknown>) => {
        const status = String(value)
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'published'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : status === 'draft'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          }`}>
            {status === 'published' ? 'Publicado' : status === 'draft' ? 'Rascunho' : 'Arquivado'}
          </span>
        )
      }
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: renderDate
    }
  ]

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      console.log("AdminCommunityPage: Loading posts...")
      const response = await CommunityService.adminGetAll({
        page: pagination.page,
        limit: pagination.limit
      })
      console.log("AdminCommunityPage: Posts loaded:", response)

      setPosts(response.posts)
      setPagination(prev => ({
        ...prev,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminCommunityPage: Error loading posts:", error)
      toast.error('Erro ao carregar postagens')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleCreate = () => {
    setEditingPost(null)
    setModalOpen(true)
  }

  const handleEdit = (post: CommunityPost) => {
    setEditingPost(post)
    setModalOpen(true)
  }

  const handleDelete = async (post: CommunityPost) => {
    if (window.confirm(`Tem certeza que deseja excluir a postagem "${post.title}"?`)) {
      try {
        await CommunityService.adminDelete(post.id)
        toast.success('Postagem deletada com sucesso')
        await loadPosts()
      } catch (error) {
        console.error("AdminCommunityPage: Error deleting post:", error)
        toast.error('Erro ao deletar postagem')
      }
    }
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      const formData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : (data.tags as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
        featured: data.featured === 'true'
      }

      if (editingPost) {
        await CommunityService.adminUpdate(editingPost.id, formData)
        toast.success('Postagem atualizada com sucesso')
      } else {
        await CommunityService.adminCreate(formData)
        toast.success('Postagem criada com sucesso')
      }
      setModalOpen(false)
      await loadPosts()
    } catch (error) {
      console.error("AdminCommunityPage: Error submitting post:", error)
      throw error
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await CommunityService.adminGetAll({
        search: query,
        page: 1,
        limit: pagination.limit
      })
      setPosts(response.posts)
      setPagination(prev => ({
        ...prev,
        page: 1,
        total: response.total,
        totalPages: response.totalPages
      }))
    } catch (error) {
      console.error("AdminCommunityPage: Error searching posts:", error)
      toast.error('Erro ao buscar postagens')
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
  const publishedPosts = posts.filter(p => p.status === 'published').length
  const featuredPosts = posts.filter(p => p.featured).length
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestão da Comunidade
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie todas as postagens da comunidade
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Postagem</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Postagens</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-african-gold" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Publicadas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{publishedPosts}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Destaques</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{featuredPosts}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Likes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLikes}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        data={posts as unknown as Record<string, unknown>[]}
        columns={columns}
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
        title={editingPost ? 'Editar Postagem' : 'Nova Postagem'}
        size="xl"
      >
        <AdminForm
          fields={communityFields}
          initialData={editingPost ? {
            ...editingPost,
            tags: editingPost.tags.join(', '),
            featured: editingPost.featured.toString()
          } : {}}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitText={editingPost ? 'Atualizar' : 'Criar'}
        />
      </AdminModal>
    </div>
  )
}
