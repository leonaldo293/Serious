'use client'

import LoadingSpinner from './LoadingSpinner'

interface LoadingPageProps {
  message?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function LoadingPage({ message = 'Carregando...', size = 'xl' }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size={size} color="primary" className="mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  )
}
