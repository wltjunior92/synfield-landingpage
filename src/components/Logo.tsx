import React from 'react'

interface LogoProps {
  className?: string
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <img
      src="/src/assets/logo.png"
      alt="Synfield Logo"
      width={size}
      height={size}
      className={className}
    />
  )
}
