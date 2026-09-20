import type { ReactNode } from 'react'
import {
  LayoutDashboard, Compass, Baby, FileStack, ShieldCheck, HandHeart, CreditCard, Bell,
  MessageSquareText, MapPin, CircleUser, Settings, ClipboardList, UserCheck, Building2,
  FileCheck, PieChart, FileSearch, Network, Activity, Database, ListChecks, Lock, Server,
  PackageCheck, Gavel, FileWarning, BookOpenCheck, Workflow as WorkflowIcon, Gauge, Users, Landmark,
} from 'lucide-react'
import type { NavItem } from './PortalLayout'

const I = {
  dashboard: LayoutDashboard, compass: Compass, life: Baby, apps: FileStack, docs: FileStack,
  shield: ShieldCheck, heart: HandHeart, card: CreditCard, bell: Bell, chat: MessageSquareText,
  pin: MapPin, user: CircleUser, settings: Settings, clipboard: ClipboardList, check: UserCheck,
  building: Building2, fileCheck: FileCheck, pie: PieChart, search: FileSearch, network: Network,
  activity: Activity, db: Database, list: ListChecks, lock: Lock, server: Server,
  package: PackageCheck, gavel: Gavel, warning: FileWarning, book: BookOpenCheck,
  workflow: WorkflowIcon, gauge: Gauge, users: Users, landmark: Landmark,
}

type IconName = keyof typeof I

function item(to: string, label: string, icon: IconName, badge?: number): NavItem {
  const Ic = I[icon]
  return { to, label, icon: <Ic className="w-4 h-4" />, badge }
}

export function getNav(role: string, badges: { notifications?: number; applications?: number; grievances?: number; cases?: number } = {}): NavItem[] {
  switch (role) {
    case 'citizen':
      return [
        item('/citizen', 'Dashboard', 'dashboard'),
        item('/citizen/services', 'Find Services', 'compass'),
        item('/citizen/life-events', 'Life Events', 'life'),
        item('/citizen/applications', 'Applications', 'apps', badges.applications),
        item('/citizen/documents', 'Documents', 'docs'),
        item('/citizen/schemes', 'Schemes', 'heart'),
        item('/citizen/grievances', 'Grievances', 'warning', badges.grievances),
        item('/citizen/payments', 'Payments', 'card'),
        item('/citizen/notifications', 'Notifications', 'bell', badges.notifications),
        item('/citizen/ai', 'MahaSetu Sahayak', 'chat'),
        item('/citizen/nearby', 'Nearby Services', 'pin'),
        item('/citizen/consent', 'Data Permissions', 'shield'),
        item('/citizen/profile', 'My Profile', 'user'),
        item('/citizen/settings', 'Settings', 'settings'),
      ]
    case 'official':
      return [
        item('/official', 'Dashboard', 'dashboard'),
        item('/official/applications', 'My Applications', 'clipboard', badges.cases),
        item('/official/grievances', 'Grievances', 'warning', badges.grievances),
        item('/official/documents', 'Documents', 'docs'),
        item('/official/interoperability', 'Interoperability', 'network'),
        item('/official/reports', 'Reports', 'pie'),
        item('/official/profile', 'Profile', 'user'),
      ]
    case 'business':
      return [
        item('/business', 'Dashboard', 'dashboard'),
        item('/business/services', 'Government Services', 'compass'),
        item('/business/applications', 'Applications', 'apps'),
        item('/business/licences', 'Licences', 'fileCheck'),
        item('/business/compliance', 'Compliance', 'gauge'),
        item('/business/schemes', 'Schemes & Incentives', 'heart'),
        item('/business/documents', 'Documents', 'docs'),
        item('/business/grievances', 'Grievances', 'warning'),
        item('/business/connect', 'Government Connect', 'landmark'),
        item('/business/notifications', 'Notifications', 'bell', badges.notifications),
        item('/business/profile', 'Business Profile', 'building'),
      ]
    case 'department_admin':
      return [
        item('/department-admin', 'Overview', 'dashboard'),
        item('/department-admin/services', 'Services', 'list'),
        item('/department-admin/applications', 'Applications', 'clipboard', badges.applications),
        item('/department-admin/workflows', 'Workflow Builder', 'workflow'),
        item('/department-admin/officials', 'Officials', 'users'),
        item('/department-admin/interoperability', 'Interoperability', 'network'),
        item('/department-admin/analytics', 'Analytics', 'pie'),
        item('/department-admin/grievances', 'Grievances', 'warning', badges.grievances),
        item('/department-admin/audit', 'Audit Logs', 'search'),
        item('/department-admin/settings', 'Settings', 'settings'),
      ]
    case 'super_admin':
      return [
        item('/admin', 'National Overview', 'dashboard'),
        item('/admin/departments', 'Departments', 'landmark'),
        item('/admin/services', 'Service Registry', 'list'),
        item('/admin/interoperability', 'Interoperability', 'network'),
        item('/admin/orchestration', 'Orchestration', 'workflow'),
        item('/admin/system-health', 'System Health', 'activity'),
        item('/admin/analytics', 'Analytics', 'pie'),
        item('/admin/grievances', 'Grievances', 'warning'),
        item('/admin/security', 'Security Center', 'lock'),
        item('/admin/audit', 'Audit Logs', 'search'),
        item('/admin/configuration', 'Configuration', 'settings'),
      ]
    default:
      return []
  }
}
