'use client';

import Link from 'next/link';
import { Lesson } from '@/lib/api/lessons';

interface LessonCardProps {
  lesson: Lesson;
  courseId: string;
  isCompleted?: boolean;
  progress?: number;
  canAccess?: boolean;
}

export default function LessonCard({ 
  lesson, 
  courseId, 
  isCompleted = false, 
  progress = 0,
  canAccess = true 
}: LessonCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 ${
      !canAccess 
        ? 'border-gray-200 dark:border-gray-700 opacity-60'
        : 'border-gray-300 dark:border-gray-600 hover:border-african-gold dark:hover:border-african-gold hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* Status Icon */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isCompleted
              ? 'bg-green-100 dark:bg-green-900'
              : canAccess
              ? 'bg-gray-100 dark:bg-gray-700'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {isCompleted ? (
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            ) : canAccess ? (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>

          {/* Lesson Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-white truncate">
              {lesson.title}
            </h4>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDuration(lesson.duration)}
              </span>
              {progress > 0 && (
                <span className="text-sm text-african-gold">
                  {progress}% assistido
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center space-x-2">
          {isCompleted && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
              Concluída
            </span>
          )}
          
          {canAccess ? (
            <Link
              href={`/lessons/${lesson.id}`}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                isCompleted
                  ? 'text-tech-teal dark:text-tech-teal hover:bg-tech-teal/10 dark:hover:bg-tech-teal/20'
                  : 'px-4 py-2 bg-tech-teal text-white rounded-lg hover:bg-opacity-90'
              }`}
            >
              {isCompleted ? 'Revisar' : 'Assistir'}
            </Link>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-400 cursor-not-allowed">
              Bloqueado
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && progress < 100 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className="bg-african-gold h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Resources Preview */}
      {lesson.resources && lesson.resources.length > 0 && (
        <div className="mt-3 flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {lesson.resources.length} recurso{lesson.resources.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
