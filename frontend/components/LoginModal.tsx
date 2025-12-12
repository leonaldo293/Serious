'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login, user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar quando user for atualizado após login
  useEffect(() => {
    if (user && isOpen) {
      onClose();
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'instructor') {
        router.push('/instructor');
      } else if (user.role === 'mentor') {
        router.push('/mentor');
      } else if (user.role === 'student' || user.role === 'user') {
        router.push('/student');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isOpen, onClose, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error || 'Falha no login');
      }
      // Redirecionamento será feito pelo useEffect quando user for atualizado
    } catch {
      setError('Erro ao tentar fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center space-x-3">
            <Image
              src="/logo.jpeg"
              alt="ELTx HUB Logo"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover"
            />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              <span className="text-african-gold">ELTx</span>
              <span className="text-tech-teal"> HUB</span>
            </span>
          </Link>
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {t('login.welcome')}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('login.email')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('login.password')}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-tech-teal focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-tech-teal text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('login.signing')}
              </>
            ) : (
              <span>{t('login.signin')}</span>
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            {t('login.noaccount')}{' '}
            <button
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="text-african-gold hover:opacity-80 transition font-medium"
              disabled={loading}
            >
              {t('login.register')}
            </button>
          </p>
        </div>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button
            onClick={() => {
              onClose();
              router.push('/forgot-password');
            }}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-african-gold dark:hover:text-african-gold transition"
            disabled={loading}
          >
            {t('login.forgot')}
          </button>
        </div>
      </div>
    </div>
  );
}
