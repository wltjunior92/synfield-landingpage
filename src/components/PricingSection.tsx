import axios from 'axios'
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Database,
  HardDrive,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { env } from '../env'

type BillingCycle = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

export interface PlanPriceDTO {
  priceId: string
  unitAmount: number | null
  currency: string
  interval: 'day' | 'week' | 'month' | 'year' | undefined
  intervalCount: number | undefined
}

export interface BillingPlanDTO {
  productId: string
  name: string
  description: string | null
  planTier: string
  prices: PlanPriceDTO[]
}

const TIER_METADATA: Record<
  string,
  { users: string; desc: string; popular?: boolean; badge?: string }
> = {
  STANDARD: {
    users: 'Franquia de até 15 usuários ativos',
    desc: 'Ideal para pequenas operações e equipes em estruturação.',
  },
  PRO: {
    users: 'Franquia de até 30 usuários ativos',
    desc: 'Para operações em expansão que exigem melhor custo por promotor.',
    popular: true,
    badge: 'Mais Escolhido',
  },
  MAX: {
    users: 'Franquia de até 60 usuários ativos',
    desc: 'Para grandes equipes de campo e operadoras de trade marketing.',
  },
}

const RETENTION_ADDONS = [
  {
    id: 'default',
    name: 'Padrão (Incluso)',
    photos: '3 dias',
    logs: '7 dias',
    price: 'Incluso',
    desc: 'Guarda padrão para auditorias recentes.',
  },
  {
    id: 'monthly',
    name: 'Histórico Mensal',
    photos: '30 dias',
    logs: '90 dias',
    price: '+R$ 99,00/mês',
    desc: 'Para fechamentos mensais e campanhas.',
  },
  {
    id: 'semiannual',
    name: 'Histórico Semestral',
    photos: '180 dias',
    logs: '180 dias',
    price: '+R$ 199,00/mês',
    desc: 'Análise evolutiva de gôndolas.',
  },
  {
    id: 'compliance',
    name: 'Compliance & Auditoria',
    photos: '365 dias',
    logs: '365 dias',
    price: '+R$ 349,00/mês',
    desc: 'Respaldo jurídico e auditoria técnica.',
  },
]

