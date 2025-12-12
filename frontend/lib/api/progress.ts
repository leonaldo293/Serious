// API service para progresso do usuário
import { api } from './client';

export interface LessonProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completedAt: string;
  timeSpent: number; // em minutos
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  timeSpent: number; // total em minutos
  lastAccessedAt: string;
  startedAt: string;
  completedAt?: string;
}

export interface UserProgress {
  userId: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalHoursWatched: number;
  streakDays: number;
  certificatesEarned: number;
  currentCourses: CourseProgress[];
}

class ProgressService {
  // Marcar lição como concluída
  async completeLesson(courseId: string, lessonId: string): Promise<CourseProgress> {
    try {
      const response = await api.post('/progress/complete', {
        courseId,
        lessonId
      }) as CourseProgress;
      return response;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw new Error('Não foi possível marcar a lição como concluída.');
    }
  }

  // Obter progresso de um curso específico
  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    try {
      const response = await api.get('/progress/course/' + courseId) as CourseProgress;
      return response;
    } catch (error) {
      console.error('Error fetching course progress:', error);
      throw new Error('Não foi possível carregar o progresso do curso.');
    }
  }

  // Obter todo o progresso do usuário
  async getUserProgress(): Promise<UserProgress> {
    try {
      const response = await api.get('/progress/user') as UserProgress;
      return response;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw new Error('Não foi possível carregar o progresso do usuário.');
    }
  }

  // Atualizar tempo assistido em uma lição
  async updateLessonTime(
    courseId: string, 
    lessonId: string, 
    timeSpent: number
  ): Promise<void> {
    try {
      await api.post(`/progress/time`, {
        courseId,
        lessonId,
        timeSpent
      });
    } catch (error) {
      console.error('Error updating lesson time:', error);
      // Silenciosamente falhar - não é crítico
    }
  }

  // Obter lições concluídas de um curso
  async getCompletedLessons(courseId: string): Promise<string[]> {
    try {
      const response = await api.get('/progress/course/' + courseId + '/lessons') as { completedLessons: string[] };
      return response.completedLessons;
    } catch (error) {
      console.error('Error fetching completed lessons:', error);
      return [];
    }
  }

  // Verificar se lição está concluída
  async isLessonCompleted(courseId: string, lessonId: string): Promise<boolean> {
    try {
      const response = await api.get('/progress/course/' + courseId + '/lesson/' + lessonId) as { completed: boolean };
      return response.completed;
    } catch (error) {
      console.error('Error checking lesson completion:', error);
      return false;
    }
  }

  // Resetar progresso de um curso (admin function)
  async resetCourseProgress(courseId: string, userId?: string): Promise<void> {
    try {
      await api.delete('/progress/course/' + courseId, {
        body: JSON.stringify({ userId })
      });
    } catch (error) {
      console.error('Error resetting course progress:', error);
      throw new Error('Não foi possível resetar o progresso do curso.');
    }
  }

  // Obter estatísticas detalhadas
  async getDetailedStats(): Promise<{
    weeklyProgress: any[];
    monthlyProgress: any[];
    courseCompletionRate: number;
    averageTimePerLesson: number;
    mostActiveDay: string;
  }> {
    try {
      const response = await api.get('/progress/stats') as {
        weeklyProgress: any[];
        monthlyProgress: any[];
        courseCompletionRate: number;
        averageTimePerLesson: number;
        mostActiveDay: string;
      };
      return response;
    } catch (error) {
      console.error('Error fetching detailed stats:', error);
      // Retornar dados mock se falhar
      return this.getMockStats();
    }
  }

  private getMockStats() {
    return {
      weeklyProgress: [],
      monthlyProgress: [],
      courseCompletionRate: 0,
      averageTimePerLesson: 0,
      mostActiveDay: 'Monday'
    };
  }

  // Calcular progresso localmente (para otimização)
  calculateProgress(completedLessons: number, totalLessons: number): number {
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  }

  // Formatar tempo em minutos para formato legível
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}min`;
    } else if (minutes < 1440) { // Menos de 24 horas
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  }

  // Obter cor baseada no progresso
  getProgressColor(percentage: number): string {
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-orange-500';
    if (percentage < 75) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-blue-500';
    return 'bg-green-500';
  }

  // Obter texto baseado no progresso
  getProgressText(percentage: number): string {
    if (percentage === 0) return 'Não iniciado';
    if (percentage < 25) return 'Começando';
    if (percentage < 50) return 'Em progresso';
    if (percentage < 75) return 'Bom progresso';
    if (percentage < 100) return 'Quase lá!';
    return 'Concluído';
  }
}

export const progressService = new ProgressService();
