'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProgramService, { Program } from '@/services/ProgramService'
import { createWhatsAppLink, createCourseInquiryMessage } from '@/lib/utils/whatsapp'

export default function Programas() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [searchTerm, setSearchTerm] = useState('')
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      setLoading(true)
      const response = await ProgramService.getAll()
      setPrograms(response.programs)
    } catch (error) {
      console.error('Error loading programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [...new Set(programs.map(p => p.category))]

  const levels = [
    { id: 'all', name: 'Todos os Níveis' },
    { id: 'beginner', name: 'Iniciante' },
    { id: 'intermediate', name: 'Intermediário' },
    { id: 'advanced', name: 'Avançado' }
  ]

  const sortOptions = [
    { id: 'popular', name: 'Mais Populares' },
    { id: 'rating', name: 'Melhor Avaliados' },
    { id: 'price-low', name: 'Menor Preço' },
    { id: 'price-high', name: 'Maior Preço' },
    { id: 'newest', name: 'Mais Recentes' }
  ]

  const filteredPrograms = programs
    .filter(program => {
      const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory
      const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel
      const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesCategory && matchesLevel && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.students - a.students
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.nextClass).getTime() - new Date(a.nextClass).getTime()
        default:
          return 0
      }
    })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'language':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'technology':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'marketing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'design':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      case 'data':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante'
      case 'intermediate':
        return 'Intermediário'
      case 'advanced':
        return 'Avançado'
      default:
        return level
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-african-gold to-tech-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Catálogo de Programas
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Explore nossos programas de capacitação e encontre o caminho perfeito para sua evolução profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary bg-white text-deep-charcoal hover:bg-gray-100">
                Comece Agora
              </Link>
              <Link href="/bootcamp" className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-deep-charcoal">
                Ver Bootcamps
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-african-gold mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Programas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tech-teal mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-400">Alunos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-african-gold mb-2">4.8</div>
              <div className="text-gray-600 dark:text-gray-400">Avaliação Média</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tech-teal mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Buscar programas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-full"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="input-field w-full"
                >
                  {levels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-deep-charcoal dark:text-pure-white">
              {filteredPrograms.length} programas encontrados
            </h2>
            <div className="flex gap-2">
              <button className="btn-secondary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                </svg>
              </button>
              <button className="btn-secondary">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Featured Badge */}
                {program.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-african-gold text-deep-charcoal text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Destaque
                    </span>
                  </div>
                )}

                {/* Enrollment Status */}
                {!program.enrollmentOpen && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Inscrições Encerradas
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl">
                      {program.category === 'language' && '🌍'}
                      {program.category === 'technology' && '💻'}
                      {program.category === 'marketing' && '📢'}
                      {program.category === 'design' && '🎨'}
                      {program.category === 'data' && '📊'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-deep-charcoal dark:text-white">
                      {program.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(program.category)}`}>
                      {program.category}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {program.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-deep-charcoal dark:text-white">
                        {program.instructor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {program.instructor}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {program.certificate && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Certificado
                      </div>
                    )}
                    {program.materials && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Materiais
                      </div>
                    )}
                    {program.support && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                        <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Suporte
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>⏱️ {program.duration}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(program.level)}`}>
                      {getLevelText(program.level)}
                    </span>
                  </div>

                  {/* Rating and Students */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                        {program.rating} ({program.students})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-deep-charcoal dark:text-white">
                        R$ {program.price.toFixed(2)}
                      </div>
                      {program.originalPrice > program.price && (
                        <div className="text-sm text-gray-500 line-through">
                          R$ {program.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Class */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      📅 Próxima turma: {new Date(program.nextClass).toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {program.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={createWhatsAppLink(createCourseInquiryMessage(program.title))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center font-medium py-3 px-4 rounded-lg transition-colors ${
                      program.enrollmentOpen
                        ? 'btn-primary inline-flex items-center justify-center gap-2'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {program.enrollmentOpen ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
                        </svg>
                        Inscrever-se
                      </>
                    ) : 'Indisponível'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                Nenhum programa encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar sua busca ou filtros
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
