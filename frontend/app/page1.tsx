'use client'

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import CourseService, { Course } from '@/services/CourseService'
import { Course as ApiCourse } from '@/lib/api/courses'
import ProgramService, { Program } from '@/services/ProgramService'
import MentorService, { Mentor } from '@/services/MentorService'
import CommunityService, { CommunityPost } from '@/services/CommunityService'
import CourseCard from '@/components/CourseCard'
import { BookOpen, Users, Award, MessageSquare, Star, Clock, DollarSign, Play, Pause } from 'lucide-react'

export const dynamic = 'force-dynamic'

function HomePageContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  // Data states
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [featuredPrograms, setFeaturedPrograms] = useState<Program[]>([])
  const [topMentors, setTopMentors] = useState<Mentor[]>([])
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log("HomePage: Loading data...")
      
      // Load all data in parallel
      const [courses, programs, mentors, posts] = await Promise.all([
        CourseService.getAll({ limit: 6 }).catch(err => ({ courses: [], total: 0, page: 1, totalPages: 1 })),
        ProgramService.getAll({ limit: 6 }).catch(err => ({ programs: [], total: 0, page: 1, totalPages: 1 })),
        MentorService.getAll({ limit: 6 }).catch(err => ({ mentors: [], total: 0, page: 1, totalPages: 1 })),
        CommunityService.getFeaturedPosts(6).catch(err => [])
      ])
      
      console.log("HomePage: Data loaded:", { courses, programs, mentors, posts })
      
      // Ensure arrays with safe extraction
      const coursesArray = courses && Array.isArray(courses.courses) ? courses.courses : []
      const programsArray = programs && Array.isArray(programs.programs) ? programs.programs : []
      const mentorsArray = mentors && Array.isArray(mentors.mentors) ? mentors.mentors : []
      const postsArray = Array.isArray(posts) ? posts : []
      
      setFeaturedCourses(coursesArray)
      setFeaturedPrograms(programsArray)
      setTopMentors(mentorsArray)
      setCommunityPosts(postsArray)
      
    } catch (error) {
      console.error('HomePage: Error loading data:', error)
      // Set empty arrays on error
      setFeaturedCourses([])
      setFeaturedPrograms([])
      setTopMentors([])
      setCommunityPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Desenvolvedora Front-end',
      content: 'O bootcamp mudou minha carreira! Em 3 meses consegui meu primeiro emprego como desenvolvedora.',
      avatar: '/images/avatars/avatar1.jpg'
    },
    {
      id: 2,
      name: 'João Santos',
      role: 'Cientista de Dados',
      content: 'Aprendi muito com os instrutores e a comunidade. Recomendo muito!',
      avatar: '/images/avatars/avatar2.jpg'
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      role: 'Empreendedora',
      content: 'A mentoria me ajudou a validar minha ideia de negócio e encontrar investidores.',
      avatar: '/images/avatars/avatar3.jpg'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white pt-28 pb-20 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/ti.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme sua carreira com
              <span className="block text-african-gold">ELTx HUB</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
              A plataforma líder em educação tecnológica em Angola. 
              Aprenda com os melhores mentores e construa seu futuro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="px-8 py-3 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:bg-opacity-90 transition"
              >
                Explorar Cursos
              </Link>
              <Link
                href="/programs"
                className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition"
              >
                Ver Programas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cursos em Destaque
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubra nossos cursos mais populares e comece sua jornada de aprendizado hoje mesmo.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course as unknown as ApiCourse} />
              ))}
            </div>
          )}

          {!loading && featuredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Nenhum curso disponível no momento.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-african-gold text-african-gold font-semibold rounded-lg hover:bg-african-gold hover:text-deep-charcoal transition"
            >
              Ver Todos os Cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Programas Intensivos
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Bootcamps e programas intensivos para acelerar sua carreira.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(featuredPrograms) && featuredPrograms.length > 0 ? (
                featuredPrograms.map((program) => (
                  <div key={program.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-african-gold/10 text-african-gold text-sm font-medium rounded-full">
                        {program.type}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {program.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-african-gold">
                        {program.price?.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {program.enrolledCount} inscritos
                      </span>
                    </div>
                    <Link
                      href={`/programs/${program.id}`}
                      className="block w-full text-center px-4 py-2 bg-african-gold text-deep-charcoal font-medium rounded-lg hover:bg-opacity-90 transition"
                    >
                      Saiba Mais
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">Nenhum programa disponível</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/programs"
              className="inline-flex items-center px-6 py-3 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Ver Todos os Programas
            </Link>
          </div>
        </div>
      </section>

      {/* Top Mentors */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Conheça nossos Mentores
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Aprenda com especialistas renomados da indústria tecnológica.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center animate-pulse">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(topMentors) && topMentors.length > 0 ? (
                topMentors.map((mentor) => (
                  <div key={mentor.id} className="text-center">
                    <div className="w-24 h-24 bg-african-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-12 h-12 text-african-gold" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {mentor.firstName} {mentor.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {Array.isArray(mentor.expertise) ? mentor.expertise.join(', ') : mentor.expertise}
                    </p>
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {(mentor.rating || 0).toFixed(1)} ({mentor.studentsCount || 0} alunos)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(mentor.hourlyRate || 0).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}/hora
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">Nenhum mentor disponível</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/mentors"
              className="inline-flex items-center px-6 py-3 border border-african-gold text-african-gold font-semibold rounded-lg hover:bg-african-gold hover:text-deep-charcoal transition"
            >
              Ver Todos os Mentores
            </Link>
          </div>
        </div>
      </section>

      {/* Community Posts */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comunidade
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Últimas postagens da nossa comunidade de aprendizes.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(communityPosts) && communityPosts.length > 0 ? (
                communityPosts.map((post) => (
                  <div key={post.id} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-african-gold/10 text-african-gold text-sm font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString('pt-AO')}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>por {post.author}</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments || 0}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {post.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">Nenhuma postagem disponível</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/community"
              className="inline-flex items-center px-6 py-3 bg-african-gold text-deep-charcoal font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Ver Comunidade
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              O que nossos alunos dizem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Histórias de sucesso da nossa comunidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-african-gold/20 rounded-full mr-4 flex items-center justify-center">
                    <Users className="w-6 h-6 text-african-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-african-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-charcoal mb-4">
            Fique por dentro das novidades
          </h2>
          <p className="text-xl text-deep-charcoal/80 mb-8">
            Receba informações exclusivas sobre novos cursos e programas.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-deep-charcoal focus:ring-opacity-50"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-deep-charcoal text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Inscrever-se
            </button>
          </form>

          {isSubscribed && (
            <p className="mt-4 text-deep-charcoal font-medium">
              ✅ Inscrição realizada com sucesso!
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
