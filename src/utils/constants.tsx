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
    description: 'Elimine planilhas informais e padronize a coleta de dados em campo.',
  },
  {
    icon: <Camera className="h-6 w-6" />,
    title: 'Evidências por Foto',
    description: 'Comprovação visual imediata de cada ação realizada no ponto de venda.',
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: 'Registro de Localização',
    description: 'Validação por GPS para garantir que a equipe está onde deveria estar.',
  },
  {
    icon: <History className="h-6 w-6" />,
    title: 'Histórico e Auditoria',
    description: 'Acesse registros passados e audite execuções com poucos cliques.',
  },
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: 'Dashboards Operacionais',
    description: 'Visão clara da operação por loja, região ou promotor em tempo real.',
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: 'Exportação de Dados',
    description: 'Extraia informações para BI ou relatórios customizados de forma simples.',
  },
]

export const STEPS: StepCardProps[] = [
  {
    number: 1,
    title: 'Planejamento e Missões',
    description: 'Defina as tarefas e roteiros para sua equipe de campo de forma centralizada.',
  },
  {
    number: 2,
    title: 'Execução no PDV',
    description: 'O promotor recebe e executa as missões diretamente via aplicativo intuitivo.',
  },
  {
    number: 3,
    title: 'Coleta de Evidências',
    description: 'Fotos, formulários e localização são registrados durante a execução.',
  },
  {
    number: 4,
    title: 'Consolidação Automática',
    description: 'Os dados são enviados e processados instantaneamente para o portal.',
  },
  {
    number: 5,
    title: 'Auditoria e Insights',
    description: 'Acompanhe os resultados e tome decisões baseadas em dados reais.',
  },
]

export const CONTACT_EMAIL = 'contato@crivora.com.br'
export const WHATSAPP_LINK = 'https://wa.me/5500000000000' // Placeholder
