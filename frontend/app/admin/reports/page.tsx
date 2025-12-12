'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  Award,
  BarChart3,
  PieChart,
  Activity,
  FileSpreadsheet,
  FileImage,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Share2,
  Mail,
  Printer
} from 'lucide-react'

interface Report {
  id: string
  name: string
  description: string
  type: 'users' | 'enrollments' | 'payments' | 'courses' | 'progress' | 'engagement' | 'financial' | 'custom'
  format: 'pdf' | 'csv' | 'excel' | 'json'
  status: 'generating' | 'completed' | 'failed' | 'scheduled'
  parameters: {
    dateFrom: string
    dateTo: string
    filters: Record<string, any>
    groupBy?: string
    sortBy?: string
  }
  fileSize?: number
  downloadUrl?: string
  createdAt: string
  generatedAt?: string
  expiresAt?: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  scheduledFor?: string
  recurrence?: {
    type: 'daily' | 'weekly' | 'monthly'
    interval: number
  }
  shareSettings: {
    isPublic: boolean
    sharedWith: string[]
  }
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'users' | 'enrollments' | 'payments' | 'courses' | 'progress' | 'engagement' | 'financial'
  category: string
  icon: string
  defaultFormat: 'pdf' | 'csv' | 'excel'
  parameters: {
    required: string[]
    optional: string[]
  }
  sampleData: boolean
}

