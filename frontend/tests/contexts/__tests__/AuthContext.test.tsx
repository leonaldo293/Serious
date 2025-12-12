import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { mockAuthContext } from '../../setup'

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
    // Reset mock to default values
    Object.assign(mockAuthContext, {
      user: null,
      loading: false,
      isAuthenticated: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    })
  })

  it('should initialize with default values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated')
    expect(screen.getByTestId('user-email')).toHaveTextContent('No User')
  })

  it('should handle login call', async () => {
    const mockUser = { 
      id: '1', 
      email: 'test@test.com', 
      firstName: 'Test',
      lastName: 'User',
      role: 'student' 
    } as any

    mockAuthContext.login.mockResolvedValue({ success: true })
    mockAuthContext.user = mockUser
    mockAuthContext.isAuthenticated = true

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const loginButton = screen.getByText('Login')
    fireEvent.click(loginButton)

    expect(mockAuthContext.login).toHaveBeenCalledWith('test@test.com', 'password')
  })

  it('should handle logout', () => {
    mockAuthContext.user = { id: '1', email: 'test@test.com', role: 'student', firstName: 'Test', lastName: 'User' } as any
    mockAuthContext.isAuthenticated = true

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    expect(mockAuthContext.logout).toHaveBeenCalled()
  })

  it('should handle register call', () => {
    mockAuthContext.register.mockResolvedValue({ success: true })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const registerButton = screen.getByText('Register')
    fireEvent.click(registerButton)

    expect(mockAuthContext.register).toHaveBeenCalledWith({
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'password'
    })
  })
})
