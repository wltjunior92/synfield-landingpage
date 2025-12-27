import React from 'react'

export interface NavLink {
  label: string
  href: string
}

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export interface StepCardProps {
  number: number
  title: string
  description: string
}

export interface TargetAudienceProps {
  title: string
  items: string[]
  type: 'industry' | 'agency'
}
