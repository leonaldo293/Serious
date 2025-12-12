'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    totalEnrollments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setStats({
        totalUsers: 5234,
        totalCourses: 45,
        totalRevenue: 2345000,
        totalEnrollments: 8901
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toLocaleString('pt-AO'),
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Total de Cursos',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-green-500',
      link: '/admin/courses'
    },
    {
      title: 'Receita Total',
      value: new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
      }).format(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-yellow-500',
      link: '/admin/payments'
    },
    {
      title: 'Total de Inscrições',
      value: stats.totalEnrollments.toLocaleString('pt-AO'),
      icon: TrendingUp,
      color: 'bg-teal-500',
      link: '/admin/enrollments'
    }
  ];

  if (loading) {
    return (
      <div className='p-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/3 mb-8'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-32 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireRole='admin'>
      <div className='p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Dashboard Administrativo
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Bem-vindo, {user?.firstName}! Aqui está um resumo da sua plataforma.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {statCards.map((stat, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer'
              onClick={() => router.push(stat.link)}
            >
              <div className={stat.color + ' p-3 rounded-lg text-white mb-4'}>
                <stat.icon className='w-6 h-6' />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>
                {stat.value}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 text-sm'>
                {stat.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
