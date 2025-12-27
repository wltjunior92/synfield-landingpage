import { Send } from 'lucide-react'

import { CONTACT_EMAIL } from '../utils/constants'
import { Button } from './Button'

export const ContactCTA: React.FC = () => {
  const handleContact = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Contato Comercial - Synfield`
  }

  return (
    <section id="contato" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-synfield-green p-8 text-center text-white shadow-2xl md:p-20">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-800/40 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              Pronto para profissionalizar sua operação de campo?
            </h2>
            <p className="mb-10 text-lg leading-relaxed md:text-xl text-white">
              Entre em contato conosco hoje mesmo para uma demonstração personalizada e
              veja como o Synfield pode transformar seus resultados.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                variant="secondary"
                className="border-none bg-white px-10 py-5 font-bold shadow-xl hover:bg-gray-100 text-white hover:text-gray-900"
                onClick={handleContact}
              >
                <Send className="mr-2 h-5 w-5" />
                Falar conosco
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
