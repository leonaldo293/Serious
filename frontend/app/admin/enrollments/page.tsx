'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  UserCheck,
  UserX,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react'

interface Enrollment {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  userAvatar?: string
  programId: string
  programTitle: string
  programCategory: string
  mentorId?: string
  mentorName?: string
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'suspended'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  paymentMethod?: 'paypal' | 'whatsapp' | 'manual' | 'free'
  amount: number
  currency: string
  enrolledAt: string
  activatedAt?: string
  completedAt?: string
  cancelledAt?: string
  progress: number
  lessonsCompleted: number
  totalLessons: number
  lastActivityAt?: string
  certificateIssued: boolean
  certificateUrl?: string
  notes?: string
  tags: string[]
  metadata?: Record<string, any>
}

interface Filters {
  search: string
  status: string
  paymentStatus: string
  program: string
  mentor: string
  dateFrom: string
  dateTo: string
  hasCertificate: string
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEnrollments, setSelectedEnrollments] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    program: 'all',
    mentor: 'all',
    dateFrom: '',
    dateTo: '',
    hasCertificate: 'all'
  })

  const enrollmentsPerPage = 20

  useEffect(() => {
    fetchEnrollments()
  }, [currentPage, filters])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      
      // Mock API call - replace with actual API
      const mockEnrollments: Enrollment[] = [
        {
          id: '1',
          userId: 'user1',
          userName: 'João Silva',
          userEmail: 'joao.silva@example.com',
          userPhone: '+239 999 123 456',
          userAvatar: '/avatars/joao.jpg',
          programId: '1',
          programTitle: 'Web Development Masterclass',
          programCategory: 'Web Development',
          mentorId: 'mentor1',
          mentorName: 'John Smith',
          status: 'active',
          paymentStatus: 'paid',
          paymentMethod: 'paypal',
          amount: 99.99,
          currency: 'USD',
          enrolledAt: '2024-03-01T10:30:00Z',
          activatedAt: '2024-03-01T10:35:00Z',
          progress: 75,
          lessonsCompleted: 34,
          totalLessons: 45,
          lastActivityAt: '2024-03-20T14:15:00Z',
          certificateIssued: false,
          tags: ['premium', 'active'],
          metadata: {
            source: 'website',
            referral: 'friend'
          }
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Maria Santos',
          userEmail: 'maria.santos@example.com',
          userPhone: '+239 999 789 012',
          programId: '2',
          programTitle: 'Mobile App Development with React Native',
          programCategory: 'Mobile Development',
          mentorId: 'mentor2',
          mentorName: 'Sarah Johnson',
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'whatsapp',
          amount: 149.99,
          currency: 'USD',
          enrolledAt: '2024-02-15T09:15:00Z',
          activatedAt: '2024-02-15T09:20:00Z',
          completedAt: '2024-03-18T16:30:00Z',
          progress: 100,
          lessonsCompleted: 38,
          totalLessons: 38,
          lastActivityAt: '2024-03-18T16:30:00Z',
          certificateIssued: true,
          certificateUrl: '/certificates/maria-santos-mobile-app.pdf',
          tags: ['completed', 'certified'],
          metadata: {
            source: 'social_media',
            completionTime: '32 days'
          }
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'Pedro Mendes',
          userEmail: 'pedro.mendes@example.com',
          programId: '3',
          programTitle: 'Data Science Fundamentals',
          programCategory: 'Data Science',
          mentorId: 'mentor3',
          mentorName: 'Dr. Michael Chen',
          status: 'active',
          paymentStatus: 'paid',
          paymentMethod: 'paypal',
          amount: 0,
          currency: 'USD',
          enrolledAt: '2024-03-10T11:45:00Z',
          activatedAt: '2024-03-10T11:50:00Z',
          progress: 45,
          lessonsCompleted: 14,
          totalLessons: 30,
          lastActivityAt: '2024-03-19T10:20:00Z',
          certificateIssued: false,
          tags: ['free', 'active'],
          metadata: {
            source: 'organic'
          }
        },
        {
          id: '4',
          userId: 'user4',
          userName: 'Ana Costa',
          userEmail: 'ana.costa@example.com',
          programId: '1',
          programTitle: 'Web Development Masterclass',
          programCategory: 'Web Development',
          mentorId: 'mentor1',
          mentorName: 'John Smith',
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: 'paypal',
          amount: 99.99,
          currency: 'USD',
          enrolledAt: '2024-03-20T15:30:00Z',
          progress: 0,
          lessonsCompleted: 0,
          totalLessons: 45,
          certificateIssued: false,
          tags: ['pending_payment'],
          metadata: {
            source: 'website'
          }
        },
        {
          id: '5',
          userId: 'user5',
          userName: 'Carlos Ferreira',
          userEmail: 'carlos.ferreira@example.com',
          programId: '4',
          programTitle: 'UI/UX Design Principles',
          programCategory: 'Design',
          mentorId: 'mentor4',
          mentorName: 'Emily Davis',
          status: 'cancelled',
          paymentStatus: 'refunded',
          paymentMethod: 'paypal',
          amount: 79.99,
          currency: 'USD',
          enrolledAt: '2024-02-20T13:20:00Z',
          activatedAt: '2024-02-20T13:25:00Z',
          cancelledAt: '2024-03-05T09:15:00Z',
          progress: 15,
          lessonsCompleted: 4,
          totalLessons: 25,
          lastActivityAt: '2024-03-01T16:45:00Z',
          certificateIssued: false,
          tags: ['cancelled', 'refunded'],
          notes: 'Student requested refund due to personal reasons',
          metadata: {
            refundReason: 'personal',
            refundDate: '2024-03-05T09:15:00Z'
          }
        }
      ]

      // Apply filters
      let filteredEnrollments = mockEnrollments
      
      if (filters.search) {
        filteredEnrollments = filteredEnrollments.filter(enrollment => 
          enrollment.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
          enrollment.userEmail.toLowerCase().includes(filters.search.toLowerCase()) ||
          enrollment.programTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
          enrollment.mentorName?.toLowerCase().includes(filters.search.toLowerCase()) ||
          enrollment.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
        )
      }
      
      if (filters.status !== 'all') {
        filteredEnrollments = filteredEnrollments.filter(enrollment => enrollment.status === filters.status)
      }
      
      if (filters.paymentStatus !== 'all') {
        filteredEnrollments = filteredEnrollments.filter(enrollment => enrollment.paymentStatus === filters.paymentStatus)
      }
      
      if (filters.program !== 'all') {
        filteredEnrollments = filteredEnrollments.filter(enrollment => enrollment.programId === filters.program)
      }
      
      if (filters.mentor !== 'all') {
        filteredEnrollments = filteredEnrollments.filter(enrollment => enrollment.mentorId === filters.mentor)
      }
      
      if (filters.hasCertificate !== 'all') {
        if (filters.hasCertificate === 'yes') {
          filteredEnrollments = filteredEnrollments.filter(enrollment => enrollment.certificateIssued)
        } else if (filters.hasCertificate === 'no') {
          filteredEnrollments = filteredEnrollments.filter(enrollment => !enrollment.certificateIssued)
        }
      }

      // Pagination
      const startIndex = (currentPage - 1) * enrollmentsPerPage
      const endIndex = startIndex + enrollmentsPerPage
      const paginatedEnrollments = filteredEnrollments.slice(startIndex, endIndex)
      
      setEnrollments(paginatedEnrollments)
      setTotalPages(Math.ceil(filteredEnrollments.length / enrollmentsPerPage))
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEnrollments(enrollments.map(enrollment => enrollment.id))
    } else {
      setSelectedEnrollments([])
    }
  }

  const handleSelectEnrollment = (enrollmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedEnrollments([...selectedEnrollments, enrollmentId])
    } else {
      setSelectedEnrollments(selectedEnrollments.filter(id => id !== enrollmentId))
    }
  }

  const handleActivateEnrollment = async (enrollmentId: string) => {
    try {
      // API call to activate enrollment
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === enrollmentId 
          ? { 
              ...enrollment, 
              status: 'active',
              activatedAt: new Date().toISOString()
            }
          : enrollment
      ))
    } catch (error) {
      console.error('Error activating enrollment:', error)
    }
  }

  const handleCancelEnrollment = async (enrollmentId: string) => {
    if (confirm('Are you sure you want to cancel this enrollment?')) {
      try {
        // API call to cancel enrollment
        setEnrollments(enrollments.map(enrollment => 
          enrollment.id === enrollmentId 
            ? { 
                ...enrollment, 
                status: 'cancelled',
                cancelledAt: new Date().toISOString()
              }
            : enrollment
        ))
      } catch (error) {
        console.error('Error cancelling enrollment:', error)
      }
    }
  }

  const handleIssueCertificate = async (enrollmentId: string) => {
    try {
      // API call to issue certificate
      setEnrollments(enrollments.map(enrollment => 
        enrollment.id === enrollmentId 
          ? { 
              ...enrollment, 
              certificateIssued: true,
              certificateUrl: `/certificates/${enrollment.userName.replace(' ', '-').toLowerCase()}.pdf`
            }
          : enrollment
      ))
    } catch (error) {
      console.error('Error issuing certificate:', error)
    }
  }

  const handleSendReminder = async (enrollmentId: string) => {
    try {
      // API call to send reminder
      alert('Reminder sent successfully!')
    } catch (error) {
      console.error('Error sending reminder:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      suspended: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      active: <UserCheck className="w-3 h-3" />,
      completed: <CheckCircle className="w-3 h-3" />,
      cancelled: <UserX className="w-3 h-3" />,
      suspended: <AlertCircle className="w-3 h-3" />
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      refunded: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      failed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enrollments</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage student enrollments, progress, and certificates
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'table' 
                  ? 'bg-african-gold text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 text-sm ${
                viewMode === 'cards' 
                  ? 'bg-african-gold text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Cards
            </button>
          </div>
          
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
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {enrollments.filter(e => e.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {enrollments.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(
                  enrollments
                    .filter(e => e.paymentStatus === 'paid')
                    .reduce((sum, e) => sum + e.amount, 0),
                  'USD'
                )}
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
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
                  placeholder="Search enrollments..."
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
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Payment</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
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
                <option value="4">UI/UX Design Principles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mentor
              </label>
              <select
                value={filters.mentor}
                onChange={(e) => setFilters({...filters, mentor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Mentors</option>
                <option value="mentor1">John Smith</option>
                <option value="mentor2">Sarah Johnson</option>
                <option value="mentor3">Dr. Michael Chen</option>
                <option value="mentor4">Emily Davis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Certificate
              </label>
              <select
                value={filters.hasCertificate}
                onChange={(e) => setFilters({...filters, hasCertificate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All</option>
                <option value="yes">Issued</option>
                <option value="no">Not Issued</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ search: '', status: 'all', paymentStatus: 'all', program: 'all', mentor: 'all', dateFrom: '', dateTo: '', hasCertificate: 'all' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollments Display */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Enrollments ({enrollments.length})
              </h3>
              {selectedEnrollments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedEnrollments.length} selected
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Send Reminder
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Cancel Selected
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
                      checked={selectedEnrollments.length === enrollments.length && enrollments.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enrolled
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEnrollments.includes(enrollment.id)}
                        onChange={(e) => handleSelectEnrollment(enrollment.id, e.target.checked)}
                        className="rounded border-gray-300 text-african-gold focus:ring-african-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-sm font-bold">
                          {enrollment.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {enrollment.userName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {enrollment.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {enrollment.programTitle}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {enrollment.mentorName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getPaymentStatusBadge(enrollment.paymentStatus)}
                        <div className="text-sm text-gray-900 dark:text-white">
                          {enrollment.amount > 0 ? formatCurrency(enrollment.amount, enrollment.currency) : 'Free'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-african-gold h-2 rounded-full" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{enrollment.progress}%</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {enrollment.lessonsCompleted}/{enrollment.totalLessons} lessons
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {formatDate(enrollment.enrolledAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {enrollment.status === 'pending' && (
                          <button
                            onClick={() => handleActivateEnrollment(enrollment.id)}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Activate Enrollment"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(enrollment.status === 'active' || enrollment.status === 'completed') && (
                          <button
                            onClick={() => handleSendReminder(enrollment.id)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                            title="Send Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        
                        {enrollment.status === 'completed' && !enrollment.certificateIssued && (
                          <button
                            onClick={() => handleIssueCertificate(enrollment.id)}
                            className="p-1 text-purple-600 hover:text-purple-700"
                            title="Issue Certificate"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        {(enrollment.status === 'active' || enrollment.status === 'pending') && (
                          <button
                            onClick={() => handleCancelEnrollment(enrollment.id)}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Cancel Enrollment"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
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
                Showing {((currentPage - 1) * enrollmentsPerPage) + 1} to {Math.min(currentPage * enrollmentsPerPage, enrollments.length)} of {enrollments.length} results
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
      ) : (
        // Cards View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-lg font-bold">
                      {enrollment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {enrollment.userName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {enrollment.userEmail}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(enrollment.status)}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {enrollment.programTitle}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Mentor: {enrollment.mentorName}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Payment</span>
                    <div className="text-right">
                      {getPaymentStatusBadge(enrollment.paymentStatus)}
                      <div className="text-sm text-gray-900 dark:text-white">
                        {enrollment.amount > 0 ? formatCurrency(enrollment.amount, enrollment.currency) : 'Free'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="text-sm text-gray-900 dark:text-white">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-african-gold h-2 rounded-full" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {enrollment.lessonsCompleted}/{enrollment.totalLessons} lessons completed
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Enrolled {formatDate(enrollment.enrolledAt)}
                  </div>
                  <div className="flex space-x-2">
                    {enrollment.status === 'pending' && (
                      <button
                        onClick={() => handleActivateEnrollment(enrollment.id)}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="Activate"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    
                    {enrollment.status === 'completed' && !enrollment.certificateIssued && (
                      <button
                        onClick={() => handleIssueCertificate(enrollment.id)}
                        className="p-1 text-purple-600 hover:text-purple-700"
                        title="Issue Certificate"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
