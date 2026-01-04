import { LogoCrivora } from './LogoCrivora'

export const AboutCrivora: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center gap-12 rounded-3xl bg-gray-50 p-8 md:flex-row md:p-12">
          <div className="flex-1">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-synfield-green">
              Sobre a Crivora
            </h4>
            <h2 className="mb-6 text-2xl font-bold text-synfield-graphite md:text-3xl">
              A força por trás do Synfield
            </h2>
            <p className="mb-6 leading-relaxed text-gray-600">
              A Crivora desenvolve soluções focadas em operação real. O Synfield nasceu da necessidade prática de controlar, auditar e confiar na execução em campo.
            </p>
            <p className="leading-relaxed text-gray-600">
              Somos criadores e mantenedores do Synfield, garantindo evolução contínua e suporte técnico para operações que precisam de precisão e confiabilidade.
            </p>
          </div>
          <div className="flex w-full justify-center md:w-1/3">
            <LogoCrivora className="h-20" />
          </div>
        </div>
      </div>
    </section>
  )
}
