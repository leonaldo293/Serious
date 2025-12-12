import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Basic translation files
const resources = {
  en: {
    common: {
      nav: {
        home: "Home",
        programs: "Programs",
        bootcamp: "Bootcamps",
        community: "Community",
        consulting: "Consulting",
        empowerment: "Empowerment",
        tracker: "Progress",
        dashboard: "Dashboard",
        profile: "Profile",
        login: "Login",
        register: "Register",
        logout: "Logout"
      },
      auth: {
        login: "Login",
        register: "Sign Up",
        email: "Email",
        password: "Password"
      }
    }
  },
  pt: {
    common: {
      nav: {
        home: "Início",
        programs: "Programas",
        bootcamp: "Bootcamps",
        community: "Comunidade",
        consulting: "Consultoria",
        empowerment: "Empoderamento",
        tracker: "Progresso",
        dashboard: "Dashboard",
        profile: "Perfil",
        login: "Entrar",
        register: "Cadastrar",
        logout: "Sair"
      },
      auth: {
        login: "Entrar",
        register: "Cadastrar-se",
        email: "Email",
        password: "Senha"
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
