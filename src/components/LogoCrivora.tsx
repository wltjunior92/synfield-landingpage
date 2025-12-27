import React from 'react'

import logo from '../assets/logo-crivora.png'

interface LogoCrivoraProps {
  className?: string
}

export const LogoCrivora: React.FC<LogoCrivoraProps> = ({
  className = '',
}) => {
  return (
    <img
      src={logo}
      alt="Synfield by Crivora"
      className={className}
    />
  )
}
