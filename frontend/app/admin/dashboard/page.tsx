'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { Users, BookOpen, TrendingUp, DollarSign, Award } from 'lucide-react';
import { AnalyticsAPI } from '@/lib/api'

// Tipos específicos para os dados
interface SalesData {
  month: string
  users: number
  revenue: number
}

interface CourseData {
  [key: string]: string | number // Index signature para compatibilidade com Recharts
  name: string
  value: number
  fill: string
}

interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeStudents: number;
  completionRate: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeStudents: 0,
    completionRate: 0,
    monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [growthData, setGrowthData] = useState<SalesData[]>([]);
  const [courseCompletionData, setCourseCompletionData] = useState<CourseData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Admin API: Fetching dashboard overview");
      
      const response = await AnalyticsAPI.getOverview();
      console.log("Admin API dashboard response:", response);
      
      // Update stats
      setStats({
        totalUsers: response?.totalUsers || 0,
        totalCourses: response?.totalCourses || 0,
        totalRevenue: response?.totalRevenue || 0,
        activeStudents: response?.activeStudents || 0,
        completionRate: response?.completionRate || 0,
        monthlyGrowth: response?.monthlyGrowth || 0,
      });

      // Fetch additional data
      const [salesData, courseData] = await Promise.all([
        AnalyticsAPI.getSalesData({ period: 'month' }),
        AnalyticsAPI.getCoursePopularity()
      ]);

      console.log("Admin API sales data:", salesData);
      console.log("Admin API course data:", courseData);

      setGrowthData(Array.isArray(salesData) ? salesData : []);
      setCourseCompletionData(Array.isArray(courseData) ? courseData : []);
      
    } catch (error) {
      console.error('Admin API Dashboard Error:', error);
      // Fallback to mock data
      setStats({
        totalUsers: 1234,
        totalCourses: 45,
        totalRevenue: 98765,
        activeStudents: 892,
        completionRate: 78.5,
        monthlyGrowth: 12.3,
      });
      setGrowthData([
        { month: 'Jan', users: 400, revenue: 2400 },
        { month: 'Feb', users: 300, revenue: 1398 },
        { month: 'Mar', users: 600, revenue: 3800 },
        { month: 'Apr', users: 800, revenue: 3908 },
        { month: 'May', users: 700, revenue: 4800 },
        { month: 'Jun', users: 900, revenue: 3800 },
      ]);
      setCourseCompletionData([
        { name: 'Web Dev', value: 400, fill: '#00B6A1' },
        { name: 'React', value: 300, fill: '#D4A017' },
        { name: 'Node.js', value: 300, fill: '#0D0D0D' },
        { name: 'Python', value: 200, fill: '#F7F6F3' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Cursos Ativos',
      value: stats.totalCourses.toString(),
      change: '+3',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Receita Total',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      change: '+23%',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Alunos Ativos',
      value: stats.activeStudents.toLocaleString(),
      change: '+8%',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Bem-vindo, {user?.firstName}! Aqui está um resumo da sua plataforma.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                {card.icon}
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {card.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Crescimento Mensal
            </h2>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#00B6A1" 
                  strokeWidth={2}
                  dot={{ fill: '#00B6A1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#D4A017" 
                  strokeWidth={2}
                  dot={{ fill: '#D4A017', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Taxa de Conclusão
            </h2>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseCompletionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {courseCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {courseCompletionData.map((course, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: course.fill }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {course.name}: {course.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Atividade Recente
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Novo usuário registrado
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Há {index + 1} {index === 0 ? 'minuto' : 'minutos'} atrás
                </p>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Sistema
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
