'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { lessonsService, LessonDetails, LessonProgress } from '@/lib/api/lessons';
import { useAuth } from '@/contexts/AuthContext';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [lesson, setLesson] = useState<LessonDetails | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingComplete, setMarkingComplete] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const lessonId = params.id as string;

  useEffect(() => {
    if (lessonId && user) {
      loadLesson();
      loadProgress();
    }
  }, [lessonId, user]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setWatchTime(Math.floor(video.currentTime));
    };

    video.addEventListener('timeupdate', updateTime);
    
    return () => {
      video.removeEventListener('timeupdate', updateTime);
    };
  }, [lesson]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      // Tenta carregar da API, se falhar usa dados mock
      try {
        const lessonData = await lessonsService.getLessonById(lessonId);
        setLesson(lessonData);
      } catch {
        const mockLesson = lessonsService.getMockLessonDetails(lessonId);
        setLesson(mockLesson);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const progressData = await lessonsService.getLessonProgress(lessonId);
      setProgress(progressData);
      
      // Define o tempo do vídeo para onde o usuário parou
      if (videoRef.current && progressData.watchTime > 0) {
        videoRef.current.currentTime = progressData.watchTime;
      }
    } catch (err) {
      console.log('No progress found for this lesson');
    }
  };

  const handleMarkComplete = async () => {
    if (!user || !lesson) return;

    try {
      setMarkingComplete(true);
      const progressData = await lessonsService.markLessonAsCompleted(lessonId, watchTime);
      setProgress(progressData);
      
      // Se houver próxima aula, pergunta se quer ir para ela
      if (lesson.nextLesson) {
        setTimeout(() => {
          if (confirm('Aula marcada como concluída! Deseja ir para a próxima aula?')) {
            router.push(`/lessons/${lesson.nextLesson!.id}`);
          }
        }, 500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMarkingComplete(false);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Auto-marca como completa se assistir 90% ou mais
    if (lesson && progress && !progress.isCompleted) {
      const completionPercentage = (watchTime / lesson.duration) * 100;
      if (completionPercentage >= 90) {
        handleMarkComplete();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const completionPercentage = lesson && progress 
    ? (watchTime / (lesson.duration * 60)) * 100 
    : 0;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Faça Login para Acessar
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Você precisa estar logado para assistir às aulas.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-tech-teal text-white font-medium rounded-lg hover:bg-opacity-90 transition"
          >
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
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
              {error || 'Aula não encontrada'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              A aula que você está procurando não existe ou foi removida.
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-tech-teal text-white font-medium rounded-lg hover:bg-opacity-90 transition"
            >
              Ver Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/courses" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Cursos
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/courses/${lesson.course.id}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                {lesson.course.title}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 dark:text-white">
              {lesson.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden mb-6">
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  src={lesson.videoUrl || '/ti.mp4'}
                  className="w-full h-full object-cover"
                  onEnded={handleVideoEnd}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Play/Pause Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {!isPlaying && (
                    <button
                      onClick={handlePlayPause}
                      className="pointer-events-auto w-20 h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition"
                    >
                      <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-white text-sm mb-1">
                      <span>{formatTime(watchTime)}</span>
                      <span>{formatTime(lesson.duration * 60)}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
                      <div
                        className="bg-african-gold h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {lesson.title}
                </h1>
                {progress?.isCompleted && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                    Concluída
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {lesson.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-8">
                {!progress?.isCompleted ? (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markingComplete}
                    className="px-6 py-3 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
                  >
                    {markingComplete ? 'Marcando...' : 'Marcar como Concluída'}
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="font-medium">Aula Concluída</span>
                  </div>
                )}

                {lesson.previousLesson && (
                  <Link
                    href={`/lessons/${lesson.previousLesson.id}`}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    ← Anterior
                  </Link>
                )}

                {lesson.nextLesson && (
                  <Link
                    href={`/lessons/${lesson.nextLesson.id}`}
                    className="px-4 py-3 bg-tech-teal text-white font-medium rounded-lg hover:bg-opacity-90 transition"
                  >
                    Próxima →
                  </Link>
                )}
              </div>

              {/* Resources */}
              {lesson.resources.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recursos da Aula
                  </h3>
                  <div className="space-y-3">
                    {lesson.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            resource.type === 'pdf' 
                              ? 'bg-red-100 dark:bg-red-900'
                              : resource.type === 'link'
                              ? 'bg-blue-100 dark:bg-blue-900'
                              : 'bg-green-100 dark:bg-green-900'
                          }`}>
                            {resource.type === 'pdf' ? (
                              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                              </svg>
                            ) : resource.type === 'link' ? (
                              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {resource.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {resource.type === 'pdf' ? 'PDF' : 
                               resource.type === 'link' ? 'Link' : 'Download'}
                            </div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Informações da Aula
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Duração</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {lesson.duration} minutos
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Módulo</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {lesson.module.title}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Progresso</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-african-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                </div>

                {progress && (
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <div className={`font-medium ${
                      progress.isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {progress.isCompleted ? 'Concluída' : 'Em andamento'}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Navegação Rápida
                </h4>
                
                <div className="space-y-3">
                  <Link
                    href={`/courses/${lesson.course.id}`}
                    className="block w-full py-2 px-4 text-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Ver Curso
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className="block w-full py-2 px-4 text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
