'use client';

import { useState, useEffect } from 'react';
import { coursesService, Course, Lesson } from '@/lib/api/courses';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';
import LessonCard from './LessonCard';
import { LessonCardSkeleton } from './SkeletonLoader';

interface CourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModal({ course, isOpen, onClose }: CourseModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (isOpen && course) {
      loadCourseDetails();
    }
  }, [isOpen, course]);

  const loadCourseDetails = async () => {
    if (!course) return;

    try {
      setLoading(true);
      const [lessonsData, progressData] = await Promise.all([
        coursesService.getCourseLessons(course.id),
        isAuthenticated ? coursesService.getCourseProgress(course.id) : null
      ]);

      setLessons(lessonsData);
      setUserProgress(progressData);
      
      // Verificar se usuário tem acesso
      if (isAuthenticated && user) {
        const access = await coursesService.checkCourseAccess(course.id);
        setHasAccess(access);
      }
    } catch (err: any) {
      console.error('Erro ao carregar detalhes do curso:', err);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os detalhes do curso'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      onClose();
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      await coursesService.enrollInCourse(course.id);
      showToast({
        type: 'success',
        title: 'Inscrição realizada!',
        message: 'Você agora tem acesso a este curso'
      });
      setHasAccess(true);
      await loadCourseDetails(); // Recarregar progresso
    } catch (err: any) {
      console.error('Erro na inscrição:', err);
      if (err.response?.status === 402) {
        // Curso pago - redirecionar para pagamento
        router.push(`/payment/${course.id}`);
        onClose();
      } else {
      showToast({
        type: 'error',
        title: 'Erro na inscrição',
        message: 'Não foi possível realizar a inscrição'
      });
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handleAccessCourse = () => {
    if (!course) return;
    router.push(`/courses/${course.id}`);
    onClose();
  };

  const calculateProgress = () => {
    if (!userProgress || !lessons.length) return 0;
    return Math.round((userProgress.completedLessons.length / lessons.length) * 100);
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="relative">
            {/* Course Banner */}
            <div className="relative h-64 md:h-80">
              <img
                src={course.thumbnail || '/placeholder-course.jpg'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Course Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-african-gold text-deep-charcoal text-xs font-semibold rounded-full">
                    {course.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full">
                    {course.level}
                  </span>
                  {course.isFree && (
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      Grátis
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {lessons.length} aulas
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {course.enrolledCount || 0} alunos
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Sobre o Curso
                  </h2>
                  <div 
                    className="text-gray-600 dark:text-gray-300 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </div>

                {/* Lessons List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Conteúdo do Curso
                  </h3>
                  
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <LessonCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-african-gold text-deep-charcoal rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {lesson.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {lesson.duration}
                              </p>
                            </div>
                          </div>
                          {userProgress?.completedLessons.includes(lesson.id) && (
                            <div className="text-green-500">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price & Action */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="text-center mb-6">
                    {course.isFree ? (
                      <div>
                        <p className="text-3xl font-bold text-green-500 mb-2">Grátis</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Acesso vitalício
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl font-bold text-african-gold mb-2">
                          {new Intl.NumberFormat('pt-AO', {
                            style: 'currency',
                            currency: 'AOA'
                          }).format(course.price || 0)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Pagamento único
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Progress (se inscrito) */}
                  {hasAccess && userProgress && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Seu progresso</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {calculateProgress()}%
                        </span>
                      </div>
                      <ProgressBar
                        value={calculateProgress()}
                        color="gold"
                        size="md"
                        showValue={false}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {userProgress.completedLessons.length} de {lessons.length} aulas concluídas
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={hasAccess ? handleAccessCourse : handleEnroll}
                    disabled={enrolling || loading}
                    className="w-full py-3 px-4 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? (
                      <span>Processando...</span>
                    ) : hasAccess ? (
                      <span>Acessar Curso</span>
                    ) : !isAuthenticated ? (
                      <span>Fazer Login para Inscrever-se</span>
                    ) : (
                      <span>Inscrever-se Agora</span>
                    )}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                      Você será redirecionado para a página de login
                    </p>
                  )}
                </div>

                {/* Course Features */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    O que você vai receber:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Acesso vitalício ao conteúdo
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Certificado de conclusão
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Material de apoio em PDF
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Suporte do instrutor
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Sobre o Instrutor
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-african-gold rounded-full flex items-center justify-center">
                        <span className="text-deep-charcoal font-bold">
                          {course.instructor?.name?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {course.instructor?.name || 'Instrutor'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.instructor?.title || 'Especialista'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
