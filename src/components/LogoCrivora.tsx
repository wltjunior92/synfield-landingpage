import React from 'react'

interface LogoCrivoraProps {
  className?: string
}

export const LogoCrivora: React.FC<LogoCrivoraProps> = ({
  className = '',
}) => {
  return (
    <img
      src="/src/assets/logo-crivora.png"
      alt="Synfield by Crivora"
      className={className}
    />
  )
}
