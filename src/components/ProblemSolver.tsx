import { AlertCircle, CheckCircle } from 'lucide-react'

const PROBLEMS = [
  'Falta de evidências concretas da execução em loja',
  'Dificuldade em padronizar o trabalho de equipes distribuídas',
  'Processos lentos para consolidação de relatórios de campo',
  'Visibilidade tardia de problemas como rupturas e erros de preço',
]

export const ProblemSolver: React.FC = () => {
  return (
    <section id="produto" className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold text-synfield-graphite md:text-4xl">
            O que o Synfield resolve?
          </h2>
          <p className="text-lg text-gray-600">
            Conectamos as dores reais da execução em campo com uma solução tecnológica
            robusta e direta.
          </p>
        </div>

        <div className="grid items-start gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-500">
              <AlertCircle size={18} /> O cenário comum
            </h3>
            {PROBLEMS.map((prob, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  {i + 1}
                </span>
                <p className="font-medium text-gray-700">{prob}</p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-synfield-green p-8 text-white md:p-12">
            <div className="absolute right-0 top-0 p-8 opacity-10">
              <CheckCircle size={120} />
            </div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-300">
              <CheckCircle size={18} /> Como o Synfield responde
            </h3>
            <p className="mb-8 text-xl font-medium leading-relaxed md:text-2xl">
              Transformamos a incerteza em dados auditáveis. Proporcionamos rastreabilidade
              total desde o planejamento da missão até a evidência fotográfica no ponto de
              venda.
            </p>
            <p className="opacity-90 leading-relaxed text-emerald-100">
              Sua operação deixa de ser um "buraco negro" de informações e passa a ser uma
              fonte de vantagem competitiva e controle estratégico.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
