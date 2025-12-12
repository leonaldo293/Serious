'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { coursesService, Course, CourseProgress } from '@/lib/api/courses';
import { useAuth } from '@/contexts/AuthContext';
import { createWhatsAppLink, createCourseInquiryMessage } from '@/lib/utils/whatsapp';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const courseId = params.id as string;

  useEffect(() => {
    if (courseId) {
      loadCourse();
      if (user) {
        loadProgress();
      }
    }
  }, [courseId, user]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courseData = await coursesService.getCourseById(courseId);
      setCourse(courseData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const progressData = await coursesService.getCourseProgress(courseId);
      setProgress(progressData);
    } catch (err) {
      // Progresso pode não existir se o usuário não estiver inscrito
      console.log('No progress found for this course');
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setEnrolling(true);
      await coursesService.enrollInCourse(courseId);
      await loadProgress();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    if (course && course.modules.length > 0 && course.modules[0].lessons.length > 0) {
      const firstLesson = course.modules[0].lessons[0];
      router.push(`/lessons/${firstLesson.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Curso não encontrado'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              O curso que você está procurando não existe ou foi removido.
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-tech-teal text-white font-medium rounded-lg hover:bg-opacity-90 transition"
            >
              Ver Todos os Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Course Header */}
      <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-african-gold/20 rounded-full flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          </div>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg opacity-90">com {course.instructor?.name || 'Instrutor'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-african-gold dark:text-african-gold">
                  {course.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.level === 'beginner' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : course.level === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {course.level === 'beginner' ? 'Iniciante' : 
                   course.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {course.title}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.duration}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    horas de conteúdo
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.modules.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    módulos
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {course.rating}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    avaliação
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {progress && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Seu Progresso
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {progress.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-african-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress.progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {progress.completedLessons.length} de {progress.totalLessons} aulas concluídas
                  </p>
                </div>
              )}
            </div>

            {/* Course Modules */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Conteúdo do Curso
              </h3>
              
              {course.modules.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  Nenhum módulo disponível ainda.
                </p>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Módulo {moduleIndex + 1}: {module.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {module.description}
                        </p>
                      </div>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const isCompleted = progress?.completedLessons.includes(lesson.id);
                          
                          return (
                            <div
                              key={lesson.id}
                              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompleted
                                      ? 'bg-green-100 dark:bg-green-900'
                                      : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    {isCompleted ? (
                                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                      </svg>
                                    ) : (
                                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {lessonIndex + 1}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-gray-900 dark:text-white">
                                      {lesson.title}
                                    </h5>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      {lesson.duration} minutos
                                    </p>
                                  </div>
                                </div>
                                
                                {user && progress && (
                                  <Link
                                    href={`/lessons/${lesson.id}`}
                                    className="px-4 py-2 text-sm font-medium text-tech-teal dark:text-tech-teal hover:bg-tech-teal/10 dark:hover:bg-tech-teal/20 rounded-lg transition"
                                  >
                                    {isCompleted ? 'Revisar' : 'Assistir'}
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  ${course.price}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {course.enrolledCount} alunos inscritos
                </div>
              </div>

              {/* Action Buttons */}
              {!user ? (
                <div className="space-y-3">
                  <a
                    href={course ? createWhatsAppLink(createCourseInquiryMessage(`Quero me inscrever para o curso: ${course.title}`)) : createWhatsAppLink(createCourseInquiryMessage('Quero me inscrever para o curso'))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 bg-tech-teal text-white text-center font-medium rounded-lg hover:bg-opacity-90 transition"
                  >
                    Faça Login para Inscrever-se
                  </a>
                </div>
              ) : !progress ? (
                <div className="space-y-3">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3 px-4 bg-african-gold text-deep-charcoal text-center font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                  >
                    {enrolling ? 'Inscrevendo...' : 'Inscrever-se no Curso'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleStartCourse}
                    className="w-full py-3 px-4 bg-tech-teal text-white text-center font-medium rounded-lg hover:bg-opacity-90 transition"
                  >
                    {progress.progressPercentage > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
                  </button>
                </div>
              )}

              {/* Instructor Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Sobre o Instrutor
                </h4>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {course.instructor?.name || 'Instrutor'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Instrutor Especialista
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Instrutor experiente com anos de prática na área e paixão por ensinar.
                </p>
              </div>

              {/* Course Features */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  O que você vai aprender
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    Conceitos fundamentais
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    Prática com projetos reais
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    Melhores práticas da indústria
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    Certificado de conclusão
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
