'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Adicionar efeito de animação ao montar
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-african-gold opacity-20 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">
              😕
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        {/* Search Suggestion */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            O que você estava procurando?
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            <Link
              href="/courses"
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Cursos</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Explore nossos cursos</div>
              </div>
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dashboard</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ver seu progresso</div>
              </div>
            </Link>
            
            <Link
              href="/community"
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Comunidade</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Conecte-se com outros</div>
              </div>
            </Link>
            
            <Link
              href="/contact"
              className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Contato</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Fale conosco</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-3 px-6 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
          >
            Voltar para Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full py-3 px-6 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Voltar para página anterior
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Se você acredita que isso é um erro, por favor{' '}
            <Link href="/contact" className="text-tech-teal hover:text-tech-teal/80">
              entre em contato conosco
            </Link>
          </p>
        </div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-african-gold/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-tech-teal/10 rounded-full animate-pulse delay-1000"></div>
      </div>

      <style jsx>{`
        .delay-1000 {
          animation-delay: 1s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
