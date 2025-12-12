// services/lessons.ts
import { api } from './client';
import { Course, Lesson, Module } from './courses';

// Re-exportar para uso em outros componentes
export type { Lesson, Module } from './courses';

export interface LessonProgress {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
  completedAt?: string;
  watchTime: number; // tempo assistido em segundos
  totalDuration: number; // duração total em segundos
}

export interface LessonDetails extends Lesson {
  course: {
    id: string;
    title: string;
  };
  module: {
    id: string;
    title: string;
  };
  nextLesson?: {
    id: string;
    title: string;
  };
  previousLesson?: {
    id: string;
    title: string;
  };
  progress?: LessonProgress;
}

class LessonsService {
  async getLessonById(id: string): Promise<LessonDetails> {
    try {
      const response = await api.get<LessonDetails>(`/lessons/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching lesson ${id}:`, error);
      throw new Error('Aula não encontrada. Tente novamente.');
    }
  }

  async markLessonAsCompleted(lessonId: string, watchTime?: number): Promise<LessonProgress> {
    try {
      const response = await api.post<LessonProgress>(`/lessons/${lessonId}/progress`, {
        isCompleted: true,
        watchTime,
      });
      return response;
    } catch (error) {
      console.error(`Error marking lesson ${lessonId} as completed:`, error);
      throw new Error('Não foi possível marcar a aula como concluída. Tente novamente.');
    }
  }

  async updateLessonProgress(lessonId: string, watchTime: number): Promise<LessonProgress> {
    try {
      const response = await api.post<LessonProgress>(`/lessons/${lessonId}/progress`, {
        watchTime,
      });
      return response;
    } catch (error) {
      console.error(`Error updating lesson ${lessonId} progress:`, error);
      throw new Error('Não foi possível atualizar o progresso da aula. Tente novamente.');
    }
  }

  async getLessonProgress(lessonId: string): Promise<LessonProgress> {
    try {
      const response = await api.get<LessonProgress>(`/lessons/${lessonId}/progress`);
      return response;
    } catch (error) {
      console.error(`Error fetching lesson progress ${lessonId}:`, error);
      // Retorna progresso fictício se a API falhar
      return this.getMockLessonProgress(lessonId);
    }
  }

  async getCourseLessons(courseId: string): Promise<{ modules: Module[]; lessons: Lesson[] }> {
    try {
      const response = await api.get<{ modules: Module[]; lessons: Lesson[] }>(`/courses/${courseId}/lessons`);
      return response;
    } catch (error) {
      console.error(`Error fetching course lessons ${courseId}:`, error);
      throw new Error('Não foi possível carregar as aulas do curso. Tente novamente.');
    }
  }

  private getMockLessonProgress(lessonId: string): LessonProgress {
    return {
      lessonId,
      courseId: 'mock-course-1',
      isCompleted: false,
      watchTime: 0,
      totalDuration: 1800, // 30 minutos
    };
  }

  // Dados fictícios para quando a API não está disponível
  getMockLessonDetails(id: string): LessonDetails {
    return {
      id,
      title: `Aula ${id}: Introdução ao React`,
      description: 'Nesta aula vamos aprender os fundamentos do React, incluindo componentes, props e estado.',
      videoUrl: '/ti.mp4', // usando o vídeo existente
      duration: 30,
      order: 1,
      isCompleted: false,
      resources: [
        {
          id: '1',
          title: 'Slides da Aula',
          type: 'pdf',
          url: '/resources/slides.pdf',
        },
        {
          id: '2',
          title: 'Código Fonte',
          type: 'link',
          url: 'https://github.com/example/react-intro',
        },
      ],
      course: {
        id: 'course-1',
        title: 'Desenvolvimento Web Moderno',
      },
      module: {
        id: 'module-1',
        title: 'Módulo 1: Fundamentos',
      },
      nextLesson: {
        id: 'lesson-2',
        title: 'Aula 2: Componentes React',
      },
      progress: this.getMockLessonProgress(id),
    };
  }
}

export const lessonsService = new LessonsService();
