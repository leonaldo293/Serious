'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createWhatsAppLink, createCourseInquiryMessage } from '@/lib/utils/whatsapp'
import SupportModal from '@/components/SupportModal'

export default function Empowerment() {
  const [activeTab, setActiveTab] = useState('programs')
  const [supportModalOpen, setSupportModalOpen] = useState(false)

  const programs = [
    {
      id: 1,
      title: 'Mulheres na Tech',
      description: 'Programa dedicado a capacitar mulheres para carreiras em tecnologia, com mentoria e networking.',
      duration: '12 semanas',
      participants: 150,
      impact: '85% de empregabilidade',
      image: '/courses/Firefly_Gemini Flash_Mulheres na Tech 1281.png',
      category: 'women',
      level: 'beginner',
      startDate: '2024-02-01',
      isFree: true
    },
    {
      id: 2,
      title: 'Jovens Líderes',
      description: 'Desenvolvimento de liderança para jovens talentos em comunidades carentes.',
      duration: '8 semanas',
      participants: 200,
      impact: '90% de aprovação',
      image: '/courses/Firefly_Gemini Flash_Jovens Líderes 1281.png',
      category: 'youth',
      level: 'intermediate',
      startDate: '2024-03-01',
      isFree: true
    },
    {
      id: 3,
      title: 'Empreendedorismo Digital',
      description: 'Capacitação em negócios digitais para empreendedores de baixa renda.',
      duration: '10 semanas',
      participants: 120,
      impact: '75% iniciaram negócios',
      image: '/courses/Firefly_Gemini Flash_Empreendedorismo Digital 1281.png',
      category: 'entrepreneurship',
      level: 'beginner',
      startDate: '2024-02-15',
      isFree: true
    }
  ]

  const stories = [
    {
      id: 1,
      name: 'Ana Sofia',
      age: 24,
      program: 'Mulheres na Tech',
      before: 'Trabalhava como vendedora sem perspectiva de crescimento.',
      after: 'Hoje é Desenvolvedora Front-end em uma multinacional.',
      quote: 'O programa mudou completamente minha vida. Nunca pensei que poderia trabalhar com tecnologia.',
      image: '/images/stories/ana.jpg',
      location: 'Luanda, Angola'
    },
    {
      id: 2,
      name: 'João Pedro',
      age: 19,
      program: 'Jovens Líderes',
      before: 'Estudante sem direção e oportunidades.',
      after: 'Líder comunitário e bolsista em universidade.',
      quote: 'Aprendi a liderar e a criar impacto na minha comunidade.',
      image: '/images/stories/joao.jpg',
      location: 'Huambo, Angola'
    },
    {
      id: 3,
      name: 'Maria Luzia',
      age: 32,
      program: 'Empreendedorismo Digital',
      before: 'Mãe solteira desempregada.',
      after: 'Dona de loja online com 50 clientes.',
      quote: 'Hoje tenho meu próprio negócio e posso dar um futuro melhor para meus filhos.',
      image: '/images/stories/maria.jpg',
      location: 'Benguela, Angola'
    }
  ]

  const partners = [
    {
      id: 1,
      name: 'UNICEF Angola',
      logo: '/images/partners/unicef.png',
      type: 'international',
      focus: 'Educação infantil e juvenil'
    },
    {
      id: 2,
      name: 'Ministério da Tecnologia',
      logo: '/images/partners/min-tech.png',
      type: 'government',
      focus: 'Inclusão digital'
    },
    {
      id: 3,
      name: 'Google.org',
      logo: '/images/partners/google.png',
      type: 'tech',
      focus: 'Educação em tecnologia'
    },
    {
      id: 4,
      name: 'Banco Africano de Desenvolvimento',
      logo: '/images/partners/afdb.png',
      type: 'financial',
      focus: 'Empreendedorismo'
    }
  ]

  const tabs = [
    { id: 'programs', label: 'Programas', icon: '🎓' },
    { id: 'impact', label: 'Impacto', icon: '📊' },
    { id: 'stories', label: 'Histórias', icon: '📖' },
    { id: 'partners', label: 'Parceiros', icon: '🤝' }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'women':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      case 'youth':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'entrepreneurship':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPartnerTypeColor = (type: string) => {
    switch (type) {
      case 'international':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'government':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'tech':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'financial':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'programs':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-pure-white mb-4">
                Programas de Transformação
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Programas gratuitos focados em capacitar comunidades carentes e grupos sub-representados em tecnologia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div key={program.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-r from-african-gold to-tech-teal relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-4xl">
                        {program.category === 'women' && '👩‍💻'}
                        {program.category === 'youth' && '🌟'}
                        {program.category === 'entrepreneurship' && '🚀'}
                      </span>
                    </div>
                    {program.isFree && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          GRATUITO
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-deep-charcoal dark:text-pure-white">
                        {program.title}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(program.category)}`}>
                        {program.category === 'women' && 'Mulheres'}
                        {program.category === 'youth' && 'Jovens'}
                        {program.category === 'entrepreneurship' && 'Empreendedores'}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {program.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Duração:</span>
                        <span className="font-medium text-deep-charcoal dark:text-pure-white">{program.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Participantes:</span>
                        <span className="font-medium text-deep-charcoal dark:text-pure-white">{program.participants}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Impacto:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{program.impact}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Início:</span>
                        <span className="font-medium text-deep-charcoal dark:text-pure-white">
                          {new Date(program.startDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <a
                      href={createWhatsAppLink(createCourseInquiryMessage(`Quero me inscrever para o programa: ${program.title}`))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-primary inline-block text-center"
                    >
                      Inscrever-se
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'impact':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-pure-white mb-4">
                Nosso Impacto Social
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Transformando vidas através da educação e capacitação tecnológica em toda África.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-african-gold mb-2">5,000+</div>
                <div className="text-gray-600 dark:text-gray-400">Vidas Transformadas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tech-teal mb-2">85%</div>
                <div className="text-gray-600 dark:text-gray-400">Taxa de Empregabilidade</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-african-gold mb-2">12</div>
                <div className="text-gray-600 dark:text-gray-400">Países Africanos</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-tech-teal mb-2">50+</div>
                <div className="text-gray-600 dark:text-gray-400">Parceiros</div>
              </div>
            </div>

            {/* Impact Areas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👩‍💻</span>
                </div>
                <h3 className="text-xl font-bold text-deep-charcoal dark:text-pure-white mb-2">
                  Empoderamento Feminino
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  60% dos nossos beneficiários são mulheres que estão quebrando barreiras na tecnologia.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="text-xl font-bold text-deep-charcoal dark:text-pure-white mb-2">
                  Juventude em Ação
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Jovens de comunidades carentes gaining acesso a educação de qualidade e oportunidades.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-deep-charcoal dark:text-pure-white mb-2">
                  Empreendedorismo
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Apoio a empreendedores para criar negócios digitais sustentáveis e escaláveis.
                </p>
              </div>
            </div>
          </div>
        )

      case 'stories':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-pure-white mb-4">
                Histórias de Transformação
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Conheça pessoas reais cujas vidas foram transformadas através de nossos programas.
              </p>
            </div>

            <div className="space-y-8">
              {stories.map((story) => (
                <div key={story.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 h-64 md:h-auto bg-gradient-to-r from-african-gold to-tech-teal relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">
                            {story.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-deep-charcoal dark:text-pure-white mb-1">
                            {story.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{story.age} anos</span>
                            <span>•</span>
                            <span>{story.location}</span>
                            <span>•</span>
                            <span className="text-african-gold font-medium">{story.program}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Antes</h4>
                          <p className="text-gray-600 dark:text-gray-300">{story.before}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-500 dark:text-gray-400 mb-2">Depois</h4>
                          <p className="text-green-600 dark:text-green-400 font-medium">{story.after}</p>
                        </div>
                      </div>

                      <blockquote className="border-l-4 border-african-gold pl-4 italic text-gray-600 dark:text-gray-300">
                        "{story.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'partners':
        return (
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-pure-white mb-4">
                Nossos Parceiros
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Trabalhamos com organizações globais e locais para maximizar nosso impacto social.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-deep-charcoal dark:text-white">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-deep-charcoal dark:text-pure-white">
                        {partner.name}
                      </h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getPartnerTypeColor(partner.type)}`}>
                        {partner.type === 'international' && 'Internacional'}
                        {partner.type === 'government' && 'Governo'}
                        {partner.type === 'tech' && 'Tecnologia'}
                        {partner.type === 'financial' && 'Financeiro'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Foco:</span> {partner.focus}
                  </p>
                </div>
              ))}
            </div>

            {/* Partnership CTA */}
            <div className="bg-gradient-to-r from-african-gold to-tech-teal text-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Seja Nosso Parceiro</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Junte-se a nós na missão de transformar vidas através da educação tecnológica em África.
              </p>
              <button className="bg-white text-deep-charcoal hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors">
                Entrar em Contato
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-african-gold to-tech-teal text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Empoderamento Social
              </h1>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Transformando vidas e comunidades através da educação tecnológica inclusiva e acessível.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary bg-white text-deep-charcoal hover:bg-gray-100">
                  Participar dos Programas
                </button>
                <button 
                  onClick={() => setSupportModalOpen(true)}
                  className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-deep-charcoal"
                >
                  Apoiar Nossa Causa
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-african-gold border-b-2 border-african-gold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </section>
      </div>
      
      {/* Support Modal */}
      <SupportModal 
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </>
  )
}
