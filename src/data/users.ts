import type { Role, User } from '@/types'

export const demoUsers: Record<Role, User> = {
  citizen: {
    id: 'cit-001', name: 'Aarav Sharma', role: 'citizen', mahaId: 'MS-4471-2093-8815',
    aadhaarMasked: 'XXXX XXXX 4821', location: 'Pune, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop',
  },
  official: {
    id: 'off-014', name: 'Meera Deshpande', role: 'official',
    designation: 'Sub-Divisional Officer, Revenue', departmentId: 'revenue',
    location: 'Pune, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=96&h=96&fit=crop',
  },
  business: {
    id: 'biz-002', name: 'Kavita Patil', role: 'business', businessName: 'Sahyadri AgroTech Pvt. Ltd.',
    gstin: '27AABCS1429P1ZQ', location: 'Nashik, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop',
  },
  department_admin: {
    id: 'adm-rev', name: 'Rajesh Kulkarni', role: 'department_admin',
    designation: 'Deputy Collector (e-Governance)', departmentId: 'revenue',
    location: 'Mumbai, Maharashtra',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop',
  },
  super_admin: {
    id: 'su-001', name: 'Dr. Anand Iyer', role: 'super_admin',
    designation: 'Chief Platform Administrator', location: 'New Delhi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop',
  },
}

export const roleMeta: Record<Role, { label: string; blurb: string; home: string }> = {
  citizen: { label: 'Citizen', blurb: 'Services, documents & life events', home: '/citizen' },
  official: { label: 'Government Official', blurb: 'Case queue & approvals', home: '/official' },
  business: { label: 'Business', blurb: 'Licences & compliance', home: '/business' },
  department_admin: { label: 'Department Admin', blurb: 'Operations & workflows', home: '/department-admin' },
  super_admin: { label: 'MahaSetu Admin', blurb: 'State command centre', home: '/admin' },
}
