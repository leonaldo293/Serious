'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import AuthGuard from '@/components/AuthGuard'

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect to specific dashboard based on user role
      switch (user.role) {
        case 'admin':
        case 'superadmin':
          router.push('/admin/dashboard')
          break
        case 'mentor':
        case 'instructor':
          router.push('/mentor/dashboard')
          break
        case 'student':
        case 'user':
          router.push('/student/dashboard')
          break
        default:
          router.push('/student/dashboard')
      }
    }
  }, [user, router])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-african-gold mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecionando para seu dashboard...</p>
        </div>
      </div>
    </AuthGuard>
  )
}
