import { CheckCircle2, ChevronRight, Layout } from 'lucide-react'

import { CONTACT_EMAIL } from '../utils/constants'
import { Button } from './Button'

export const Hero: React.FC = () => {
  const handleDemoClick = () => {
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Solicitação de Demonstração - Synfield`
  }

  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-48">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-synfield-green">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Produto Crivora
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight text-synfield-graphite md:text-5xl lg:text-6xl">
              Controle e rastreabilidade da execução em campo.
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-gray-600 md:text-xl">
              Evidências padronizadas e dashboards em tempo real para indústrias e
              agências que buscam uma operação profissional.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="primary" onClick={handleDemoClick}>
                Solicitar demonstração
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('produto')?.scrollIntoView()}
              >
                Ver como funciona
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-10 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-synfield-green" />
                <span>Baseado em Dados</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-synfield-green" />
                <span>Mobile First</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-synfield-green" />
                <span>Pronto para B2B</span>
              </div>
            </div>
          </div>

          <div className="relative lg:block">
            {/* Abstract UI Visual Mock */}
            <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-2xl md:p-8">
              <div className="absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full bg-emerald-100 blur-3xl opacity-50" />
              <div className="flex flex-col gap-4">
                {/* Header mock */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="h-3 w-32 rounded bg-gray-200" />
                </div>

                <div className="mb-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="mb-2 h-2 w-8 rounded bg-gray-100" />
                    <div className="h-4 w-12 rounded bg-synfield-green/20" />
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="mb-2 h-2 w-8 rounded bg-gray-100" />
                    <div className="h-4 w-12 rounded bg-emerald-100" />
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="mb-2 h-2 w-8 rounded bg-gray-100" />
                    <div className="h-4 w-12 rounded bg-gray-100" />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-full bg-emerald-50">
                      <Layout className="h-5 w-5 text-synfield-green" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 h-3 w-24 rounded bg-gray-200" />
                      <div className="h-2 w-16 rounded bg-gray-100" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-32 rounded bg-gray-100" />
                      <div className="h-2 w-8 rounded bg-emerald-200" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-28 rounded bg-gray-100" />
                      <div className="h-2 w-6 rounded bg-emerald-100" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-40 rounded bg-gray-100" />
                      <div className="h-2 w-10 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
