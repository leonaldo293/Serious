// services/courses.ts
import { apiClient } from '../api/apiClient';

// API Response types
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // mudado para string para "8h", "40min", etc
  image?: string;
  thumbnail?: string; // adicionado
  instructor?: { // mudado para objeto
    name: string;
    title: string;
    avatar?: string;
  };
  price: number;
  rating: number;
  enrolledCount: number;
  isFree?: boolean; // adicionado
  modules: Module[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // em minutos
  order: number;
  isCompleted?: boolean;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'download';
  url: string;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progressPercentage: number;
  lastAccessedAt: string;
}

class CoursesService {
  async getCourses(params?: {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ courses: Course[]; total: number; page: number; totalPages: number }> {
    try {
      console.log('Using mock data for courses list');
      // Retorna dados mock diretamente
      const mockCourses = this.getMockFeaturedCourses(params?.limit || 10);
      
      // Aplica filtros se fornecidos
      let filteredCourses = mockCourses;
      
      if (params?.category) {
        filteredCourses = filteredCourses.filter(course => 
          course.category.toLowerCase().includes(params.category!.toLowerCase())
        );
      }
      
      if (params?.level) {
        filteredCourses = filteredCourses.filter(course => 
          course.level === params.level
        );
      }
      
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)
        );
      }
      
