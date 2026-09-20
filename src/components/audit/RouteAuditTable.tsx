import { useEffect, useState } from 'react'
import { Route, ScrollText, Trash2 } from 'lucide-react'
import { Card, EmptyState, StatusBadge } from '@/components/ui/primitives'
import { getRouteEvents, clearRouteEvents } from '@/features/audit/routeAudit'
import type { AuditLogEntry } from '@/types'

function fmt(at: number): string {
  return new Date(at).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })
}

/**
 * Live route-anomaly table — 404 hits and RBAC denials captured client-side.
 * Session-scoped by design: mirrors how a session-scoped server tail behaves in
 * the real platform and avoids persisting browsing data across sessions.
 */
export function RouteAuditTable() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [version, setVersion] = useState(0)

  // Re-read on focus so a quick check in another tab reflects immediately.
  useEffect(() => {
    const refresh = () => setEntries(getRouteEvents())
    refresh()
    window.addEventListener('focus', refresh)
    window.addEventListener('mahasetu:route-audit', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('mahasetu:route-audit', refresh)
    }
  }, [version])

  const counts = {
    notFound: entries.filter((e) => e.kind === '404').length,
    denied: entries.filter((e) => e.kind === 'route_denied').length,
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100 bg-canvas/60">
        <div className="flex items-center gap-2 min-w-0">
          <Route className="w-4 h-4 text-primary-700 shrink-0" />
          <span className="text-sm font-semibold text-slate-800 truncate">Route anomalies — live (this session)</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-medium">{counts.notFound} × 404</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-medium">{counts.denied} × denied</span>
          </span>
        </div>
        <button
          onClick={() => { clearRouteEvents(); setVersion((v) => v + 1) }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors shrink-0"
          title="Clear this session's route audit entries"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear session log
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-canvas">
            <tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Path</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50/70">
                <td className="px-5 py-3 text-slate-500 whitespace-nowrap">{fmt(e.at)}</td>
                <td className="px-5 py-3 text-slate-700">{e.kind === '404' ? 'Page not found' : 'Access denied'}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-600 break-all">{e.path}</td>
                <td className="px-5 py-3 text-slate-500">{e.role ? e.role.replaceAll('_', ' ') : '—'}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{e.userId ?? 'anonymous'}</td>
                <td className="px-5 py-3"><StatusBadge status={e.kind === '404' ? 'not_found' : 'route_denied'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entries.length === 0 && (
        <EmptyState
          icon={<ScrollText className="w-6 h-6" />}
          title="No route anomalies captured this session"
          body="Unknown URLs and unauthorized portal attempts will appear here. Try visiting a bogus path to see it recorded."
        />
      )}
    </Card>
  )
}
