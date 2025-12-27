import React from 'react'

import logo from '../assets/logo.png'

interface LogoProps {
  className?: string
  size?: number
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <img
      src={logo}
      alt="Synfield Logo"
      width={size}
      height={size}
      className={className}
    />
  )
}
