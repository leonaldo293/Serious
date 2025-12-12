import { apiClient } from '../api/apiClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

class NotificationService {
  private pushSubscription: PushSubscription | null = null;

  /**
   * Initialize push notifications
   */
  async initializePushNotifications(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.getVAPIDPublicKey(),
      });

      this.pushSubscription = subscription;
      
      // Send subscription to server
      await this.sendPushSubscriptionToServer(subscription);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Get VAPID public key
   */
  private getVAPIDPublicKey(): string {
    // This should come from your backend
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
  }

  /**
   * Send push subscription to server
   */
  private async sendPushSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await apiClient.post('/api/notifications/subscribe', {
        subscription,
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const response = await apiClient.get(`/api/notifications/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.patch(`/api/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      await apiClient.patch(`/api/notifications/${userId}/read-all`);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }

  /**
   * Send email notification
   */
  async sendEmail(emailData: EmailNotification): Promise<void> {
    try {
      await apiClient.post('/api/notifications/email', emailData);
    } catch (error) {
      console.error('Failed to send email notification:', error);
      throw error;
    }
  }

  /**
   * Send push notification (from server)
   */
  async sendPushNotification(userId: string, notification: PushNotification): Promise<void> {
    try {
      await apiClient.post('/api/notifications/push', {
        userId,
        notification,
      });
    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  /**
   * Create in-app notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    try {
      const response = await apiClient.post('/api/notifications', notification);
      return response.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'Bem-vindo ao ELTx HUB! 🎓',
      template: 'welcome',
      data: {
        userName,
        loginUrl: `${window.location.origin}/login`,
        supportEmail: 'support@eltx-hub.com',
      },
    });
  }

  /**
   * Send course enrollment confirmation
   */
  async sendCourseEnrollmentEmail(userEmail: string, userName: string, courseName: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: `Inscrição Confirmada: ${courseName} 🎓`,
      template: 'course-enrollment',
      data: {
        userName,
        courseName,
        dashboardUrl: `${window.location.origin}/dashboard`,
        courseUrl: `${window.location.origin}/courses`,
      },
    });
  }

  /**
   * Send assignment reminder
   */
  async sendAssignmentReminder(userEmail: string, userName: string, assignmentTitle: string, dueDate: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: `Lembrete: Tarefa para Entregar - ${assignmentTitle} ⏰`,
      template: 'assignment-reminder',
      data: {
        userName,
        assignmentTitle,
        dueDate,
        dashboardUrl: `${window.location.origin}/dashboard`,
      },
    });
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmationEmail(userEmail: string, userName: string, amount: number, courseName?: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'Pagamento Confirmado - ELTx HUB 💳',
      template: 'payment-confirmation',
      data: {
        userName,
        amount,
        courseName,
        receiptUrl: `${window.location.origin}/profile/receipts`,
      },
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<void> {
    await this.sendEmail({
      to: userEmail,
      subject: 'Redefinição de Senha - ELTx HUB 🔐',
      template: 'password-reset',
      data: {
        resetUrl: `${window.location.origin}/reset-password?token=${resetToken}`,
        supportEmail: 'support@eltx-hub.com',
      },
    });
  }

  /**
   * Show browser notification
   */
  showBrowserNotification(title: string, options: NotificationOptions = {}): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/logo.jpeg',
        badge: '/logo-no-bg.png',
        ...options,
      });
    }
  }

  /**
   * Schedule notification
   */
  async scheduleNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>, scheduledFor: Date): Promise<void> {
    try {
      await apiClient.post('/api/notifications/schedule', {
        notification,
        scheduledFor,
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(userId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/notifications/preferences/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      return {};
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(userId: string, preferences: any): Promise<void> {
    try {
      await apiClient.patch(`/api/notifications/preferences/${userId}`, preferences);
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
