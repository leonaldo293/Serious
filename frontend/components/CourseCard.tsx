'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Course } from '@/lib/api/courses';
import ProgressBar from './ProgressBar';
import CourseModal from './CourseModal';

interface CourseCardProps {
  course: Course;
  progress?: number;
  enrolled?: boolean;
  showProgress?: boolean;
  className?: string;
}

export default function CourseCard({
  course,
  progress = 0,
  enrolled = false,
  showProgress = false,
  className = ''
}: CourseCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.thumbnail || course.image || '/placeholder-course.jpg'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-african-gold text-deep-charcoal text-xs font-semibold rounded-full">
              {course.category}
            </span>
          </div>

          {/* Free Badge */}
          {course.isFree && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                Grátis
              </span>
            </div>
          )}

          {/* Play Button on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleLearnMore}
              className="w-14 h-14 bg-african-gold/90 text-deep-charcoal rounded-full flex items-center justify-center hover:bg-african-gold transition transform scale-90 group-hover:scale-100"
            >
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
              {course.description.replace(/<[^>]*>/g, '')}
            </p>
          </div>

          {/* Course Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {course.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0} aulas
              </span>
            </div>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-medium rounded">
              {course.level}
            </span>
          </div>

          {/* Progress Bar */}
          {showProgress && enrolled && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
              </div>
              <ProgressBar value={progress} color="gold" showValue={false} />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Price */}
            <div>
              {course.isFree ? (
                <span className="text-green-500 font-bold">Grátis</span>
              ) : (
                <span className="text-african-gold font-bold">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(course.price || 0)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {enrolled ? (
                <Link
                  href={`/courses/${course.id}`}
                  className="px-4 py-2 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
                >
                  Acessar
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleLearnMore}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Saiba Mais
                  </button>
                  <Link
                    href={`/courses/${course.id}`}
                    className="px-4 py-2 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
                  >
                    Inscrever-se
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Students Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{course.enrolledCount || 0} alunos inscritos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal
        course={course}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
