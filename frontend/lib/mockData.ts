// Mock data para garantir que todos os componentes tenham dados disponíveis

export const mockUsers = [
  {
    id: '1',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@example.com',
    role: 'admin' as const,
    avatar: 'JS',
    createdAt: '2024-01-15T10:30:00',
    lastLogin: '2024-01-20T14:22:00'
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@example.com',
    role: 'user' as const,
    avatar: 'MS',
    createdAt: '2024-01-16T09:15:00',
    lastLogin: '2024-01-19T16:45:00'
  },
  {
    id: '3',
    firstName: 'Pedro',
    lastName: 'Costa',
    email: 'pedro.costa@example.com',
    role: 'instructor' as const,
    avatar: 'PC',
    createdAt: '2024-01-10T11:20:00',
    lastLogin: '2024-01-20T10:30:00'
  }
]

export const mockCourses = [
  {
    id: '1',
    title: 'Desenvolvimento Web Completo',
    description: 'Aprenda HTML, CSS, JavaScript, React e Node.js do zero ao avançado',
    thumbnail: '/images/courses/web-dev.jpg',
    instructor: {
      id: '3',
      firstName: 'Pedro',
      lastName: 'Costa',
      email: 'pedro.costa@example.com',
      avatar: 'PC'
    },
    duration: '40 horas',
    level: 'iniciante',
    price: 150000,
    isFree: false,
    category: 'desenvolvimento',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    rating: 4.8,
    studentsCount: 1250,
    lessonsCount: 45,
    createdAt: '2024-01-10T00:00:00',
    updatedAt: '2024-01-15T00:00:00'
  },
  {
    id: '2',
    title: 'Python para Data Science',
    description: 'Domine Python e suas bibliotecas para análise de dados',
    thumbnail: '/images/courses/python-ds.jpg',
    instructor: {
      id: '2',
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@example.com',
      avatar: 'MS'
    },
    duration: '35 horas',
    level: 'intermediário',
    price: 120000,
    isFree: false,
    category: 'data-science',
    tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    rating: 4.9,
    studentsCount: 890,
    lessonsCount: 38,
    createdAt: '2024-01-12T00:00:00',
    updatedAt: '2024-01-18T00:00:00'
  },
  {
    id: '3',
    title: 'Introdução ao React',
    description: 'Aprenda os fundamentos do React e crie aplicações modernas',
    thumbnail: '/images/courses/react-intro.jpg',
    instructor: {
      id: '1',
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@example.com',
      avatar: 'JS'
    },
    duration: '20 horas',
    level: 'iniciante',
    price: 0,
    isFree: true,
    category: 'desenvolvimento',
    tags: ['React', 'JavaScript', 'Hooks', 'Components'],
    rating: 4.7,
    studentsCount: 2100,
    lessonsCount: 25,
    createdAt: '2024-01-08T00:00:00',
    updatedAt: '2024-01-20T00:00:00'
  }
]

export const mockBootcamps = [
  {
    id: '1',
    title: 'Bootcamp Full Stack',
    description: 'Torne-se um desenvolvedor Full Stack em 12 semanas',
    duration: '12 semanas',
    level: 'iniciante',
    price: 500000,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    mode: 'online',
    instructor: 'João Silva',
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    studentsCount: 45,
    maxStudents: 60,
    rating: 4.9,
    image: '/images/bootcamps/fullstack.jpg'
  },
  {
    id: '2',
    title: 'Bootcamp Data Science',
    description: 'Domine Data Science e Machine Learning',
    duration: '16 semanas',
    level: 'intermediário',
    price: 750000,
    startDate: '2024-02-15',
    endDate: '2024-06-15',
    mode: 'híbrido',
    instructor: 'Maria Santos',
    tags: ['Python', 'Machine Learning', 'Deep Learning', 'Statistics'],
    studentsCount: 30,
    maxStudents: 40,
    rating: 4.8,
    image: '/images/bootcamps/datascience.jpg'
  }
]

