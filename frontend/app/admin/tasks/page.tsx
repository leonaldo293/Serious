'use client'

import { useState, useEffect } from 'react'
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  FileText,
  Upload,
  Star,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  BarChart3,
  TrendingUp,
  Award,
  Target
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  type: 'assignment' | 'quiz' | 'project' | 'exam'
  courseId: string
  courseTitle: string
  mentorId: string
  mentorName: string
  dueDate: string
  maxScore: number
  status: 'draft' | 'published' | 'closed'
  priority: 'low' | 'medium' | 'high'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  instructions: string
  attachments: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface Submission {
  id: string
  taskId: string
  taskTitle: string
  studentId: string
  studentName: string
  studentEmail: string
  submittedAt: string
  status: 'submitted' | 'graded' | 'returned' | 'late'
  score?: number
  maxScore: number
  feedback?: string
  attachments: string[]
  grade?: {
    score: number
    feedback: string
    gradedAt: string
    gradedBy: string
  }
  plagiarism?: {
    score: number
    status: 'clean' | 'suspicious' | 'plagiarized'
    report?: string
  }
}

interface Filters {
  search: string
  status: string
  type: string
  course: string
  mentor: string
  priority: string
  difficulty: string
  dateFrom: string
  dateTo: string
}

export default function AdminTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState<'tasks' | 'submissions'>('tasks')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    type: 'all',
    course: 'all',
    mentor: 'all',
    priority: 'all',
    difficulty: 'all',
    dateFrom: '',
    dateTo: ''
  })

  const itemsPerPage = 20

  useEffect(() => {
    fetchData()
  }, [currentPage, filters, activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'React Component Assignment',
          description: 'Create a reusable React component with TypeScript',
          type: 'assignment',
          courseId: '1',
          courseTitle: 'Web Development Masterclass',
          mentorId: 'mentor1',
          mentorName: 'John Smith',
          dueDate: '2024-03-25T23:59:00Z',
          maxScore: 100,
          status: 'published',
          priority: 'high',
          difficulty: 'intermediate',
          estimatedTime: 120,
          instructions: 'Create a reusable React component that can be used across different applications...',
          attachments: ['requirements.pdf', 'example.zip'],
          tags: ['react', 'typescript', 'components'],
          createdAt: '2024-03-10T10:30:00Z',
          updatedAt: '2024-03-15T14:20:00Z'
        },
        {
          id: '2',
          title: 'JavaScript Fundamentals Quiz',
          description: 'Test your knowledge of JavaScript basics',
          type: 'quiz',
          courseId: '1',
          courseTitle: 'Web Development Masterclass',
          mentorId: 'mentor1',
          mentorName: 'John Smith',
          dueDate: '2024-03-22T23:59:00Z',
          maxScore: 50,
          status: 'published',
          priority: 'medium',
          difficulty: 'beginner',
          estimatedTime: 30,
          instructions: 'Answer 20 multiple choice questions about JavaScript fundamentals...',
          attachments: [],
          tags: ['javascript', 'quiz', 'basics'],
          createdAt: '2024-03-08T09:15:00Z',
          updatedAt: '2024-03-08T09:15:00Z'
        },
        {
          id: '3',
          title: 'Mobile App Final Project',
          description: 'Build a complete mobile application',
          type: 'project',
          courseId: '2',
          courseTitle: 'Mobile App Development',
          mentorId: 'mentor2',
          mentorName: 'Sarah Johnson',
          dueDate: '2024-04-15T23:59:00Z',
          maxScore: 200,
          status: 'published',
          priority: 'high',
          difficulty: 'advanced',
          estimatedTime: 480,
          instructions: 'Build a complete mobile application using React Native...',
          attachments: ['project-brief.pdf', 'design-mockups.fig'],
          tags: ['react-native', 'mobile', 'project'],
          createdAt: '2024-03-01T11:45:00Z',
          updatedAt: '2024-03-20T16:30:00Z'
        },
        {
          id: '4',
          title: 'Data Analysis Exam',
          description: 'Comprehensive exam on data analysis techniques',
          type: 'exam',
          courseId: '3',
          courseTitle: 'Data Science Fundamentals',
          mentorId: 'mentor3',
          mentorName: 'Dr. Michael Chen',
          dueDate: '2024-03-30T23:59:00Z',
          maxScore: 150,
          status: 'published',
          priority: 'high',
          difficulty: 'advanced',
          estimatedTime: 180,
          instructions: 'Complete comprehensive exam covering all data analysis topics...',
          attachments: ['exam-topics.pdf'],
          tags: ['data-science', 'exam', 'analysis'],
          createdAt: '2024-03-05T13:20:00Z',
          updatedAt: '2024-03-05T13:20:00Z'
        },
        {
          id: '5',
          title: 'UI Design Challenge',
          description: 'Design a modern user interface',
          type: 'assignment',
          courseId: '4',
          courseTitle: 'UI/UX Design Principles',
          mentorId: 'mentor4',
          mentorName: 'Emily Davis',
          dueDate: '2024-03-28T23:59:00Z',
          maxScore: 80,
          status: 'draft',
          priority: 'low',
          difficulty: 'intermediate',
          estimatedTime: 90,
          instructions: 'Create a modern UI design for a mobile app...',
          attachments: ['design-guidelines.pdf'],
          tags: ['ui', 'design', 'figma'],
          createdAt: '2024-03-18T15:00:00Z',
          updatedAt: '2024-03-18T15:00:00Z'
        }
      ]

      const mockSubmissions: Submission[] = [
        {
          id: '1',
          taskId: '1',
          taskTitle: 'React Component Assignment',
          studentId: 'student1',
          studentName: 'Ana Silva',
          studentEmail: 'ana.silva@example.com',
          submittedAt: '2024-03-20T16:30:00Z',
          status: 'submitted',
          score: undefined,
          maxScore: 100,
          attachments: ['react-component.zip', 'screenshot.png'],
          grade: undefined,
          plagiarism: {
            score: 5,
            status: 'clean'
          }
        },
        {
          id: '2',
          taskId: '2',
          taskTitle: 'JavaScript Fundamentals Quiz',
          studentId: 'student2',
          studentName: 'Carlos Mendes',
          studentEmail: 'carlos.mendes@example.com',
          submittedAt: '2024-03-19T14:15:00Z',
          status: 'graded',
          score: 42,
          maxScore: 50,
          attachments: [],
          grade: {
            score: 42,
            feedback: 'Good understanding of JavaScript fundamentals. Review async programming concepts.',
            gradedAt: '2024-03-19T18:30:00Z',
            gradedBy: 'John Smith'
          },
          plagiarism: {
            score: 2,
            status: 'clean'
          }
        },
        {
          id: '3',
          taskId: '1',
          taskTitle: 'React Component Assignment',
          studentId: 'student3',
          studentName: 'Maria Santos',
          studentEmail: 'maria.santos@example.com',
          submittedAt: '2024-03-21T10:45:00Z',
          status: 'graded',
          score: 88,
          maxScore: 100,
          attachments: ['react-component-v2.zip'],
          grade: {
            score: 88,
            feedback: 'Excellent implementation! Good use of TypeScript and React best practices.',
            gradedAt: '2024-03-21T15:20:00Z',
            gradedBy: 'John Smith'
          },
          plagiarism: {
            score: 8,
            status: 'clean'
          }
        },
        {
          id: '4',
          taskId: '3',
          taskTitle: 'Mobile App Final Project',
          studentId: 'student4',
          studentName: 'João Costa',
          studentEmail: 'joao.costa@example.com',
          submittedAt: '2024-03-18T11:30:00Z',
          status: 'late',
          score: undefined,
          maxScore: 200,
          attachments: ['mobile-app.apk', 'source-code.zip'],
          grade: undefined,
          plagiarism: {
            score: 25,
            status: 'suspicious',
            report: 'Some similarities detected with existing projects. Please review.'
          }
        },
        {
          id: '5',
          taskId: '2',
          taskTitle: 'JavaScript Fundamentals Quiz',
          studentId: 'student5',
          studentName: 'Pedro Ferreira',
          studentEmail: 'pedro.ferreira@example.com',
          submittedAt: '2024-03-20T09:00:00Z',
          status: 'graded',
          score: 35,
          maxScore: 50,
          attachments: [],
          grade: {
            score: 35,
            feedback: 'Basic concepts understood. Need more practice on closures and prototypes.',
            gradedAt: '2024-03-20T12:15:00Z',
            gradedBy: 'John Smith'
          },
          plagiarism: {
            score: 3,
            status: 'clean'
          }
        }
      ]

      // Apply filters
      let filteredItems: Task[] | Submission[] = activeTab === 'tasks' ? mockTasks : mockSubmissions
      
      if (filters.search) {
        if (activeTab === 'tasks') {
          filteredItems = (filteredItems as Task[]).filter(task => 
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.courseTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
          )
        } else {
          filteredItems = (filteredItems as Submission[]).filter(submission => 
            submission.taskTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
            submission.studentName.toLowerCase().includes(filters.search.toLowerCase()) ||
            submission.studentEmail.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
      }
      
      if (filters.status !== 'all') {
        if (activeTab === 'tasks') {
          filteredItems = (filteredItems as Task[]).filter(item => item.status === filters.status)
        } else {
          filteredItems = (filteredItems as Submission[]).filter(item => item.status === filters.status)
        }
      }
      
      if (filters.type !== 'all' && activeTab === 'tasks') {
        filteredItems = (filteredItems as Task[]).filter(item => item.type === filters.type)
      }
      
      if (filters.course !== 'all') {
        if (activeTab === 'tasks') {
          filteredItems = (filteredItems as Task[]).filter(item => item.courseId === filters.course)
        } else {
          // For submissions, we need to check the task's courseId
          // This is a simplified approach - in real implementation, you'd need to fetch task details
          filteredItems = (filteredItems as Submission[]).filter(item => item.taskId.startsWith(filters.course))
        }
      }
      
      if (filters.priority !== 'all' && activeTab === 'tasks') {
        filteredItems = (filteredItems as Task[]).filter(item => item.priority === filters.priority)
      }
      
      if (filters.difficulty !== 'all' && activeTab === 'tasks') {
        filteredItems = (filteredItems as Task[]).filter(item => item.difficulty === filters.difficulty)
      }

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedItems = filteredItems.slice(startIndex, endIndex)
      
      if (activeTab === 'tasks') {
        setTasks(paginatedItems as Task[])
      } else {
        setSubmissions(paginatedItems as Submission[])
      }
      setTotalPages(Math.ceil(filteredItems.length / itemsPerPage))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    const items = activeTab === 'tasks' ? tasks : submissions
    if (checked) {
      if (activeTab === 'tasks') {
        setSelectedTasks(tasks.map(task => task.id))
      } else {
        setSelectedSubmissions(submissions.map(submission => submission.id))
      }
    } else {
      if (activeTab === 'tasks') {
        setSelectedTasks([])
      } else {
        setSelectedSubmissions([])
      }
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (activeTab === 'tasks') {
      if (checked) {
        setSelectedTasks([...selectedTasks, itemId])
      } else {
        setSelectedTasks(selectedTasks.filter(id => id !== itemId))
      }
    } else {
      if (checked) {
        setSelectedSubmissions([...selectedSubmissions, itemId])
      } else {
        setSelectedSubmissions(selectedSubmissions.filter(id => id !== itemId))
      }
    }
  }

  const handleGradeSubmission = (submission: Submission) => {
    setSelectedSubmission(submission)
    setShowGradeModal(true)
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
      published: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      closed: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      submitted: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      graded: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      returned: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      late: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    }
    const icons = {
      draft: <FileText className="w-3 h-3" />,
      published: <CheckCircle className="w-3 h-3" />,
      closed: <XCircle className="w-3 h-3" />,
      submitted: <Upload className="w-3 h-3" />,
      graded: <Award className="w-3 h-3" />,
      returned: <AlertCircle className="w-3 h-3" />,
      late: <Clock className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      assignment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      quiz: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      project: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      exam: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      high: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    }
    return colors[priority as keyof typeof colors]
  }

  const getPlagiarismBadge = (plagiarism: any) => {
    if (!plagiarism) return null
    
    const colors = {
      clean: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      suspicious: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      plagiarized: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[plagiarism.status as keyof typeof colors]}`}>
        {plagiarism.score}% {plagiarism.status}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks & Submissions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage assignments, quizzes, and student submissions
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
          
          {activeTab === 'tasks' && (
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tasks'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {tasks.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submissions'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Submissions</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {submissions.filter(s => s.status === 'submitted').length}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                  placeholder={`Search ${activeTab}...`}
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
                {activeTab === 'tasks' ? (
                  <>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </>
                ) : (
                  <>
                    <option value="submitted">Submitted</option>
                    <option value="graded">Graded</option>
                    <option value="returned">Returned</option>
                    <option value="late">Late</option>
                  </>
                )}
              </select>
            </div>

            {activeTab === 'tasks' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Course
              </label>
              <select
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Courses</option>
                <option value="1">Web Development Masterclass</option>
                <option value="2">Mobile App Development</option>
                <option value="3">Data Science Fundamentals</option>
                <option value="4">UI/UX Design Principles</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', status: 'all', type: 'all', course: 'all', mentor: 'all', priority: 'all', difficulty: 'all', dateFrom: '', dateTo: '' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      {activeTab === 'tasks' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tasks ({tasks.length})
              </h3>
              {selectedTasks.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTasks.length} selected
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
                      checked={selectedTasks.length === tasks.length && tasks.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={(e) => handleSelectItem(task.id, e.target.checked)}
                        className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {task.mentorName}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          {getTypeBadge(task.type)}
                          <span className="text-xs text-gray-400">{task.estimatedTime}min</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {task.courseTitle}
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(task.type)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(task.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(task.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Edit className="w-4 h-4" />
                        </button>
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, tasks.length)} of {tasks.length} results
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

      {/* Submissions Table */}
      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Submissions ({submissions.length})
              </h3>
              {selectedSubmissions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedSubmissions.length} selected
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Bulk Grade
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Return Selected
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
                      checked={selectedSubmissions.length === submissions.length && submissions.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Plagiarism
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.includes(submission.id)}
                        onChange={(e) => handleSelectItem(submission.id, e.target.checked)}
                        className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.studentName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {submission.studentEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {submission.taskTitle}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Max: {submission.maxScore} points
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDateTime(submission.submittedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4">
                      {submission.grade ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {submission.grade.score}/{submission.maxScore}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {Math.round((submission.grade.score / submission.maxScore) * 100)}%
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not graded</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getPlagiarismBadge(submission.plagiarism)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        {submission.status === 'submitted' && (
                          <button
                            onClick={() => handleGradeSubmission(submission)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Grade Submission"
                          >
                            <Award className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <MessageCircle className="w-4 h-4" />
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, submissions.length)} of {submissions.length} results
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

      {/* Grade Modal */}
      {showGradeModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grade Submission - {selectedSubmission.taskTitle}
              </h3>
              <button
                onClick={() => setShowGradeModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Student: {selectedSubmission.studentName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSubmission.studentEmail}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Submitted: {formatDateTime(selectedSubmission.submittedAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Score (out of {selectedSubmission.maxScore})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedSubmission.maxScore}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  placeholder="Enter score"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feedback
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
                  placeholder="Provide feedback to the student..."
                />
              </div>

              {selectedSubmission.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Submitted Files
                  </h4>
                  <div className="space-y-2">
                    {selectedSubmission.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-900 dark:text-white">{file}</span>
                        <button className="text-african-gold hover:text-african-gold/80 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowGradeModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle grade submission
                  setShowGradeModal(false)
                }}
                className="px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90"
              >
                Submit Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
