import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Notification } from '@/lib/api/notifications';

interface NotificationsStore {
  // Estado
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // Filtros
  filters: {
    unreadOnly: boolean;
    type: Notification['type'] | '';
    limit: number;
    offset: number;
  };
  
  // Preferências
  preferences: {
    email: boolean;
    push: boolean;
    courseUpdates: boolean;
    newLessons: boolean;
    announcements: boolean;
    promotions: boolean;
  };
  
  // Ações
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Filtros
  setFilters: (filters: Partial<NotificationsStore['filters']>) => void;
  clearFilters: () => void;
  
  // Preferências
  setPreferences: (preferences: Partial<NotificationsStore['preferences']>) => void;
  
  // Utilitários
  getFilteredNotifications: () => Notification[];
  getUnreadNotifications: () => Notification[];
  getNotificationById: (id: string) => Notification | undefined;
  getNotificationCount: () => number;
  
  // Reset
  reset: () => void;
}

const defaultFilters: NotificationsStore['filters'] = {
  unreadOnly: false,
  type: '',
  limit: 20,
  offset: 0,
};

const defaultPreferences: NotificationsStore['preferences'] = {
  email: true,
  push: true,
  courseUpdates: true,
  newLessons: true,
  announcements: true,
  promotions: false,
};

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,
      filters: defaultFilters,
      preferences: defaultPreferences,
      
      // Ações básicas
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount, loading: false, error: null });
      },
      
      addNotification: (notification) => {
        const notifications = get().notifications;
        const newNotifications = [notification, ...notifications];
        const unreadCount = newNotifications.filter(n => !n.isRead).length;
        set({ notifications: newNotifications, unreadCount });
      },
      
      updateNotification: (id, updates) => {
        const notifications = get().notifications;
        const updatedNotifications = notifications.map(notification =>
          notification.id === id ? { ...notification, ...updates } : notification
        );
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        set({ notifications: updatedNotifications, unreadCount });
      },
      
      removeNotification: (id) => {
        const notifications = get().notifications;
        const filteredNotifications = notifications.filter(n => n.id !== id);
        const unreadCount = filteredNotifications.filter(n => !n.isRead).length;
        set({ notifications: filteredNotifications, unreadCount });
      },
      
      markAsRead: (id) => {
        const notifications = get().notifications;
        const notification = notifications.find(n => n.id === id);
        if (notification && !notification.isRead) {
          get().updateNotification(id, { isRead: true });
        }
      },
      
      markAllAsRead: () => {
        const notifications = get().notifications;
        const updatedNotifications = notifications.map(notification => ({
          ...notification,
          isRead: true,
        }));
        set({ notifications: updatedNotifications, unreadCount: 0 });
      },
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error, loading: false }),
      
      clearError: () => set({ error: null }),
      
      // Filtros
      setFilters: (filters) => {
        const currentFilters = get().filters;
        set({ filters: { ...currentFilters, ...filters } });
      },
      
      clearFilters: () => set({ filters: defaultFilters }),
      
      // Preferências
      setPreferences: (preferences) => {
        const currentPreferences = get().preferences;
        set({ preferences: { ...currentPreferences, ...preferences } });
      },
      
      // Utilitários
      getFilteredNotifications: () => {
        const notifications = get().notifications;
        const filters = get().filters;
        
        return notifications.filter(notification => {
          // Unread only
          if (filters.unreadOnly && notification.isRead) {
            return false;
          }
          
          // Type
          if (filters.type && notification.type !== filters.type) {
            return false;
          }
          
          return true;
        });
      },
      
      getUnreadNotifications: () => {
        const notifications = get().notifications;
        return notifications.filter(n => !n.isRead);
      },
      
      getNotificationById: (id) => {
        const notifications = get().notifications;
        return notifications.find(n => n.id === id);
      },
      
      getNotificationCount: () => {
        const notifications = get().notifications;
        return notifications.length;
      },
      
      // Reset
      reset: () => set({
        notifications: [],
        unreadCount: 0,
        loading: false,
        error: null,
        filters: defaultFilters,
      }),
    }),
    {
      name: 'notifications-store',
      partialize: (state) => ({
        preferences: state.preferences,
        filters: state.filters,
      }),
    }
  )
);

// Selectores úteis
export const useNotifications = () => useNotificationsStore((state) => state.notifications);
export const useUnreadCount = () => useNotificationsStore((state) => state.unreadCount);
export const useNotificationsLoading = () => useNotificationsStore((state) => state.loading);
export const useNotificationsError = () => useNotificationsStore((state) => state.error);
export const useFilteredNotifications = () => useNotificationsStore((state) => state.getFilteredNotifications());
export const useUnreadNotifications = () => useNotificationsStore((state) => state.getUnreadNotifications());

// Hooks personalizados
export const useNotificationsManagement = () => {
  const {
    setNotifications,
    addNotification,
    updateNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    setLoading,
    setError,
    clearError,
  } = useNotificationsStore();
  
  return {
    setNotifications,
    addNotification,
    updateNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    setLoading,
    setError,
    clearError,
  };
};

export const useNotificationsFilters = () => {
  const filters = useNotificationsStore((state) => state.filters);
  const setFilters = useNotificationsStore((state) => state.setFilters);
  const clearFilters = useNotificationsStore((state) => state.clearFilters);
  
  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters({ [key]: value });
  };
  
  return {
    filters,
    setFilters,
    clearFilters,
    updateFilter,
  };
};

export const useNotificationsPreferences = () => {
  const preferences = useNotificationsStore((state) => state.preferences);
  const setPreferences = useNotificationsStore((state) => state.setPreferences);
  
  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences({ [key]: value });
  };
  
  return {
    preferences,
    setPreferences,
    updatePreference,
  };
};

// Hook para notificações em tempo real (WebSocket simulation)
export const useRealTimeNotifications = () => {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const preferences = useNotificationsStore((state) => state.preferences);
  
  // Simular recebimento de notificações em tempo real
  const simulateNotification = (type: Notification['type'], title: string, message: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    // Verificar preferências antes de adicionar
    const shouldAdd = 
      (type === 'info' && preferences.courseUpdates) ||
      (type === 'success' && preferences.newLessons) ||
      (type === 'warning' && preferences.announcements) ||
      (type === 'error' && preferences.promotions);
    
    if (shouldAdd) {
      addNotification(notification);
    }
  };
  
  return {
    simulateNotification,
  };
};
