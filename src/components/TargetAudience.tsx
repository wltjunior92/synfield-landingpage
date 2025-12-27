import { Briefcase, Check, Factory } from 'lucide-react'

const AUDIENCE_DATA = [
  {
    type: 'industry',
    title: 'Indústrias e Marcas',
    icon: <Factory className="h-8 w-8" />,
    items: [
      'Visibilidade real da execução de campo',
      'Dashboards com insights estratégicos',
      'Monitoramento de ruptura e preços',
      'Histórico auditável para compliance',
    ],
  },
  {
    type: 'agency',
    title: 'Agências e Serviços',
    icon: <Briefcase className="h-8 w-8" />,
    items: [
      'Padronização do trabalho da equipe',
      'Acompanhamento em tempo real',
      'Evidências geolocalizadas',
      'Aumento da confiança do contratante',
    ],
  },
]

export const TargetAudience: React.FC = () => {
  return (
    <section id="para-quem" className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-synfield-graphite md:text-4xl">
            Para quem é
          </h2>
          <p className="mx-auto max-w-xl text-gray-600">
            Soluções pensadas para todos os elos da cadeia de execução.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {AUDIENCE_DATA.map((audience) => (
            <div
              key={audience.type}
              className="flex h-full flex-col gap-6 rounded-3xl border border-gray-100 bg-gray-50 p-8 md:p-12"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-synfield-green shadow-sm">
                {audience.icon}
              </div>
              <div>
                <h3 className="mb-6 text-2xl font-bold text-synfield-graphite">
                  {audience.title}
                </h3>
                <ul className="space-y-4">
                  {audience.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-synfield-green/10 text-synfield-green">
                        <Check size={12} />
                      </div>
                      <span className="leading-tight text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
