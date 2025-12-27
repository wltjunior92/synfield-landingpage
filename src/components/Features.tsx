import { FEATURES } from '../utils/constants'

export const Features: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <h2 className="mb-4 text-3xl font-bold text-synfield-graphite md:text-4xl">
            Recursos Principais
          </h2>
          <p className="text-gray-600">
            Tudo o que você precisa para uma gestão eficiente em campo.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <div key={i} className="group flex gap-5 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-synfield-green shadow-sm transition-all group-hover:bg-synfield-green group-hover:text-white">
                {feature.icon}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-synfield-graphite">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
