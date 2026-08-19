import axios from 'axios'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Database,
  FileText,
  HardDrive,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
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
    logs: '30 dias',
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false)

  // Estados de Validação de CNPJ / Federação / Erros
  const [documentError, setDocumentError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [linkedPartnerInfo, setLinkedPartnerInfo] = useState<{
    id: string
    name: string
    type: 'AGENCY' | 'INDUSTRY'
  } | null>(null)

  // Controle das Etapas (1: Empresa, 2: Endereço, 3: Responsável)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    tenantName: '',
    tenantType: 'AGENCY' as 'AGENCY' | 'INDUSTRY',
    document: '',
    phone: '',
    billingEmail: '',
    addressZipCode: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
  })

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
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('checkout') === 'success') {
      setIsSuccessModalOpen(true)

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    if (name === 'document') {
      setDocumentError(null)
    }
    if (name === 'ownerEmail') {
      setEmailError(null)
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Auto-complete BrasilAPI + Validação de CNPJ/Ponte de Federação no Backend
  const handleDocumentBlur = async () => {
    const cleanDoc = formData.document.replace(/\D/g, '')
    setDocumentError(null)

    if (cleanDoc.length === 11 || cleanDoc.length === 14) {
      try {
        setIsLoadingCnpj(true)

        // 1. Consulta BrasilAPI se for CNPJ (14 dígitos)
        if (cleanDoc.length === 14) {
          try {
            const brasilApiRes = await axios.get(
              `https://brasilapi.com.br/api/cnpj/v1/${cleanDoc}`,
            )
            const data = brasilApiRes.data
            if (data) {
              setFormData((prev) => ({
                ...prev,
                tenantName: data.nome_fantasia || data.razao_social || prev.tenantName,
                phone: data.ddd_telefone_1 ? data.ddd_telefone_1.replace(/\D/g, '') : prev.phone,
                addressZipCode: data.cep ? data.cep.replace(/\D/g, '') : prev.addressZipCode,
                addressStreet: data.logradouro || prev.addressStreet,
                addressNumber: data.numero || prev.addressNumber,
                addressComplement: data.complemento || prev.addressComplement,
                addressNeighborhood: data.bairro || prev.addressNeighborhood,
                addressCity: data.municipio || prev.addressCity,
                addressState: data.uf || prev.addressState,
              }))
            }
          } catch (e) {
            console.error('Erro na consulta BrasilAPI:', e)
          }
        }

        // 2. Consulta de Verificação de Documento no Backend Synfield
        const checkRes = await axios.post<{
          existsAsPartner: boolean
          partner?: { id: string; name: string; type: 'AGENCY' | 'INDUSTRY' }
        }>(`${env.VITE_APP_API_URL}/checkout/check-document`, {
          document: cleanDoc,
        })

        if (checkRes.data.existsAsPartner && checkRes.data.partner) {
          setLinkedPartnerInfo(checkRes.data.partner)
          setFormData((prev) => ({
            ...prev,
            tenantName: checkRes.data.partner?.name || prev.tenantName,
          }))
        } else {
          setLinkedPartnerInfo(null)
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 409) {
          setDocumentError('Já existe uma conta ativa cadastrada com este CNPJ/CPF no Synfield.')
        }
      } finally {
        setIsLoadingCnpj(false)
      }
    }
  }

  // Auto-complete ViaCEP
  const handleZipCodeBlur = async () => {
    const cleanCep = formData.addressZipCode.replace(/\D/g, '')
    if (cleanCep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cleanCep}/json/`,
        )
        if (!response.data.erro) {
          setFormData((prev) => ({
            ...prev,
            addressStreet: response.data.logradouro || prev.addressStreet,
            addressNeighborhood: response.data.bairro || prev.addressNeighborhood,
            addressCity: response.data.localidade || prev.addressCity,
            addressState: response.data.uf || prev.addressState,
          }))
        }
      } catch (err) {
        console.error('Erro ao buscar CEP:', err)
      }
    }
  }

  // Abre o modal de identificação ao escolher um plano
  const handleOpenCheckoutModal = (planName: string, priceId: string) => {
    setSelectedPlanName(planName)
    setSelectedPriceId(priceId)
    setIsModalOpen(true)
  }

  // Validação simples para avançar cada passo
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep === 1) {
      if (documentError) {
        alert('Por favor, corrija o documento informado antes de prosseguir.')
        return
      }
      if (!formData.document.trim() || !formData.tenantName.trim() || !formData.phone.trim()) {
        alert('Por favor, preencha o CNPJ/CPF, o Nome da Empresa e o Telefone.')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (
        !formData.addressZipCode.trim() ||
        !formData.addressStreet.trim() ||
        !formData.addressNumber.trim() ||
        !formData.addressNeighborhood.trim() ||
        !formData.addressCity.trim() ||
        !formData.addressState.trim()
      ) {
        alert('Por favor, preencha todos os campos obrigatórios do endereço.')
        return
      }
      setCurrentStep(3)
    }
  }

  // Disparo Final para o Backend
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.ownerName.trim() || !formData.ownerEmail.trim()) {
      alert('Por favor, preencha o Nome e E-mail do Responsável.')
      return
    }

    try {
      setIsSubmitting(true)

      const payload = {
        priceId: selectedPriceId,
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        tenantName: formData.tenantName,
        tenantType: formData.tenantType,
        document: formData.document.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        billingEmail: formData.billingEmail.trim() || undefined,
        addressZipCode: formData.addressZipCode.replace(/\D/g, ''),
        addressStreet: formData.addressStreet,
        addressNumber: formData.addressNumber,
        addressComplement: formData.addressComplement.trim() || undefined,
        addressNeighborhood: formData.addressNeighborhood,
        addressCity: formData.addressCity,
        addressState: formData.addressState.toUpperCase(),
        linkedPartnerId: linkedPartnerInfo?.id,
        linkedPartnerType: linkedPartnerInfo?.type,
      }

      const response = await axios.post<{ checkoutUrl: string }>(
        `${env.VITE_APP_API_URL}/checkout/session`,
        payload,
      )

      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl
      }
    } catch (err) {
      console.error('Erro ao criar sessão de checkout:', err)
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setEmailError(
          'Este e-mail já está cadastrado no Synfield. Se você já possui uma conta ativa, acesse o painel administrativo da sua organização para contratar um novo plano. Caso queira realizar uma nova contratação como um novo usuário, utilize outro e-mail.',
        )
      } else {
        alert(
          axios.isAxiosError(err)
            ? err.response?.data?.message
            : 'Ocorreu um erro ao validar os dados.',
        )
      }
    } finally {
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

      {/* MODAL RESPONSIVO MULTI-STEP COM SCROLL INTERNO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-8 shadow-2xl overflow-hidden">

            {/* Botão Fechar Fixo */}
            <button
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Cabeçalho Fixo do Modal */}
            <div className="mb-4 pr-6 flex-shrink-0">
              <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
                Assinando Plano {selectedPlanName}
              </span>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold text-synfield-graphite">
                Configuração da Conta
              </h3>
            </div>

            {/* STEPPER COMPACTO E RESPONSIVO */}
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep === 1
                      ? 'bg-synfield-green text-white ring-2 ring-emerald-500/20'
                      : currentStep > 1
                      ? 'bg-emerald-100 text-synfield-green'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                </div>
                <span
                  className={`text-xs font-bold ${
                    currentStep === 1 ? 'text-synfield-graphite' : 'text-gray-400'
                  }`}
                >
                  Empresa
                </span>
              </div>

              <div className="h-0.5 flex-1 bg-gray-200 mx-2" />

              <div className="flex items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep === 2
                      ? 'bg-synfield-green text-white ring-2 ring-emerald-500/20'
                      : currentStep > 2
                      ? 'bg-emerald-100 text-synfield-green'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle2 className="h-4 w-4" /> : '2'}
                </div>
                <span
                  className={`text-xs font-bold ${
                    currentStep === 2 ? 'text-synfield-graphite' : 'text-gray-400'
                  }`}
                >
                  Endereço
                </span>
              </div>

              <div className="h-0.5 flex-1 bg-gray-200 mx-2" />

              <div className="flex items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    currentStep === 3
                      ? 'bg-synfield-green text-white ring-2 ring-emerald-500/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs font-bold ${
                    currentStep === 3 ? 'text-synfield-graphite' : 'text-gray-400'
                  }`}
                >
                  Gestor
                </span>
              </div>
            </div>

            {/* ÁREA COM SCROLL INTERNO PARA OS FORMULÁRIOS */}
            <div className="flex-1 overflow-y-auto pr-1">

              {/* ETAPA 1: Empresa */}
              {currentStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-3.5">
                  <div className="mb-1">
                    <h4 className="text-sm font-bold text-synfield-graphite">
                      1. Dados da Empresa
                    </h4>
                    <p className="text-xs text-gray-500">
                      Informe o CNPJ para preenchimento automático.
                    </p>
                  </div>

                  {/* Banner Informativo de Ponte de Federação */}
                  {linkedPartnerInfo && (
                    <div className="rounded-xl bg-blue-50 p-3 border border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Empresa parceira identificada!</p>
                        <p className="mt-0.5 leading-relaxed">
                          Identificamos que <strong>{linkedPartnerInfo.name}</strong> já está cadastrada como parceira no Synfield. Ao prosseguir, sua conta será vinculada como dona oficial do cadastro desta empresa.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        CNPJ ou CPF <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="document"
                          required
                          placeholder="00.000.000/0000-00"
                          value={formData.document}
                          onChange={handleInputChange}
                          onBlur={handleDocumentBlur}
                          className={`w-full rounded-xl border py-2 pl-9 pr-8 text-sm focus:outline-none ${
                            documentError
                              ? 'border-red-500 focus:border-red-600'
                              : 'border-gray-300 focus:border-synfield-green'
                          }`}
                        />
                        {isLoadingCnpj && (
                          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-synfield-green" />
                        )}
                      </div>
                      {documentError && (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-red-600">
                          <AlertCircle className="h-3.5 w-3.5" /> {documentError}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nome da Empresa / Razão Social <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="tenantName"
                          required
                          placeholder="Razão Social ou Nome Fantasia"
                          value={formData.tenantName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-synfield-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tipo de Empresa <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          name="tenantType"
                          value={formData.tenantType}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-synfield-green focus:outline-none bg-white"
                        >
                          <option value="AGENCY">Agência</option>
                          <option value="INDUSTRY">Indústria</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Telefone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="phone"
                          required
                          placeholder="(61) 99999-9999"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-synfield-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        E-mail Financeiro
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="billingEmail"
                          placeholder="financeiro@empresa.com"
                          value={formData.billingEmail}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-synfield-green focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <button
                      type="submit"
                      disabled={!!documentError || isLoadingCnpj}
                      className="flex items-center gap-2 rounded-xl bg-synfield-green px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all disabled:opacity-50"
                    >
                      Avançar <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ETAPA 2: Endereço Fiscal (GRID OTIMIZADA PARA MOBILE) */}
              {currentStep === 2 && (
                <form onSubmit={handleNextStep} className="space-y-3.5">
                  <div className="mb-1">
                    <h4 className="text-sm font-bold text-synfield-graphite">
                      2. Endereço Fiscal
                    </h4>
                    <p className="text-xs text-gray-500">
                      Confira o endereço de faturamento da sua empresa.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                    {/* CEP + UF na mesma linha no mobile */}
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        CEP <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="text"
                          name="addressZipCode"
                          required
                          placeholder="70000-000"
                          value={formData.addressZipCode}
                          onChange={handleInputChange}
                          onBlur={handleZipCodeBlur}
                          className="w-full rounded-xl border border-gray-300 py-2 pl-8 pr-2 text-xs sm:text-sm focus:border-synfield-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        UF <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressState"
                        required
                        maxLength={2}
                        placeholder="DF"
                        value={formData.addressState}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 py-2 px-2.5 text-xs sm:text-sm font-bold uppercase focus:border-synfield-green focus:outline-none text-center"
                      />
                    </div>

                    {/* Rua em linha cheia */}
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Rua / Logradouro <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressStreet"
                        required
                        placeholder="Av. Paulista"
                        value={formData.addressStreet}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 py-2 px-3 text-xs sm:text-sm focus:border-synfield-green focus:outline-none"
                      />
                    </div>

                    {/* Número + Complemento em 2 colunas */}
                    <div className="col-span-1 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Número <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressNumber"
                        required
                        placeholder="1000"
                        value={formData.addressNumber}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 py-2 px-2.5 text-xs sm:text-sm focus:border-synfield-green focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="addressComplement"
                        placeholder="Sala 402"
                        value={formData.addressComplement}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 py-2 px-2.5 text-xs sm:text-sm focus:border-synfield-green focus:outline-none"
                      />
                    </div>

                    {/* Bairro + Cidade em 2 colunas no mobile */}
                    <div className="col-span-1 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Bairro <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressNeighborhood"
                        required
                        placeholder="Centro"
                        value={formData.addressNeighborhood}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 py-2 px-2.5 text-xs sm:text-sm focus:border-synfield-green focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Cidade <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="addressCity"
                        required
                        placeholder="Brasília"
                        value={formData.addressCity}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-300 py-2 px-2.5 text-xs sm:text-sm focus:border-synfield-green focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800"
                    >
                      <ArrowLeft className="h-4 w-4" /> Voltar
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-synfield-green px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all"
                    >
                      Avançar <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ETAPA 3: Responsável */}
              {currentStep === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-3.5">
                  <div className="mb-1">
                    <h4 className="text-sm font-bold text-synfield-graphite">
                      3. Responsável pela Conta
                    </h4>
                    <p className="text-xs text-gray-500">
                      Informe quem utilizará o acesso de gestor principal.
                    </p>
                  </div>

                  {/* Alerta Amigável para Erro de E-mail Cadastrado */}
                  {emailError && (
                    <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{emailError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nome do Gestor <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          name="ownerName"
                          required
                          placeholder="Seu nome completo"
                          value={formData.ownerName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-synfield-green focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        E-mail do Responsável <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="ownerEmail"
                          required
                          placeholder="seu.email@empresa.com"
                          value={formData.ownerEmail}
                          onChange={handleInputChange}
                          className={`w-full rounded-xl border py-2 pl-9 pr-3 text-sm focus:outline-none ${
                            emailError
                              ? 'border-amber-500 focus:border-amber-600'
                              : 'border-gray-300 focus:border-synfield-green'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resumo da Assinatura */}
                  <div className="rounded-xl bg-gray-50 p-3 border border-gray-200 text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Empresa:</span>
                      <strong className="text-synfield-graphite truncate max-w-[200px]">{formData.tenantName || '-'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Documento:</span>
                      <strong className="text-synfield-graphite">{formData.document || '-'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Localidade:</span>
                      <strong className="text-synfield-graphite">
                        {formData.addressCity ? `${formData.addressCity}/${formData.addressState}` : '-'}
                      </strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t flex justify-between items-center">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50"
                    >
                      <ArrowLeft className="h-4 w-4" /> Voltar
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 rounded-xl bg-synfield-green px-6 sm:px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-900 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Processando...
                        </>
                      ) : (
                        <>
                          Finalizar Pagamento <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
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
