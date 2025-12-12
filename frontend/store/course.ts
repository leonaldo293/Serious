import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, CourseProgress } from '@/lib/api/courses';

interface CourseStore {
  // Estado
  courses: Course[];
  currentCourse: Course | null;
  courseProgress: Record<string, CourseProgress>;
  loading: boolean;
  error: string | null;
  
  // Filtros
  filters: {
    category: string;
    level: string;
    search: string;
    priceRange: [number, number];
    duration: [number, number];
  };
  
  // Paginação
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Favoritos
  favorites: string[];
  
  // Ações
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCourseProgress: (courseId: string, progress: CourseProgress) => void;
  updateCourseProgress: (courseId: string, updates: Partial<CourseProgress>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Filtros
  setFilters: (filters: Partial<CourseStore['filters']>) => void;
  clearFilters: () => void;
  
  // Paginação
  setPagination: (pagination: Partial<CourseStore['pagination']>) => void;
  
  // Favoritos
  toggleFavorite: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
  
  // Utilitários
  getFilteredCourses: () => Course[];
  getCourseById: (id: string) => Course | undefined;
  getProgressPercentage: (courseId: string) => number;
  
  // Reset
  reset: () => void;
}

const defaultFilters: CourseStore['filters'] = {
  category: '',
  level: '',
  search: '',
  priceRange: [0, 1000],
  duration: [0, 100],
};

const defaultPagination: CourseStore['pagination'] = {
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 0,
};

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      courses: [],
      currentCourse: null,
      courseProgress: {},
      loading: false,
      error: null,
      filters: defaultFilters,
      pagination: defaultPagination,
      favorites: [],
      
      // Ações básicas
      setCourses: (courses) => set({ courses, loading: false, error: null }),
      
      addCourse: (course) => {
        const courses = get().courses;
        set({ courses: [...courses, course] });
      },
      
      updateCourse: (id, updates) => {
        const courses = get().courses;
        const updatedCourses = courses.map(course =>
          course.id === id ? { ...course, ...updates } : course
        );
        set({ courses: updatedCourses });
      },
      
      removeCourse: (id) => {
        const courses = get().courses;
        const filteredCourses = courses.filter(course => course.id !== id);
        set({ courses: filteredCourses });
      },
      
      setCurrentCourse: (course) => set({ currentCourse: course }),
      
      setCourseProgress: (courseId, progress) => {
        const courseProgress = get().courseProgress;
        set({ courseProgress: { ...courseProgress, [courseId]: progress } });
      },
      
      updateCourseProgress: (courseId, updates) => {
        const courseProgress = get().courseProgress;
        const currentProgress = courseProgress[courseId];
        if (currentProgress) {
          set({
            courseProgress: {
              ...courseProgress,
              [courseId]: { ...currentProgress, ...updates }
            }
          });
        }
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
      
      // Paginação
      setPagination: (pagination) => {
        const currentPagination = get().pagination;
        set({ pagination: { ...currentPagination, ...pagination } });
      },
      
      // Favoritos
      toggleFavorite: (courseId) => {
        const favorites = get().favorites;
        const newFavorites = favorites.includes(courseId)
          ? favorites.filter(id => id !== courseId)
          : [...favorites, courseId];
        set({ favorites: newFavorites });
      },
      
      isFavorite: (courseId) => {
        const favorites = get().favorites;
        return favorites.includes(courseId);
      },
      
      // Utilitários
      getFilteredCourses: () => {
        const courses = get().courses;
        const filters = get().filters;
        
        return courses.filter(course => {
          // Categoria
          if (filters.category && course.category.toLowerCase() !== filters.category.toLowerCase()) {
            return false;
          }
          
          // Nível
          if (filters.level && course.level !== filters.level) {
            return false;
          }
          
          // Search
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesSearch = 
              course.title.toLowerCase().includes(searchLower) ||
              course.description.toLowerCase().includes(searchLower) ||
              course.instructor?.name?.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }
          
          // Preço
          if (course.price < filters.priceRange[0] || course.price > filters.priceRange[1]) {
            return false;
          }
          
          // Duração
          const courseDuration = parseFloat(course.duration) || 0;
          if (courseDuration < filters.duration[0] || courseDuration > filters.duration[1]) {
            return false;
          }
          
          return true;
        });
      },
      
      getCourseById: (id) => {
        const courses = get().courses;
        return courses.find(course => course.id === id);
      },
      
      getProgressPercentage: (courseId) => {
        const courseProgress = get().courseProgress;
        const progress = courseProgress[courseId];
        return progress ? progress.progressPercentage : 0;
      },
      
      // Reset
      reset: () => set({
        courses: [],
        currentCourse: null,
        courseProgress: {},
        loading: false,
        error: null,
        filters: defaultFilters,
        pagination: defaultPagination,
      }),
    }),
    {
      name: 'course-store',
      partialize: (state) => ({
        favorites: state.favorites,
        filters: state.filters,
      }),
    }
  )
);

// Selectores úteis
export const useCourses = () => useCourseStore((state) => state.courses);
export const useCurrentCourse = () => useCourseStore((state) => state.currentCourse);
export const useCourseLoading = () => useCourseStore((state) => state.loading);
export const useCourseError = () => useCourseStore((state) => state.error);
export const useFilteredCourses = () => useCourseStore((state) => state.getFilteredCourses());

// Hooks personalizados
export const useCourseManagement = () => {
  const {
    setCourses,
    addCourse,
    updateCourse,
    removeCourse,
    setCurrentCourse,
    setLoading,
    setError,
    clearError,
  } = useCourseStore();
  
  return {
    setCourses,
    addCourse,
    updateCourse,
    removeCourse,
    setCurrentCourse,
    setLoading,
    setError,
    clearError,
  };
};

export const useCourseFilters = () => {
  const filters = useCourseStore((state) => state.filters);
  const setFilters = useCourseStore((state) => state.setFilters);
  const clearFilters = useCourseStore((state) => state.clearFilters);
  
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

export const useCourseFavorites = () => {
  const favorites = useCourseStore((state) => state.favorites);
  const toggleFavorite = useCourseStore((state) => state.toggleFavorite);
  const isFavorite = useCourseStore((state) => state.isFavorite);
  
  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length,
  };
};

export const useCourseProgress = () => {
  const courseProgress = useCourseStore((state) => state.courseProgress);
  const setCourseProgress = useCourseStore((state) => state.setCourseProgress);
  const updateCourseProgress = useCourseStore((state) => state.updateCourseProgress);
  const getProgressPercentage = useCourseStore((state) => state.getProgressPercentage);
  
  const getProgress = (courseId: string) => courseProgress[courseId];
  const hasProgress = (courseId: string) => !!courseProgress[courseId];
  const isCompleted = (courseId: string) => {
    const progress = courseProgress[courseId];
    return progress ? progress.progressPercentage === 100 : false;
  };
  
  return {
    courseProgress,
    setCourseProgress,
    updateCourseProgress,
    getProgressPercentage,
    getProgress,
    hasProgress,
    isCompleted,
  };
};
