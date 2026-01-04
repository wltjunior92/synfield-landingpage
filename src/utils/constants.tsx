import {
  Camera,
  ClipboardCheck,
  Database,
  History,
  LayoutDashboard,
  MapPin,
} from 'lucide-react'

import { FeatureCardProps, NavLink, StepCardProps } from '../types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Produto', href: '#produto' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Para quem é', href: '#para-quem' },
  { label: 'Segurança', href: '#seguranca' },
  { label: 'Contato', href: '#contato' },
]

export const FEATURES: FeatureCardProps[] = [
  {
    icon: <ClipboardCheck className="h-6 w-6" />,
    title: 'Relatórios Padronizados',
    description: 'Elimina improvisos e garante que todos coletam dados no mesmo padrão.',
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: 'Evidências por Foto',
    description: 'Comprovação visual e imediata de cada ação realizada no ponto de venda.',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Registro de Localização',
    description: 'Validação por GPS para confirmar que a equipe estava onde deveria estar.',
  },
  {
    icon: <History className="h-6 w-6" />,
    title: 'Histórico e Auditoria',
    description: 'Consulte registros passados e audite execuções com confiança e rastreabilidade.',
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: 'Dashboards Operacionais',
    description: 'Visualize problemas e oportunidades em tempo real por loja, região ou executor.',
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: 'Exportação de Dados',
    description: 'Use os dados em apresentações, auditorias e relatórios customizados.',
  },
]

export const STEPS: StepCardProps[] = [
  {
    number: 1,
    title: 'Planejamento de Tarefas',
    description: 'Defina as tarefas e roteiros para sua equipe de forma centralizada.',
  },
  {
    number: 2,
    title: 'Execução em Campo',
    description: 'O executor recebe a missão no celular e realiza a tarefa com facilidade.',
  },
  {
    number: 3,
    title: 'Registro de Evidências',
    description: 'Fotos, dados e localização são capturados durante a execução.',
  },
  {
    number: 4,
    title: 'Envio Automático',
    description: 'As informações são enviadas automaticamente para o sistema.',
  },
  {
    number: 5,
    title: 'Acompanhamento e Auditoria',
    description: 'Veja os resultados em tempo real e audite tudo com segurança.',
  },
]

export const CONTACT_EMAIL = 'contato@crivora.com.br'
export const WHATSAPP_LINK = 'https://wa.me/5500000000000' // Placeholder
