import { Cloud, MapPin, Smartphone, Wifi } from 'lucide-react'

const FEATURES_LIST = [
  {
    icon: <Wifi className="h-5 w-5" />,
    title: 'Funciona com internet instável',
    description: 'Sincronização offline mantém os dados seguros mesmo sem conexão',
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: 'Para equipes distribuídas',
    description: 'Gestão centralizada com dados em tempo real de cada ponto de execução',
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: 'Design mobile',
    description: 'Aplicativo intuitivo que qualquer executor consegue usar',
  },
  {
    icon: <Cloud className="h-5 w-5" />,
    title: 'Diferentes níveis de acesso',
    description: 'Controle granular por perfil: executor, gerente, administrador',
  },
]

export const FieldReality: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-synfield-graphite md:text-3xl">
            Feito para a realidade do campo
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Funciona mesmo com internet instável, equipes distribuídas e diferentes níveis de acesso.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES_LIST.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-synfield-green">
                {feature.icon}
              </div>
              <h3 className="font-bold text-synfield-graphite">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
