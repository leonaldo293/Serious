// contexts/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Textos traduzidos
const translations = {
  pt: {
    // Navbar
    'home': 'Início',
    'empowerment_drive': 'Movimento de Empoderamento',
    'skills_tracker': 'Rastreador de Competências',
    'consulting': 'Consultoria',
    'programs': 'Programas',
    'bootcamp': 'Bootcamp',
    'empowerment': 'Empoderamento',
    'tracker': 'Tracker',
    'community': 'Comunidade',
    'profile': 'Perfil',
    'login': 'Login',
    'register': 'Registrar',
    'logout': 'Sair',
    'hello': 'Olá,',
    
    // Home Page
    'hero.title': 'Empoderando África Através de Linguagem, Código & Inovação',
    'hero.subtitle': 'Construa: Crie: Cresça — com o ecossistema EdTech que mais cresce no continente.',
    'hero.cta1': 'Comece Sua Jornada',
    'hero.cta2': 'Parceria Conosco',
    'whoWeAre': 'Quem Somos',
    'buildingSkills': 'Construindo Habilidades.',
    'buildingAfrica': 'Construindo África.',
    'whoWeAre.description': 'ELTx HUB é um ecossistema construído para ajudar africanos a falar com confiança, codificar com eficiência e construir projetos digitais do mundo real. Desbloqueamos oportunidades através do aprendizado de idiomas, treinamento em software e inovação.',
    
    // Footer
    'footer.brand': 'ELTx Hub',
    'footer.description': 'Empoderando aprendizes com programas EdTech inovadores.',
    'footer.resources': 'Recursos',
    'footer.contact': 'Contato',
    'footer.copyright': ' 2025 ELTx Hub. Todos os direitos reservados.',
    
    // Home Page Content
    'home.hero.title': 'Transforme sua carreira com tecnologia',
    'home.hero.subtitle': 'Capacitação profissional de qualidade para impulsionar sua jornada no mercado de tecnologia e inovação.',
    'home.hero.explore': 'Explorar Cursos',
    'home.hero.watch': 'Assistir Vídeo',
    'home.hero.pause': 'Pausar Vídeo',
    'home.stats.title': 'Nossos Números',
    'home.stats.students': 'Alunos Formados',
    'home.stats.employment': 'Empregabilidade',
    'home.stats.programs': 'Programas',
    'home.stats.countries': 'Países',
    'home.featured.title': 'Cursos em Destaque',
    'home.featured.subtitle': 'Comece sua jornada com nossos cursos mais populares',
    'home.featured.empty': 'Nenhum curso em destaque no momento.',
    'home.featured.viewall': 'Ver todos os cursos',
    'home.testimonials.title': 'O Que Nossos Alunos Dizem',
    'home.testimonials.subtitle': 'Histórias de sucesso e transformação',
    'home.newsletter.title': 'Fique por Dentro das Novidades',
    'home.newsletter.subtitle': 'Receba atualizações sobre novos cursos e eventos exclusivos',
    'home.newsletter.placeholder': 'Seu email',
    'home.newsletter.subscribe': 'Inscrever',
    'home.newsletter.thanks': ' Obrigado por se inscrever!',
    
    // Login Modal
    'login.welcome': 'Bem-vindo de volta',
    'login.email': 'Seu email',
    'login.password': 'Sua senha',
    'login.signing': 'Entrando...',
    'login.signin': 'Entrar',
    'login.noaccount': 'Não tem uma conta?',
    'login.register': 'Registre-se',
    'login.forgot': 'Esqueci minha senha',
    'login.error': 'Falha no login',
    'login.error.general': 'Erro ao tentar fazer login',
  },
  en: {
    // Navbar
    'home': 'Home',
    'empowerment_drive': 'Empowerment Drive',
    'skills_tracker': 'Skills Tracker',
    'consulting': 'Consulting',
    'programs': 'Programs',
    'bootcamp': 'Bootcamp',
    'empowerment': 'Empowerment',
    'tracker': 'Tracker',
    'community': 'Community',
    'profile': 'Profile',
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    'hello': 'Hello,',
    
    // Home Page
    'hero.title': 'Empowering Africa Through Language, Code & Innovation',
    'hero.subtitle': 'Loom, Build: Create: Grow — with the fastest-rising EdTech ecosystem on the continent.',
    'hero.cta1': 'Start Your Journey',
    'hero.cta2': 'Partner With Us',
    'whoWeAre': 'Who We Are',
    'buildingSkills': 'Building Skills.',
    'buildingAfrica': 'Building Africa.',
    'whoWeAre.description': 'ELTx HUB is an ecosystem built to help Africans speak confidently, code efficiently, and build real-world digital projects. We unlock opportunities through language learning, software training, and innovation.',
    
    // Footer
    'footer.brand': 'ELTx Hub',
    'footer.description': 'Empowering learners with innovative EdTech programs.',
    'footer.programs': 'Programs',
    'footer.resources': 'Resources',
      }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  // Carregar idioma salvo do localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('eltx-language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'pt' ? 'en' : 'pt';
    setLanguage(newLanguage);
    localStorage.setItem('eltx-language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}