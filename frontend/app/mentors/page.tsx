'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MentorService, { Mentor } from '@/services/MentorService'
import { Star, Users, Clock, DollarSign, MapPin, Award, BookOpen, MessageCircle } from 'lucide-react'

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    expertise: '',
    search: '',
    availability: '',
    rating: ''
  })

  useEffect(() => {
    loadMentors()
  }, [])

  useEffect(() => {
    filterMentors()
  }, [mentors, filters])

  const loadMentors = async () => {
    try {
      setLoading(true)
      const response = await MentorService.getAll()
      setMentors(response.mentors)
    } catch (error) {
      console.error('Error loading mentors:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMentors = () => {
    let filtered = mentors

    if (filters.expertise) {
      filtered = filtered.filter(mentor => 
        mentor.expertise.some(skill => 
          skill.toLowerCase().includes(filters.expertise.toLowerCase())
        )
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(mentor => 
        mentor.firstName.toLowerCase().includes(searchLower) ||
        mentor.lastName.toLowerCase().includes(searchLower) ||
        mentor.bio.toLowerCase().includes(searchLower) ||
        mentor.expertise.some(skill => skill.toLowerCase().includes(searchLower))
      )
    }

    if (filters.rating) {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter(mentor => mentor.rating >= minRating)
    }

    setFilteredMentors(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      expertise: '',
      search: '',
      availability: '',
      rating: ''
    })
  }

  const expertiseAreas = [...new Set(mentors.flatMap(m => m.expertise))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Conheça nossos Mentores
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Aprenda com especialistas renomados da indústria tecnológica
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-african-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mentors.length}</div>
            <div className="text-gray-600 dark:text-gray-300">Mentores</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mentors.length > 0 ? (mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1) : '0'}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Avaliação Média</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <BookOpen className="w-8 h-8 text-tech-teal mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mentors.reduce((sum, m) => sum + m.studentsCount, 0)}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Alunos Mentoriados</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {mentors.filter(m => m.status === 'active').length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Mentores Ativos</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pesquisar
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Buscar mentores..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tech-teal focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Especialização
              </label>
              <select
                value={filters.expertise}
                onChange={(e) => handleFilterChange('expertise', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tech-teal focus:border-transparent"
              >
                <option value="">Todas</option>
                {expertiseAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Avaliação Mínima
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-tech-teal focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="4.5">4.5+</option>
                <option value="4.0">4.0+</option>
                <option value="3.5">3.5+</option>
                <option value="3.0">3.0+</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 'es' : ''} encontrado{filteredMentors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum mentor encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tente ajustar os filtros ou termos de pesquisa
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Mentor Profile */}
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="w-20 h-20 bg-african-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-african-gold" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {mentor.firstName} {mentor.lastName}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
            {mentor.experience}
          </p>
          <div className="flex items-center justify-center mb-2">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {mentor.rating.toFixed(1)} ({mentor.studentsCount} alunos)
            </span>
          </div>
        </div>

        {/* Expertise */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Especializações
          </h4>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((skill, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-african-gold/10 text-african-gold rounded-full">
                {skill}
              </span>
            ))}
            {mentor.expertise.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{mentor.expertise.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
            {mentor.bio}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            {mentor.studentsCount} alunos
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4 mr-1" />
            {mentor.hourlyRate.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}/hora
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            mentor.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
          }`}>
            {mentor.status === 'active' ? 'Disponível' : 'Indisponível'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link
            href={`/mentors/${mentor.id}`}
            className="block w-full py-2 px-4 bg-african-gold text-deep-charcoal text-center font-medium rounded-lg hover:bg-opacity-90 transition"
          >
            Ver Perfil
          </Link>
          <button className="w-full py-2 px-4 border border-african-gold text-african-gold text-center font-medium rounded-lg hover:bg-african-gold hover:text-deep-charcoal transition">
            Agendar Mentoria
          </button>
        </div>
      </div>
    </div>
  )
}
