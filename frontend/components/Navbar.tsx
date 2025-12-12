'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from 'next-themes'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Globe, 
  LogOut, 
  User,
  Crown
} from 'lucide-react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import UnderConstructionModal from './UnderConstructionModal'
import { createWhatsAppLink, createCourseInquiryMessage } from '@/lib/utils/whatsapp'

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [registerModalOpen, setRegisterModalOpen] = useState(false)
  const [underConstructionOpen, setUnderConstructionOpen] = useState(false)
  const { user, logout } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleLogout = async () => {
    try {
      await logout()
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Navigation links for regular users
  const userLinks = [
    { href: '/', label: t('home') },
    { href: '/programas', label: t('programs') },
    { href: '/empowerment', label: t('empowerment_drive') },
    { href: '/tracker', label: t('skills_tracker') },
    { href: '/consulting', label: t('consulting') },
  ]

  // Add protected links for logged-in users
  if (user) {
    if (user.role === 'instructor') {
      userLinks.push({ href: '/instructor', label: 'Painel' })
    } else if (user.role === 'mentor') {
      userLinks.push({ href: '/mentor', label: 'Painel' })
    } else if (user.role === 'student' || user.role === 'user') {
      userLinks.push({ href: '/student', label: 'Student' })
      userLinks.push({ href: '/profile', label: 'Perfil' })
      userLinks.push({ href: '/lessons', label: 'Lições' })
    } else {
      userLinks.push({ href: '/tracker', label: 'Tracker' })
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16">
        <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between h-full items-center">
            
            {/* Logo */}
            <Link href={user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : user?.role === 'mentor' ? '/mentor' : user?.role === 'student' || user?.role === 'user' ? '/student' : '/'} className="flex-shrink-0" style={{marginTop: '8px'}}>
              <div className="flex items-center space-x-2">
                <Image
                  src="/logo.jpeg"
                  alt="ELTx HUB Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-bold text-sm">
                  <span className="text-african-gold">ELTx</span>
                  <span className="text-tech-teal"> HUB</span>
                  {user?.role === 'admin' && (
                    <span className="text-tech-teal text-xs ml-1">• Admin</span>
                  )}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8" style={{marginTop: '8px'}}>
              {user?.role !== 'admin' && userLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-african-gold dark:hover:text-african-gold transition-colors px-2 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3" style={{marginTop: '8px'}}>
              
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
                <span className="sr-only">Menu</span>
              </button>

              {/* Desktop auth buttons */}
              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' && (
                        <Crown className="w-4 h-4 text-african-gold" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.firstName}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="sr-only">Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setUnderConstructionOpen(true)}
                      className="px-3 py-1.5 text-sm font-medium text-tech-teal border border-tech-teal rounded-lg hover:bg-tech-teal hover:text-white transition-colors"
                    >
                      {t('login')}
                    </button>
                    <button
                      onClick={() => setUnderConstructionOpen(true)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-african-gold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {t('register')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation links */}
              {user?.role !== 'admin' && userLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-african-gold dark:hover:text-african-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth section */}
              {user ? (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3 py-2">
                    {user.role === 'admin' && (
                      <Crown className="w-4 h-4 text-african-gold" />
                    )}
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.firstName} {user.lastName || ''}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <button
                    onClick={() => {
                      setUnderConstructionOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-3 py-2 text-sm font-medium text-tech-teal border border-tech-teal rounded-lg hover:bg-tech-teal hover:text-white transition-colors"
                  >
                    {t('login')}
                  </button>
                  <button
                    onClick={() => {
                      setUnderConstructionOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    className="w-full px-3 py-2 text-sm font-medium text-white bg-african-gold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {t('register')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modals */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false)
          setRegisterModalOpen(true)
        }}
      />
      <RegisterModal 
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false)
          setLoginModalOpen(true)
        }}
      />
      <UnderConstructionModal 
        isOpen={underConstructionOpen}
        onClose={() => setUnderConstructionOpen(false)}
      />
    </>
  )
}
