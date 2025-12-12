'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: 'admin' | 'superadmin' | 'mentor' | 'student' | 'user' | 'instructor';
}

export default function AuthGuard({ children, requireRole }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (requireRole && user) {
      const hasRequiredRole = requireRole === 'admin' 
        ? ['admin', 'superadmin'].includes(user.role)
        : requireRole === 'superadmin'
        ? user.role === 'superadmin'
        : user.role === requireRole;

      if (!hasRequiredRole) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, loading, isAuthenticated, requireRole, router]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500'></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireRole && user) {
    const hasRequiredRole = requireRole === 'admin' 
      ? ['admin', 'superadmin'].includes(user.role)
      : requireRole === 'superadmin'
      ? user.role === 'superadmin'
      : user.role === requireRole;

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
