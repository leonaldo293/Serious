'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Sobre() {
  const [activeTab, setActiveTab] = useState('mission')

  const team = [
    {
      id: 1,
      name: 'Sebastião Mendes',
      role: 'CEO & Founder',
      bio: 'Visionário com mais de 10 anos de experiência em tecnologia e educação, dedicado a transformar vidas através do conhecimento.',
      image: '/images/team/sebastiao.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 2,
      name: 'Ana Silva',
      role: 'CTO & Co-Founder',
      bio: 'Especialista em arquitetura de software e inteligência artificial, com passagem por empresas como Google e Microsoft.',
      image: '/images/team/ana.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 3,
      name: 'Carlos Costa',
      role: 'Head of Education',
      bio: 'Educador apaixonado com experiência em desenvolvimento curricular e metodologias de ensino inovadoras.',
      image: '/images/team/carlos.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      id: 4,
      name: 'Maria Santos',
      role: 'Head of Community',
      bio: 'Especialista em construção de comunidades e engajamento, focada em criar ambientes inclusivos e colaborativos.',
      image: '/images/team/maria.jpg',
      linkedin: '#',
      twitter: '#'
    }
  ]

  const values = [
    {
      id: 1,
      title: 'Excelência',
      description: 'Buscamos a excelência em tudo que fazemos, desde a qualidade do conteúdo até a experiência do aluno.',
      icon: '🏆'
    },
    {
      id: 2,
      title: 'Inovação',
      description: 'Estamos sempre na vanguarda da tecnologia, trazendo as últimas tendências e melhores práticas.',
      icon: '💡'
    },
    {
      id: 3,
      title: 'Inclusão',
      description: 'Acreditamos que educação de qualidade deve ser acessível a todos, independentemente de sua origem.',
      icon: '🌍'
    },
    {
      id: 4,
      title: 'Impacto',
      description: 'Nosso objetivo é criar impacto real e duradouro na vida de nossos alunos e na sociedade.',
      icon: '🎯'
    }
  ]

  const milestones = [
    {
      year: '2019',
      title: 'Fundação',
      description: 'ELTx HUB foi fundada com a missão de democratizar o acesso à educação tecnológica em África.'
    },
    {
      year: '2020',
      title: 'Primeiros Bootcamps',
      description: 'Lançamos nossos primeiros bootcamps de programação e inglês com 50 alunos.'
    },
    {
      year: '2021',
      title: 'Expansão',
      description: 'Chegamos a 1.000 alunos e expandimos nossa oferta de cursos para 10 programas diferentes.'
    },
    {
      year: '2022',
      title: 'Parcerias Estratégicas',
      description: 'Estabelecemos parcerias com empresas globais e organizações internacionais.'
    },
    {
      year: '2023',
      title: 'Plataforma Digital',
      description: 'Lançamos nossa plataforma de ensino online com recursos avançados de aprendizado.'
    },
    {
      year: '2024',
      title: 'Impacto Social',
      description: 'Já transformamos mais de 5.000 vidas através de nossos programas de capacitação.'
    }
  ]

  const partners = [
    {
      id: 1,
      name: 'Google for Startups',
      logo: '/images/partners/google.png',
      type: 'Tecnologia'
    },
    {
      id: 2,
      name: 'Microsoft Africa',
      logo: '/images/partners/microsoft.png',
      type: 'Tecnologia'
    },
    {
      id: 3,
      name: 'UNICEF Angola',
      logo: '/images/partners/unicef.png',
      type: 'ONG'
    },
    {
      id: 4,
      name: 'Banco Africano de Desenvolvimento',
      logo: '/images/partners/afdb.png',
      type: 'Financeiro'
    },
    {
      id: 5,
      name: 'Ministério da Educação',
      logo: '/images/partners/min-edu.png',
      type: 'Governo'
    },
    {
      id: 6,
      name: 'Meta',
      logo: '/images/partners/meta.png',
      type: 'Tecnologia'
    }
  ]

  const tabs = [
    { id: 'mission', label: 'Missão', icon: '🎯' },
    { id: 'vision', label: 'Visão', icon: '👁️' },
    { id: 'values', label: 'Valores', icon: '💎' },
    { id: 'team', label: 'Equipa', icon: '👥' },
    { id: 'history', label: 'História', icon: '📚' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'mission':
        return (
          <div className="space-y-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-white mb-6">
                Nossa Missão
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Transformar vidas em África através da educação tecnológica de excelência, 
                capacitando profissionais para os desafios do século XXI e promovendo 
                o desenvolvimento sustentável da sociedade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-african-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                  Educação de Qualidade
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Oferecemos programas educacionais que atendem aos mais altos padrões internacionais.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-tech-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                  Impacto Social
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Focamos em criar impacto real nas comunidades e na economia local.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-african-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                  Inovação
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Utilizamos tecnologia de ponta para oferecer a melhor experiência de aprendizado.
                </p>
              </div>
            </div>
          </div>
        )

      case 'vision':
        return (
          <div className="space-y-8">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-white mb-6">
                Nossa Visão
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Ser a referência em educação tecnológica em África até 2030, 
                formando mais de 100.000 profissionais e contribuindo para 
                o desenvolvimento de um continente digitalmente inclusivo e inovador.
              </p>
            </div>

            <div className="bg-gradient-to-r from-african-gold to-tech-teal text-white rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Nossos Objetivos 2030</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-2">100.000+</div>
                  <div className="text-white/90">Profissionais formados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-white/90">Países alcançados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">1.000+</div>
                  <div className="text-white/90">Empresas parceiras</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">90%</div>
                  <div className="text-white/90">Taxa de empregabilidade</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'values':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-white mb-6">
                Nossos Valores
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value) => (
                <div key={value.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'team':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-white mb-6">
                Nossa Equipa
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Uma equipa diversificada de profissionais apaixonados por educação 
                e tecnologia, unidos pelo propósito de transformar vidas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-gradient-to-r from-african-gold to-tech-teal relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-african-gold font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {member.bio}
                    </p>
                    <div className="flex space-x-3">
                      <a href={member.linkedin} className="text-gray-400 hover:text-african-gold transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                      <a href={member.twitter} className="text-gray-400 hover:text-african-gold transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'history':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-deep-charcoal dark:text-white mb-6">
                Nossa História
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Uma jornada de transformação e impacto, marcada por conquistas importantes
                e o crescimento constante da nossa comunidade.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-african-gold/20"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="text-2xl font-bold text-african-gold mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-african-gold rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-african-gold to-tech-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre Nós
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Conheça a história, missão e as pessoas por trás da ELTx HUB,
              transformando vidas através da educação tecnológica em África.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-african-gold mb-2">5.000+</div>
              <div className="text-gray-600 dark:text-gray-400">Alunos Formados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tech-teal mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Programas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-african-gold mb-2">12</div>
              <div className="text-gray-600 dark:text-gray-400">Países</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-tech-teal mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-400">Empregabilidade</div>
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
                className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-african-gold border-african-gold'
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-deep-charcoal dark:hover:text-pure-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-deep-charcoal dark:text-white mb-4">
              Nossos Parceiros
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trabalhamos com as melhores organizações para oferecer oportunidades excepcionais aos nossos alunos.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-deep-charcoal dark:text-white">
                    {partner.name.charAt(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="btn-primary">
              Torne-se um Parceiro
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
