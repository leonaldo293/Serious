import { api } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: 'admin' | 'user' | 'instructor' | 'mentor';
      avatar?: string;
      isEmailVerified: boolean;
      createdAt: string;
    };
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to login');
      }
      throw new Error('Failed to login');
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to register');
      }
      throw new Error('Failed to register');
    }
  },

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await api.post<{ access_token: string; refresh_token: string }>('/auth/refresh', { refreshToken });
      return {
        token: response.access_token,
        refreshToken: response.refresh_token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to refresh token');
      }
      throw new Error('Failed to refresh token');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<AuthResponse['data']['user']> {
    try {
      const response = await api.get<AuthResponse['data']['user']>('/users/profile');
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to get current user');
      }
      throw new Error('Failed to get current user');
    }
  }
};

export default authService;