      return {
        courses: filteredCourses,
        total: filteredCourses.length,
        page: params?.page || 1,
        totalPages: 1
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Não foi possível carregar os cursos. Tente novamente.');
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      // Verificar se temos dados mock para este ID
      const mockCourses = this.getMockFeaturedCourses(10);
      const mockCourse = mockCourses.find(course => course.id === id);
      
      if (mockCourse) {
        console.log(`Using mock data for course ${id}`);
        return mockCourse;
      }
      
      // Se não encontrar nos mock, tentar a API
      const response = await apiClient.get(`/courses/${id}`);
      return response.data as Course;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      // Se a API falhar, retornar um curso mock padrão
      const mockCourses = this.getMockFeaturedCourses(3);
      const fallbackCourse = mockCourses[0]; // Retorna o primeiro curso como fallback
      if (fallbackCourse) {
        console.log(`Using fallback mock data for course ${id}`);
        return { ...fallbackCourse, id };
      }
      throw new Error('Curso não encontrado. Tente novamente.');
    }
  }

  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    try {
      // Retorna dados mock de progresso
      console.log(`Using mock data for course progress ${courseId}`);
      return {
        courseId,
        completedLessons: [],
        totalLessons: 12,
        progressPercentage: 0,
        lastAccessedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching course progress ${courseId}:`, error);
      throw new Error('Não foi possível carregar o progresso do curso.');
    }
  }

  async enrollInCourse(courseId: string): Promise<void> {
    try {
      console.log(`Mock enrollment in course ${courseId}`);
      // Simula inscrição bem-sucedida
      return Promise.resolve();
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw new Error('Não foi possível se inscrever no curso. Tente novamente.');
    }
  }

  async updateProgress(courseId: string, lessonId: string): Promise<CourseProgress> {
    try {
      console.log(`Mock updating progress for course ${courseId}, lesson ${lessonId}`);
      // Simula atualização de progresso
      return {
        courseId,
        completedLessons: [lessonId],
        totalLessons: 12,
        progressPercentage: 8.33, // 1/12 * 100
        lastAccessedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error updating progress:`, error);
      throw new Error('Não foi possível atualizar o progresso. Tente novamente.');
    }
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    try {
      console.log(`Using mock data for course lessons ${courseId}`);
      // Retorna lições mock
      return [
        {
          id: 'lesson-1',
          title: 'Introdução ao Curso',
          description: 'Visão geral do curso e objetivos de aprendizagem',
          videoUrl: 'https://example.com/video1.mp4',
          duration: 15,
          order: 1,
          isCompleted: false,
          resources: []
        },
        {
          id: 'lesson-2',
          title: 'Módulo 1: Conceitos Básicos',
          description: 'Aprendendo os fundamentos',
          videoUrl: 'https://example.com/video2.mp4',
          duration: 30,
          order: 2,
          isCompleted: false,
          resources: []
        }
      ];
    } catch (error) {
      console.error(`Error fetching course lessons ${courseId}:`, error);
      throw new Error('Não foi possível carregar as aulas do curso.');
    }
  }

  async checkCourseAccess(courseId: string): Promise<boolean> {
    try {
      console.log(`Using mock data for course access ${courseId}`);
      // Simula acesso ao curso (sempre true para desenvolvimento)
      return true;
    } catch (error) {
      console.error(`Error checking course access ${courseId}:`, error);
      return false;
    }
  }

  async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    // Retorna dados mock diretamente para evitar erro de rede
    console.log('CoursesService: Using mock data for featured courses');
    return this.getMockFeaturedCourses(limit);
  }

  private getMockFeaturedCourses(limit: number): Course[] {
    const featuredCourses = [
      {
        id: 'ingles-bootcamp',
        title: 'Inglês Bootcamp',
        description: 'Treinamento acelerado da língua inglesa com foco em comunicação profissional. E-book e plataforma digital, básico ao avançado.',
        category: 'Idiomas',
        level: 'beginner' as const,
        duration: '4 semanas',
        image: '/courses/1.png',
        thumbnail: '/courses/1.png',
        instructor: {
          name: 'ELTx Team',
          title: 'Language Experts'
        },
        price: 30000,
        rating: 4.9,
        enrolledCount: 2500,
        isFree: false,
        modules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'engenharia-prompt',
        title: 'Engenharia de Prompt',
        description: 'Técnicas avançadas de prompt para criação de negócios e gestão de projetos. E-books e plataforma digital, 1.000 prompts/business.',
        category: 'IA & Tecnologia',
        level: 'advanced' as const,
        duration: '3 horas por sessão',
        image: '/courses/2.png',
        thumbnail: '/courses/2.png',
        instructor: {
          name: 'ELTx Team',
          title: 'AI Experts'
        },
        price: 55000,
        rating: 4.8,
        enrolledCount: 1800,
        isFree: false,
        modules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'google-workspace',
        title: 'Pacote Google Workspace',
        description: 'Ferramentas modernas da Google: Gsheets, Gdocs, Gformulário, Gmail, Gdrive, Gmeet, etc. Ferramentas Google + IA.',
        category: 'Produtividade',
        level: 'beginner' as const,
        duration: '3 horas por sessão',
        image: '/courses/Firefly_Gemini Flash_imagem que demostra Pacote Google Workspace 1281.png',
        thumbnail: '/courses/Firefly_Gemini Flash_imagem que demostra Pacote Google Workspace 1281.png',
        instructor: {
          name: 'ELTx Team',
          title: 'Productivity Experts'
        },
        price: 45000,
        rating: 4.7,
        enrolledCount: 3200,
        isFree: false,
        modules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'fullcycle-intensivo',
        title: 'FullCycle Intensivo',
        description: 'Curso completo de desenvolvimento FullCycle com foco em arquitetura de software, microsserviços, DevOps e boas práticas. Projeto prático final com deploy em produção.',
        category: 'Desenvolvimento',
        level: 'intermediate' as const,
        duration: '12 semanas intensivas',
        image: '/courses/3.png',
        thumbnail: '/courses/3.png',
        instructor: {
          name: 'ELTx Team',
          title: 'FullCycle Experts'
        },
        price: 95000,
        rating: 4.9,
        enrolledCount: 850,
        isFree: false,
        modules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'fullstack-intensivo',
        title: 'Full Stack Intensivo',
        description: 'Treinamento completo em desenvolvimento Full Stack com React, Node.js, TypeScript, bancos de dados e deploy. Construa aplicações web modernas do zero.',
        category: 'Desenvolvimento',
        level: 'intermediate' as const,
        duration: '10 semanas intensivas',
        image: '/courses/Firefly_Gemini Flash_Empreendedorismo Digital 1281.png',
        thumbnail: '/courses/Firefly_Gemini Flash_Empreendedorismo Digital 1281.png',
        instructor: {
          name: 'ELTx Team',
          title: 'Full Stack Experts'
        },
        price: 95000,
        rating: 4.8,
        enrolledCount: 1200,
        isFree: false,
        modules: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    return featuredCourses.slice(0, limit);
  }
}

export const coursesService = new CoursesService();
