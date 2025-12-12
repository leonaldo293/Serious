'use client';

// Componentes de Skeleton Loading para diferentes tipos de conteúdo

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

export function Skeleton({ 
  className = '', 
  width, 
  height, 
  variant = 'text' 
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '2rem')
  };

  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Skeleton para cards de curso
export function CourseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <Skeleton width="60%" height="16px" className="mb-2" />
        
        {/* Title */}
        <Skeleton width="80%" height="20px" className="mb-3" />
        
        {/* Description */}
        <Skeleton width="100%" height="14px" className="mb-1" />
        <Skeleton width="90%" height="14px" className="mb-1" />
        <Skeleton width="70%" height="14px" className="mb-4" />
        
        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Skeleton width="40px" height="16px" />
            <Skeleton width="60px" height="16px" />
          </div>
          <Skeleton width="40px" height="16px" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="60px" height="24px" />
          <Skeleton width="80px" height="16px" />
        </div>
        
        {/* Button */}
        <Skeleton width="100%" height="48px" className="rounded-lg" />
      </div>
    </div>
  );
}

// Skeleton para cards de aula
export function LessonCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* Icon */}
          <Skeleton variant="circular" width="40px" height="40px" />
          
          {/* Content */}
          <div className="flex-1">
            <Skeleton width="70%" height="16px" className="mb-2" />
            <div className="flex items-center space-x-3">
              <Skeleton width="50px" height="14px" />
              <Skeleton width="60px" height="14px" />
            </div>
          </div>
        </div>
        
        {/* Button */}
        <Skeleton width="80px" height="32px" className="rounded-lg" />
      </div>
      
      {/* Progress */}
      <div className="mt-3">
        <Skeleton width="100%" height="4px" className="rounded-full" />
      </div>
    </div>
  );
}

// Skeleton para dashboard
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Skeleton width="40%" height="32px" className="mb-2" />
          <Skeleton width="60%" height="20px" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Skeleton variant="circular" width="48px" height="48px" className="mr-4" />
                <div>
                  <Skeleton width="120px" height="16px" className="mb-2" />
                  <Skeleton width="40px" height="24px" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Programs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <Skeleton width="150px" height="20px" />
              </div>
              <div className="p-6 space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <Skeleton width="60%" height="16px" className="mb-2" />
                        <Skeleton width="40%" height="14px" />
                      </div>
                      <Skeleton width="60px" height="24px" className="rounded-full" />
                    </div>
                    <Skeleton width="100%" height="8px" className="rounded-full mb-3" />
                    <div className="flex justify-between items-center">
                      <Skeleton width="80px" height="14px" />
                      <Skeleton width="80px" height="16px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <Skeleton width="100px" height="20px" />
              </div>
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <Skeleton variant="circular" width="32px" height="32px" className="mr-3" />
                      <div className="flex-1">
                        <Skeleton width="60%" height="16px" className="mb-1" />
                        <Skeleton width="80%" height="14px" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para cards genéricos
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <Skeleton width="60%" height="20px" className="mb-4" />
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          width={`${100 - (i * 10)}%`}
          height="16px" 
          className="mb-2" 
        />
      ))}
    </div>
  );
}

// Skeleton para tabelas
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(columns)].map((_, i) => (
            <Skeleton key={i} width="80%" height="16px" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton key={colIndex} width="70%" height="16px" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton para perfil
export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-8">
          <Skeleton variant="circular" width="120px" height="120px" />
          <div>
            <Skeleton width="200px" height="32px" className="mb-2" />
            <Skeleton width="150px" height="16px" className="mb-4" />
            <div className="flex space-x-4">
              <Skeleton width="100px" height="36px" className="rounded-lg" />
              <Skeleton width="100px" height="36px" className="rounded-lg" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <Skeleton width="150px" height="24px" className="mb-6" />
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <Skeleton width="100px" height="14px" className="mb-2" />
                    <Skeleton width="100%" height="40px" className="rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <Skeleton width="120px" height="20px" className="mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton width="80px" height="14px" />
                    <Skeleton width="60px" height="14px" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