export const mockBlogPosts = [
  {
    id: '1',
    title: 'Os 10 Melhores Frameworks JavaScript em 2024',
    slug: 'melhores-frameworks-javascript-2024',
    excerpt: 'Descubra quais são os frameworks JavaScript mais populares e adequados para seus projetos neste ano.',
    content: `
      <p>O mundo do desenvolvimento web está em constante evolução, e com ele surgem novos frameworks e bibliotecas JavaScript. Neste artigo, vamos explorar os 10 melhores frameworks que estão dominando o mercado em 2024.</p>
      
      <h2>1. React</h2>
      <p>React continua sendo o framework mais popular, mantido pelo Facebook e com uma comunidade enorme. Sua abordagem baseada em componentes e virtual DOM o torna ideal para aplicações complexas.</p>
      
      <h2>2. Vue.js</h2>
      <p>Vue.js ganhou popularidade por sua simplicidade e flexibilidade. É uma ótima opção para desenvolvedores que querem uma curva de aprendizado suave.</p>
      
      <h2>3. Angular</h2>
      <p>Mantido pelo Google, Angular é uma escolha robusta para aplicações empresariais, oferecendo um ecossistema completo e TypeScript integrado.</p>
      
      <h2>Conclusão</h2>
      <p>A escolha do framework depende das necessidades específicas do seu projeto, equipe e objetivos. Avalie cuidadosamente cada opção antes de tomar sua decisão.</p>
    `,
    author: {
      name: 'João Silva',
      avatar: '/images/authors/joao.jpg',
      bio: 'Desenvolvedor Full Stack com 8 anos de experiência'
    },
    category: 'desenvolvimento',
    tags: ['JavaScript', 'Frameworks', 'React', 'Vue', 'Angular'],
    publishedAt: '2024-01-20T10:00:00',
    readingTime: 8,
    featured: true,
    image: '/images/blog/frameworks-js.jpg'
  },
  {
    id: '2',
    title: 'Guia Completo de CSS Grid Layout',
    slug: 'guia-completo-css-grid-layout',
    excerpt: 'Aprenda a dominar CSS Grid Layout e criar layouts complexos com facilidade.',
    content: `
      <p>CSS Grid Layout revolucionou a forma como criamos layouts na web. Neste guia completo, vamos explorar todos os conceitos e técnicas para dominar essa poderosa ferramenta.</p>
      
      <h2>O que é CSS Grid?</h2>
      <p>CSS Grid é um sistema de layout bidimensional que nos permite criar estruturas complexas tanto em linhas quanto em colunas, algo que não era possível com os métodos tradicionais.</p>
      
      <h2>Conceitos Básicos</h2>
      <p>Para começar com Grid, precisamos entender alguns conceitos fundamentais como grid container, grid items, grid lines e grid tracks.</p>
      
      <h2>Exemplos Práticos</h2>
      <p>Vamos criar vários exemplos práticos para solidificar nosso conhecimento, desde layouts simples até estruturas complexas.</p>
    `,
    author: {
      name: 'Maria Santos',
      avatar: '/images/authors/maria.jpg',
      bio: 'UI/UX Designer e Front-end Developer'
    },
    category: 'design',
    tags: ['CSS', 'Grid', 'Layout', 'Front-end'],
    publishedAt: '2024-01-18T14:30:00',
    readingTime: 12,
    featured: false,
    image: '/images/blog/css-grid.jpg'
  }
]

export const mockTestimonials = [
  {
    id: '1',
    name: 'Ana Oliveira',
    role: 'Desenvolvedora Front-end',
    avatar: '/images/testimonials/ana.jpg',
    content: 'O bootcamp mudou completamente minha carreira! Em apenas 3 meses, passei de estagiar a conseguir meu primeiro emprego como desenvolvedora. Os instrutores são excelentes e o suporte da comunidade é incrível.',
    rating: 5,
    company: 'Tech Solutions Angola',
    location: 'Luanda, Angola'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    role: 'Cientista de Dados',
    avatar: '/images/testimonials/carlos.jpg',
    content: 'Os cursos de Data Science são completos e muito práticos. Gostei especialmente dos projetos reais que desenvolvemos, que me ajudaram a construir um portfólio sólido.',
    rating: 5,
    company: 'Data Analytics Ltd',
    location: 'Maputo, Moçambique'
  },
  {
    id: '3',
    name: 'Sofia Costa',
    role: 'Product Manager',
    avatar: '/images/testimonials/sofia.jpg',
    content: 'A plataforma é intuitiva e o conteúdo é de alta qualidade. As mentorias individuais foram fundamentais para minha transição de carreira para Product Management.',
    rating: 4,
    company: 'Startup Inovadora',
    location: 'São Paulo, Brasil'
  }
]

