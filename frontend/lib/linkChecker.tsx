// Utilitário para verificar e garantir funcionalidade de links e botões

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/Toast'

// Lista de todas as rotas válidas da aplicação
export const validRoutes = {
  // Públicas
  '/': true,
  '/login': true,
  '/register': true,
  '/contact': true,
  '/sobre': true,
  '/blog': true,
  '/programas': true,
  '/bootcamp': true,
  '/community': true,
  '/consulting': true,
  '/empowerment': true,
  '/tracker': true,
  
  // Blog
  '/blog/[slug]': true,
  
  // Cursos
  '/courses': true,
  '/courses/[id]': true,
  '/lessons/[id]': true,
  
  // Autenticadas
  '/dashboard': true,
  '/profile': true,
  
  // Admin
  '/admin': true,
  '/admin/users': true,
  '/admin/community': true,
  '/admin/payments': true,
  '/admin/settings': true,
  
  // API
  '/api/auth': true,
  '/api/courses': true,
  '/api/users': true,
  '/api/payments': true
}

// Componente Link seguro que verifica se a rota é válida
interface SafeLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  target?: string
  rel?: string
}

export function SafeLink({ href, children, className, onClick, target, rel }: SafeLinkProps) {
  const router = useRouter()
  
  const handleClick = (e: React.MouseEvent) => {
    // Verificar se é um link externo
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      if (onClick) onClick()
      return
    }
    
    // Verificar se é uma rota válida
    const isDynamicRoute = href.includes('[') && href.includes(']')
    const isValid = validRoutes[href as keyof typeof validRoutes] || isDynamicRoute
    
    if (!isValid) {
      console.warn(`Rota inválida: ${href}`)
      e.preventDefault()
      // Redirecionar para página 404 ou página inicial
      router.push('/')
      return
    }
    
    if (onClick) onClick()
  }
  
  // Links externos
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={className}
        onClick={handleClick}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
      >
        {children}
      </a>
    )
  }
  
  // Links internos
  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}

// Hook para navegação segura
export function useSafeNavigation() {
  const router = useRouter()
  
  const navigate = (href: string) => {
    const isDynamicRoute = href.includes('[') && href.includes(']')
    const isValid = validRoutes[href as keyof typeof validRoutes] || isDynamicRoute
    
    if (!isValid) {
      console.warn(`Tentativa de navegação para rota inválida: ${href}`)
      router.push('/')
      return
    }
    
    router.push(href)
  }
  
  return { navigate }
}

// Função para verificar se um usuário tem permissão para acessar uma rota
export function canAccessRoute(route: string, userRole: string = 'user'): boolean {
  // Rotas públicas
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/contact',
    '/sobre',
    '/blog',
    '/blog/[slug]',
    '/programas',
    '/bootcamp',
    '/community',
    '/consulting',
    '/empowerment',
    '/tracker'
  ]
  
  // Rotas de admin
  const adminRoutes = [
    '/admin',
    '/admin/users',
    '/admin/community',
    '/admin/payments',
    '/admin/settings'
  ]
  
  // Rotas autenticadas
  const authRoutes = [
    '/dashboard',
    '/profile',
    '/courses/[id]',
    '/lessons/[id]'
  ]
  
  if (publicRoutes.includes(route)) {
    return true
  }
  
  if (adminRoutes.includes(route)) {
    return userRole === 'admin'
  }
  
  if (authRoutes.includes(route)) {
    return ['admin', 'user', 'instructor'].includes(userRole)
  }
  
  return false
}

// Componente de wrapper para proteger rotas
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, requiredRole, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-african-gold"></div>
      </div>
    )
  }
  
  if (!user) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Acesso Restrito
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Você precisa estar logado para acessar esta página.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
        >
          Fazer Login
        </Link>
      </div>
    )
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return fallback || (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Permissão Negada
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Você não tem permissão para acessar esta página.
        </p>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
        >
          Voltar para Dashboard
        </Link>
      </div>
    )
  }
  
  return <>{children}</>
}

// Função para validar formulários
export function validateForm(data: Record<string, any>, rules: Record<string, (value: any) => string | null>) {
  const errors: Record<string, string> = {}
  
  for (const [field, rule] of Object.entries(rules)) {
    const error = rule(data[field])
    if (error) {
      errors[field] = error
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Regras de validação comuns
export const validationRules = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo é obrigatório'
    }
    return null
  },
  
  email: (value: string) => {
    if (!value) return null
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Email inválido'
    }
    return null
  },
  
  minLength: (min: number) => (value: string) => {
    if (!value) return null
    if (value.length < min) {
      return `Mínimo de ${min} caracteres`
    }
    return null
  },
  
  maxLength: (max: number) => (value: string) => {
    if (!value) return null
    if (value.length > max) {
      return `Máximo de ${max} caracteres`
    }
    return null
  },
  
  phone: (value: string) => {
    if (!value) return null
    const phoneRegex = /^\+?[0-9]{9,15}$/
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Telefone inválido'
    }
    return null
  },
  
  password: (value: string) => {
    if (!value) return null
    if (value.length < 8) {
      return 'A senha deve ter pelo menos 8 caracteres'
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'A senha deve conter letras maiúsculas, minúsculas e números'
    }
    return null
  }
}

// Hook para tratamento de erros
export function useErrorHandler() {
  const { showToast } = useToast()
  
  const handleError = (error: any, defaultMessage = 'Ocorreu um erro inesperado') => {
    console.error('Error:', error)
    
    const message = error?.message || error?.data?.message || defaultMessage
    showToast({
      type: 'error',
      title: 'Erro',
      message
    });
  }
  
  return { handleError }
}

// Função para formatar dados para API
export function formatApiData(data: Record<string, any>) {
  const formatted: Record<string, any> = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== '') {
      formatted[key] = value
    }
  }
  
  return formatted
}

// Hook para debounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Função para gerar cores aleatórias consistentes
export function generateColorFromString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

// Função para copiar texto para clipboard
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback para navegadores antigos
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}
