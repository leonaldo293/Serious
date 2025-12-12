'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// Mock data - Em produção, buscar do CMS ou API
const posts = {
  '10-habilidades-essenciais-desenvolvedores-2024': {
    id: 1,
    title: '10 Habilidades Essenciais para Desenvolvedores em 2024',
    slug: '10-habilidades-essenciais-desenvolvedores-2024',
    content: `
# 10 Habilidades Essenciais para Desenvolvedores em 2024

O mundo da tecnologia está em constante evolução, e os desenvolvedores precisam se manter atualizados para permanecerem relevantes no mercado. Neste artigo, vamos explorar as 10 habilidades mais importantes que todo desenvolvedor deve dominar este ano.

## 1. Programação Funcional

A programação funcional continua ganhando popularidade, especialmente com frameworks como React adotando conceitos funcionais. Entender imutabilidade, pureza e composição de funções é fundamental.

\`\`\`javascript
// Exemplo de função pura
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Composição de funções
const compose = (f, g) => (x) => f(g(x));
const addAndMultiply = compose(multiply, add);
\`\`\`

## 2. Cloud Computing

O conhecimento em serviços cloud é indispensável. AWS, Azure e Google Cloud dominam o mercado, e entender como implantar e gerenciar aplicações na nuvem é uma habilidade valiosa.

## 3. DevOps e CI/CD

Práticas de DevOps e automação de pipelines são essenciais para times modernos. Ferramentas como Docker, Kubernetes e GitHub Actions fazem parte do dia a dia.

## 4. Machine Learning Básico

Mesmo que você não seja um cientista de dados, entender conceitos básicos de ML é importante. APIs como TensorFlow.js e modelos pré-treinados estão acessíveis.

## 5. Segurança da Informação

Com o aumento de ciberataques, conhecimento em segurança é crucial. Entender OWASP Top 10, criptografia e práticas seguras de desenvolvimento é fundamental.

## 6. Arquitetura de Microsserviços

Aplicações monolíticas estão sendo substituídas por arquiteturas distribuídas. Entender padrões de microsserviços é essencial.

## 7. GraphQL e APIs Modernas

REST ainda é relevante, mas GraphQL está ganhando espaço. Saber projetar e consumir APIs modernas é uma habilidade importante.

## 8. Testes Automatizados

Qualidade de software depende de bons testes. TDD, BDD e testes em diferentes níveis (unidade, integração, E2E) são fundamentais.

## 9. Performance e Otimização

Aplicações rápidas proporcionam melhor experiência. Entender otimização de performance, lazy loading e técnicas de cache é essencial.

## 10. Soft Skills

Habilidades técnicas são importantes, mas comunicação, trabalho em equipe e liderança fazem a diferença na carreira.

## Conclusão

O desenvolvimento de software é um campo em constante mudança. Investir em aprendizado contínuo e manter-se atualizado com as tendências do mercado é a chave para o sucesso.

Qual dessas habilidades você já domina? E quais você planeja aprender este ano? Deixe seu comentário abaixo!
    `,
    author: {
      name: 'Carlos Mendes',
      avatar: '/images/authors/carlos.jpg',
      bio: 'Desenvolvedor Senior com 10+ anos de experiência em arquitetura de software e liderança técnica.'
    },
    category: 'carreira',
    tags: ['desenvolvimento', 'carreira', 'habilidades', '2024'],
    image: '/images/blog/habilidades-2024.jpg',
    publishedAt: '2024-01-15',
    readTime: '8 min',
    views: 1250,
    likes: 89,
    comments: [
      {
        id: 1,
        author: 'Ana Silva',
        content: 'Ótimo artigo! A parte sobre cloud computing é especialmente relevante hoje.',
        publishedAt: '2024-01-15T14:30:00',
        likes: 12
      },
      {
        id: 2,
        author: 'João Santos',
        content: 'Concordo sobre a importância das soft skills. Técnica sozinha não basta mais.',
        publishedAt: '2024-01-15T16:45:00',
        likes: 8
      }
    ]
  }
}

const relatedPosts = [
  {
    id: 2,
    title: 'Guia Completo: Como Começar na Programação',
    slug: 'guia-como-comecar-programacao',
    category: 'tutorial',
    readTime: '12 min'
  },
  {
    id: 3,
    title: 'Inteligência Artificial: O Futuro do Desenvolvimento',
    slug: 'inteligencia-artificial-futuro-desenvolvimento',
    category: 'tecnologia',
    readTime: '10 min'
  },
  {
    id: 4,
    title: 'Remote Work: Dicas para Trabalhar Remotamente com Sucesso',
    slug: 'remote-work-dicas-sucesso',
    category: 'produtividade',
    readTime: '6 min'
  }
]

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const [newComment, setNewComment] = useState('')
  
  const post = posts[slug as keyof typeof posts]

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-400 mb-4">Artigo não encontrado</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Link href="/blog" className="btn-primary">
              Voltar para o Blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria o envio do comentário para a API
    console.log('Novo comentário:', newComment)
    setNewComment('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `Há ${diffInHours}h`
    if (diffInHours < 48) return 'Ontem'
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-600 hover:text-african-gold">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/blog" className="text-gray-600 hover:text-african-gold">
                Blog
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              {post.title}
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="mb-6">
            <span className="inline-block bg-african-gold/10 text-african-gold px-3 py-1 rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-deep-charcoal dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-bold text-deep-charcoal dark:text-white">
                      {post.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-deep-charcoal dark:text-white">
                      {post.author.name}
                    </div>
                    <div className="text-sm">
                      {formatDate(post.publishedAt)} • {post.readTime} de leitura
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {post.views}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {post.likes}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12">
          <div className="h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-6xl">
              {post.category === 'carreira' && '🚀'}
              {post.category === 'tutorial' && '📚'}
              {post.category === 'tecnologia' && '💻'}
            </span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <div dangerouslySetInnerHTML={{ 
            __html: post.content.replace(/\n/g, '<br>').replace(/```/g, '<pre><code>').replace(/```/g, '</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/^### (.*$)/gm, '<h3>$1</h3>').replace(/^## (.*$)/gm, '<h2>$1</h2>').replace(/^# (.*$)/gm, '<h1>$1</h1>')
          }} />
        </div>

        {/* Tags */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-deep-charcoal dark:text-white">
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-deep-charcoal dark:text-white mb-1">
                {post.author.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {post.author.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-deep-charcoal dark:text-white mb-6">
            Comentários ({post.comments.length})
          </h3>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-deep-charcoal dark:text-white mb-4">
              Deixe seu comentário
            </h4>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Compartilhe suas thoughts..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-african-gold focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              required
            />
            <button type="submit" className="btn-primary mt-4">
              Publicar Comentário
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-deep-charcoal dark:text-white">
                      {comment.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-deep-charcoal dark:text-white">
                        {comment.author}
                      </h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatCommentDate(comment.publishedAt)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {comment.content}
                    </p>
                    <button className="text-sm text-gray-500 hover:text-african-gold transition-colors">
                      ❤️ {comment.likes} curtidas
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div>
          <h3 className="text-2xl font-bold text-deep-charcoal dark:text-white mb-6">
            Artigos Relacionados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="block">
                <article className="bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">
                      {relatedPost.category === 'tutorial' && '📚'}
                      {relatedPost.category === 'tecnologia' && '💻'}
                      {relatedPost.category === 'produtividade' && '⚡'}
                    </span>
                  </div>
                  <h4 className="font-semibold text-deep-charcoal dark:text-white mb-2 hover:text-african-gold transition-colors">
                    {relatedPost.title}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {relatedPost.readTime}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
