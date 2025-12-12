import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as any

// Test component
function TestComponent() {
  const { user, login, logout, register, isAuthenticated, loading } = useAuth()
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user-email">{user?.email || 'No User'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => register({ 
        email: 'test@test.com', 
        firstName: 'Test', 
        lastName: 'User', 
        password: 'password' 
      })}>Register</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
    expect(screen.getByTestId('user-email')).toHaveTextContent('No User')
  })

  it('should handle successful login', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        user: { 
          id: '1', 
          email: 'test@test.com', 
          firstName: 'Test',
          lastName: 'User',
          role: 'student' 
        }
      }
    }

    mockedAxios.post.mockResolvedValue(mockResponse)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@test.com')
    })

    expect(localStorage.getItem('token')).toBe('mock-token')
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/auth/login', {
      email: 'test@test.com',
      password: 'password'
    })
  })

  it('should handle login error', async () => {
    mockedAxios.post.mockRejectedValue(new Error('Login failed'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
    })
  })

  it('should handle successful registration', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        user: { 
          id: '1', 
          email: 'test@test.com', 
          firstName: 'Test',
          lastName: 'User',
          role: 'student' 
        }
      }
    }

    mockedAxios.post.mockResolvedValue(mockResponse)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const registerButton = screen.getByText('Register')
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@test.com')
    })

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/auth/register', {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password'
    })
  })

  it('should handle logout', async () => {
    // First login
    const mockResponse = {
      data: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        user: { 
          id: '1', 
          email: 'test@test.com', 
          firstName: 'Test',
          lastName: 'User',
          role: 'student' 
        }
      }
    }

    mockedAxios.post.mockResolvedValue(mockResponse)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Login first
    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    // Then logout
    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
      expect(screen.getByTestId('user-email')).toHaveTextContent('No User')
    })

    expect(localStorage.getItem('token')).toBeNull()
  })

  it('should handle registration with different roles', async () => {
    const mockResponse = {
      data: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        user: { 
          id: '1', 
          email: 'mentor@test.com', 
          firstName: 'Mentor',
          lastName: 'User',
          role: 'mentor' 
        }
      }
    }

    mockedAxios.post.mockResolvedValue(mockResponse)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Test mentor registration
    const registerButton = screen.getByText('Register')
    fireEvent.click(registerButton)

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated')
    })

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5000/auth/register', {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password'
    })
  })
})
