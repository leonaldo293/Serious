'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import AuthGuard from '@/components/AuthGuard'
import Footer from '@/components/Footer'
import { Shield, AlertTriangle } from 'lucide-react'

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireRole='mentor'>
      <MentorLayoutContent>{children}</MentorLayoutContent>
    </AuthGuard>
  )
}

function MentorLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, hasPermission } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if user has mentor role or higher
  const hasMentorAccess = user && (user.role === 'mentor' || user.role === 'admin' || user.role === 'superadmin')

  if (!hasMentorAccess) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to access the mentor portal.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, <span className="font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Mentor Portal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
