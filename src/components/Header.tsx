import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { CONTACT_EMAIL, NAV_LINKS } from '../utils/constants'
import { Button } from './Button'
import { Logo } from './Logo'

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDemoClick = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Solicitação de Demonstração - Synfield`
  }

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled
? 'bg-white py-3 shadow-md'
: 'bg-transparent py-5'}`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        <a href="#" className="flex items-center gap-3 group">
          <Logo size={36} />
          <span className="text-xl font-bold tracking-tight text-synfield-graphite">
            Synfield
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-synfield-green"
            >
              {link.label}
            </a>
          ))}
          <Button variant="primary" className="px-5 py-2" onClick={handleDemoClick}>
            Falar com a Crivora
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="p-2 text-synfield-graphite md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen
            ? <X size={24} />
            : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-gray-100 bg-white p-6 shadow-xl md:hidden">
          <nav className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="primary"
              className="mt-2 w-full"
              onClick={handleDemoClick}
            >
              Solicitar Demonstração
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
