import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/dashboard'
  }),
  usePathname: () => '/dashboard'
}))

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: vi.fn()
}))

import { useAuth } from '@/contexts/AuthContext'

describe('Navbar Component', () => {
  const mockUseAuth = vi.mocked(useAuth)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show login/register buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Registrar')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('should show dashboard link when authenticated as student', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'student@test.com', role: 'student', firstName: 'Student', lastName: 'User' },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
    expect(screen.queryByText('Registrar')).not.toBeInTheDocument()
  })

  it('should show admin links when authenticated as admin', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'admin@test.com', role: 'admin', firstName: 'Admin', lastName: 'User' },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(true)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('should show mentor links when authenticated as mentor', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'mentor@test.com', role: 'mentor', firstName: 'Mentor', lastName: 'User' },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(true)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Mentor')).toBeInTheDocument()
  })

  it('should handle logout correctly', async () => {
    const mockLogout = vi.fn()
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@test.com', role: 'student', firstName: 'Test', lastName: 'User' },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    const logoutButton = screen.getByText('Sair')
    fireEvent.click(logoutButton)

    expect(mockLogout).toHaveBeenCalled()
  })

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: true,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.getByTestId('navbar-loading')).toBeInTheDocument()
  })

  it('should be responsive', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument()
  })

  it('should toggle mobile menu', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
      hasPermission: vi.fn().mockReturnValue(false)
    })

    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    )

    const mobileMenuButton = screen.getByTestId('mobile-menu-button')
    
    // Initially mobile menu should be hidden
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton)
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    
    // Click to close mobile menu
    fireEvent.click(mobileMenuButton)
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })
})
