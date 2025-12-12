'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, Award, TrendingUp, Play, Calendar, Target, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface StudentStats {
  enrolledCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
  currentStreak: number;
  progress: number;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson?: string;
  thumbnail: string;
  category: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    certificates: 0,
    currentStreak: 0,
    progress: 0,
  });
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with real API call
    setTimeout(() => {
      setStats({
        enrolledCourses: 5,
        completedCourses: 2,
        totalHours: 47,
        certificates: 2,
        currentStreak: 15,
        progress: 68,
      });

      setRecentCourses([
        {
          id: '1',
          title: 'Next.js 16 com TypeScript',
          instructor: 'João Silva',
          progress: 75,
          totalLessons: 40,
          completedLessons: 30,
          nextLesson: 'API Routes',
          thumbnail: '/api/placeholder/300/200',
          category: 'Desenvolvimento Web',
        },
        {
          id: '2',
          title: 'React Avançado',
          instructor: 'Maria Santos',
          progress: 45,
          totalLessons: 35,
          completedLessons: 16,
          nextLesson: 'Performance Optimization',
          thumbnail: '/api/placeholder/300/200',
          category: 'Frontend',
        },
        {
          id: '3',
          title: 'Node.js e Express',
          instructor: 'Pedro Costa',
          progress: 30,
          totalLessons: 45,
          completedLessons: 14,
          nextLesson: 'Middleware',
          thumbnail: '/api/placeholder/300/200',
          category: 'Backend',
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Cursos Ativos',
      value: stats.enrolledCourses.toString(),
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Em andamento',
    },
    {
      title: 'Horas Estudadas',
      value: stats.totalHours.toString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Este mês',
    },
    {
      title: 'Certificados',
      value: stats.certificates.toString(),
      icon: <Award className="w-6 h-6" />,
      color: 'bg-yellow-500',
      description: 'Conquistados',
    },
    {
      title: 'Sequência Atual',
      value: `${stats.currentStreak} dias`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Continue assim!',
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
          Bem-vindo, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Continue sua jornada de aprendizado e alcance seus objetivos
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

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Seu Progresso Geral
          </h2>
          <Target className="w-5 h-5 text-african-gold" />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Conclusão Total</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-african-gold to-tech-teal h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.enrolledCourses}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Inscritos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedCourses}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Concluídos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.certificates}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Certificados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Continue Aprendendo
          </h2>
          <Link 
            href="/student/courses"
            className="text-sm text-african-gold hover:opacity-80 transition"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCourses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              {/* Course Thumbnail */}
              <div className="h-40 bg-gradient-to-br from-african-gold to-tech-teal flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white opacity-50" />
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-african-gold bg-african-gold/10 px-2 py-1 rounded">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {course.instructor}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {course.title}
                </h3>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-african-gold to-tech-teal h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {course.completedLessons} de {course.totalLessons} aulas
                  </p>
                </div>

                {/* Next Lesson */}
                {course.nextLesson && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center text-sm">
                      <Play className="w-4 h-4 text-african-gold mr-2" />
                      <span className="text-gray-600 dark:text-gray-300">Próxima: {course.nextLesson}</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/student/courses/${course.id}`}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-african-gold text-deep-charcoal rounded-lg hover:opacity-90 transition"
                >
                  <Play className="w-4 h-4" />
                  <span>Continuar</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Próximas Aulas
            </h3>
            <Calendar className="w-5 h-5 text-tech-teal" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Live de React</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Hoje, 19:00</p>
              </div>
              <button className="text-sm text-african-gold hover:opacity-80 transition">
                Entrar
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Mentoria Individual</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Amanhã, 14:00</p>
              </div>
              <button className="text-sm text-african-gold hover:opacity-80 transition">
                Agendar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conquistas Recentes
            </h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Primeiro Curso</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Concluído há 2 dias</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">15 Dias Seguidos</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mantenha o ritmo!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
