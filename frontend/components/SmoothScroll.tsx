'use client'

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    // Smooth scroll para links internos
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (!link) return
      
      const href = link.getAttribute('href')
      if (!href?.startsWith('#')) return
      
      e.preventDefault()
      
      const targetId = href.slice(1)
      const targetElement = document.getElementById(targetId)
      
      if (targetElement) {
        const headerOffset = 80 // Height of fixed navbar
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }

    // Adicionar event listener
    document.addEventListener('click', handleClick)
    
    // Limpar event listener
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    // Smooth scroll para links de navegação que apontam para âncoras na mesma página
    const handleNavigation = () => {
      const hash = window.location.hash
      if (hash) {
        const targetElement = document.querySelector(hash)
        if (targetElement) {
          setTimeout(() => {
            const headerOffset = 80
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }, 100)
        }
      }
    }

    // Executar quando a página carregar
    handleNavigation()
    
    // Executar quando o hash mudar
    window.addEventListener('hashchange', handleNavigation)
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation)
    }
  }, [])

  useEffect(() => {
    // Scroll suave para o topo quando navegar para novas páginas
    const handleRouteChange = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    // Observar mudanças na URL
    let currentPath = window.location.pathname
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname
        handleRouteChange()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Componente não renderiza nada visualmente
  return null
}
