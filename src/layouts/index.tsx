import { Outlet } from 'react-router-dom'
import { useMemo } from 'react'
import { PortalShell, type NavItem } from './PortalLayout'
import { getNav } from './roleNav'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'

/** Authenticated portal layout: builds nav per role. */
export function PortalLayout() {
  const { role, notifications, grievances, applications } = useApp()
  const { user } = useAuth()

  const nav: NavItem[] = useMemo(() => {
    const badges = {
      notifications: notifications.filter((n) => n.audience.includes(role) && !n.read).length,
      grievances: role === 'citizen'
        ? grievances.filter((g) => g.citizenId === user?.id && g.status !== 'resolved').length
        : grievances.length,
      applications: role === 'citizen'
        ? applications.filter((a) => a.citizenId === user?.id && ['submitted', 'under_review', 'action_required', 'processing'].includes(a.status)).length
        : applications.filter((a) => ['submitted', 'under_review', 'action_required', 'processing'].includes(a.status)).length,
      cases: applications.filter((a) => a.assignedOfficer?.includes(user?.name ?? '###')).length,
    }
    return getNav(role, badges)
  }, [role, notifications, grievances, applications, user])

  return <PortalShell nav={nav}>{<Outlet />}</PortalShell>
}
