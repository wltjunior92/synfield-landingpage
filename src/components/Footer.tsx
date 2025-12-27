import { CONTACT_EMAIL } from '../utils/constants'
import { LogoCrivora } from './LogoCrivora'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-100 bg-white pb-8 pt-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="mb-6 flex items-center gap-3">
              <LogoCrivora className="h-10" />
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Uma plataforma profissional de controle e rastreabilidade para execução em
              campo, desenvolvida pela Crivora.
            </p>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold text-synfield-graphite">Links Rápidos</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <a
                  href="#produto"
                  className="transition-colors hover:text-synfield-green"
                >
                  Produto
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="transition-colors hover:text-synfield-green"
                >
                  Como Funciona
                </a>
              </li>
              <li>
                <a
                  href="#para-quem"
                  className="transition-colors hover:text-synfield-green"
                >
                  Para quem é
                </a>
              </li>
              <li>
                <a
                  href="https://app.synfield.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-synfield-green"
                >
                  Entrar no App
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-sm font-bold text-synfield-graphite">Contato</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>{CONTACT_EMAIL}</li>
              <li>
                <a href="#" className="transition-colors hover:text-synfield-green">
                  Suporte Técnico
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-synfield-green">
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-synfield-green">
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gap-4 border-t border-gray-100 pt-8 flex flex-col items-center md:flex-row md:justify-between">
          <p className="text-xs font-medium text-gray-400">
            &copy; {currentYear} Synfield por Crivora. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <span>Brasil</span>
            <span className="my-auto h-1 w-1 rounded-full bg-gray-200" />
            <span>Feito com excelência</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
