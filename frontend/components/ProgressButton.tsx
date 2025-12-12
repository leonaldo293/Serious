'use client';

import { useState, useEffect } from 'react';
import { progressService } from '@/lib/api/progress';
import { useToast } from '@/components/Toast';

interface ProgressButtonProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  isCompleted?: boolean;
  onProgressUpdate?: (completed: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export default function ProgressButton({
  courseId,
  lessonId,
  lessonTitle,
  isCompleted: initialCompleted = false,
  onProgressUpdate,
  className = '',
  disabled = false
}: ProgressButtonProps) {
  const { showToast } = useToast();
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  // Verificar estado inicial se não fornecido
  useEffect(() => {
    if (initialCompleted === undefined) {
      checkCompletionStatus();
    }
  }, [courseId, lessonId]);

  const checkCompletionStatus = async () => {
    try {
      const completed = await progressService.isLessonCompleted(courseId, lessonId);
      setIsCompleted(completed);
    } catch (error) {
      console.error('Error checking lesson completion:', error);
    }
  };

  const toggleCompletion = async () => {
    if (disabled || loading) return;

    try {
      setLoading(true);

      if (isCompleted) {
        // Se já está concluído, não permitir desmarcar (regra de negócio)
        showToast({
          type: 'error',
          title: 'Operação não permitida',
          message: 'Uma vez concluída, a lição não pode ser desmarcada.'
        });
        return;
      }

      // Marcar como concluída
      await progressService.completeLesson(courseId, lessonId);
      
      setIsCompleted(true);
      onProgressUpdate?.(true);
      
        showToast({
          type: 'success',
          title: 'Lição concluída!',
          message: `"${lessonTitle}" marcada como concluída com sucesso.`
        });
      
    } catch (error: any) {
      console.error('Error toggling lesson completion:', error);
      showToast({
        type: 'error',
        title: 'Erro',
        message: error.message || 'Não foi possível atualizar o progresso.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleCompletion}
      disabled={disabled || loading || isCompleted}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${isCompleted 
          ? 'bg-green-500 text-white cursor-not-allowed' 
          : 'bg-african-gold text-deep-charcoal hover:bg-opacity-90 active:scale-95'
        }
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      title={
        isCompleted 
          ? 'Lição já concluída' 
          : disabled 
            ? 'Não disponível' 
            : 'Marcar lição como concluída'
      }
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Salvando...</span>
        </>
      ) : isCompleted ? (
        <>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Concluída</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Marcar como Concluída</span>
        </>
      )}
    </button>
  );
}

// Versão compacta para usar em listas
export function CompactProgressButton({
  courseId,
  lessonId,
  isCompleted,
  onProgressUpdate,
  className = ''
}: Omit<ProgressButtonProps, 'lessonTitle' | 'disabled'>) {
  return (
    <ProgressButton
      courseId={courseId}
      lessonId={lessonId}
      lessonTitle=""
      isCompleted={isCompleted}
      onProgressUpdate={onProgressUpdate}
      className={`p-2 ${className}`}
    />
  );
}

// Versão apenas de visualização (sem interação)
export function ProgressIndicator({
  isCompleted,
  size = 'md',
  className = ''
}: {
  isCompleted: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`
      ${sizeClasses[size]} rounded-full flex items-center justify-center
      ${isCompleted 
        ? 'bg-green-500 text-white' 
        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
      }
      ${className}
    `}>
      {isCompleted && (
        <svg className="w-2/3 h-2/3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
}
