import { type ReactNode, useMemo } from 'react'
import { createContext, useContext } from 'react'
import { useApp } from './AppContext'
import type { Role } from '@/types'

interface NotifCtx {
  items: ReturnType<typeof useApp>['notifications']
  unreadFor: (role: Role) => number
  markRead: (id: string) => void
  markAll: () => void
}

const Ctx = createContext<NotifCtx | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const app = useApp()
  const value = useMemo<NotifCtx>(() => ({
    items: app.notifications,
    unreadFor: (r: Role) => app.notifications.filter((n) => n.audience.includes(r) && !n.read).length,
    markRead: app.markNotifRead,
    markAll: app.markAllRead,
  }), [app])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useNotifications() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
