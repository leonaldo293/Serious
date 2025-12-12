'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthGuard from '@/components/AuthGuard'

export default function Tracker() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedProgram, setSelectedProgram] = useState('all')

  const studySessions = [
    {
      id: 1,
      date: '2024-01-15',
      program: 'English Bootcamp',
      duration: 120, // minutes
      lessonsCompleted: 3,
      topics: ['Grammar Basics', 'Business Vocabulary', 'Speaking Practice'],
      notes: 'Great progress on pronunciation. Need more practice with past tense.',
      mood: 'motivated',
      difficulty: 'medium'
    },
    {
      id: 2,
      date: '2024-01-14',
      program: 'Tech Bootcamp',
      duration: 90,
      lessonsCompleted: 2,
      topics: ['React Hooks', 'State Management'],
      notes: 'useState and useEffect are becoming clearer. Practice more complex examples.',
      mood: 'focused',
      difficulty: 'hard'
    },
    {
      id: 3,
      date: '2024-01-13',
      program: 'Python Mastery',
      duration: 75,
      lessonsCompleted: 2,
      topics: ['Data Structures', 'List Comprehensions'],
      notes: 'List comprehensions are powerful but need more practice.',
      mood: 'confident',
      difficulty: 'medium'
    },
    {
      id: 4,
      date: '2024-01-12',
      program: 'English Bootcamp',
      duration: 60,
      lessonsCompleted: 1,
      topics: ['Listening Comprehension'],
      notes: 'Struggled with fast-paced audio. Need to improve listening skills.',
      mood: 'frustrated',
      difficulty: 'hard'
    }
  ]

  const programs = [
    { id: 'all', name: 'Todos os Programas' },
    { id: 'english', name: 'English Bootcamp' },
    { id: 'tech', name: 'Tech Bootcamp' },
    { id: 'python', name: 'Python Mastery' }
  ]

  const periods = [
    { id: 'week', name: 'Esta Semana' },
    { id: 'month', name: 'Este Mês' },
    { id: 'quarter', name: 'Este Trimestre' },
    { id: 'year', name: 'Este Ano' }
  ]

  const goals = [
    {
      id: 1,
      title: 'Completar English Bootcamp',
      target: 'Complete all modules',
      current: 75,
      total: 100,
      deadline: '2024-03-01',
      status: 'on-track'
    },
    {
      id: 2,
      title: 'Estudar 20 horas/semana',
      target: '20 hours per week',
      current: 16,
      total: 20,
      deadline: '2024-01-21',
      status: 'behind'
    },
    {
      id: 3,
      title: 'Concluir 50 lições',
      target: 'Complete 50 lessons',
      current: 38,
      total: 50,
      deadline: '2024-02-01',
      status: 'on-track'
    }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Primeira Semana',
      description: 'Complete study sessions for 7 consecutive days',
      icon: '🔥',
      unlocked: true,
      unlockedDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Maratonista',
      description: 'Study for more than 2 hours in a single session',
      icon: '⏰',
      unlocked: true,
      unlockedDate: '2024-01-15'
    },
    {
      id: 3,
      title: 'Poliglota',
      description: 'Complete lessons in 3 different programs',
      icon: '🌍',
      unlocked: false,
      progress: 2,
      total: 3
    },
    {
      id: 4,
      title: 'Mestre do Tempo',
      description: 'Study for 100 total hours',
      icon: '📚',
      unlocked: false,
      progress: 67,
      total: 100
    }
  ]

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'motivated':
        return '🔥'
      case 'focused':
        return '🎯'
      case 'confident':
        return '💪'
      case 'frustrated':
        return '😤'
      case 'tired':
        return '😴'
      default:
        return '😊'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'behind':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'ahead':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'No Caminho'
      case 'behind':
        return 'Atrasado'
      case 'ahead':
        return 'Adiantado'
      default:
        return status
    }
  }

  const filteredSessions = studySessions.filter(session => {
    const matchesProgram = selectedProgram === 'all' || 
                         session.program.toLowerCase().includes(selectedProgram.toLowerCase())
    return matchesProgram
  })

  const totalStudyTime = filteredSessions.reduce((total, session) => total + session.duration, 0)
  const totalLessons = filteredSessions.reduce((total, session) => total + session.lessonsCompleted, 0)
  const averageSessionTime = filteredSessions.length > 0 ? Math.round(totalStudyTime / filteredSessions.length) : 0

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-deep-charcoal dark:text-pure-white mb-2">
              Meu Progresso
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe seu aprendizado e celebre suas conquistas
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-african-gold/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-deep-charcoal dark:text-white">
                    {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}min
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Total</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-tech-teal/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-deep-charcoal dark:text-white">
                    {totalLessons}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lições Completas</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-african-gold/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-deep-charcoal dark:text-white">
                    {filteredSessions.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sessões</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-tech-teal/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-deep-charcoal dark:text-white">
                    {averageSessionTime}min
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Média/Sessão</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="input-field"
                >
                  {periods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Programa
                </label>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="input-field"
                >
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:ml-auto">
                <button className="btn-primary mt-6">
                  Adicionar Sessão
                </button>
              </div>
            </div>
          </div>

          {/* Study Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-deep-charcoal dark:text-white mb-4">
                Sessões Recentes
              </h2>
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div key={session.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-deep-charcoal dark:text-white">
                          {session.program}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.date).toLocaleDateString('pt-BR')} • {session.duration} minutos
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMoodEmoji(session.mood)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(session.difficulty)}`}>
                          {session.difficulty === 'easy' && 'Fácil'}
                          {session.difficulty === 'medium' && 'Médio'}
                          {session.difficulty === 'hard' && 'Difícil'}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tópicos:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {session.topics.map((topic, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div className="font-medium mb-1">Notas:</div>
                      <p>{session.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <h2 className="text-xl font-bold text-deep-charcoal dark:text-white mb-4">
                Metas de Aprendizado
              </h2>
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-deep-charcoal dark:text-white">
                        {goal.title}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(goal.status)}`}>
                        {getStatusText(goal.status)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {goal.target}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{goal.current}/{goal.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-african-gold h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(goal.current / goal.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString('pt-BR') : 'Não definido'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-xl font-bold text-deep-charcoal dark:text-white mb-4">
              Conquistas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center ${
                    !achievement.unlocked && 'opacity-60'
                  }`}
                >
                  <div className={`text-4xl mb-3 ${!achievement.unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold text-deep-charcoal dark:text-white mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Desbloqueado em {achievement.unlockedDate ? new Date(achievement.unlockedDate).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Progresso: {achievement.progress}/{achievement.total}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
