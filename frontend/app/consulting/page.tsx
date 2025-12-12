'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - Replace with API calls
const services = [
  {
    id: 1,
    title: 'Orientação de Carreira em TI',
    description: 'Planejamento de carreira personalizado para profissionais de tecnologia, incluindo roteiro de aprendizado e estratégias de crescimento.',
    duration: '60 min',
    price: '2.499 Kz',
    category: 'Carreira',
    icon: '💼'
  },
  {
    id: 2,
    title: 'Revisão de Portfólio',
    description: 'Análise detalhada do seu portfólio com feedback construtivo e dicas para melhorar sua apresentação profissional.',
    duration: '45 min',
    price: '1.999 Kz',
    category: 'Portfólio',
    icon: '📁'
  },
  {
    id: 3,
    title: 'Preparação para Entrevistas',
    description: 'Simulações de entrevistas técnicas e comportamentais com feedback personalizado.',
    duration: '60 min',
    price: '2.999 Kz',
    category: 'Entrevistas',
    icon: '🎯'
  },
  {
    id: 4,
    title: 'Mentoria em Desenvolvimento Web',
    description: 'Acompanhamento personalizado para desenvolvimento de projetos web, desde o planejamento até a implementação.',
    duration: '90 min',
    price: '3.499 Kz',
    category: 'Desenvolvimento',
    icon: '💻'
  },
  {
    id: 5,
    title: 'Otimização de LinkedIn',
    description: 'Melhore seu perfil no LinkedIn para atrair mais oportunidades profissionais e recrutadores.',
    duration: '45 min',
    price: '1.799 Kz',
    category: 'Carreira',
    icon: '🔗'
  },
  {
    id: 6,
    title: 'Consultoria em Inovação Digital',
    description: 'Apoio na transformação digital do seu negócio ou startup com as melhores práticas do mercado.',
    duration: '120 min',
    price: '4.999 Kz',
    category: 'Negócios',
    icon: '🚀'
  }
];

const testimonials = [
  {
    id: 1,
    name: 'Carlos M.',
    role: 'Desenvolvedor Front-end',
    content: 'A mentoria me ajudou a estruturar melhor meus projetos e me preparar para entrevistas técnicas. Consegui minha primeira vaga como desenvolvedor!',
    avatar: '/images/avatars/avatar3.jpg'
  },
  {
    id: 2,
    name: 'Ana P.',
    role: 'Estudante de TI',
    content: 'A consultoria de carreira foi essencial para definir meu caminho de aprendizado. Recomendo muito!',
    avatar: '/images/avatars/avatar4.jpg'
  },
  {
    id: 3,
    name: 'Miguel S.',
    role: 'Empreendedor',
    content: 'A consultoria em inovação digital trouxe insights valiosos para o meu negócio. Voltarei para mais sessões!',
    avatar: '/images/avatars/avatar5.jpg'
  }
];

const faqs = [
  {
    question: 'Como agendar uma consultoria?',
    answer: 'Basta clicar no botão "Agendar Sessão" do serviço desejado, escolher um horário disponível e efetuar o pagamento.'
  },
  {
    question: 'Qual a duração de cada sessão?',
    answer: 'As sessões variam de 45 a 120 minutos, dependendo do serviço escolhido. A duração está especificada em cada card de serviço.'
  },
  {
    question: 'Posso reagendar minha consultoria?',
    answer: 'Sim, você pode reagendar sua consultoria com até 24 horas de antecedência através do link de confirmação enviado por e-mail.'
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos transferência bancária, cartão de crédito e pagamentos via M-Pesa e Airtel Money.'
  },
  {
    question: 'Oferecem descontos para pacotes de consultoria?',
    answer: 'Sim, oferecemos descontos especiais para pacotes com múltiplas sessões. Entre em contato para mais informações.'
  }
];

export default function Consulting() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = ['Todas', ...Array.from(new Set(services.map(service => service.category)))];
  
  const filteredServices = activeCategory === 'Todas' 
    ? services 
    : services.filter(service => service.category === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-soft-ivory dark:bg-deep-charcoal">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-deep-charcoal to-tech-teal text-pure-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Consultoria Especializada</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            Apoio personalizado para impulsionar sua carreira ou negócio na área de tecnologia e inovação
          </p>
          <Link 
            href="#servicos"
            className="bg-african-gold hover:bg-african-gold/90 text-deep-charcoal font-bold py-3 px-8 rounded-full text-lg transition-colors"
          >
            Ver Serviços
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 bg-pure-white dark:bg-dark-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-deep-charcoal dark:text-pure-white">
            Nossos Serviços de Consultoria
          </h2>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-african-gold text-deep-charcoal'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="bg-pure-white dark:bg-dark-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="w-16 h-16 rounded-full bg-african-gold/10 flex items-center justify-center text-3xl mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal dark:text-pure-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {service.duration} • {service.price}
                    </span>
                    <div className="flex gap-2">
                      <a 
                        href={`https://wa.me/953763326?text=Olá! Tenho interesse na consultoria: ${service.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                        </svg>
                        WhatsApp
                      </a>
                      <button className="bg-african-gold hover:bg-african-gold/90 text-deep-charcoal font-medium py-2 px-4 rounded-full text-sm transition-colors">
                        Agendar Sessão
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50 dark:bg-dark-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-deep-charcoal dark:text-pure-white">
            Como Funciona
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Escolha o Serviço',
                description: 'Selecione o tipo de consultoria que melhor atende às suas necessidades.'
              },
              {
                step: '2',
                title: 'Agende o Horário',
                description: 'Escolha um horário que se encaixe na sua agenda.'
              },
              {
                step: '3',
                title: 'Conecte-se Online',
                description: 'Participe da sua sessão por vídeo chamada no horário agendado.'
              }
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-pure-white dark:bg-dark-gray-800 rounded-xl shadow-md">
                <div className="w-16 h-16 bg-african-gold/10 rounded-full flex items-center justify-center text-2xl font-bold text-african-gold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-deep-charcoal dark:text-pure-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-pure-white dark:bg-dark-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-deep-charcoal dark:text-pure-white">
            O Que Dizem Nossos Clientes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 dark:bg-dark-gray-700 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-deep-charcoal dark:text-pure-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-tech-teal to-african-gold text-pure-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Precisa de algo personalizado?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Temos consultores especializados prontos para atender necessidades específicas do seu projeto ou carreira.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/953763326?text=Olá! Preciso de uma consultoria personalizada."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
            </svg>
            Falar via WhatsApp
          </a>
          <button className="bg-pure-white hover:bg-gray-100 text-deep-charcoal font-bold py-3 px-8 rounded-full text-lg transition-colors">
            Fale com um Consultor
          </button>
        </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-dark-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-deep-charcoal dark:text-pure-white">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-pure-white dark:bg-dark-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-medium text-deep-charcoal dark:text-pure-white">
                    {faq.question}
                  </span>
                  <span className="text-african-gold text-xl">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