interface Filters {
  search: string
  type: string
  status: string
  format: string
  dateFrom: string
  dateTo: string
  createdBy: string
}

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'schedule'>('reports')
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'all',
    status: 'all',
    format: 'all',
    dateFrom: '',
    dateTo: '',
    createdBy: 'all'
  })

  const reportsPerPage = 20

  useEffect(() => {
    fetchData()
  }, [currentPage, filters, activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Monthly User Activity Report',
          description: 'Comprehensive report on user engagement and activity for March 2024',
          type: 'users',
          format: 'pdf',
          status: 'completed',
          parameters: {
            dateFrom: '2024-03-01',
            dateTo: '2024-03-31',
            filters: {
              role: 'all',
              status: 'active'
            },
            groupBy: 'role',
            sortBy: 'last_login'
          },
          fileSize: 2456789,
          downloadUrl: '/reports/monthly-user-activity-march-2024.pdf',
          createdAt: '2024-04-01T09:00:00Z',
          generatedAt: '2024-04-01T09:05:00Z',
          expiresAt: '2024-05-01T09:05:00Z',
          createdBy: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@example.com'
          },
          shareSettings: {
            isPublic: false,
            sharedWith: ['john@example.com', 'sarah@example.com']
          }
        },
        {
          id: '2',
          name: 'Payment Summary Q1 2024',
          description: 'Quarterly financial report including all payments and transactions',
          type: 'payments',
          format: 'excel',
          status: 'completed',
          parameters: {
            dateFrom: '2024-01-01',
            dateTo: '2024-03-31',
            filters: {
              status: 'completed',
              payment_method: 'all'
            },
            groupBy: 'payment_method',
            sortBy: 'date'
          },
          fileSize: 3456789,
          downloadUrl: '/reports/payment-summary-q1-2024.xlsx',
          createdAt: '2024-04-02T10:30:00Z',
          generatedAt: '2024-04-02T10:35:00Z',
          expiresAt: '2024-07-02T10:35:00Z',
          createdBy: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@example.com'
          },
          shareSettings: {
            isPublic: true,
            sharedWith: []
          }
        },
        {
          id: '3',
          name: 'Course Progress Analytics',
          description: 'Detailed analytics on student progress across all courses',
          type: 'progress',
          format: 'pdf',
          status: 'generating',
          parameters: {
            dateFrom: '2024-02-01',
            dateTo: '2024-03-31',
            filters: {
              course_id: 'all',
              completion_rate: 'above_50'
            },
            groupBy: 'course',
            sortBy: 'completion_rate'
          },
          createdAt: '2024-04-03T14:15:00Z',
          createdBy: {
            id: 'admin1',
            name: 'Admin User',
            email: 'admin@example.com'
          },
          shareSettings: {
            isPublic: false,
            sharedWith: ['finance@example.com']
          }
        },
        {
          id: '4',
          name: 'Weekly Enrollment Report',
          description: 'Automated weekly report on new enrollments and course registrations',
          type: 'enrollments',
          format: 'csv',
          status: 'scheduled',
          parameters: {
            dateFrom: '2024-03-25',
            dateTo: '2024-03-31',
            filters: {
              status: 'confirmed'
            },
            groupBy: 'course',
            sortBy: 'enrollment_date'
          },
          createdAt: '2024-03-25T08:00:00Z',
          scheduledFor: '2024-04-01T08:00:00Z',
          recurrence: {
            type: 'weekly',
            interval: 1
          },
          createdBy: {
            id: 'system',
            name: 'System',
            email: 'system@example.com'
          },
          shareSettings: {
            isPublic: false,
            sharedWith: ['marketing@example.com', 'sales@example.com']
          }
        },
        {
          id: '5',
          name: 'Failed Login Attempts Report',
          description: 'Security report on failed login attempts and suspicious activities',
          type: 'users',
          format: 'json',
          status: 'failed',
          parameters: {
            dateFrom: '2024-03-20',
            dateTo: '2024-03-27',
            filters: {
              ip_address: 'suspicious_only'
            }
          },
          createdAt: '2024-03-28T16:45:00Z',
          createdBy: {
            id: 'security1',
            name: 'Security Admin',
            email: 'security@example.com'
          },
          shareSettings: {
            isPublic: false,
            sharedWith: ['security@example.com']
          }
        }
      ]

      const mockTemplates: ReportTemplate[] = [
        {
          id: '1',
          name: 'User Activity Report',
          description: 'Track user engagement, login frequency, and activity patterns',
          type: 'users',
          category: 'User Analytics',
          icon: 'users',
          defaultFormat: 'pdf',
          parameters: {
            required: ['date_from', 'date_to'],
            optional: ['role', 'status', 'group_by', 'sort_by']
          },
          sampleData: true
        },
        {
          id: '2',
          name: 'Financial Summary',
          description: 'Comprehensive financial report with revenue, expenses, and projections',
          type: 'financial',
          category: 'Financial',
          icon: 'dollar_sign',
          defaultFormat: 'excel',
          parameters: {
            required: ['date_from', 'date_to'],
            optional: ['payment_method', 'currency', 'group_by']
          },
          sampleData: true
        },
        {
          id: '3',
          name: 'Course Performance',
          description: 'Analyze course completion rates, student progress, and engagement',
          type: 'courses',
          category: 'Academic',
          icon: 'book_open',
          defaultFormat: 'pdf',
          parameters: {
            required: ['date_from', 'date_to'],
            optional: ['course_id', 'instructor', 'completion_threshold']
          },
          sampleData: true
        },
        {
          id: '4',
          name: 'Enrollment Statistics',
          description: 'Track enrollment trends, conversion rates, and demographic data',
          type: 'enrollments',
          category: 'Enrollment',
          icon: 'trending_up',
          defaultFormat: 'csv',
          parameters: {
            required: ['date_from', 'date_to'],
            optional: ['course_category', 'source', 'status']
          },
          sampleData: true
        },
        {
          id: '5',
          name: 'Payment Analytics',
          description: 'Detailed payment analysis including methods, trends, and failures',
          type: 'payments',
          category: 'Financial',
          icon: 'credit_card',
          defaultFormat: 'excel',
          parameters: {
            required: ['date_from', 'date_to'],
            optional: ['payment_method', 'status', 'amount_range']
          },
          sampleData: true
        },
        {
          id: '6',
          name: 'Student Progress Report',
          description: 'Individual and cohort progress tracking with detailed metrics',
          type: 'progress',
          category: 'Academic',
          icon: 'award',
          defaultFormat: 'pdf',
          parameters: {
            required: ['date_from', 'date_to'],
            optional: ['student_id', 'course_id', 'progress_threshold']
          },
          sampleData: true
        }
      ]

      // Apply filters
      let filteredReports = mockReports
      
      if (filters.search) {
        filteredReports = filteredReports.filter(report => 
          report.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          report.description.toLowerCase().includes(filters.search.toLowerCase())
        )
      }
      
      if (filters.type !== 'all') {
        filteredReports = filteredReports.filter(report => report.type === filters.type)
      }
      
      if (filters.status !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === filters.status)
      }
      
      if (filters.format !== 'all') {
        filteredReports = filteredReports.filter(report => report.format === filters.format)
      }
      
      if (filters.createdBy !== 'all') {
        filteredReports = filteredReports.filter(report => report.createdBy.name === filters.createdBy)
      }

      // Pagination
      const startIndex = (currentPage - 1) * reportsPerPage
      const endIndex = startIndex + reportsPerPage
      const paginatedReports = filteredReports.slice(startIndex, endIndex)
      
      setReports(paginatedReports)
      setTemplates(mockTemplates)
      setTotalPages(Math.ceil(filteredReports.length / reportsPerPage))
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reports.map(report => report.id))
    } else {
      setSelectedReports([])
    }
  }

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId])
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId))
    }
  }

  const handleGenerateReport = async (templateId: string) => {
    try {
      setGeneratingReport(templateId)
      // API call to generate report
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      // Add new report to list
      const template = templates.find(t => t.id === templateId)
      if (template) {
        const newReport: Report = {
          id: Date.now().toString(),
          name: `${template.name} - ${new Date().toLocaleDateString()}`,
          description: template.description,
          type: template.type as any,
          format: template.defaultFormat,
          status: 'generating',
          parameters: {
            dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dateTo: new Date().toISOString().split('T')[0],
            filters: {},
          },
          createdAt: new Date().toISOString(),
          createdBy: {
            id: 'current_user',
            name: 'Current User',
            email: 'user@example.com'
          },
          shareSettings: {
            isPublic: false,
            sharedWith: []
          }
        }
        setReports([newReport, ...reports])
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const handleDownloadReport = (report: Report) => {
    if (report.downloadUrl) {
      // Simulate download
      const link = document.createElement('a')
      link.href = report.downloadUrl
      link.download = report.name.replace(/\s+/g, '-').toLowerCase() + '.' + report.format
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShareReport = (reportId: string) => {
    // Implement share functionality
    console.log('Share report:', reportId)
  }

  const handleDeleteReport = async (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      try {
        // API call to delete report
        setReports(reports.filter(report => report.id !== reportId))
        setSelectedReports(selectedReports.filter(id => id !== reportId))
      } catch (error) {
        console.error('Error deleting report:', error)
      }
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      users: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      enrollments: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      payments: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      courses: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      engagement: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      financial: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      custom: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type as keyof typeof colors]}`}>
        {type}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      generating: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      completed: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      failed: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      scheduled: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200'
    }
    const icons = {
      generating: <RefreshCw className="w-3 h-3 animate-spin" />,
      completed: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
      scheduled: <Clock className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const getFormatIcon = (format: string) => {
    const icons = {
      pdf: <FileText className="w-4 h-4 text-red-500" />,
      csv: <FileSpreadsheet className="w-4 h-4 text-green-500" />,
      excel: <FileSpreadsheet className="w-4 h-4 text-blue-500" />,
      json: <FileText className="w-4 h-4 text-purple-500" />
    }
    return icons[format as keyof typeof icons]
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate, schedule, and manage reports and analytics
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
            Export All
          </button>
          
          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {reports.length + 47} {/* Mock total */}
              </p>
              <p className="text-sm text-green-600 mt-1">+8% this month</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {reports.filter(r => {
                  const today = new Date().toDateString()
                  return new Date(r.createdAt).toDateString() === today
                }).length}
              </p>
              <p className="text-sm text-blue-600 mt-1">Active reports</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {reports.filter(r => r.status === 'scheduled').length}
              </p>
              <p className="text-sm text-purple-600 mt-1">Automated reports</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">2.4 GB</p>
              <p className="text-sm text-yellow-600 mt-1">78% of limit</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Reports</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {reports.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileImage className="w-4 h-4" />
                <span>Templates</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {templates.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-african-gold text-african-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Scheduled</span>
                <span className="bg-african-gold/20 text-african-gold px-2 py-1 rounded-full text-xs">
                  {reports.filter(r => r.status === 'scheduled').length}
                </span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Filters */}
      {showFilters && activeTab === 'reports' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
                  placeholder="Search reports..."
                />
              </div>
            </div>
            
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
                <option value="users">Users</option>
                <option value="enrollments">Enrollments</option>
                <option value="payments">Payments</option>
                <option value="courses">Courses</option>
                <option value="progress">Progress</option>
                <option value="engagement">Engagement</option>
                <option value="financial">Financial</option>
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
                <option value="generating">Generating</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format
              </label>
              <select
                value={filters.format}
                onChange={(e) => setFilters({...filters, format: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="excel">Excel</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Created By
              </label>
              <select
                value={filters.createdBy}
                onChange={(e) => setFilters({...filters, createdBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Users</option>
                <option value="Admin User">Admin User</option>
                <option value="Security Admin">Security Admin</option>
                <option value="System">System</option>
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
                onClick={() => setFilters({ search: '', type: 'all', status: 'all', format: 'all', dateFrom: '', dateTo: '', createdBy: 'all' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Content */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reports ({reports.length})
              </h3>
              {selectedReports.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedReports.length} selected
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Bulk Download
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
                      checked={selectedReports.length === reports.length && reports.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(report.id)}
                        onChange={(e) => handleSelectReport(report.id, e.target.checked)}
                        className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {report.description}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">
                            by {report.createdBy.name}
                          </span>
                          {report.recurrence && (
                            <span className="text-xs text-gray-400">
                              • Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getTypeBadge(report.type)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getFormatIcon(report.format)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white uppercase">
                          {report.format}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {report.fileSize ? formatFileSize(report.fileSize) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div>
                        <div>{formatDate(report.createdAt)}</div>
                        {report.generatedAt && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Generated: {formatDate(report.generatedAt)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        {report.status === 'completed' && report.downloadUrl && (
                          <button
                            onClick={() => handleDownloadReport(report)}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleShareReport(report.id)}
                          className="p-1 text-gray-400 hover:text-blue-600"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
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
                Showing {((currentPage - 1) * reportsPerPage) + 1} to {Math.min(currentPage * reportsPerPage, reports.length)} of {reports.length} results
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

      {/* Templates Content */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-african-gold/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-african-gold" />
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                  {template.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Format: {template.defaultFormat.toUpperCase()}
                </span>
                {template.sampleData && (
                  <span className="text-xs text-green-600">Sample data available</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleGenerateReport(template.id)}
                  disabled={generatingReport === template.id}
                  className="flex-1 mr-2 px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {generatingReport === template.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Content */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Scheduled Reports ({reports.filter(r => r.status === 'scheduled').length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.filter(r => r.status === 'scheduled').map((report) => (
              <div key={report.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {report.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {report.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Next run: {formatDateTime(report.scheduledFor!)}
                      </div>
                      {report.recurrence && (
                        <div className="flex items-center">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          {report.recurrence.type} ({report.recurrence.interval})
                        </div>
                      )}
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {report.shareSettings.sharedWith.length} recipients
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
