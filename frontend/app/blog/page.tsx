'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const posts = [
    {
      id: 1,
      title: '10 Habilidades Essenciais para Desenvolvedores em 2024',
      slug: '10-habilidades-essenciais-desenvolvedores-2024',
      excerpt: 'Descubra as competências mais demandadas no mercado de tecnologia e como se preparar para os desafios do futuro.',
      content: 'O mundo da tecnologia está em constante evolução, e os desenvolvedores precisam se manter atualizados para permanecerem relevantes no mercado...',
      author: {
        name: 'Carlos Mendes',
        avatar: '/images/authors/carlos.jpg',
        bio: 'Desenvolvedor Senior com 10+ anos de experiência'
      },
      category: 'carreira',
      tags: ['desenvolvimento', 'carreira', 'habilidades'],
      image: '/images/blog/habilidades-2024.jpg',
      publishedAt: '2024-01-15',
      readTime: '8 min',
      featured: true,
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: 'Guia Completo: Como Começar na Programação',
      slug: 'guia-como-comecar-programacao',
      excerpt: 'Passo a passo para iniciar sua carreira como programador, desde a escolha da linguagem até o primeiro emprego.',
      content: 'Começar na programação pode parecer desafiador, mas com o caminho certo, qualquer pessoa pode se tornar um desenvolvedor...',
      author: {
        name: 'Ana Oliveira',
        avatar: '/images/authors/ana.jpg',
        bio: 'Instrutora de Programação e Mentora'
      },
      category: 'tutorial',
      tags: ['iniciante', 'programação', 'guia'],
      image: '/images/blog/guia-programacao.jpg',
      publishedAt: '2024-01-12',
      readTime: '12 min',
      featured: true,
      views: 2100,
      likes: 156
    },
    {
      id: 3,
      title: 'Inteligência Artificial: O Futuro do Desenvolvimento',
      slug: 'inteligencia-artificial-futuro-desenvolvimento',
      excerpt: 'Como a IA está transformando a forma como escrevemos código e o que esperar nos próximos anos.',
      content: 'A inteligência artificial está revolucionando todos os setores, e o desenvolvimento de software não é exceção...',
      author: {
        name: 'Pedro Costa',
        avatar: '/images/authors/pedro.jpg',
        bio: 'Especialista em IA e Machine Learning'
      },
      category: 'tecnologia',
      tags: ['ia', 'machine learning', 'futuro'],
      image: '/images/blog/ia-desenvolvimento.jpg',
      publishedAt: '2024-01-10',
      readTime: '10 min',
      featured: false,
      views: 890,
      likes: 67
    },
    {
      id: 4,
      title: 'Mulheres na Tech: Superando Desafios e Quebrando Barreiras',
      slug: 'mulheres-tech-superando-desafios',
      excerpt: 'Histórias inspiradoras e estratégias para mulheres que querem prosperar na área de tecnologia.',
      content: 'A tecnologia ainda é um campo dominado por homens, mas isso está mudando rapidamente...',
      author: {
        name: 'Maria Silva',
        avatar: '/images/authors/maria.jpg',
        bio: 'Advogada e Diversidade & Inclusão'
      },
      category: 'diversidade',
      tags: ['mulheres', 'diversidade', 'tecnologia'],
      image: '/images/blog/mulheres-tech.jpg',
      publishedAt: '2024-01-08',
      readTime: '7 min',
      featured: false,
      views: 1450,
      likes: 112
    },
    {
      id: 5,
      title: 'Remote Work: Dicas para Trabalhar Remotamente com Sucesso',
      slug: 'remote-work-dicas-sucesso',
      excerpt: 'Guia prático para manter produtividade e bem-estar trabalhando de casa ou em qualquer lugar.',
      content: 'O trabalho remoto veio para ficar, mas exige disciplina e organização para ser produtivo...',
      author: {
        name: 'João Santos',
        avatar: '/images/authors/joao.jpg',
        bio: 'Product Manager e especialista em remote work'
      },
      category: 'produtividade',
      tags: ['remote work', 'produtividade', 'home office'],
      image: '/images/blog/remote-work.jpg',
      publishedAt: '2024-01-05',
      readTime: '6 min',
      featured: false,
      views: 780,
      likes: 45
    },
    {
      id: 6,
      title: 'Framework vs Biblioteca: Entenda a Diferença',
      slug: 'framework-biblioteca-diferenca',
      excerpt: 'Conceitos fundamentais que todo desenvolvedor deve conhecer para escolher as ferramentas certas.',
      content: 'Muitos desenvolvedores iniciantes confundem frameworks com bibliotecas, mas são conceitos diferentes...',
      author: {
        name: 'Lucas Ferreira',
        avatar: '/images/authors/lucas.jpg',
        bio: 'Full-stack Developer e Technical Writer'
      },
      category: 'tutorial',
      tags: ['framework', 'biblioteca', 'conceitos'],
      image: '/images/blog/framework-biblioteca.jpg',
      publishedAt: '2024-01-03',
      readTime: '5 min',
      featured: false,
      views: 620,
      likes: 38
    }
  ]

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'tutorial', name: 'Tutoriais' },
    { id: 'tecnologia', name: 'Tecnologia' },
    { id: 'carreira', name: 'Carreira' },
    { id: 'diversidade', name: 'Diversidade' },
    { id: 'produtividade', name: 'Produtividade' }
  ]

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tutorial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'tecnologia':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'carreira':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'diversidade':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
      case 'produtividade':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-african-gold to-tech-teal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog ELTx HUB
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Conteúdo de qualidade para desenvolvedores, entusiastas de tecnologia e profissionais em crescimento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-white text-deep-charcoal hover:bg-gray-100">
                Assinar Newsletter
              </button>
              <button className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-deep-charcoal">
                Enviar Artigo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
              {/* Search */}
              <div className="w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-800 dark:text-white transition"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-african-gold text-deep-charcoal'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-gray-600 dark:text-gray-400">
              {filteredPosts.length} artigo{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Featured Posts */}
          {selectedCategory === 'all' && !searchTerm && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-deep-charcoal dark:text-white mb-8">
                Artigos em Destaque
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posts.filter(post => post.featured).slice(0, 2).map((post) => (
                  <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-4xl">
                          {post.category === 'tutorial' && '📚'}
                          {post.category === 'tecnologia' && '💻'}
                          {post.category === 'carreira' && '🚀'}
                          {post.category === 'diversidade' && '🌍'}
                          {post.category === 'produtividade' && '⚡'}
                        </span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-african-gold text-deep-charcoal text-xs font-bold px-3 py-1 rounded-full">
                          ⭐ Destaque
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(post.category)}`}>
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {post.readTime}
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`} className="block">
                        <h3 className="text-xl font-bold text-deep-charcoal dark:text-white mb-2 hover:text-african-gold transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs font-bold text-deep-charcoal dark:text-white">
                              {post.author.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {post.author.name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-4xl">
                      {post.category === 'tutorial' && '📚'}
                      {post.category === 'tecnologia' && '💻'}
                      {post.category === 'carreira' && '🚀'}
                      {post.category === 'diversidade' && '🌍'}
                      {post.category === 'produtividade' && '⚡'}
                    </span>
                  </div>
                  {post.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-african-gold text-deep-charcoal text-xs font-bold px-2 py-1 rounded-full">
                        ⭐
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getCategoryColor(post.category)}`}>
                      {categories.find(c => c.id === post.category)?.name}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {post.readTime}
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h3 className="text-lg font-bold text-deep-charcoal dark:text-white mb-2 hover:text-african-gold transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-deep-charcoal dark:text-white">
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">
                        {post.author.name}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-deep-charcoal dark:text-white mb-2">
                Nenhum artigo encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar sua busca ou categoria
              </p>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 bg-gradient-to-r from-african-gold to-tech-teal text-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Assine Nossa Newsletter</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Receba os melhores artigos, tutoriais e dicas diretamente no seu e-mail toda semana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 rounded-lg text-deep-charcoal focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-deep-charcoal hover:bg-gray-100 font-bold py-2 px-6 rounded-lg transition-colors">
                Assinar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
