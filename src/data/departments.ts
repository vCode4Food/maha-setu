import type { Department, HealthStatus } from '@/types'

export const departments: Department[] = [
  {
    id: 'revenue', name: 'Revenue & Land Records Department', shortName: 'Revenue',
    domain: 'Certificates · Land · Property', servicesCount: 34, status: 'connected',
    lastSync: '2 min ago', responseMs: 210, requests24h: 48210, dataExchanged: '18.2 GB', color: '#2b5799',
    description: 'Certificates, land records, property registration and revenue administration.',
  },
  {
    id: 'transport', name: 'Transport Department', shortName: 'Transport',
    domain: 'Licences · Vehicles', servicesCount: 22, status: 'healthy',
    lastSync: '1 min ago', responseMs: 180, requests24h: 39115, dataExchanged: '12.4 GB', color: '#1d4ed8',
    description: 'Driving licences, vehicle registration, permits and road transport services.',
  },
  {
    id: 'health', name: 'Health & Family Welfare Department', shortName: 'Health',
    domain: 'Hospitals · Public Health', servicesCount: 28, status: 'connected',
    lastSync: 'just now', responseMs: 160, requests24h: 52310, dataExchanged: '21.7 GB', color: '#0e7490',
    description: 'Public health services, hospital administration and family welfare programmes.',
  },
  {
    id: 'education', name: 'Education Department', shortName: 'Education',
    domain: 'Schools · Scholarships', servicesCount: 26, status: 'connected',
    lastSync: '3 min ago', responseMs: 240, requests24h: 44012, dataExchanged: '15.1 GB', color: '#7c3aed',
    description: 'School education, higher education, scholarships and examinations.',
  },
  {
    id: 'agriculture', name: 'Agriculture Department', shortName: 'Agriculture',
    domain: 'Farmers · Soil · Subsidies', servicesCount: 19, status: 'syncing',
    lastSync: '8 min ago', responseMs: 320, requests24h: 27480, dataExchanged: '9.8 GB', color: '#15803d',
    description: 'Farmer services, subsidies, soil health and agricultural marketing.',
  },
  {
    id: 'municipal', name: 'Municipal Administration', shortName: 'Municipal',
    domain: 'Urban · Trade Licences', servicesCount: 24, status: 'healthy',
    lastSync: '4 min ago', responseMs: 260, requests24h: 31990, dataExchanged: '11.2 GB', color: '#b45309',
    description: 'Urban local bodies, trade licences, property tax and civic services.',
  },
  {
    id: 'labour', name: 'Labour & Employment Department', shortName: 'Labour',
    domain: 'Shops · Employment', servicesCount: 16, status: 'healthy',
    lastSync: '5 min ago', responseMs: 290, requests24h: 18320, dataExchanged: '6.3 GB', color: '#9333ea',
    description: 'Labour welfare, shop and establishment registrations and employment exchanges.',
  },
  {
    id: 'social', name: 'Social Welfare Department', shortName: 'Social Welfare',
    domain: 'Pensions · Equity', servicesCount: 18, status: 'connected',
    lastSync: '6 min ago', responseMs: 310, requests24h: 22760, dataExchanged: '7.9 GB', color: '#be123c',
    description: 'Pensions, scholarships for weaker sections and social equity programmes.',
  },
  {
    id: 'finance', name: 'Finance & Taxation Department', shortName: 'Finance',
    domain: 'Tax · Exchequer', servicesCount: 14, status: 'healthy',
    lastSync: '2 min ago', responseMs: 190, requests24h: 25810, dataExchanged: '8.6 GB', color: '#1f3a63',
    description: 'Taxation, state excise and financial administration.',
  },
  {
    id: 'police', name: 'Police & Home Department', shortName: 'Police',
    domain: 'Certificates · Clearances', servicesCount: 12, status: 'connected',
    lastSync: '7 min ago', responseMs: 350, requests24h: 16440, dataExchanged: '5.1 GB', color: '#374151',
    description: 'Police clearances, character certificates and public safety services.',
  },
  {
    id: 'housing', name: 'Housing & Urban Development', shortName: 'Housing',
    domain: 'Housing Schemes', servicesCount: 11, status: 'warning',
    lastSync: '19 min ago', responseMs: 640, requests24h: 9880, dataExchanged: '3.2 GB', color: '#c2410c',
    description: 'Affordable housing, urban development and slum rehabilitation.',
  },
  {
    id: 'business', name: 'Business Services (MahaEase)', shortName: 'Business Services',
    domain: 'Registration · Compliance', servicesCount: 21, status: 'healthy',
    lastSync: '1 min ago', responseMs: 200, requests24h: 21350, dataExchanged: '7.4 GB', color: '#0f766e',
    description: 'Single-window business registration, licences and compliance.',
  },
]

export const departmentById = (id: string): Department | undefined =>
  departments.find((d) => d.id === id)

export const deptShort = (id: string): string => departmentById(id)?.shortName ?? id

export const healthTone: Record<HealthStatus, { dot: string; text: string; bg: string }> = {
  connected: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  healthy: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  syncing: { dot: 'bg-sky-500', text: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  warning: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  offline: { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
}
