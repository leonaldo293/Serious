'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AuthGuard from '@/components/AuthGuard';
import Footer from '@/components/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireRole='admin'>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col'>
        <div className='flex flex-1'>
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main content */}
          <div className='flex-1 lg:ml-0'>
            <main className='p-6 lg:p-8'>
              {children}
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
}
