'use client'

import { useState, useEffect } from 'react'
import { 
  PenTool, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  MessageCircle,
  Share2,
  TrendingUp,
  Heart,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  Tag,
  User,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  category: string
  tags: string[]
  featuredImage?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  publishedAt?: string
  scheduledFor?: string
  createdAt: string
  updatedAt: string
  readTime: number
  views: number
  likes: number
  comments: number
  shares: number
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  postCount: number
  color?: string
}

interface Filters {
  search: string
  status: string
  category: string
  author: string
  dateFrom: string
  dateTo: string
  tags: string[]
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    category: 'all',
    author: 'all',
    dateFrom: '',
    dateTo: '',
    tags: []
  })

  const postsPerPage = 20

  useEffect(() => {
    fetchData()
  }, [currentPage, filters, activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'Getting Started with React 18: New Features and Best Practices',
          slug: 'getting-started-react-18',
          excerpt: 'Explore the latest features in React 18 including concurrent rendering, automatic batching, and the new hooks API.',
          content: 'React 18 introduces several groundbreaking features...',
          author: {
            id: 'author1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            avatar: '/avatars/john.jpg'
          },
          category: 'Web Development',
          tags: ['react', 'javascript', 'frontend', 'webdev'],
          featuredImage: '/blog/react-18.jpg',
          status: 'published',
          publishedAt: '2024-03-15T10:30:00Z',
          createdAt: '2024-03-10T09:15:00Z',
          updatedAt: '2024-03-15T10:30:00Z',
          readTime: 8,
          views: 1254,
          likes: 89,
          comments: 23,
          shares: 45,
          seo: {
            metaTitle: 'React 18 Guide - New Features & Best Practices',
            metaDescription: 'Complete guide to React 18 features including concurrent rendering and automatic batching.',
            keywords: ['react', 'react 18', 'javascript', 'frontend', 'web development']
          }
        },
        {
          id: '2',
          title: 'Building Scalable Mobile Apps with React Native',
          slug: 'scalable-react-native-apps',
          excerpt: 'Learn how to build production-ready mobile applications using React Native with proper architecture and performance optimization.',
          content: 'React Native has become the go-to solution for cross-platform mobile development...',
          author: {
            id: 'author2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            avatar: '/avatars/sarah.jpg'
          },
          category: 'Mobile Development',
          tags: ['react-native', 'mobile', 'ios', 'android', 'cross-platform'],
          featuredImage: '/blog/react-native.jpg',
          status: 'published',
          publishedAt: '2024-03-12T14:20:00Z',
          createdAt: '2024-03-08T11:45:00Z',
          updatedAt: '2024-03-12T14:20:00Z',
          readTime: 12,
          views: 892,
          likes: 67,
          comments: 15,
          shares: 28,
          seo: {
            metaTitle: 'React Native Scalable Apps Guide',
            metaDescription: 'Build production-ready mobile apps with React Native - architecture, performance, and best practices.',
            keywords: ['react native', 'mobile development', 'ios', 'android', 'scalable apps']
          }
        },
        {
          id: '3',
          title: 'Data Science Fundamentals: From Theory to Practice',
          slug: 'data-science-fundamentals',
          excerpt: 'A comprehensive introduction to data science concepts, tools, and real-world applications for beginners.',
          content: 'Data science has emerged as one of the most sought-after fields in technology...',
          author: {
            id: 'author3',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@example.com',
            avatar: '/avatars/michael.jpg'
          },
          category: 'Data Science',
          tags: ['data-science', 'python', 'machine-learning', 'analytics', 'statistics'],
          featuredImage: '/blog/data-science.jpg',
          status: 'published',
          publishedAt: '2024-03-10T16:45:00Z',
          createdAt: '2024-03-05T10:30:00Z',
          updatedAt: '2024-03-10T16:45:00Z',
          readTime: 15,
          views: 2341,
          likes: 156,
          comments: 42,
          shares: 89,
          seo: {
            metaTitle: 'Data Science Fundamentals Guide',
            metaDescription: 'Complete guide to data science concepts, tools, and real-world applications for beginners.',
            keywords: ['data science', 'python', 'machine learning', 'analytics', 'statistics']
          }
        },
        {
          id: '4',
          title: 'UI/UX Design Principles for Modern Web Applications',
          slug: 'ui-ux-design-principles',
          excerpt: 'Essential design principles and best practices for creating user-friendly and visually appealing web interfaces.',
          content: 'Great design is invisible - it just works. But behind every seamless user experience...',
          author: {
            id: 'author4',
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            avatar: '/avatars/emily.jpg'
          },
          category: 'Design',
          tags: ['ui', 'ux', 'design', 'user-experience', 'web-design'],
          featuredImage: '/blog/ui-ux.jpg',
          status: 'draft',
          createdAt: '2024-03-18T13:20:00Z',
          updatedAt: '2024-03-20T09:30:00Z',
          readTime: 10,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          seo: {
            metaTitle: 'UI UX Design Principles Guide',
            metaDescription: 'Essential design principles and best practices for modern web applications.',
            keywords: ['ui design', 'ux design', 'user experience', 'web design', 'design principles']
          }
        },
        {
          id: '5',
          title: 'Advanced TypeScript Patterns for Large-Scale Applications',
          slug: 'advanced-typescript-patterns',
          excerpt: 'Explore advanced TypeScript patterns and techniques for building maintainable and type-safe large-scale applications.',
          content: 'TypeScript has evolved beyond simple type annotations to become a powerful tool...',
          author: {
            id: 'author1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            avatar: '/avatars/john.jpg'
          },
          category: 'Web Development',
          tags: ['typescript', 'javascript', 'patterns', 'architecture', 'type-safety'],
          featuredImage: '/blog/typescript.jpg',
          status: 'scheduled',
          scheduledFor: '2024-03-25T10:00:00Z',
          createdAt: '2024-03-20T15:45:00Z',
          updatedAt: '2024-03-20T15:45:00Z',
          readTime: 18,
          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          seo: {
            metaTitle: 'Advanced TypeScript Patterns',
            metaDescription: 'Master advanced TypeScript patterns for building large-scale, type-safe applications.',
            keywords: ['typescript', 'javascript', 'patterns', 'architecture', 'type safety']
          }
        }
      ]

      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Web Development',
          slug: 'web-development',
          description: 'Articles about web development, frontend, and backend technologies',
          postCount: 45,
          color: '#3B82F6'
        },
        {
          id: '2',
          name: 'Mobile Development',
          slug: 'mobile-development',
          description: 'Mobile app development guides and tutorials',
          postCount: 28,
          color: '#10B981'
        },
        {
          id: '3',
          name: 'Data Science',
          slug: 'data-science',
          description: 'Data science, machine learning, and analytics content',
          postCount: 32,
          color: '#8B5CF6'
        },
        {
          id: '4',
          name: 'Design',
          slug: 'design',
          description: 'UI/UX design principles and best practices',
          postCount: 19,
          color: '#F59E0B'
        },
        {
          id: '5',
          name: 'DevOps',
          slug: 'devops',
          description: 'DevOps practices, CI/CD, and deployment strategies',
          postCount: 15,
          color: '#EF4444'
        }
      ]

      // Apply filters
      let filteredPosts = mockPosts
      
      if (filters.search) {
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.content.toLowerCase().includes(filters.search.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
        )
      }
      
      if (filters.status !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.status === filters.status)
      }
      
      if (filters.category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === filters.category)
      }
      
      if (filters.author !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.author.name === filters.author)
      }
      
      if (filters.tags.length > 0) {
        filteredPosts = filteredPosts.filter(post => 
          filters.tags.some(tag => post.tags.includes(tag))
        )
      }

      // Pagination
      const startIndex = (currentPage - 1) * postsPerPage
      const endIndex = startIndex + postsPerPage
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex)
      
      setPosts(paginatedPosts)
      setCategories(mockCategories)
      setTotalPages(Math.ceil(filteredPosts.length / postsPerPage))
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id))
    } else {
      setSelectedPosts([])
    }
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId])
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    }
  }

  const handlePublishPost = async (postId: string) => {
    try {
      // API call to publish post
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, status: 'published', publishedAt: new Date().toISOString() }
          : post
      ))
    } catch (error) {
      console.error('Error publishing post:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        // API call to delete post
        setPosts(posts.filter(post => post.id !== postId))
        setSelectedPosts(selectedPosts.filter(id => id !== postId))
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
      published: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      scheduled: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      archived: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    }
    const icons = {
      draft: <FileText className="w-3 h-3" />,
      published: <CheckCircle className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />,
      archived: <AlertCircle className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage blog posts, categories, and content
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters 
                ? 'border-african-gold text-african-gold bg-african-gold/10' 
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          
          {activeTab === 'posts' && (
            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </button>
          )}
          
          {activeTab === 'categories' && (
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {posts.length + posts.length * 2} {/* Mock total */}
              </p>
              <p className="text-sm text-green-600 mt-1">+12% this month</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {posts.filter(p => p.status === 'published').length}
              </p>
              <p className="text-sm text-blue-600 mt-1">Active posts</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 mt-1">+28% this month</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {posts.reduce((sum, p) => sum + p.likes + p.comments, 0).toLocaleString()}
              </p>
              <p className="text-sm text-yellow-600 mt-1">Likes + Comments</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <PenTool className="w-4 h-4" />
                <span>Posts</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {posts.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Categories</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {categories.length}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      {showFilters && activeTab === 'posts' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  placeholder="Search posts..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author
              </label>
              <select
                value={filters.author}
                onChange={(e) => setFilters({...filters, author: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Authors</option>
                <option value="John Smith">John Smith</option>
                <option value="Sarah Johnson">Sarah Johnson</option>
                <option value="Dr. Michael Chen">Dr. Michael Chen</option>
                <option value="Emily Davis">Emily Davis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', status: 'all', category: 'all', author: 'all', dateFrom: '', dateTo: '', tags: [] })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Content */}
      {activeTab === 'posts' && (
        <>
          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  viewMode === 'table'
                    ? 'bg-african-gold text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-sm ${
                  viewMode === 'grid'
                    ? 'bg-african-gold text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Grid
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPosts.length > 0 && `${selectedPosts.length} selected`}
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Posts ({posts.length})
                  </h3>
                  {selectedPosts.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedPosts.length} selected
                      </span>
                      <button className="text-sm text-blue-600 hover:text-blue-700">
                        Bulk Edit
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-700">
                        Delete Selected
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedPosts.length === posts.length && posts.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stats
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPosts.includes(post.id)}
                            onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                            className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            {post.featuredImage && (
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {post.excerpt}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-400">{post.readTime} min read</span>
                                {post.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-xs font-bold">
                              {post.author.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">{post.author.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {post.category}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(post.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {post.publishedAt ? formatDate(post.publishedAt) : 
                           post.scheduledFor ? `Scheduled: ${formatDate(post.scheduledFor)}` : 
                           'Not published'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views}
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.comments}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            {post.status === 'draft' && (
                              <button
                                onClick={() => handlePublishPost(post.id)}
                                className="p-1 text-gray-400 hover:text-green-600"
                                title="Publish"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-1 text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((currentPage - 1) * postsPerPage) + 1} to {Math.min(currentPage * postsPerPage, posts.length)} of {posts.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                  {post.featuredImage && (
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      {getStatusBadge(post.status)}
                      <span className="text-xs text-gray-400">{post.readTime} min read</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-xs font-bold">
                          {post.author.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{post.author.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{post.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.comments}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        {post.status === 'draft' && (
                          <button
                            onClick={() => handlePublishPost(post.id)}
                            className="p-1 text-gray-400 hover:text-green-600"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Categories Content */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                  <Tag className="w-6 h-6" style={{ color: category.color }} />
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.postCount} posts
                </span>
                <span className="text-xs text-gray-400">
                  /{category.slug}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
