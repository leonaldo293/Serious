'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { coursesService } from '@/lib/api/courses'
import { useToast } from '@/components/Toast'

interface CourseGuardProps {
  courseId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function CourseGuard({ courseId, children, fallback }: CourseGuardProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [accessStatus, setAccessStatus] = useState<'loading' | 'granted' | 'denied' | 'payment_required'>('loading')
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (authLoading) return

      // User not logged in
      if (!user) {
        setAccessStatus('denied')
        return
      }

      // Admin has access to everything
      if (user.role === 'admin') {
        setAccessStatus('granted')
        return
      }

      // Check course access
      try {
        setChecking(true)
        const hasAccess = await coursesService.checkCourseAccess(courseId)
        
        if (hasAccess) {
          setAccessStatus('granted')
        } else {
          // Check if course requires payment
          const course = await coursesService.getCourseById(courseId)
          if (course && !course.isFree) {
            setAccessStatus('payment_required')
          } else {
            setAccessStatus('denied')
          }
        }
      } catch (err) {
        console.error('Error checking course access:', err)
        setAccessStatus('denied')
      } finally {
        setChecking(false)
      }
    }

    checkAccess()
  }, [courseId, user, authLoading])

  if (authLoading || checking || accessStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-african-gold mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Verificando acesso...</p>
          </div>
        </div>
      </div>
    )
  }

  if (accessStatus === 'granted') {
    return <>{children}</>
  }

  // Custom fallback
  if (fallback) {
    return <>{fallback}</>
  }

  // Default access denied screens
  if (accessStatus === 'denied') {
    if (!user) {
      // Not logged in
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Login Requerido
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Você precisa fazer login para acessar este curso.
              </p>
              
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-block px-6 py-3 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
                >
                  Fazer Login
                </Link>
                
                <Link
                  href="/register"
                  className="inline-block px-6 py-3 bg-tech-teal text-white font-medium rounded-lg hover:bg-opacity-90 transition"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Logged in but no access
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Acesso Restrito
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Você não tem permissão para acessar este curso.
            </p>
            
            <div className="space-x-4">
              <Link
                href="/programas"
                className="inline-block px-6 py-3 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
              >
                Ver Cursos Disponíveis
              </Link>
              
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-opacity-90 transition"
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Payment required
  if (accessStatus === 'payment_required') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pagamento Requerido
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Este curso requer pagamento para acessar o conteúdo completo.
            </p>
            
            <div className="space-x-4">
              <Link
                href={`/programas/${courseId}`}
                className="inline-block px-6 py-3 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
              >
                Ver Detalhes do Curso
              </Link>
              
              <Link
                href="/programas"
                className="inline-block px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-opacity-90 transition"
              >
                Ver Outros Cursos
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
