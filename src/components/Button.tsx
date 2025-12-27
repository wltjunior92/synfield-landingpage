import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 md:text-base'

  const variants = {
    primary: 'bg-synfield-green text-white shadow-sm hover:bg-emerald-950',
    secondary: 'bg-synfield-graphite text-white hover:bg-black',
    outline: 'border border-synfield-green text-synfield-green hover:bg-emerald-50',
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
