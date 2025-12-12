'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  BookOpen, 
  Clock,
  Activity,
  Eye,
  MousePointer,
  Target,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  PlayCircle,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    totalCourses: number
    totalEnrollments: number
    completionRate: number
    averageSessionDuration: number
    bounceRate: number
  }
  userMetrics: {
    newUsers: number[]
    activeUsers: number[]
    userRetention: number[]
    userDemographics: {
      age: { range: string; count: number }[]
      location: { country: string; count: number }[]
      device: { type: string; count: number }[]
    }
  }
  courseMetrics: {
    enrollments: number[]
    completions: number[]
    revenue: number[]
    popularCourses: { title: string; enrollments: number; completionRate: number }[]
    categoryPerformance: { category: string; enrollments: number; revenue: number }[]
  }
  engagementMetrics: {
    pageViews: number[]
    sessionDuration: number[]
    interactionRate: number[]
    contentEngagement: {
      lessons: { views: number; completions: number }
      quizzes: { attempts: number; averageScore: number }
      discussions: { posts: number; comments: number }
    }
  }
  financialMetrics: {
    revenue: number[]
    costs: number[]
    profit: number[]
    paymentMethods: { method: string; amount: number; percentage: number }[]
    subscriptionRevenue: { plan: string; revenue: number; users: number }[]
  }
  timeRange: string
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  format?: 'number' | 'currency' | 'percentage' | 'duration'
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Mock API calls - replace with actual API
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 12847,
          activeUsers: 8934,
          totalRevenue: 284750,
          totalCourses: 12,
          totalEnrollments: 3456,
          completionRate: 78.5,
          averageSessionDuration: 1245, // in seconds
          bounceRate: 34.2
        },
        userMetrics: {
          newUsers: [45, 67, 89, 123, 156, 189, 234, 267, 298, 312, 345, 378],
          activeUsers: [2345, 2567, 2789, 2901, 3123, 3345, 3567, 3789, 3901, 4012, 4123, 4234],
          userRetention: [92.5, 91.2, 90.8, 89.5, 88.2, 87.9, 86.5, 85.2, 84.8, 83.5, 82.2, 81.9],
          userDemographics: {
            age: [
              { range: '18-24', count: 2345 },
              { range: '25-34', count: 4567 },
              { range: '35-44', count: 3456 },
              { range: '45-54', count: 1890 },
              { range: '55+', count: 589 }
            ],
            location: [
              { country: 'United States', count: 4567 },
              { country: 'United Kingdom', count: 2345 },
              { country: 'Canada', count: 1890 },
              { country: 'Australia', count: 1234 },
              { country: 'Germany', count: 987 },
              { country: 'France', count: 876 },
              { country: 'Others', count: 948 }
            ],
            device: [
              { type: 'Desktop', count: 5678 },
              { type: 'Mobile', count: 4567 },
              { type: 'Tablet', count: 1234 },
              { type: 'Other', count: 1368 }
            ]
          }
        },
        courseMetrics: {
          enrollments: [123, 156, 189, 234, 267, 298, 312, 345, 378, 401, 423, 445],
          completions: [89, 123, 156, 189, 223, 256, 289, 312, 345, 367, 389, 401],
          revenue: [12345, 14567, 16789, 18901, 20123, 22345, 24567, 26789, 28901, 30123, 32345, 34567],
          popularCourses: [
            { title: 'Web Development Masterclass', enrollments: 1234, completionRate: 85.5 },
            { title: 'Mobile App Development', enrollments: 987, completionRate: 78.2 },
            { title: 'Data Science Fundamentals', enrollments: 876, completionRate: 92.1 },
            { title: 'UI/UX Design Principles', enrollments: 765, completionRate: 88.7 },
            { title: 'React Advanced Patterns', enrollments: 654, completionRate: 76.3 }
          ],
          categoryPerformance: [
            { category: 'Web Development', enrollments: 2345, revenue: 56789 },
            { category: 'Mobile Development', enrollments: 1890, revenue: 45678 },
            { category: 'Data Science', enrollments: 1567, revenue: 37890 },
            { category: 'Design', enrollments: 1234, revenue: 29876 },
            { category: 'DevOps', enrollments: 987, revenue: 23456 }
          ]
        },
        engagementMetrics: {
          pageViews: [12345, 14567, 16789, 18901, 20123, 22345, 24567, 26789, 28901, 30123, 32345, 34567],
          sessionDuration: [1234, 1256, 1278, 1290, 1312, 1334, 1356, 1378, 1390, 1412, 1434, 1456],
          interactionRate: [45.2, 46.5, 47.8, 49.1, 50.4, 51.7, 53.0, 54.3, 55.6, 56.9, 58.2, 59.5],
          contentEngagement: {
            lessons: { views: 123456, completions: 98765 },
            quizzes: { attempts: 23456, averageScore: 78.5 },
            discussions: { posts: 3456, comments: 12345 }
          }
        },
        financialMetrics: {
          revenue: [12345, 14567, 16789, 18901, 20123, 22345, 24567, 26789, 28901, 30123, 32345, 34567],
          costs: [5678, 5890, 6012, 6134, 6256, 6378, 6490, 6612, 6734, 6856, 6978, 7100],
          profit: [6667, 8677, 10777, 12767, 14867, 16967, 19077, 21177, 23167, 25267, 27367, 29467],
          paymentMethods: [
            { method: 'Credit Card', amount: 156789, percentage: 55.1 },
            { method: 'PayPal', amount: 89012, percentage: 31.3 },
            { method: 'Bank Transfer', amount: 28456, percentage: 10.0 },
            { method: 'Cryptocurrency', amount: 9987, percentage: 3.5 },
            { method: 'Other', amount: 506, percentage: 0.1 }
          ],
          subscriptionRevenue: [
            { plan: 'Basic', revenue: 45678, users: 1234 },
            { plan: 'Pro', revenue: 89012, users: 567 },
            { plan: 'Enterprise', revenue: 150000, users: 89 }
          ]
        },
        timeRange: '7d'
      }

      setData(mockData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchAnalytics()
  }

  const formatValue = (value: number, format?: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'duration':
        const hours = Math.floor(value / 3600)
        const minutes = Math.floor((value % 3600) / 60)
        return `${hours}h ${minutes}m`
      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(value)
    }
  }

  const getChangeIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return <ArrowUpRight className="w-4 h-4 text-green-500" />
      case 'decrease':
        return <ArrowDownRight className="w-4 h-4 text-red-500" />
      case 'neutral':
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getChangeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-500'
      case 'decrease':
        return 'text-red-500'
      case 'neutral':
        return 'text-gray-500'
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Desktop':
        return <Monitor className="w-4 h-4" />
      case 'Mobile':
        return <Smartphone className="w-4 h-4" />
      case 'Tablet':
        return <Tablet className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  const metricCards: MetricCard[] = data ? [
    {
      title: 'Total Users',
      value: data.overview.totalUsers,
      change: 12.5,
      changeType: 'increase',
      icon: <Users className="w-6 h-6" />,
      format: 'number'
    },
    {
      title: 'Active Users',
      value: data.overview.activeUsers,
      change: 8.3,
      changeType: 'increase',
      icon: <Activity className="w-6 h-6" />,
      format: 'number'
    },
    {
      title: 'Total Revenue',
      value: data.overview.totalRevenue,
      change: 15.7,
      changeType: 'increase',
      icon: <DollarSign className="w-6 h-6" />,
      format: 'currency'
    },
    {
      title: 'Completion Rate',
      value: data.overview.completionRate,
      change: -2.1,
      changeType: 'decrease',
      icon: <Target className="w-6 h-6" />,
      format: 'percentage'
    },
    {
      title: 'Avg Session Duration',
      value: data.overview.averageSessionDuration,
      change: 5.4,
      changeType: 'increase',
      icon: <Clock className="w-6 h-6" />,
      format: 'duration'
    },
    {
      title: 'Bounce Rate',
      value: data.overview.bounceRate,
      change: -3.2,
      changeType: 'increase',
      icon: <TrendingDown className="w-6 h-6" />,
      format: 'percentage'
    }
  ] : []

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time insights and performance metrics
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
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-african-gold dark:bg-gray-700 dark:text-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-african-gold/10 rounded-lg">
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatValue(card.value as number, card.format)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center ${getChangeColor(card.changeType)}`}>
                  {getChangeIcon(card.changeType)}
                  <span className="text-sm font-medium ml-1">
                    {card.change > 0 ? '+' : ''}{card.change}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  vs last period
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
              <option>New Users</option>
              <option>Active Users</option>
              <option>Retention Rate</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {data?.userMetrics.newUsers.reduce((a, b) => a + b, 0)} new users this period
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
            <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
              <option>Revenue</option>
              <option>Profit</option>
              <option>Costs</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Chart visualization</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {formatValue(data?.financialMetrics.revenue.reduce((a, b) => a + b, 0) || 0, 'currency')} total revenue
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Age Distribution</h3>
          <div className="space-y-3">
            {data?.userMetrics.userDemographics.age.map((age, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{age.range}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-african-gold h-2 rounded-full" 
                      style={{ width: `${(age.count / data.userMetrics.userDemographics.age.reduce((a, b) => a + b.count, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {age.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Geographic Distribution</h3>
          <div className="space-y-3">
            {data?.userMetrics.userDemographics.location.slice(0, 5).map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{location.country}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(location.count / data.userMetrics.userDemographics.location.reduce((a, b) => a + b.count, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {location.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Distribution</h3>
          <div className="space-y-3">
            {data?.userMetrics.userDemographics.device.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getDeviceIcon(device.type)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">{device.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(device.count / data.userMetrics.userDemographics.device.reduce((a, b) => a + b.count, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                    {device.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Performance</h3>
          <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white">
            <option>Popular Courses</option>
            <option>Category Performance</option>
            <option>Completion Rates</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Course</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Enrollments</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Completion Rate</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.courseMetrics.popularCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">{course.enrollments}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 dark:text-white mr-2">{course.completionRate}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatValue(course.enrollments * 99, 'currency')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <PlayCircle className="w-8 h-8 text-african-gold" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Lesson Views</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total lesson completions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatValue(data?.engagementMetrics.contentEngagement.lessons.views || 0, 'number')}
                </p>
                <p className="text-xs text-green-600">
                  {((data?.engagementMetrics.contentEngagement.lessons.completions || 0) / (data?.engagementMetrics.contentEngagement.lessons.views || 1) * 100).toFixed(1)}% completion
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Quiz Attempts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average score</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatValue(data?.engagementMetrics.contentEngagement.quizzes.attempts || 0, 'number')}
                </p>
                <p className="text-xs text-blue-600">
                  {data?.engagementMetrics.contentEngagement.quizzes.averageScore}% avg score
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Discussions</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Posts and comments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatValue((data?.engagementMetrics.contentEngagement.discussions.posts || 0) + (data?.engagementMetrics.contentEngagement.discussions.comments || 0), 'number')}
                </p>
                <p className="text-xs text-purple-600">
                  {data?.engagementMetrics.contentEngagement.discussions.posts} posts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This period</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatValue(data?.financialMetrics.revenue.reduce((a, b) => a + b, 0) || 0, 'currency')}
                </p>
                <p className="text-xs text-green-600">+15.7% vs last period</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Net Profit</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">After costs</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatValue(data?.financialMetrics.profit.reduce((a, b) => a + b, 0) || 0, 'currency')}
                </p>
                <p className="text-xs text-blue-600">68.5% margin</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Revenue/User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Per active user</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatValue((data?.financialMetrics.revenue.reduce((a, b) => a + b, 0) || 0) / (data?.overview.activeUsers || 1), 'currency')}
                </p>
                <p className="text-xs text-purple-600">+5.2% vs last period</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {data?.financialMetrics.paymentMethods.map((method, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <div className="w-12 h-12 bg-african-gold/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-african-gold" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{method.method}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {formatValue(method.amount, 'currency')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{method.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
