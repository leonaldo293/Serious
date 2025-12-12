'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface Lesson {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  instructor: string;
  duration: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
  thumbnail?: string;
  videoUrl?: string;
  completedAt?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  thumbnail?: string;
}

export default function LessonsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  useEffect(() => {
    // Mock data - substituir com API calls reais
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Web Development Masterclass',
        description: 'Curso completo de desenvolvimento web',
        instructor: 'João Silva',
        totalLessons: 45,
        completedLessons: 23,
        progress: 51,
        thumbnail: '/images/courses/web-dev.jpg',
      },
      {
        id: '2',
        title: 'React Advanced Patterns',
        description: 'Técnicas avançadas de React',
        instructor: 'Maria Santos',
        totalLessons: 32,
        completedLessons: 15,
        progress: 47,
        thumbnail: '/images/courses/react.jpg',
      },
      {
        id: '3',
        title: 'JavaScript Basics',
        description: 'Fundamentos de JavaScript',
        instructor: 'Pedro Costa',
        totalLessons: 28,
        completedLessons: 28,
        progress: 100,
        thumbnail: '/images/courses/javascript.jpg',
      },
    ];

    const mockLessons: Lesson[] = [
      {
        id: '1',
        title: 'Introdução ao HTML5',
        description: 'Aprenda os fundamentos do HTML5',
        courseTitle: 'Web Development Masterclass',
        instructor: 'João Silva',
        duration: '45 min',
        progress: 100,
        status: 'completed',
        thumbnail: '/images/lessons/html5.jpg',
        completedAt: '2025-11-28T14:30:00Z',
      },
      {
        id: '2',
        title: 'CSS3 Flexbox e Grid',
        description: 'Domine o layout moderno com CSS3',
        courseTitle: 'Web Development Masterclass',
        instructor: 'João Silva',
        duration: '60 min',
        progress: 75,
        status: 'in_progress',
        thumbnail: '/images/lessons/css3.jpg',
      },
      {
        id: '3',
        title: 'JavaScript Fundamentos',
        description: 'Conceitos básicos de JavaScript',
        courseTitle: 'Web Development Masterclass',
        instructor: 'João Silva',
        duration: '90 min',
        progress: 30,
        status: 'in_progress',
        thumbnail: '/images/lessons/js-basics.jpg',
      },
      {
        id: '4',
        title: 'React Hooks Avançados',
        description: 'Use custom hooks e patterns avançados',
        courseTitle: 'React Advanced Patterns',
        instructor: 'Maria Santos',
        duration: '75 min',
        progress: 0,
        status: 'not_started',
        thumbnail: '/images/lessons/react-hooks.jpg',
      },
      {
        id: '5',
        title: 'State Management com Redux',
        description: 'Gerenciamento de estado complexo',
        courseTitle: 'React Advanced Patterns',
        instructor: 'Maria Santos',
        duration: '120 min',
        progress: 0,
        status: 'not_started',
        thumbnail: '/images/lessons/redux.jpg',
      },
    ];

    setCourses(mockCourses);
    setLessons(mockLessons);
    setLoading(false);
  }, []);

  const filteredLessons = selectedCourse === 'all' 
    ? lessons 
    : lessons.filter(lesson => {
        const course = courses.find(c => c.title === lesson.courseTitle);
        return course?.id === selectedCourse;
      });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900';
      case 'not_started':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'in_progress':
        return 'Em andamento';
      case 'not_started':
        return 'Não iniciado';
      default:
        return status;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Minhas Lições
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Acompanhe seu progresso e acesse suas aulas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {lessons.filter(l => l.status === 'completed').length} de {lessons.length} lições concluídas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtrar por curso:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos os cursos</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {course.title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {course.completedLessons}/{course.totalLessons}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Progresso</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instrutor: {course.instructor}
              </p>
            </div>
          ))}
        </div>

        {/* Lessons List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Lições {selectedCourse !== 'all' && `- ${courses.find(c => c.id === selectedCourse)?.title}`}
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredLessons.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                Nenhuma lição encontrada para este filtro.
              </div>
            ) : (
              filteredLessons.map(lesson => (
                <div key={lesson.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {lesson.thumbnail ? (
                        <Image
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          width={120}
                          height={80}
                          className="w-30 h-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-30 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 dark:text-gray-500 text-2xl">📹</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {lesson.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {lesson.description}
                          </p>
                          <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>📚 {lesson.courseTitle}</span>
                            <span>👨‍🏫 {lesson.instructor}</span>
                            <span>⏱️ {lesson.duration}</span>
                            {lesson.completedAt && (
                              <span>✅ Concluído em {new Date(lesson.completedAt).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lesson.status)}`}>
                            {getStatusText(lesson.status)}
                          </span>
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            {lesson.status === 'completed' ? 'Revisar' : lesson.status === 'in_progress' ? 'Continuar' : 'Iniciar'}
                          </Link>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {lesson.status === 'in_progress' && lesson.progress > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progresso da lição</span>
                            <span>{lesson.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
