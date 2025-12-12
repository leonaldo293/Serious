// services/notifications.ts
import { apiClient } from '../api/apiClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  newLessons: boolean;
  announcements: boolean;
  promotions: boolean;
}

class NotificationsService {
  async getNotifications(params?: {
    unreadOnly?: boolean;
    type?: Notification['type'];
    limit?: number;
    offset?: number;
  }): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
    try {
      const response = await apiClient.get('/notifications', params);
      return response.data as { notifications: Notification[]; total: number; unreadCount: number };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Retorna dados fictícios se a API falhar
      return this.getMockNotifications(params);
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`, {});
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw new Error('Não foi possível marcar notificação como lida. Tente novamente.');
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.patch('/notifications/read-all', {});
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Não foi possível marcar todas as notificações como lidas. Tente novamente.');
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw new Error('Não foi possível excluir notificação. Tente novamente.');
    }
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.get('/notifications/preferences');
      return response.data as NotificationPreferences;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      // Retorna preferências padrão se a API falhar
      return this.getDefaultPreferences();
    }
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.put('/notifications/preferences', preferences);
      return response.data as NotificationPreferences;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw new Error('Não foi possível atualizar preferências. Tente novamente.');
    }
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: true,
      push: true,
      courseUpdates: true,
      newLessons: true,
      announcements: true,
      promotions: false,
    };
  }

  private getMockNotifications(params?: {
    unreadOnly?: boolean;
    type?: Notification['type'];
    limit?: number;
  }): { notifications: Notification[]; total: number; unreadCount: number } {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nova aula disponível',
        message: 'A aula "Hooks Avançados do React" já está disponível no seu curso.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        actionUrl: '/lessons/react-hooks-advanced',
        actionText: 'Ver Aula',
      },
      {
        id: '2',
        title: 'Parabéns pela conclusão!',
        message: 'Você completou o curso "Fundamentos de JavaScript". Baixe seu certificado!',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
        actionUrl: '/certificates/js-fundamentals',
        actionText: 'Ver Certificado',
      },
      {
        id: '3',
        title: 'Lembrete de estudo',
        message: 'Você não acessa o curso há 3 dias. Continue aprendendo!',
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
        actionUrl: '/dashboard',
        actionText: 'Ir para Dashboard',
      },
      {
        id: '4',
        title: 'Novo curso disponível',
        message: 'Conheça nosso novo curso "Desenvolvimento Mobile com React Native".',
        type: 'info',
        isRead: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
        actionUrl: '/courses/react-native',
        actionText: 'Ver Curso',
      },
      {
        id: '5',
        title: 'Manutenção programada',
        message: 'O sistema estará em manutenção no dia 30/11 das 02:00 às 04:00.',
        type: 'error',
        isRead: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
      },
    ];

    let filteredNotifications = mockNotifications;

    if (params?.unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    }

    if (params?.type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === params.type);
    }

    if (params?.limit) {
      filteredNotifications = filteredNotifications.slice(0, params.limit);
    }

    return {
      notifications: filteredNotifications,
      total: mockNotifications.length,
      unreadCount: mockNotifications.filter(n => !n.isRead).length,
    };
  }

  // Formata o tempo relativo da notificação
  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Agora pouco';
    } else if (diffHours < 24) {
      return `Há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else if (diffDays < 7) {
      return `Há ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  }
}

export const notificationsService = new NotificationsService();
