'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CommunityService, { CommunityPost } from '@/services/CommunityService'
import CommunityChat from '@/components/Chat/CommunityChat'
import { Heart, MessageCircle, Pin, Lock } from 'lucide-react'

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('forum')
  const [searchTerm, setSearchTerm] = useState('')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const response = await CommunityService.getAll()
      setPosts(response.posts || [])
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'business': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'design': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `Há ${diffInHours}h`
    if (diffInHours < 48) return 'Ontem'
    return date.toLocaleDateString('pt-BR')
  }

  if (activeTab === 'chat') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chat da Comunidade</h1>
            </div>
            <div className="h-[600px]">
              <CommunityChat />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comunidade ELTx HUB
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conecte-se com outros aprendizes, compartilhe conhecimento e cresça junto
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('forum')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'forum'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Fórum
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Chat
            </button>
          </nav>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar discussões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tech-teal focus:border-transparent"
            />
          </div>
          <button className="px-6 py-2 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition">
            Nova Discussão
          </button>
        </div>

        {/* Forum Posts */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma discussão encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Seja o primeiro a iniciar uma conversa ou ajuste sua busca
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-african-gold rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-deep-charcoal">
                        {post.author ? post.author.substring(0, 2).toUpperCase() : 'AN'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {post.author || 'Anônimo'}
                        </h3>
                        {post.isPinned && (
                          <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs font-medium px-2 py-1 rounded">
                            <Pin className="w-3 h-3 inline mr-1" />
                            Fixado
                          </span>
                        )}
                        {post.isLocked && (
                          <span className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded">
                            <Lock className="w-3 h-3 inline mr-1" />
                            Bloqueado
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTimeAgo(post.createdAt)} • {post.views || 0} visualizações
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(post.category || 'general')}`}>
                    {post.category || 'Geral'}
                  </span>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-african-gold transition-colors">
                      <Heart className="w-5 h-5 mr-1" />
                      {post.likes || 0}
                    </button>
                    <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-african-gold transition-colors">
                      <MessageCircle className="w-5 h-5 mr-1" />
                      {post.replies || 0} respostas
                    </button>
                  </div>
                  <Link
                    href={`/community/${post.id}`}
                    className="text-african-gold hover:text-african-gold/80 font-medium text-sm"
                  >
                    Ver Discussão →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-2 border border-african-gold text-african-gold font-medium rounded-lg hover:bg-african-gold hover:text-deep-charcoal transition">
              Carregar Mais
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
