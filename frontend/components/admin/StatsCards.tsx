'use client'

import { Users, BookOpen, Award, DollarSign, TrendingUp, Activity } from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo'
}

interface StatsCardsProps {
  stats: {
    totalUsers: number
    totalCourses: number
    totalPrograms: number
    totalTutors: number
    totalRevenue: number
    activeUsers: number
    monthlyRevenue: number
    completionRate: number
  }
  loading?: boolean
}

export default function StatsCards({ stats, loading = false }: StatsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getCardColor = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        light: 'bg-blue-100 dark:bg-blue-900',
        text: 'text-blue-600 dark:text-blue-400'
      },
      green: {
        bg: 'bg-green-500',
        light: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400'
      },
      purple: {
        bg: 'bg-purple-500',
        light: 'bg-purple-100 dark:bg-purple-900',
        text: 'text-purple-600 dark:text-purple-400'
      },
      yellow: {
        bg: 'bg-yellow-500',
        light: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-600 dark:text-yellow-400'
      },
      red: {
        bg: 'bg-red-500',
        light: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-600 dark:text-red-400'
      },
      indigo: {
        bg: 'bg-indigo-500',
        light: 'bg-indigo-100 dark:bg-indigo-900',
        text: 'text-indigo-600 dark:text-indigo-400'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const cards: StatCard[] = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toLocaleString('pt-AO'),
      icon: <Users className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Cursos Ativos',
      value: stats.totalCourses.toLocaleString('pt-AO'),
      icon: <BookOpen className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Programas',
      value: stats.totalPrograms.toLocaleString('pt-AO'),
      icon: <Award className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Tutores',
      value: stats.totalTutors.toLocaleString('pt-AO'),
      icon: <Activity className="w-6 h-6" />,
      color: 'yellow'
    },
    {
      title: 'Receita Total',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Usuários Ativos',
      value: stats.activeUsers.toLocaleString('pt-AO'),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'indigo'
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(stats.monthlyRevenue),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Taxa de Conclusão',
      value: formatPercentage(stats.completionRate),
      icon: <Award className="w-6 h-6" />,
      color: 'purple'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-lg w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const color = getCardColor(card.color)
        
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
                {card.change && (
                  <div className={`flex items-center mt-2 text-sm ${
                    card.change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {card.change.value}%
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg ${color.light}`}>
                <div className={`${color.bg} text-white rounded-lg p-2`}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
