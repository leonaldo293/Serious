'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { coursesService, Course } from '@/lib/api/courses';
import { safeMapRender } from '@/lib/utils/arraySafety';
import { useLanguage } from '@/contexts/LanguageContext';
import { createWhatsAppLink, createCourseInquiryMessage } from '@/lib/utils/whatsapp';
// import { useToast } from '@/components/Toast';
import CourseCard from '@/components/CourseCard';
import { CourseCardSkeleton } from '@/components/SkeletonLoader';

export const dynamic = 'force-dynamic';

function HomePageContent() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedCourses();
  }, []);

  const loadFeaturedCourses = async () => {
    try {
      setLoading(true);
      const courses = await coursesService.getFeaturedCourses(3);
      // Garantir que sempre seja um array, mesmo que vazio
      setFeaturedCourses(Array.isArray(courses) ? courses : []);
    } catch (err: unknown) {
      console.error('Erro ao carregar cursos:', err);
      // Se a API falhar, o getFeaturedCourses já retorna dados mock
      // então não precisamos chamar o método privado aqui
      setFeaturedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // showToast({
      //   type: 'success',
      //   title: 'Inscrição realizada com sucesso!',
      //   message: 'Você receberá nossas novidades em breve.'
      // });
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  
  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Front-end Developer',
      content: 'The bootcamp changed my career! In 3 months, I got my first job as a developer.',
      avatar: '/images/avatars/avatar1.jpg'
    },
    {
      id: 2,
      name: 'João Santos',
      role: 'Data Scientist',
      content: 'I learned a lot from the instructors and the community. Highly recommended!',
      avatar: '/images/avatars/avatar2.jpg'
    },
    {
      id: 3,
      name: 'Ana Oliveira',
      role: 'Entrepreneur',
      content: 'The mentorship helped me validate my business idea and find investors.',
      avatar: '/images/avatars/avatar3.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white pt-28 pb-20 overflow-hidden">
        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/eltex.jpeg"
            alt="ELTx Hub Background"
            className="w-full h-full object-cover"
              />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={createWhatsAppLink(createCourseInquiryMessage('Quero me inscrever nos cursos'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-african-gold hover:bg-african-gold/90 text-deep-charcoal font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.897-.105.537-.299.994-.748 1.247-1.249.253-.501.398-1.056.398-1.653 0-.198-.025-.372-.075-.521z"/>
                    <path d="M19.5 3.5c-2.5-2.5-6.5-2.5-9 0l-1 1c-1.5 1.5-2.5 3.5-2.5 5.5 0 2 1 4 2.5 5.5l1 1c1.5 1.5 3.5 2.5 5.5 2.5 2 0 4-1 5.5-2.5l1-1c1.5-1.5 2.5-3.5 2.5-5.5 0-2-1-4-2.5-5.5z" opacity="0.3"/>
                  </svg>
                  Sign Up
                </a>
                <Link 
                  href="/courses"
                  className="border-2 border-white text-white hover:bg-white hover:text-deep-charcoal font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Courses
                </Link>
              </div>
            </div>
            
            {/* Right side - Stats or additional content */}
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">{t('home.stats.title')}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-african-gold mb-2">5.000+</div>
                    <div className="text-gray-300">{t('home.stats.students')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-tech-teal mb-2">85%</div>
                    <div className="text-gray-300">{t('home.stats.employment')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-african-gold mb-2">50+</div>
                    <div className="text-gray-300">{t('home.stats.programs')}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-tech-teal mb-2">12</div>
                    <div className="text-gray-300">{t('home.stats.countries')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('home.featured.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {safeMapRender(
                  featuredCourses,
                  (course) => <CourseCard key={course.id} course={course} />,
                  t('home.featured.empty')
                )}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/courses"
                  className="inline-flex items-center text-african-gold hover:text-african-gold/80 font-semibold text-lg"
                >
                  {t('home.featured.viewall')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-african-gold">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-deep-charcoal mb-6">
            {t('home.newsletter.title')}
          </h2>
          <p className="text-xl text-deep-charcoal/80 mb-8">
            {t('home.newsletter.subtitle')}
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('home.newsletter.placeholder')}
                className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-deep-charcoal placeholder-deep-charcoal/50 focus:outline-none focus:ring-2 focus:ring-deep-charcoal"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-deep-charcoal text-white font-medium rounded-lg hover:bg-deep-charcoal/90 transition"
              >
                {t('home.newsletter.subscribe')}
              </button>
            </form>
          ) : (
            <div className="text-deep-charcoal font-medium">
              ✓ Obrigado por se inscrever!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return <HomePageContent />;
}
