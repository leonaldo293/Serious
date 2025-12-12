'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Play, 
  CheckSquare, 
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Award,
  Target,
  Download,
  PlayCircle,
  FileText,
  MessageCircle,
  Users,
  Video,
  BarChart3,
  Activity,
  Bell,
  Settings,
  HelpCircle
} from 'lucide-react'

interface StudentStats {
  totalCourses: number
  completedCourses: number
  inProgressCourses: number
  totalLessons: number
  completedLessons: number
  pendingTasks: number
  averageProgress: number
  totalHours: number
  certificates: number
}

interface Course {
  id: string
  title: string
  instructor: string
  thumbnail: string
  progress: number
  totalLessons: number
  completedLessons: number
  status: 'active' | 'completed' | 'locked'
  nextLesson?: string
  estimatedTime: string
  category: string
  rating: number
  enrolledAt: string
  lastAccessed: string
}

interface Task {
  id: string
  title: string
  courseTitle: string
  dueDate: string
  type: 'assignment' | 'quiz' | 'project'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
  feedback?: string
}

interface Session {
  id: string
  title: string
  instructor: string
  dateTime: string
  duration: number
  type: 'live' | 'recorded' | 'workshop'
  status: 'upcoming' | 'live' | 'completed'
  joinUrl?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  category: string
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockStats: StudentStats = {
        totalCourses: 3,
        completedCourses: 1,
        inProgressCourses: 2,
        totalLessons: 45,
        completedLessons: 28,
        pendingTasks: 5,
        averageProgress: 68,
        totalHours: 24,
        certificates: 1
      }

      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Web Development Masterclass',
          instructor: 'John Smith',
          thumbnail: '/courses/web-dev.jpg',
          progress: 85,
          totalLessons: 24,
          completedLessons: 20,
          status: 'active',
          nextLesson: 'Advanced React Patterns',
          estimatedTime: '2h 30m',
          category: 'Web Development',
          rating: 4.8,
          enrolledAt: '2024-01-15T10:30:00Z',
          lastAccessed: '2024-03-20T14:15:00Z'
        },
        {
          id: '2',
          title: 'Mobile App Development',
          instructor: 'Sarah Johnson',
          thumbnail: '/courses/mobile-dev.jpg',
          progress: 45,
          totalLessons: 18,
          completedLessons: 8,
          status: 'active',
          nextLesson: 'Navigation & Routing',
          estimatedTime: '1h 45m',
          category: 'Mobile Development',
          rating: 4.6,
          enrolledAt: '2024-02-01T09:15:00Z',
          lastAccessed: '2024-03-19T16:30:00Z'
        },
        {
          id: '3',
          title: 'Data Science Fundamentals',
          instructor: 'Dr. Michael Chen',
          thumbnail: '/courses/data-science.jpg',
          progress: 100,
          totalLessons: 15,
          completedLessons: 15,
          status: 'completed',
          estimatedTime: '3h',
          category: 'Data Science',
          rating: 4.9,
          enrolledAt: '2023-12-10T11:45:00Z',
          lastAccessed: '2024-03-18T10:20:00Z'
        }
      ]

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'React Component Assignment',
          courseTitle: 'Web Development Masterclass',
          dueDate: '2024-03-25T23:59:00Z',
          type: 'assignment',
          priority: 'high',
          status: 'pending'
        },
        {
          id: '2',
          title: 'JavaScript Quiz - Module 3',
          courseTitle: 'Web Development Masterclass',
          dueDate: '2024-03-22T23:59:00Z',
          type: 'quiz',
          priority: 'medium',
          status: 'pending'
        },
        {
          id: '3',
          title: 'Mobile App UI Design',
          courseTitle: 'Mobile App Development',
          dueDate: '2024-03-28T23:59:00Z',
          type: 'project',
          priority: 'high',
          status: 'pending'
        },
        {
          id: '4',
          title: 'Data Analysis Project',
          courseTitle: 'Data Science Fundamentals',
          dueDate: '2024-03-15T23:59:00Z',
          type: 'project',
          priority: 'medium',
          status: 'graded',
          grade: 92,
          feedback: 'Excellent analysis and presentation!'
        },
        {
          id: '5',
          title: 'Python Basics Quiz',
          courseTitle: 'Data Science Fundamentals',
          dueDate: '2024-02-28T23:59:00Z',
          type: 'quiz',
          priority: 'low',
          status: 'graded',
          grade: 88
        }
      ]

      const mockSessions: Session[] = [
        {
          id: '1',
          title: 'React Hooks Deep Dive',
          instructor: 'John Smith',
          dateTime: '2024-03-22T14:00:00Z',
          duration: 90,
          type: 'live',
          status: 'upcoming',
          joinUrl: 'https://zoom.us/j/123456789'
        },
        {
          id: '2',
          title: 'Mobile App Workshop',
          instructor: 'Sarah Johnson',
          dateTime: '2024-03-23T10:00:00Z',
          duration: 120,
          type: 'workshop',
          status: 'upcoming',
          joinUrl: 'https://zoom.us/j/987654321'
        },
        {
          id: '3',
          title: 'Data Science Q&A',
          instructor: 'Dr. Michael Chen',
          dateTime: '2024-03-24T15:00:00Z',
          duration: 60,
          type: 'live',
          status: 'upcoming'
        }
      ]

      const mockAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Course Completed',
          description: 'Successfully completed your first course',
          icon: '🎓',
          unlockedAt: '2024-03-18T10:20:00Z',
          category: 'milestone'
        },
        {
          id: '2',
          title: 'Fast Learner',
          description: 'Completed 5 lessons in one day',
          icon: '⚡',
          unlockedAt: '2024-03-15T16:45:00Z',
          category: 'speed'
        },
        {
          id: '3',
          title: 'Perfect Score',
          description: 'Got 100% on a quiz',
          icon: '🏆',
          unlockedAt: '2024-03-10T14:30:00Z',
          category: 'academic'
        }
      ]

      setStats(mockStats)
      setCourses(mockCourses)
      setTasks(mockTasks)
      setSessions(mockSessions)
      setAchievements(mockAchievements)
    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      completed: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      locked: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
      pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      submitted: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      graded: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      upcoming: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      live: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
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
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and manage your learning journey
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-african-gold text-white rounded-lg hover:opacity-90 transition-opacity">
            Download Progress Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.inProgressCourses}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stats?.totalCourses} total enrolled
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Lessons</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.completedLessons}</p>
              <p className="text-sm text-green-600 mt-1">
                {Math.round((stats?.completedLessons || 0) / (stats?.totalLessons || 1) * 100)}% complete
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <PlayCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.pendingTasks}</p>
              <p className="text-sm text-yellow-600 mt-1">Need attention</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats?.certificates}</p>
              <p className="text-sm text-purple-600 mt-1">Achievements earned</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Courses */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h3>
              <button className="text-sm text-african-gold hover:text-african-gold/80">
                Browse Courses
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {courses.map((course) => (
              <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {course.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {course.instructor} • {course.category}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        <span>⭐ {course.rating}</span>
                        <span>{course.estimatedTime}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-african-gold h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    {course.nextLesson && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Next: {course.nextLesson}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
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
                {tasks.filter(t => t.status === 'pending').length} pending
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.filter(task => task.status === 'pending').map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{task.courseTitle}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Due {formatDate(task.dueDate)}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{task.type}</span>
                    </div>
                  </div>
                  <button className="p-2 text-african-gold hover:bg-african-gold/10 rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
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
                {sessions.filter(s => s.status === 'upcoming').length} scheduled
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.filter(session => session.status === 'upcoming').map((session) => (
              <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{session.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.instructor}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{formatDateTime(session.dateTime)}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{session.duration} min</span>
                    </div>
                  </div>
                  {session.joinUrl ? (
                    <button className="p-2 text-african-gold hover:bg-african-gold/10 rounded-lg transition-colors">
                      <Video className="w-4 h-4" />
                    </button>
                  ) : (
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Learning Progress Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-african-gold mb-2">{stats?.averageProgress}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Progress</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
                <div 
                  className="bg-african-gold h-3 rounded-full" 
                  style={{ width: `${stats?.averageProgress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats?.totalHours}h</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Learning Time</p>
              <div className="flex items-center justify-center space-x-1 mt-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">2.5h daily average</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats?.completedCourses}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</p>
              <div className="flex items-center justify-center space-x-1 mt-3">
                <Award className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Keep it up!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
