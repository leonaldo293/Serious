'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  activeStudents: number;
  completedCourses: number;
  averageRating: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingTasks: number;
}

interface RecentActivity {
  id: string;
  type: 'course' | 'student' | 'task' | 'rating';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'active';
}

interface Course {
  id: string;
  title: string;
  students: number;
  progress: number;
  rating: number;
  status: 'active' | 'draft' | 'completed';
}

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    activeStudents: 0,
    completedCourses: 0,
    averageRating: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingTasks: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - substituir com API calls reais
    const mockStats: InstructorStats = {
      totalCourses: 12,
      totalStudents: 248,
      activeStudents: 186,
      completedCourses: 8,
      averageRating: 4.7,
      totalRevenue: 45600,
      monthlyRevenue: 3800,
      pendingTasks: 14,
    };

    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'student',
        title: 'Novo aluno inscrito',
        description: 'João Silva se inscreveu em "Web Development"',
        timestamp: '2 horas atrás',
        status: 'active',
      },
      {
        id: '2',
        type: 'rating',
        title: 'Nova avaliação recebida',
        description: 'Maria Santos avaliou "React Advanced" com 5 estrelas',
        timestamp: '4 horas atrás',
        status: 'completed',
      },
      {
        id: '3',
        type: 'task',
        title: 'Tarefa para revisar',
        description: 'Projeto final de "JavaScript Basics" aguardando correção',
        timestamp: '6 horas atrás',
        status: 'pending',
      },
      {
        id: '4',
        type: 'course',
        title: 'Curso publicado',
        description: 'Node.js Masterclass foi publicado com sucesso',
        timestamp: '1 dia atrás',
        status: 'completed',
      },
    ];

    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Web Development Masterclass',
        students: 45,
        progress: 78,
        rating: 4.8,
        status: 'active',
      },
      {
        id: '2',
        title: 'React Advanced Patterns',
        students: 32,
        progress: 92,
        rating: 4.9,
        status: 'active',
      },
      {
        id: '3',
        title: 'JavaScript Basics',
        students: 67,
        progress: 100,
        rating: 4.6,
        status: 'completed',
      },
      {
        id: '4',
        title: 'Node.js Masterclass',
        students: 28,
        progress: 45,
        rating: 0,
        status: 'active',
      },
    ];

    setStats(mockStats);
    setRecentActivity(mockActivity);
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'student':
        return '👥';
      case 'rating':
        return '⭐';
      case 'task':
        return '📝';
      case 'course':
        return '📚';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'active':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo, {user?.firstName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Aqui está o resumo das suas atividades como instrutor
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-lg p-3">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total de Cursos
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-lg p-3">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total de Alunos
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.totalStudents}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-lg p-3">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Avaliação Média
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  {stats.averageRating.toFixed(1)}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-lg p-3">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Receita Mensal
                </dt>
                <dd className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${stats.monthlyRevenue.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Meus Cursos
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </p>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {course.students} alunos
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {course.progress}% completo
                      </span>
                      {course.rating > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ⭐ {course.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      course.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : course.status === 'completed'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {course.status === 'active' ? 'Ativo' : course.status === 'completed' ? 'Concluído' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Atividade Recente
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {activity.timestamp}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status === 'completed' ? 'Concluído' : activity.status === 'pending' ? 'Pendente' : 'Ativo'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks Alert */}
      {stats.pendingTasks > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Você tem <span className="font-medium">{stats.pendingTasks}</span> tarefas pendentes para revisar.
              </p>
              <div className="mt-2">
                <a
                  href="/instructor/tasks"
                  className="text-sm font-medium text-yellow-700 dark:text-yellow-200 underline hover:text-yellow-600"
                >
                  Ver tarefas pendentes →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
