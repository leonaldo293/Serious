// services/user.ts
import { apiClient } from '../api/apiClient';
import { User } from '@/contexts/AuthContext';

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  phone?: string;
  dateOfBirth?: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: 'pt' | 'en';
    theme: 'light' | 'dark' | 'system';
  };
  statistics: {
    coursesEnrolled: number;
    coursesCompleted: number;
    totalHoursWatched: number;
    certificatesEarned: number;
    streakDays: number;
  };
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  phone?: string;
  dateOfBirth?: string;
  preferences?: Partial<UserProfile['preferences']>;
}

class UserService {
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/users/me');
      return response.data as UserProfile;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw new Error('Não foi possível carregar seus dados. Tente novamente.');
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/users/me', data);
      return response.data as UserProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Não foi possível atualizar seu perfil. Tente novamente.');
    }
  }

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.upload('/users/me/avatar', formData);
      return response.data as { avatarUrl: string };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Não foi possível enviar sua foto. Tente novamente.');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await apiClient.delete('/users/me');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Não foi possível excluir sua conta. Tente novamente.');
    }
  }

  async getUserStatistics(): Promise<UserProfile['statistics']> {
    try {
      const response = await apiClient.get('/users/me/statistics');
      return response.data as UserProfile['statistics'];
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      throw new Error('Não foi possível carregar suas estatísticas. Tente novamente.');
    }
  }

  private getMockStatistics(): UserProfile['statistics'] {
    return {
      coursesEnrolled: 5,
      coursesCompleted: 2,
      totalHoursWatched: 47,
      certificatesEarned: 2,
      streakDays: 15,
    };
  }

  // Validação do formulário de perfil
  validateProfileData(data: UpdateProfileData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (data.firstName && data.firstName.trim().length < 2) {
      errors.firstName = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (data.lastName && data.lastName.trim().length < 2) {
      errors.lastName = 'Sobrenome deve ter pelo menos 2 caracteres';
    }

    if (data.bio && data.bio.length > 500) {
      errors.bio = 'Bio deve ter no máximo 500 caracteres';
    }

    if (data.website && !this.isValidUrl(data.website)) {
      errors.website = 'Website inválido';
    }

    if (data.linkedin && !this.isValidUrl(data.linkedin)) {
      errors.linkedin = 'LinkedIn inválido';
    }

    if (data.github && !this.isValidUrl(data.github)) {
      errors.github = 'GitHub inválido';
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.phone = 'Telefone inválido';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  }

  // Dados fictícios para quando a API não está disponível
  getMockCurrentUser(): UserProfile {
    return {
      id: 'mock-user-1',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@example.com',
      role: 'student',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      bio: 'Desenvolvedor apaixonado por tecnologia e aprendizado contínuo.',
      location: 'São Paulo, Brasil',
      website: 'https://joaosilva.dev',
      linkedin: 'https://linkedin.com/in/joaosilva',
      github: 'https://github.com/joaosilva',
      phone: '+55 11 98765-4321',
      preferences: {
        emailNotifications: true,
        pushNotifications: false,
        language: 'pt',
        theme: 'system'
      },
      statistics: this.getMockStatistics(),
    };
  }
}

export const userService = new UserService();
