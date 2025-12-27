import { Activity, Lock, RefreshCw, ShieldCheck } from 'lucide-react'

const PRINCIPLES = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Rastreabilidade Total',
    text: 'Cada ação registrada possui data, hora e geolocalização.',
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: 'Controle de Acesso',
    text: 'Níveis de permissão rigorosos por perfil de usuário.',
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: 'Histórico Imutável',
    text: 'Registros preservados para auditorias e análise de evolução.',
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: 'Consistência de Dados',
    text: 'Sincronização inteligente para garantir integridade offline.',
  },
]

export const SecuritySection: React.FC = () => {
  return (
    <section id="seguranca" className="bg-synfield-graphite py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Segurança e Confiabilidade
            </h2>
            <p className="mb-10 text-lg leading-relaxed text-gray-300">
              Sabemos que os dados da sua operação são sensíveis. Por isso, o Synfield
              foi construído sob pilares de integridade e segurança institucional.
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              {PRINCIPLES.map((p, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    {p.icon}
                    <h4 className="font-bold text-white">{p.title}</h4>
                  </div>
                  <p className="text-sm text-gray-300">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h3 className="mb-4 text-xl font-bold">Foco em Integridade B2B</h3>
            <p className="max-w-sm text-sm text-gray-300">
              Processos estruturados para garantir que a informação que chega ao
              dashboard seja o reflexo fiel do que aconteceu no PDV.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
