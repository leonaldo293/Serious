'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createWhatsAppLink, createCourseInquiryMessage } from '@/lib/utils/whatsapp'

export default function BootcampPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const bootcamps = [
    {
      id: 'ingles-bootcamp',
      title: 'Inglês Bootcamp',
      description: 'Treinamento acelerado da língua inglesa com foco em comunicação profissional. E-book e plataforma digital, básico ao avançado.',
      category: 'language',
      level: 'beginner',
      duration: '4 semanas',
      price: 30000,
      originalPrice: 35000,
      rating: 4.9,
      students: 2500,
      image: '/images/bootcamps/english.jpg',
      instructor: 'ELTx Team',
      startDate: new Date().toISOString().split('T')[0],
      schedule: 'Online/On-site - 4 semanas',
      certificate: true,
      liveClasses: true,
      materials: true,
      support: true,
      tags: ['inglês', 'comunicação', 'profissional'],
      featured: true
    },
    {
      id: 'engenharia-prompt',
      title: 'Engenharia de Prompt',
      description: 'Técnicas avançadas de prompt para criação de negócios e gestão de projetos. E-books e plataforma digital, 1.000 prompts/business.',
      category: 'technology',
      level: 'advanced',
      duration: '3 horas por sessão',
      price: 55000,
      originalPrice: 60000,
      rating: 4.8,
      students: 1800,
      image: '/images/bootcamps/tech.jpg',
      instructor: 'ELTx Team',
      startDate: new Date().toISOString().split('T')[0],
      schedule: 'Online - 3 horas/sessão',
      certificate: true,
      liveClasses: true,
      materials: true,
      support: true,
      tags: ['prompt', 'IA', 'negócios'],
      featured: true
    },
    {
      id: 'google-workspace',
      title: 'Pacote Google Workspace',
      description: 'Ferramentas modernas da Google: Gsheets, Gdocs, Gformulário, Gmail, Gdrive, Gmeet, etc. Ferramentas Google + IA.',
      category: 'technology',
      level: 'beginner',
      duration: '3 horas por sessão',
      price: 45000,
      originalPrice: 50000,
      rating: 4.7,
      students: 3200,
      image: '/images/bootcamps/productivity.jpg',
      instructor: 'ELTx Team',
      startDate: new Date().toISOString().split('T')[0],
      schedule: 'Online - 3 horas/sessão',
      certificate: true,
      liveClasses: true,
      materials: true,
      support: true,
      tags: ['google', 'produtividade', 'IA'],
      featured: true
    }
  ]

  const categories = [
    { id: 'all', name: 'Todos', icon: '📚' },
    { id: 'language', name: 'Idiomas', icon: '🌍' },
    { id: 'technology', name: 'Tecnologia', icon: '💻' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'design', name: 'Design', icon: '🎨' }
  ]

  const filteredBootcamps = bootcamps.filter(bootcamp => {
    const matchesCategory = selectedCategory === 'all' || bootcamp.category === selectedCategory
    const matchesSearch = bootcamp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bootcamp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bootcamp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
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
              Bootcamps Intensivos
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Transforme sua carreira com nossos programas intensivos. Aprenda com especialistas e 
              desenvolva habilidades práticas em poucas semanas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#bootcamps" className="px-6 py-3 bg-white text-deep-charcoal font-semibold rounded-lg hover:bg-gray-100 transition">
                Ver Bootcamps
              </a>
              <a 
                href={createWhatsAppLink(createCourseInquiryMessage('Bootcamps ELTx HUB'))}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-deep-charcoal transition inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
                </svg>
                Inscrever-se Agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-african-gold mb-2">5K+</div>
              <div className="text-gray-600 dark:text-gray-400">Alunos Formados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tech-teal mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-400">Empregabilidade</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-african-gold mb-2">4.8</div>
              <div className="text-gray-600 dark:text-gray-400">Avaliação Média</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tech-teal mb-2">12</div>
              <div className="text-gray-600 dark:text-gray-400">Programas Ativos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamps Section */}
      <section id="bootcamps" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar bootcamps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                />
              </div>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-african-gold text-deep-charcoal'
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bootcamps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBootcamps.map((bootcamp) => (
              <div key={bootcamp.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Featured Badge */}
                {bootcamp.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-african-gold text-deep-charcoal text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Destaque
                    </span>
                  </div>
                )}

                {/* Image */}
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl">
                      {bootcamp.category === 'language' && '🌍'}
                      {bootcamp.category === 'technology' && '💻'}
                      {bootcamp.category === 'marketing' && '📢'}
                      {bootcamp.category === 'design' && '🎨'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-deep-charcoal dark:text-white">
                      {bootcamp.title}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(bootcamp.category)}`}>
                      {categories.find(c => c.id === bootcamp.category)?.name}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {bootcamp.description}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-bold text-deep-charcoal dark:text-white">
                        {bootcamp.instructor.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {bootcamp.instructor}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Certificado
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Aulas ao Vivo
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Materiais
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Suporte
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>⏱️ {bootcamp.duration}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(bootcamp.level)}`}>
                      {getLevelText(bootcamp.level)}
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
                        {bootcamp.rating} ({bootcamp.students})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-deep-charcoal dark:text-white">
                        R$ {bootcamp.price.toFixed(2)}
                      </div>
                      {bootcamp.originalPrice > bootcamp.price && (
                        <div className="text-sm text-gray-500 line-through">
                          R$ {bootcamp.originalPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      📅 Início: {new Date(bootcamp.startDate).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      🕐 {bootcamp.schedule}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {bootcamp.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={createWhatsAppLink(createCourseInquiryMessage(bootcamp.title))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-3 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:bg-opacity-90 transition inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
                    </svg>
                    Inscrever-se
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredBootcamps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                Nenhum bootcamp encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar sua busca ou filtros
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para acelerar sua carreira?
          </h2>
          <p className="text-xl mb-8">
            Junte-se a milhares de profissionais que transformaram suas vidas com nossos bootcamps.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={createWhatsAppLink(createCourseInquiryMessage('Bootcamps ELTx HUB'))}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-deep-charcoal font-semibold rounded-lg hover:bg-gray-100 transition inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
              </svg>
              Inscrever-se Agora
            </a>
            <a 
              href={createWhatsAppLink(createCourseInquiryMessage('Informações sobre Bootcamps'))}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-deep-charcoal transition inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
              </svg>
              Falar com um Especialista
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
