'use client'

import { useState, useEffect } from 'react'
import StatsCards from './StatsCards'
import AdminService, { AdminStats } from '@/lib/api/AdminService'
import { Users, BookOpen, Award, TrendingUp, DollarSign, Activity } from 'lucide-react'

export default function AdminDashboardNew() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCourses: 0,
    totalPrograms: 0,
    totalTutors: 0,
    totalRevenue: 0,
    activeUsers: 0,
    monthlyRevenue: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      console.log("AdminDashboard: Loading stats...")
      const data = await AdminService.getStats()
      console.log("AdminDashboard: Stats loaded:", data)
      setStats(data)
    } catch (error) {
      console.error("AdminDashboard: Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Novo Usuário',
      description: 'Adicionar novo usuário ao sistema',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Novo Curso',
      description: 'Criar novo curso',
      icon: BookOpen,
      href: '/admin/courses',
      color: 'bg-green-500'
    },
    {
      title: 'Novo Programa',
      description: 'Criar novo programa ou bootcamp',
      icon: Award,
      href: '/admin/programs',
      color: 'bg-purple-500'
    },
    {
      title: 'Novo Tutor',
      description: 'Adicionar novo tutor/mentor',
      icon: Activity,
      href: '/admin/tutors',
      color: 'bg-yellow-500'
    }
  ]

  const recentActivities = [
    { type: 'user', action: 'Novo usuário registrado', name: 'João Silva', time: '2 minutos atrás' },
    { type: 'course', action: 'Novo curso criado', name: 'React Avançado', time: '15 minutos atrás' },
    { type: 'enrollment', action: 'Nova inscrição', name: 'Maria Santos em Python Bootcamp', time: '1 hora atrás' },
    { type: 'payment', action: 'Pagamento recebido', name: 'AOA 25,000 - Curso JavaScript', time: '2 horas atrás' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Administrativo
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visão geral do sistema ELTx HUB
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={loading} />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white mr-4`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Atividades Recentes
        </h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.name}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Receita Mensal
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico de receita</p>
              <p className="text-sm">Integração com chart.js em breve</p>
            </div>
          </div>
        </div>

        {/* User Growth Chart Placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Crescimento de Usuários
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>Gráfico de crescimento</p>
              <p className="text-sm">Integração com chart.js em breve</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
