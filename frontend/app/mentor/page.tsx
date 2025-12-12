'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  Clock,
  Star,
  MessageCircle,
  Video,
  FileText,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Eye,
  Edit,
  Mail,
  Phone
} from 'lucide-react'

interface MentorStats {
  totalStudents: number
  activeStudents: number
  totalCourses: number
  pendingTasks: number
  averageProgress: number
  totalSessions: number
  upcomingSessions: number
  responseRate: number
}

interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  progress: number
  lastActive: string
  courseTitle: string
  status: 'active' | 'inactive' | 'needs_attention'
}

interface Task {
  id: string
  title: string
  studentName: string
  submittedAt: string
  type: 'assignment' | 'quiz' | 'project'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'graded' | 'reviewed'
}

interface Session {
  id: string
  title: string
  studentName: string
  dateTime: string
  duration: number
  type: 'one_on_one' | 'group' | 'workshop'
  status: 'scheduled' | 'completed' | 'cancelled'
}

interface Course {
  id: string
  title: string
  students: number
  progress: number
  nextLesson: string
  status: 'active' | 'completed' | 'draft'
}

export default function MentorDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MentorStats | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchMentorData()
  }, [timeRange])

  const fetchMentorData = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockStats: MentorStats = {
        totalStudents: 45,
        activeStudents: 38,
        totalCourses: 3,
        pendingTasks: 12,
        averageProgress: 72,
        totalSessions: 156,
        upcomingSessions: 8,
        responseRate: 94
      }

      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Ana Silva',
          email: 'ana.silva@example.com',
          avatar: '/avatars/ana.jpg',
          progress: 85,
          lastActive: '2 hours ago',
          courseTitle: 'Web Development Masterclass',
          status: 'active'
        },
        {
          id: '2',
          name: 'Carlos Mendes',
          email: 'carlos.mendes@example.com',
          avatar: '/avatars/carlos.jpg',
          progress: 45,
          lastActive: '1 day ago',
          courseTitle: 'Mobile App Development',
          status: 'needs_attention'
        },
        {
          id: '3',
          name: 'Maria Santos',
          email: 'maria.santos@example.com',
          avatar: '/avatars/maria.jpg',
          progress: 92,
          lastActive: '3 hours ago',
          courseTitle: 'Data Science Fundamentals',
          status: 'active'
        },
        {
          id: '4',
          name: 'João Costa',
          email: 'joao.costa@example.com',
          progress: 28,
          lastActive: '5 days ago',
          courseTitle: 'Web Development Masterclass',
          status: 'inactive'
        }
      ]

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'React Component Assignment',
          studentName: 'Ana Silva',
          submittedAt: '2 hours ago',
          type: 'assignment',
          priority: 'high',
          status: 'pending'
        },
        {
          id: '2',
          title: 'JavaScript Quiz - Module 3',
          studentName: 'Carlos Mendes',
          submittedAt: '5 hours ago',
          type: 'quiz',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: '3',
          title: 'Final Project - Mobile App',
          studentName: 'Maria Santos',
          submittedAt: '1 day ago',
          type: 'project',
          priority: 'high',
          status: 'pending'
        }
      ]

      const mockSessions: Session[] = [
        {
          id: '1',
          title: 'Code Review Session',
          studentName: 'Ana Silva',
          dateTime: '2024-03-22T14:00:00Z',
          duration: 60,
          type: 'one_on_one',
          status: 'scheduled'
        },
        {
          id: '2',
          title: 'React Workshop',
          studentName: 'Group Session',
          dateTime: '2024-03-23T10:00:00Z',
          duration: 120,
          type: 'group',
          status: 'scheduled'
        },
        {
          id: '3',
          title: 'Project Planning',
          studentName: 'Maria Santos',
          dateTime: '2024-03-24T15:00:00Z',
          duration: 45,
          type: 'one_on_one',
          status: 'scheduled'
        }
      ]

      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Web Development Masterclass',
          students: 18,
          progress: 68,
          nextLesson: 'Advanced React Patterns',
          status: 'active'
        },
        {
          id: '2',
          title: 'Mobile App Development',
          students: 12,
          progress: 45,
          nextLesson: 'Navigation & Routing',
          status: 'active'
        },
        {
          id: '3',
          title: 'Data Science Fundamentals',
          students: 15,
          progress: 82,
          nextLesson: 'Machine Learning Intro',
          status: 'active'
        }
      ]

      setStats(mockStats)
      setStudents(mockStudents)
      setTasks(mockTasks)
      setSessions(mockSessions)
      setCourses(mockCourses)
    } catch (error) {
      console.error('Error fetching mentor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      inactive: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
      needs_attention: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      pending: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      graded: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      reviewed: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200',
      scheduled: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      completed: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      cancelled: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      draft: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
    }
    return colors[status as keyof typeof colors] || colors.pending
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      low: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
    }
    return colors[priority as keyof typeof colors]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mentor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your students, courses, and sessions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalStudents}</p>
              <p className="text-sm text-green-600 mt-1">
                {stats?.activeStudents} active
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.pendingTasks}</p>
              <p className="text-sm text-yellow-600 mt-1">Need review</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.averageProgress}%</p>
              <p className="text-sm text-green-600 mt-1">+5% this week</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.responseRate}%</p>
              <p className="text-sm text-blue-600 mt-1">Excellent</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Students</h3>
              <button className="text-sm text-african-gold hover:text-african-gold/80">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((student) => (
              <div key={student.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-african-gold rounded-full flex items-center justify-center text-deep-charcoal text-sm font-bold">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.courseTitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                          {student.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">{student.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{student.progress}%</div>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-african-gold h-2 rounded-full" 
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <Video className="w-5 h-5 mr-3 text-african-gold" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Create Lesson</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-african-gold" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Create Task</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-african-gold" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule Session</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-3 text-african-gold" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Send Message</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-3 text-african-gold" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Download Report</span>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks and Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Tasks</h3>
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                {tasks.length} pending
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.studentName}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-400">{task.type}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{formatDate(task.submittedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Sessions</h3>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                {sessions.length} scheduled
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{session.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.studentName}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{formatDate(session.dateTime)}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{session.duration} min</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Video className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h3>
            <button className="text-sm text-african-gold hover:text-african-gold/80">
              Manage Courses
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {courses.map((course) => (
            <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{course.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Students</span>
                  <span className="font-medium text-gray-900 dark:text-white">{course.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-african-gold h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Next: {course.nextLesson}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
