import { STEPS } from '../utils/constants'

export const HowItWorks: React.FC = () => {
  return (
    <section id="como-funciona" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-synfield-graphite md:text-4xl">
            Como funciona
          </h2>
          <p className="text-gray-600">
            Um fluxo operacional simples para resultados profissionais.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-bold text-synfield-green group-hover:bg-gray-900 group-hover:text-white transition-colors">
                {step.number}
              </div>
              <h3 className="mb-3 text-lg font-bold text-synfield-graphite">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