export const PricingSection: React.FC = () => {
  const [plans, setPlans] = useState<BillingPlanDTO[]>([])
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const [cycle, setCycle] = useState<BillingCycle>('annual')

  // Estado para controle do modal de identificação
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlanName, setSelectedPlanName] = useState<string>('')
  const [selectedPriceId, setSelectedPriceId] = useState<string>('')
  const [tenantName, setTenantName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  useEffect(() => {
    async function fetchPlans() {
      try {
        setIsLoadingPlans(true)
        const response = await axios.get<{ plans: BillingPlanDTO[] }>(
          `${env.VITE_APP_API_URL}/checkout/plans`,
        )
        setPlans(response.data.plans)
      } catch (err) {
        console.error('Erro ao buscar planos do Stripe:', err)
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchPlans()
  }, [])

  useEffect(() => {
    // Detecta se o Stripe redirecionou de volta com ?checkout=success
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('checkout') === 'success') {
      setIsSuccessModalOpen(true)

      // Limpa os parâmetros da URL sem recarregar a página
      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState({}, document.title, cleanUrl)
    }
  }, [])

  const formatCurrency = (amountInCents: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
      amountInCents / 100,
    )

  const getPriceForCycle = (
    prices: PlanPriceDTO[],
    cycle: BillingCycle,
  ): PlanPriceDTO | undefined => {
    return prices.find((p) => {
      if (cycle === 'monthly') {
        return p.interval === 'month' && (p.intervalCount === 1 || !p.intervalCount)
      }
      if (cycle === 'quarterly') {
        return p.interval === 'month' && p.intervalCount === 3
      }
      if (cycle === 'semiannual') {
        return p.interval === 'month' && p.intervalCount === 6
      }
      if (cycle === 'annual') {
        return p.interval === 'year' || (p.interval === 'month' && p.intervalCount === 12)
      }
      return false
    })
  }

  // Abre o modal de identificação ao escolher um plano
  const handleOpenCheckoutModal = (planName: string, priceId: string) => {
    setSelectedPlanName(planName)
    setSelectedPriceId(priceId)
    setIsModalOpen(true)
  }

  // Envia os dados para o endpoint createCheckoutSessionController
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tenantName.trim() || !customerEmail.trim()) {
      alert('Por favor, preencha o nome da empresa e o e-mail.')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await axios.post<{ checkoutUrl: string }>(
        `${env.VITE_APP_API_URL}/checkout/session`,
        {
          priceId: selectedPriceId,
          customerEmail,
          tenantName,
        },
      )

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl
      }
    } catch (err) {
      console.error('Erro ao criar sessão de checkout:', err)
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Ocorreu um erro ao conectar ao servidor.')
      }
      setIsSubmitting(false)
    }
  }

  const ALLOWED_TIERS = ['STANDARD', 'PRO', 'MAX']

  const basePlans = plans
    .filter((plan) => ALLOWED_TIERS.includes(plan.planTier?.toUpperCase()))
    .sort(
      (a, b) =>
        ALLOWED_TIERS.indexOf(a.planTier.toUpperCase()) -
        ALLOWED_TIERS.indexOf(b.planTier.toUpperCase()),
    )

  return (
    <section id="planos" className="bg-gray-50 py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-4 w-4" /> Precificação Transparente em Reais
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-synfield-graphite md:text-5xl">
            Planos escaláveis para a sua operação de campo
          </h2>
          <p className="text-lg text-gray-600">
            Sem surpresas em dólar ou orçamentos opacos. Franquias flexíveis de usuários com suporte completo a conformidade trabalhista.
          </p>

          {/* Billing Cycle Selector */}
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-1 rounded-2xl bg-gray-200/80 p-1.5 shadow-inner">
            <button
              onClick={() => setCycle('monthly')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                cycle === 'monthly' ? 'bg-white text-synfield-graphite shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setCycle('quarterly')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                cycle === 'quarterly' ? 'bg-white text-synfield-graphite shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trimestral <span className="text-emerald-600 font-bold">(-5%)</span>
            </button>
            <button
              onClick={() => setCycle('semiannual')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                cycle === 'semiannual' ? 'bg-white text-synfield-graphite shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semestral <span className="text-emerald-600 font-bold">(-10%)</span>
            </button>
            <button
              onClick={() => setCycle('annual')}
              className={`relative rounded-xl px-4 py-2 text-xs font-semibold transition-all md:text-sm ${
                cycle === 'annual' ? 'bg-synfield-green text-white shadow-md' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Anual <span className={`${cycle === 'annual' ? 'text-emerald-200' : 'text-emerald-600'} font-bold`}>(-15%)</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingPlans ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-synfield-green" />
            <p className="text-sm font-medium text-gray-500">Carregando planos disponíveis...</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {basePlans.map((plan) => {
              const tierKey = plan.planTier.toUpperCase()
              const meta = TIER_METADATA[tierKey] || {
                users: 'Franquia de usuários ativa',
                desc: plan.description || 'Solução completa para gestão em campo.',
              }

              const matchedPrice = getPriceForCycle(plan.prices, cycle)

              let monthlyEquivalent = matchedPrice?.unitAmount ?? 0
              if (matchedPrice?.interval === 'month' && matchedPrice.intervalCount) {
                monthlyEquivalent = Math.round((matchedPrice.unitAmount ?? 0) / matchedPrice.intervalCount)
              } else if (matchedPrice?.interval === 'year') {
                monthlyEquivalent = Math.round((matchedPrice.unitAmount ?? 0) / 12)
              }

              return (
                <div
                  key={plan.productId}
                  className={`relative flex flex-col justify-between rounded-3xl border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${
                    meta.popular ? 'border-2 border-synfield-green ring-4 ring-emerald-500/10' : 'border-gray-200'
                  }`}
                >
                  {meta.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-synfield-green px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                      {meta.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-synfield-graphite">{plan.name}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{meta.desc}</p>

                    <div className="my-6 border-b border-gray-100 pb-6">
                      {matchedPrice ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-synfield-graphite">
                              {formatCurrency(monthlyEquivalent)}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">/mês</span>
                          </div>

                          {cycle !== 'monthly' && (
                            <p className="mt-1 text-xs font-medium text-emerald-700">
                              Faturado {formatCurrency(matchedPrice.unitAmount ?? 0)} por ciclo
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm font-semibold text-gray-400">Opção indisponível neste ciclo</p>
                      )}
                    </div>

                    <ul className="space-y-4 text-sm text-gray-600">
                      <li className="flex items-center gap-3 font-semibold text-synfield-graphite">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-synfield-green">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        {meta.users}
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-synfield-green">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        Usuário excedente: <strong className="text-synfield-graphite">R$ 50,00/mês</strong>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-synfield-green">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        PWA Offline com compressão no navegador
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-synfield-green">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        Upload direto S3 (sem limite de tráfego)
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-synfield-green">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        Orientação jurídica CLT / BYOD
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8">
                    <button
                      disabled={!matchedPrice}
                      onClick={() =>
                        matchedPrice &&
                        handleOpenCheckoutModal(plan.name, matchedPrice.priceId)}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-center text-sm font-bold transition-all shadow-md disabled:opacity-50 ${
                        meta.popular
                          ? 'bg-synfield-green text-white hover:bg-emerald-900'
                          : 'bg-synfield-graphite text-white hover:bg-black'
                      }`}
                    >
                      Assinar Plano {plan.name} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add-ons Informational Block */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12 shadow-sm mb-16">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-synfield-green">
                <Database className="h-4 w-4" /> Módulo Adicional Operacional
              </div>
              <h3 className="mt-1 text-2xl font-bold text-synfield-graphite">
                Tiers de Retenção de Fotos e Logs (Contratação via Painel)
              </h3>
              <p className="text-sm text-gray-500">
                Personalize a retenção de dados e histórico de gôndola diretamente nas configurações da sua conta após a assinatura.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
              <HardDrive className="h-4 w-4" /> Armazenamento seguro AWS S3 + RDS
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RETENTION_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50/60 p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-synfield-graphite text-base">{addon.name}</span>
                    <span className="text-xs font-bold text-synfield-green bg-emerald-100 px-2 py-0.5 rounded-full">
                      {addon.price}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">{addon.desc}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200/60 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Retenção Fotos:</span>
                    <strong className="text-synfield-graphite">{addon.photos}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Retenção Logs:</span>
                    <strong className="text-synfield-graphite">{addon.logs}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proteção Trabalhista B2B */}
        <div className="rounded-3xl bg-synfield-graphite p-8 text-white md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <ShieldCheck size={240} />
          </div>
          <div className="relative z-10 grid items-center gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Proteção e Conformidade CLT
              </div>
              <h3 className="text-2xl font-bold md:text-3xl">
                Blindagem contra Passivos Trabalhistas em Dispositivos Móveis
              </h3>
              <p className="mt-3 leading-relaxed text-gray-300 text-sm md:text-base">
                Sua empresa ou clientes B2B utilizam celulares pessoais dos promotores? Orientamos a implementação segura de <strong>Modelos de Comodato com MDM</strong> ou <strong>Política BYOD com Ajuda de Custo Indenizatória</strong> (Art. 2º e Art. 458 da CLT), eliminando riscos de reembolso forçado ou caracterização de Salário-Utilidade.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end justify-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Incluso em todos os planos</p>
                <p className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Minutas de Comodato
                </p>
                <p className="text-sm font-semibold text-emerald-300 flex items-center gap-2 mt-1">
                  <Check className="h-4 w-4" /> Termo de Política BYOD
                </p>
                <p className="text-sm font-semibold text-emerald-300 flex items-center gap-2 mt-1">
                  <Check className="h-4 w-4" /> Checklist de Conformidade
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Identificação do Cliente / Empresa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Plano {selectedPlanName}
              </span>
              <h3 className="mt-3 text-2xl font-bold text-synfield-graphite">
                Identifique sua empresa
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Informe o nome da sua organização e o e-mail do responsável para prosseguir para o pagamento seguro.
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Nome da Empresa
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Trade Marketing Soluções Ltda"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm text-synfield-graphite focus:border-synfield-green focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  E-mail do Responsável
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="seu.nome@suaempresa.com.br"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm text-synfield-graphite focus:border-synfield-green focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-synfield-green py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Gerando Checkout...
                    </>
                  ) : (
                    <>
                      Ir para Pagamento Seguro <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal de Sucesso Pós-Pagamento */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-synfield-green">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h3 className="mb-2 text-2xl font-bold text-synfield-graphite">
              Assinatura Confirmada!
            </h3>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              Obrigado por escolher o <strong>Synfield</strong>. Enviamos um e-mail com as instruções para ativação da sua conta e acesso à plataforma.
            </p>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full rounded-xl bg-synfield-green py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
