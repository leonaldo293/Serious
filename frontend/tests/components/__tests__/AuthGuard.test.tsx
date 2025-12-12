import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthGuard from '@/components/AuthGuard'
import { AuthProvider } from '@/contexts/AuthContext'
import { mockAuthContext } from '../../setup'

describe('AuthGuard', () => {
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
      hasPermission: vi.fn().mockReturnValue(false)
    })
  })

  it('should show loading spinner while checking auth', () => {
    mockAuthContext.loading = true

    const { container } = render(
      <AuthProvider>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthProvider>
    )

    // Look for the spinner by its Tailwind classes
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-yellow-500')
  })

  it('should return null if user is not authenticated', () => {
    mockAuthContext.loading = false
    mockAuthContext.isAuthenticated = false

    const { container } = render(
      <AuthProvider>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthProvider>
    )

    // AuthGuard returns null when not authenticated
    expect(container.firstChild).toBeNull()
  })

  it('should render children if user is authenticated', () => {
    mockAuthContext.loading = false
    mockAuthContext.isAuthenticated = true
    mockAuthContext.user = { id: '1', email: 'test@example.com', role: 'student', firstName: 'Test', lastName: 'User' }

    render(
      <AuthProvider>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </AuthProvider>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should return null if user role is not authorized', () => {
    mockAuthContext.loading = false
    mockAuthContext.isAuthenticated = true
    mockAuthContext.user = { id: '1', email: 'test@example.com', role: 'student', firstName: 'Test', lastName: 'User' }

    const { container } = render(
      <AuthProvider>
        <AuthGuard requireRole="admin">
          <div>Admin Content</div>
        </AuthGuard>
      </AuthProvider>
    )

    // AuthGuard returns null when role is not authorized
    expect(container.firstChild).toBeNull()
  })

  it('should render children if user role is authorized', () => {
    mockAuthContext.loading = false
    mockAuthContext.isAuthenticated = true
    mockAuthContext.user = { id: '1', email: 'admin@example.com', role: 'admin', firstName: 'Admin', lastName: 'User' }

    render(
      <AuthProvider>
        <AuthGuard requireRole="admin">
          <div>Admin Content</div>
        </AuthGuard>
      </AuthProvider>
    )

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
