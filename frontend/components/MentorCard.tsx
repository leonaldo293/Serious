'use client'

import Link from 'next/link'
import Image from 'next/image'

interface MentorCardProps {
  mentor: {
    id: string
    firstName: string
    lastName: string
    email: string
    bio: string
    expertise: string[]
    avatar?: string
    rating: number
    studentsCount: number
    coursesCount: number
    isAvailable: boolean
  }
  className?: string
}

export default function MentorCard({ mentor, className = '' }: MentorCardProps) {
  const initials = `${mentor.firstName.charAt(0)}${mentor.lastName.charAt(0)}`
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}>
      {/* Mentor Info */}
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-african-gold rounded-full flex items-center justify-center mr-4">
          {mentor.avatar ? (
            <Image
              src={mentor.avatar}
              alt={`${mentor.firstName} ${mentor.lastName}`}
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-deep-charcoal">
              {initials}
            </span>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {mentor.firstName} {mentor.lastName}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-2">⭐ {mentor.rating.toFixed(1)}</span>
            <span>•</span>
            <span className="ml-2">{mentor.studentsCount} alunos</span>
          </div>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              mentor.isAvailable 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
            }`}>
              {mentor.isAvailable ? 'Disponível' : 'Ocupado'}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {mentor.bio}
      </p>

      {/* Expertise */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Especialidades:</h4>
        <div className="flex flex-wrap gap-1">
          {mentor.expertise.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded"
            >
              {skill}
            </span>
          ))}
          {mentor.expertise.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{mentor.expertise.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>{mentor.coursesCount} cursos</span>
        <span>{mentor.studentsCount} alunos</span>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Link
          href={`/mentors/${mentor.id}`}
          className="flex-1 px-3 py-2 bg-african-gold text-deep-charcoal text-sm font-medium rounded-lg hover:bg-opacity-90 transition text-center"
        >
          Ver Perfil
        </Link>
        {mentor.isAvailable && (
          <button
            onClick={() => window.open(`https://wa.me/939947819?text=Olá,+gostaria+de+agendar+uma+sessão+com+o+mentor+${mentor.firstName}+${mentor.lastName}`, '_blank')}
            className="px-3 py-2 border border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 text-sm font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition"
          >
            WhatsApp
          </button>
        )}
      </div>
    </div>
  )
}
