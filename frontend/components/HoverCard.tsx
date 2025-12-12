'use client'

import { useState } from 'react'

interface HoverCardProps {
  children: React.ReactNode
  hoverScale?: number
  shadowSize?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function HoverCard({ 
  children, 
  hoverScale = 1.05,
  shadowSize = 'lg',
  className = '' 
}: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }

  const styles = {
    transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
    transition: 'transform 300ms ease-out, box-shadow 300ms ease-out',
  }

  return (
    <div
      style={styles}
      className={`${shadowClasses[shadowSize]} rounded-lg cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}
