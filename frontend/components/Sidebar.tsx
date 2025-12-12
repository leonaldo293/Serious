'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, BookOpen, DollarSign, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getNavItems = () => {
    if (!user) return [];

    const baseItems = [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: Home
      }
    ];

    if (['admin', 'superadmin'].includes(user.role)) {
      return [
        ...baseItems,
        {
          href: '/admin',
          label: 'Administração',
          icon: Settings
        },
        {
          href: '/admin/users',
          label: 'Usuários',
          icon: Users
        },
        {
          href: '/admin/courses',
          label: 'Cursos',
          icon: BookOpen
        },
        {
          href: '/admin/payments',
          label: 'Pagamentos',
          icon: DollarSign
        }
      ];
    }

    if (user.role === 'mentor') {
      return [
        ...baseItems,
        {
          href: '/mentor/courses',
          label: 'Meus Cursos',
          icon: BookOpen
        },
        {
          href: '/mentor/students',
          label: 'Estudantes',
          icon: Users
        }
      ];
    }

    if (user.role === 'student') {
      return [
        ...baseItems,
        {
          href: '/courses',
          label: 'Cursos',
          icon: BookOpen
        },
        {
          href: '/progress',
          label: 'Progresso',
          icon: Home
        }
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const sidebarClasses = 'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ' + 
    (isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0');

  return (
    <div className={sidebarClasses}>
      <div className='flex flex-col h-full'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <h2 className='text-xl font-bold text-white'>
            <span className='text-yellow-500'>ELTx</span>
            <span className='text-teal-500'> HUB</span>
          </h2>
          {onClose && (
            <button onClick={onClose} className='lg:hidden text-gray-400 hover:text-white'>
              <X className='w-5 h-5' />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 space-y-2'>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const linkClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ' + 
              (isActive ? 'bg-yellow-500 text-black' : 'text-gray-300 hover:bg-gray-800 hover:text-white');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClasses}
              >
                <item.icon className='w-5 h-5' />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className='p-4 border-t border-gray-700'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold'>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white truncate'>
                {user?.firstName} {user?.lastName}
              </p>
              <p className='text-xs text-gray-400 truncate'>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 w-full px-3 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors'
          >
            <LogOut className='w-5 h-5' />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