export const mockEvents = [
  {
    id: '1',
    title: 'Webinar: Introdução a React Hooks',
    description: 'Aprenda os fundamentos dos React Hooks e como usálos para criar componentes mais eficientes',
    date: '2024-01-25T19:00:00',
    duration: '2 horas',
    mode: 'online',
    instructor: 'João Silva',
    maxParticipants: 100,
    currentParticipants: 78,
    price: 0,
    category: 'workshop',
    tags: ['React', 'Hooks', 'JavaScript', 'Front-end'],
    image: '/images/events/react-hooks.jpg'
  },
  {
    id: '2',
    title: 'Workshop: Python para Análise de Dados',
    description: 'Workshop prático sobre como usar Python e Pandas para análise de dados',
    date: '2024-01-27T14:00:00',
    duration: '4 horas',
    mode: 'online',
    instructor: 'Maria Santos',
    maxParticipants: 50,
    currentParticipants: 42,
    price: 25000,
    category: 'workshop',
    tags: ['Python', 'Pandas', 'Data Analysis', 'Workshop'],
    image: '/images/events/python-data.jpg'
  },
  {
    id: '3',
    title: 'Meetup: Mulheres na Tecnologia',
    description: 'Encontro para discutir desafios e oportunidades para mulheres na área de tecnologia',
    date: '2024-01-30T18:00:00',
    duration: '3 horas',
    mode: 'presencial',
    instructor: 'Comunidade ELTx',
    maxParticipants: 80,
    currentParticipants: 65,
    price: 0,
    category: 'networking',
    tags: ['Networking', 'Mulheres na Tech', 'Comunidade'],
    image: '/images/events/women-tech.jpg'
  }
]

export const mockOpportunities = [
  {
    id: '1',
    title: 'Desenvolvedor Front-end Júnior',
    company: 'Tech Solutions Angola',
    location: 'Luanda, Angola',
    type: 'full-time',
    level: 'junior',
    salary: 'AOA 150.000 - 250.000',
    description: 'Buscamos desenvolvedores React para nossa equipe inovadora. Você trabalhará em projetos desafiadores para clientes internacionais.',
    requirements: ['React', 'TypeScript', 'CSS', 'Git'],
    benefits: ['Plano de saúde', 'Flexibilidade de horário', 'Oportunidades de crescimento'],
    postedAt: '2024-01-15',
    deadline: '2024-02-15',
    isRemote: false,
    isUrgent: true,
    category: 'desenvolvimento'
  },
  {
    id: '2',
    title: 'Estágio em Desenvolvimento Web',
    company: 'Digital Agency',
    location: 'Remoto',
    type: 'internship',
    level: 'intern',
    salary: 'AOA 50.000 - 80.000',
    description: 'Oportunidade para estudantes aprenderem na prática, desenvolvendo projetos reais para clientes.',
    requirements: ['HTML', 'CSS', 'JavaScript básico', 'Foco em aprendizado'],
    benefits: ['Certificado', 'Mentoria', 'Possibilidade de efetivação'],
    postedAt: '2024-01-14',
    deadline: '2024-01-31',
    isRemote: true,
    isUrgent: false,
    category: 'desenvolvimento'
  },
  {
    id: '3',
    title: 'Cientista de Dados Pleno',
    company: 'Startup Inovadora',
    location: 'Remoto',
    type: 'full-time',
    level: 'mid',
    salary: 'AOA 300.000 - 500.000',
    description: 'Buscamos um cientista de dados para ajudar a construir modelos de machine learning e analisar dados complexos.',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Estatística'],
    benefits: ['Remoto', 'Bolsa de pesquisa', 'Conferências'],
    postedAt: '2024-01-13',
    deadline: '2024-02-01',
    isRemote: true,
    isUrgent: false,
    category: 'data-science'
  }
]

export const mockStats = {
  users: 5234,
  courses: 48,
  bootcamps: 12,
  instructors: 15,
  countries: 15,
  completionRate: 85,
  satisfactionRate: 92,
  averageRating: 4.8
}

export const mockNotifications = [
  {
    id: '1',
    title: 'Novo curso disponível',
    message: 'React Advanced Patterns já está disponível!',
    type: 'info',
    read: false,
    createdAt: '2024-01-20T10:00:00'
  },
  {
    id: '2',
    title: 'Lembrete de aula',
    message: 'Você tem uma aula amanhã às 14:00',
    type: 'reminder',
    read: false,
    createdAt: '2024-01-19T18:00:00'
  },
  {
    id: '3',
    title: 'Certificado emitido',
    message: 'Parabéns! Você concluiu o curso de JavaScript',
    type: 'success',
    read: true,
    createdAt: '2024-01-18T16:30:00'
  }
]

// Funções utilitárias para formatar dados
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA'
  }).format(amount)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR')
}

export const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInHours < 1) return 'Agora'
  if (diffInHours < 24) return `Há ${diffInHours} horas`
  if (diffInDays === 1) return 'Ontem'
  if (diffInDays < 7) return `Há ${diffInDays} dias`
  return formatDate(dateString)
}

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
