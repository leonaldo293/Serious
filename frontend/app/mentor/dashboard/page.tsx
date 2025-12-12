'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Users, BookOpen, MessageSquare, Clock, TrendingUp, Calendar, Star, Award, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface MentorStats {
  totalStudents: number;
  activeCourses: number;
  totalSessions: number;
  averageRating: number;
  completionRate: number;
  monthlyHours: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  progress: number;
  lastActive: string;
  avatar: string;
}

interface UpcomingSession {
  id: string;
  studentName: string;
  course: string;
  date: string;
  time: string;
  type: 'individual' | 'group';
}

export default function MentorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MentorStats>({
    totalStudents: 0,
    activeCourses: 0,
    totalSessions: 0,
    averageRating: 0,
    completionRate: 0,
    monthlyHours: 0,
  });
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API call
    setTimeout(() => {
      setStats({
        totalStudents: 45,
        activeCourses: 3,
        totalSessions: 128,
        averageRating: 4.9,
        completionRate: 82,
        monthlyHours: 67,
      });

      setRecentStudents([
        {
          id: '1',
          name: 'Ana Silva',
          email: 'ana.silva@email.com',
          enrolledCourses: 2,
          progress: 75,
          lastActive: '2 horas atrás',
          avatar: '/api/placeholder/40/40',
        },
        {
          id: '2',
          name: 'Carlos Santos',
          email: 'carlos.santos@email.com',
          enrolledCourses: 1,
          progress: 60,
          lastActive: '1 dia atrás',
          avatar: '/api/placeholder/40/40',
        },
        {
          id: '3',
          name: 'Mariana Costa',
          email: 'mariana.costa@email.com',
          enrolledCourses: 3,
          progress: 90,
          lastActive: '3 horas atrás',
          avatar: '/api/placeholder/40/40',
        },
        {
          id: '4',
          name: 'Pedro Oliveira',
          email: 'pedro.oliveira@email.com',
          enrolledCourses: 2,
          progress: 45,
          lastActive: '5 horas atrás',
          avatar: '/api/placeholder/40/40',
        },
      ]);

      setUpcomingSessions([
        {
          id: '1',
          studentName: 'Ana Silva',
          course: 'Next.js 16 com TypeScript',
          date: 'Hoje',
          time: '14:00',
          type: 'individual',
        },
        {
          id: '2',
          studentName: 'Grupo de React',
          course: 'React Avançado',
          date: 'Hoje',
          time: '16:00',
          type: 'group',
        },
        {
          id: '3',
          studentName: 'Carlos Santos',
          course: 'Node.js e Express',
          date: 'Amanhã',
          time: '10:00',
          type: 'individual',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total de Alunos',
      value: stats.totalStudents.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Ativos este mês',
    },
    {
      title: 'Sessões Realizadas',
      value: stats.totalSessions.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Total',
    },
    {
      title: 'Avaliação Média',
      value: stats.averageRating.toFixed(1),
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500',
      description: '⭐ Excelente',
    },
    {
      title: 'Horas/Mês',
      value: stats.monthlyHours.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Este mês',
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
          Dashboard do Mentor
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Olá, {user?.firstName}! Acompanhe seu progresso e seus alunos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-lg text-white`}>
                {card.icon}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Desempenho Geral
          </h2>
          <BarChart3 className="w-5 h-5 text-african-gold" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Conclusão</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {stats.completionRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-african-gold to-tech-teal h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Cursos Ativos</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.activeCourses}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sessões este mês</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tempo médio por sessão</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">1h 30min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Feedback positivo</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">96%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alunos Recentes
            </h2>
            <Link
              href="/mentor/students"
              className="text-sm text-african-gold hover:opacity-80 transition"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {recentStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-tech-teal rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.enrolledCourses} cursos • {student.lastActive}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {student.progress}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-tech-teal h-1.5 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próximas Sessões
            </h2>
            <Link
              href="/mentor/calendar"
              className="text-sm text-african-gold hover:opacity-80 transition"
            >
              Ver calendário
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    session.type === 'individual' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900'
                  }`}>
                    {session.type === 'individual' ? (
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-300" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.studentName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.course}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {session.date}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {session.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/mentor/students"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Gerenciar Alunos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Acompanhe progresso</p>
            </div>
          </div>
        </Link>

        <Link
          href="/mentor/tasks"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Revisar Tarefas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes: 5</p>
            </div>
          </div>
        </Link>

        <Link
          href="/mentor/calendar"
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Calendário</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Agende sessões</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
