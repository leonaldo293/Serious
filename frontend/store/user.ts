import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/lib/api/user';

interface UserStore {
  // Estado
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  // Preferências
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt' | 'en';
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  
  // Estatísticas
  statistics: {
    coursesEnrolled: number;
    coursesCompleted: number;
    totalHoursWatched: number;
    certificatesEarned: number;
    streakDays: number;
  };
  
  // Ações
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updatePreferences: (preferences: Partial<UserStore['preferences']>) => void;
  updateStatistics: (statistics: Partial<UserStore['statistics']>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      loading: false,
      error: null,
      
      preferences: {
        theme: 'system',
        language: 'pt',
        emailNotifications: true,
        pushNotifications: false,
      },
      
      statistics: {
        coursesEnrolled: 0,
        coursesCompleted: 0,
        totalHoursWatched: 0,
        certificatesEarned: 0,
        streakDays: 0,
      },
      
      // Ações
      setUser: (user) => {
        set({ 
          user, 
          loading: false, 
          error: null,
          statistics: user.statistics,
          preferences: {
            ...get().preferences,
            ...user.preferences,
          }
        });
      },
      
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
        }
      },
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error, loading: false }),
      
      clearError: () => set({ error: null }),
      
      updatePreferences: (preferences) => {
        const currentPreferences = get().preferences;
        const newPreferences = { ...currentPreferences, ...preferences };
        set({ preferences: newPreferences });
        
        // Atualiza também no user se existir
        const currentUser = get().user;
        if (currentUser) {
          get().updateUser({ preferences: newPreferences });
        }
      },
      
      updateStatistics: (statistics) => {
        const currentStatistics = get().statistics;
        const newStatistics = { ...currentStatistics, ...statistics };
        set({ statistics: newStatistics });
        
        // Atualiza também no user se existir
        const currentUser = get().user;
        if (currentUser) {
          get().updateUser({ statistics: newStatistics });
        }
      },
      
      logout: () => {
        set({
          user: null,
          loading: false,
          error: null,
          preferences: {
            theme: 'system',
            language: 'pt',
            emailNotifications: true,
            pushNotifications: false,
          },
          statistics: {
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalHoursWatched: 0,
            certificatesEarned: 0,
            streakDays: 0,
          },
        });
      },
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        preferences: state.preferences,
        statistics: state.statistics,
      }),
    }
  )
);

// Selectores úteis
export const useUser = () => useUserStore((state) => state.user);
export const useUserPreferences = () => useUserStore((state) => state.preferences);
export const useUserStatistics = () => useUserStore((state) => state.statistics);
export const useUserLoading = () => useUserStore((state) => state.loading);
export const useUserError = () => useUserStore((state) => state.error);

// Hooks personalizados
export const useTheme = () => {
  const preferences = useUserPreferences();
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    updatePreferences({ theme });
    
    // Aplica o tema imediatamente
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
  };
  
  return {
    theme: preferences.theme,
    setTheme,
  };
};

export const useLanguage = () => {
  const preferences = useUserPreferences();
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  
  const setLanguage = (language: 'pt' | 'en') => {
    updatePreferences({ language });
  };
  
  return {
    language: preferences.language,
    setLanguage,
  };
};

export const useNotifications = () => {
  const preferences = useUserPreferences();
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  
  const setEmailNotifications = (enabled: boolean) => {
    updatePreferences({ emailNotifications: enabled });
  };
  
  const setPushNotifications = (enabled: boolean) => {
    updatePreferences({ pushNotifications: enabled });
  };
  
  return {
    emailNotifications: preferences.emailNotifications,
    pushNotifications: preferences.pushNotifications,
    setEmailNotifications,
    setPushNotifications,
  };
};
