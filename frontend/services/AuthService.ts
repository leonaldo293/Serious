import { api, handleResponse, handleError } from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: string
  phone?: string
  bio?: string
  location?: string
}

export interface AuthResponse {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    status: string
    createdAt: string
  }
  token: string
  refreshToken: string
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("AuthService: Logging in user:", credentials.email)
      const response = await api.post('/auth/login', credentials)
      console.log("AuthService: Login response:", response.data)
      
      const authData = handleResponse(response)
      
      // Store tokens in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token)
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      
      return authData
    } catch (error) {
      console.error("AuthService: Login error:", error)
      throw error
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log("AuthService: Registering user:", userData.email)
      const response = await api.post('/auth/register', userData)
      console.log("AuthService: Register response:", response.data)
      
      const authData = handleResponse(response)
      
      // Store tokens in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token)
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      
      return authData
    } catch (error) {
      console.error("AuthService: Register error:", error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      console.log("AuthService: Logging out user")
      await api.post('/auth/logout')
    } catch (error) {
      console.error("AuthService: Logout error:", error)
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear tokens from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      console.log("AuthService: Tokens cleared from localStorage")
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        console.log("AuthService: No refresh token found")
        return null
      }

      console.log("AuthService: Refreshing token")
      const response = await api.post('/auth/refresh', { refreshToken })
      console.log("AuthService: Refresh response:", response.data)
      
      const authData = handleResponse(response)
      
      // Update tokens in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token)
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      
      return authData
    } catch (error) {
      console.error("AuthService: Refresh token error:", error)
      // Clear tokens if refresh fails
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      return null
    }
  }

  async getCurrentUser(): Promise<any> {
    try {
      console.log("AuthService: Getting current user")
      const response = await api.get('/auth/me')
      console.log("AuthService: Current user response:", response.data)
      return handleResponse(response)
    } catch (error) {
      console.error("AuthService: Get current user error:", error)
      return null
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      console.log("AuthService: Requesting password reset for:", email)
      await api.post('/auth/forgot-password', { email })
      console.log("AuthService: Password reset email sent")
    } catch (error) {
      console.error("AuthService: Forgot password error:", error)
      throw error
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      console.log("AuthService: Resetting password")
      await api.post('/auth/reset-password', { token, newPassword })
      console.log("AuthService: Password reset successful")
    } catch (error) {
      console.error("AuthService: Reset password error:", error)
      throw error
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      console.log("AuthService: Changing password")
      await api.post('/auth/change-password', { currentPassword, newPassword })
      console.log("AuthService: Password changed successfully")
    } catch (error) {
      console.error("AuthService: Change password error:", error)
      throw error
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      console.log("AuthService: Verifying email")
      await api.post('/auth/verify-email', { token })
      console.log("AuthService: Email verified successfully")
    } catch (error) {
      console.error("AuthService: Verify email error:", error)
      throw error
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      console.log("AuthService: Resending verification email")
      await api.post('/auth/resend-verification')
      console.log("AuthService: Verification email sent")
    } catch (error) {
      console.error("AuthService: Resend verification error:", error)
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token')
    return !!token
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token')
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  // Social login methods
  async googleLogin(token: string): Promise<AuthResponse> {
    try {
      console.log("AuthService: Google login")
      const response = await api.post('/auth/google', { token })
      console.log("AuthService: Google login response:", response.data)
      
      const authData = handleResponse(response)
      
      // Store tokens in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token)
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      
      return authData
    } catch (error) {
      console.error("AuthService: Google login error:", error)
      throw error
    }
  }

  async facebookLogin(token: string): Promise<AuthResponse> {
    try {
      console.log("AuthService: Facebook login")
      const response = await api.post('/auth/facebook', { token })
      console.log("AuthService: Facebook login response:", response.data)
      
      const authData = handleResponse(response)
      
      // Store tokens in localStorage
      if (authData.token) {
        localStorage.setItem('token', authData.token)
      }
      if (authData.refreshToken) {
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      
      return authData
    } catch (error) {
      console.error("AuthService: Facebook login error:", error)
      throw error
    }
  }
}

export default new AuthService()
