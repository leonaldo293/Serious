'use client'

import { useState, useEffect } from 'react'
import { 
  Video, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Upload,
  FileText,
  Play,
  Clock,
  BookOpen,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  programId: string
  programTitle: string
  chapter: string
  order: number
  duration: number // in minutes
  videoUrl?: string
  videoSize?: number
  videoFormat?: string
  documents?: {
    id: string
    filename: string
    url: string
    size: number
    type: string
  }[]
  isPublished: boolean
  isFree: boolean
  hasQuiz: boolean
  quizQuestions?: number
  enrollmentsCount: number
  completionsCount: number
  averageProgress: number
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
  publishedAt?: string
  tags: string[]
  learningObjectives: string[]
  resources?: {
    type: 'link' | 'file'
    title: string
    url?: string
    filename?: string
  }[]
}

interface Filters {
  search: string
  program: string
  status: string
  published: string
  hasVideo: string
  dateFrom: string
  dateTo: string
}

export default function AdminLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadingLesson, setUploadingLesson] = useState<Lesson | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    program: 'all',
    status: 'all',
    published: 'all',
    hasVideo: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const lessonsPerPage = 20

  useEffect(() => {
    fetchLessons()
  }, [currentPage, filters])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      
      // Mock API call - replace with actual API
      const mockLessons: Lesson[] = [
        {
          id: '1',
          title: 'Introduction to HTML & CSS',
          description: 'Learn the fundamentals of HTML and CSS for web development.',
          programId: '1',
          programTitle: 'Web Development Masterclass',
          chapter: 'Chapter 1: Web Basics',
          order: 1,
          duration: 45,
          videoUrl: '/videos/html-css-intro.mp4',
          videoSize: 125829120, // 120MB
          videoFormat: 'mp4',
          documents: [
            {
              id: 'doc1',
              filename: 'HTML-Cheat-Sheet.pdf',
              url: '/documents/html-cheat-sheet.pdf',
              size: 524288, // 512KB
              type: 'application/pdf'
            },
            {
              id: 'doc2',
              filename: 'CSS-Exercises.zip',
              url: '/documents/css-exercises.zip',
              size: 2097152, // 2MB
              type: 'application/zip'
            }
          ],
          isPublished: true,
          isFree: true,
          hasQuiz: true,
          quizQuestions: 10,
          enrollmentsCount: 156,
          completionsCount: 89,
          averageProgress: 75,
          status: 'published',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-03-20T14:15:00Z',
          publishedAt: '2024-01-20T09:00:00Z',
          tags: ['HTML', 'CSS', 'Basics'],
          learningObjectives: [
            'Understand HTML structure',
            'Create CSS styles',
            'Build basic web pages'
          ],
          resources: [
            {
              type: 'link',
              title: 'MDN Web Docs',
              url: 'https://developer.mozilla.org'
            },
            {
              type: 'file',
              title: 'Code Examples',
              filename: 'html-css-examples.zip'
            }
          ]
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals',
          description: 'Master the basics of JavaScript programming.',
          programId: '1',
          programTitle: 'Web Development Masterclass',
          chapter: 'Chapter 2: JavaScript',
          order: 2,
          duration: 60,
          videoUrl: '/videos/js-fundamentals.mp4',
          videoSize: 188743680, // 180MB
          videoFormat: 'mp4',
          documents: [
            {
              id: 'doc3',
              filename: 'JavaScript-Guide.pdf',
              url: '/documents/js-guide.pdf',
              size: 1048576, // 1MB
              type: 'application/pdf'
            }
          ],
          isPublished: true,
          isFree: false,
          hasQuiz: true,
          quizQuestions: 15,
          enrollmentsCount: 156,
          completionsCount: 67,
          averageProgress: 60,
          status: 'published',
          createdAt: '2024-01-18T15:45:00Z',
          updatedAt: '2024-03-19T11:20:00Z',
          publishedAt: '2024-01-22T10:00:00Z',
          tags: ['JavaScript', 'Programming', 'Basics'],
          learningObjectives: [
            'Write JavaScript code',
            'Understand variables and functions',
            'Work with DOM'
          ]
        },
        {
          id: '3',
          title: 'React Components',
          description: 'Learn how to build reusable React components.',
          programId: '1',
          programTitle: 'Web Development Masterclass',
          chapter: 'Chapter 3: React',
          order: 3,
          duration: 75,
          videoUrl: '/videos/react-components.mp4',
          videoSize: 251658240, // 240MB
          videoFormat: 'mp4',
          documents: [],
          isPublished: false,
          isFree: false,
          hasQuiz: false,
          quizQuestions: 0,
          enrollmentsCount: 0,
          completionsCount: 0,
          averageProgress: 0,
          status: 'draft',
          createdAt: '2024-03-10T09:15:00Z',
          updatedAt: '2024-03-20T16:30:00Z',
          tags: ['React', 'Components', 'Frontend'],
          learningObjectives: [
            'Create React components',
            'Use props and state',
            'Handle events'
          ]
        },
        {
          id: '4',
          title: 'Mobile App Setup',
          description: 'Setting up your development environment for React Native.',
          programId: '2',
          programTitle: 'Mobile App Development with React Native',
          chapter: 'Chapter 1: Getting Started',
          order: 1,
          duration: 30,
          videoUrl: '/videos/mobile-setup.mp4',
          videoSize: 94371840, // 90MB
          videoFormat: 'mp4',
          documents: [
            {
              id: 'doc4',
              filename: 'Setup-Guide.pdf',
              url: '/documents/setup-guide.pdf',
              size: 786432, // 768KB
              type: 'application/pdf'
            }
          ],
          isPublished: true,
          isFree: true,
          hasQuiz: true,
          quizQuestions: 5,
          enrollmentsCount: 89,
          completionsCount: 45,
          averageProgress: 82,
          status: 'published',
          createdAt: '2024-02-05T13:20:00Z',
          updatedAt: '2024-03-18T10:45:00Z',
          publishedAt: '2024-02-10T08:00:00Z',
          tags: ['React Native', 'Setup', 'Mobile'],
          learningObjectives: [
            'Install development tools',
            'Create first React Native app',
            'Run on simulator/device'
          ]
        },
        {
          id: '5',
          title: 'Data Analysis with Python',
          description: 'Introduction to data analysis using Python libraries.',
          programId: '3',
          programTitle: 'Data Science Fundamentals',
          chapter: 'Chapter 1: Python Basics',
          order: 1,
          duration: 55,
          documents: [
            {
              id: 'doc5',
              filename: 'Python-Notebook.ipynb',
              url: '/documents/python-notebook.ipynb',
              size: 1572864, // 1.5MB
              type: 'application/json'
            }
          ],
          isPublished: true,
          isFree: true,
          hasQuiz: true,
          quizQuestions: 8,
          enrollmentsCount: 234,
          completionsCount: 156,
          averageProgress: 68,
          status: 'published',
          createdAt: '2024-01-20T11:10:00Z',
          updatedAt: '2024-03-17T15:25:00Z',
          publishedAt: '2024-01-25T14:00:00Z',
          tags: ['Python', 'Data Analysis', 'Jupyter'],
          learningObjectives: [
            'Use pandas for data manipulation',
            'Create data visualizations',
            'Analyze datasets'
          ]
        }
      ]

      // Apply filters
      let filteredLessons = mockLessons
      
      if (filters.search) {
        filteredLessons = filteredLessons.filter(lesson => 
          lesson.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          lesson.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          lesson.programTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
          lesson.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
        )
      }
      
      if (filters.program !== 'all') {
        filteredLessons = filteredLessons.filter(lesson => lesson.programId === filters.program)
      }
      
      if (filters.status !== 'all') {
        filteredLessons = filteredLessons.filter(lesson => lesson.status === filters.status)
      }
      
      if (filters.published !== 'all') {
        if (filters.published === 'published') {
          filteredLessons = filteredLessons.filter(lesson => lesson.isPublished)
        } else if (filters.published === 'unpublished') {
          filteredLessons = filteredLessons.filter(lesson => !lesson.isPublished)
        }
      }
      
      if (filters.hasVideo !== 'all') {
        if (filters.hasVideo === 'yes') {
          filteredLessons = filteredLessons.filter(lesson => lesson.videoUrl)
        } else if (filters.hasVideo === 'no') {
          filteredLessons = filteredLessons.filter(lesson => !lesson.videoUrl)
        }
      }

      // Pagination
      const startIndex = (currentPage - 1) * lessonsPerPage
      const endIndex = startIndex + lessonsPerPage
      const paginatedLessons = filteredLessons.slice(startIndex, endIndex)
      
      setLessons(paginatedLessons)
      setTotalPages(Math.ceil(filteredLessons.length / lessonsPerPage))
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLessons(lessons.map(lesson => lesson.id))
    } else {
      setSelectedLessons([])
    }
  }

  const handleSelectLesson = (lessonId: string, checked: boolean) => {
    if (checked) {
      setSelectedLessons([...selectedLessons, lessonId])
    } else {
      setSelectedLessons(selectedLessons.filter(id => id !== lessonId))
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        // API call to delete lesson
        setLessons(lessons.filter(lesson => lesson.id !== lessonId))
        setSelectedLessons(selectedLessons.filter(id => id !== lessonId))
      } catch (error) {
        console.error('Error deleting lesson:', error)
      }
    }
  }

  const handleTogglePublish = async (lessonId: string) => {
    try {
      // API call to toggle publish status
      setLessons(lessons.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, isPublished: !lesson.isPublished }
          : lesson
      ))
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const handleVideoUpload = async (lessonId: string, videoFile: File) => {
    try {
      setUploadingLesson(lessons.find(l => l.id === lessonId) || null)
      setUploadProgress(0)

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // Update lesson with video
      setLessons(lessons.map(lesson => 
        lesson.id === lessonId 
          ? { 
              ...lesson, 
              videoUrl: `/videos/${videoFile.name}`,
              videoSize: videoFile.size,
              videoFormat: videoFile.type.split('/')[1]
            }
          : lesson
      ))
    } catch (error) {
      console.error('Error uploading video:', error)
    } finally {
      setUploadingLesson(null)
      setUploadProgress(0)
    }
  }

  const handleDocumentUpload = async (lessonId: string, documentFile: File) => {
    try {
      // API call to upload document
      const newDocument = {
        id: `doc_${Date.now()}`,
        filename: documentFile.name,
        url: `/documents/${documentFile.name}`,
        size: documentFile.size,
        type: documentFile.type
      }

      setLessons(lessons.map(lesson => 
        lesson.id === lessonId 
          ? { 
              ...lesson, 
              documents: [...(lesson.documents || []), newDocument]
            }
          : lesson
      ))
    } catch (error) {
      console.error('Error uploading document:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    )
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
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
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lessons</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage course content, videos, and learning materials
          </p>
        </div>
        <div className="flex space-x-3">
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
          
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lesson
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Lessons</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{lessons.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lessons.filter(l => l.isPublished).length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Video</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {lessons.filter(l => l.videoUrl).length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(lessons.reduce((sum, l) => sum + l.duration, 0))}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
                  placeholder="Search lessons..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Program
              </label>
              <select
                value={filters.program}
                onChange={(e) => setFilters({...filters, program: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Programs</option>
                <option value="1">Web Development Masterclass</option>
                <option value="2">Mobile App Development</option>
                <option value="3">Data Science Fundamentals</option>
              </select>
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
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Published
              </label>
              <select
                value={filters.published}
                onChange={(e) => setFilters({...filters, published: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Has Video
              </label>
              <select
                value={filters.hasVideo}
                onChange={(e) => setFilters({...filters, hasVideo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', program: 'all', status: 'all', published: 'all', hasVideo: 'all', dateFrom: '', dateTo: '' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lessons ({lessons.length})
            </h3>
            {selectedLessons.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedLessons.length} selected
                </span>
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
                    checked={selectedLessons.length === lessons.length && lessons.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lesson
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLessons.includes(lesson.id)}
                      onChange={(e) => handleSelectLesson(lesson.id, e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {lesson.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {lesson.chapter} • Order {lesson.order}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(lesson.status)}
                        {lesson.isFree && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Free
                          </span>
                        )}
                        {lesson.hasQuiz && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Quiz ({lesson.quizQuestions})
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {lesson.programTitle}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {formatDuration(lesson.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        {lesson.videoUrl ? (
                          <div className="flex items-center text-green-600">
                            <Video className="w-4 h-4 mr-1" />
                            <span>{formatFileSize(lesson.videoSize || 0)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <Video className="w-4 h-4 mr-1" />
                            <span>No video</span>
                          </div>
                        )}
                      </div>
                      {lesson.documents && lesson.documents.length > 0 && (
                        <div className="flex items-center text-sm text-blue-600">
                          <FileText className="w-4 h-4 mr-1" />
                          <span>{lesson.documents.length} docs</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {lesson.enrollmentsCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className="bg-african-gold h-2 rounded-full" 
                            style={{ width: `${lesson.averageProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{lesson.averageProgress}%</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {lesson.completionsCount} completed
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
                      <button
                        onClick={() => handleTogglePublish(lesson.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                      >
                        {lesson.isPublished ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      
                      {/* Video Upload */}
                      <label className="p-1 text-gray-400 hover:text-blue-600 cursor-pointer" title="Upload Video">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleVideoUpload(lesson.id, file)
                          }}
                        />
                      </label>
                      
                      {/* Document Upload */}
                      <label className="p-1 text-gray-400 hover:text-green-600 cursor-pointer" title="Upload Document">
                        <FileText className="w-4 h-4" />
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt,.zip"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleDocumentUpload(lesson.id, file)
                          }}
                        />
                      </label>
                      
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
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
              Showing {((currentPage - 1) * lessonsPerPage) + 1} to {Math.min(currentPage * lessonsPerPage, lessons.length)} of {lessons.length} results
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

      {/* Upload Progress Modal */}
      {uploadingLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Uploading Video
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {uploadingLesson.title}
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-african-gold h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {uploadProgress}% complete
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-african-gold"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
