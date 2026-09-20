import { useState } from 'react'
import { Search, ScrollText } from 'lucide-react'
import { Card, EmptyState, StatusBadge, inputCls, Tabs } from '@/components/ui/primitives'
import { RouteAuditTable } from '@/components/audit/RouteAuditTable'
import { initialAuditLogs } from '@/data/misc'

export default function AdminAudit() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('all')

  const filtered = initialAuditLogs.filter((l) => {
    if (tab === 'denied' && l.status !== 'denied' && l.status !== 'warning') return false
    if (q && !(l.action.toLowerCase().includes(q.toLowerCase()) || l.actor.toLowerCase().includes(q.toLowerCase()) || l.entity.toLowerCase().includes(q.toLowerCase()) || l.role.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Audit Logs</h1>
        <p className="text-slate-500 mt-1.5">Platform-wide, append-only audit trail. Every actor, action and entity is attributable.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={[{ id: 'all', label: 'All events', count: initialAuditLogs.length }, { id: 'denied', label: 'Denials & warnings' }]} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, action, entity, role…" className={`${inputCls} pl-9`} aria-label="Search audit logs" />
        </div>
      </div>

      <RouteAuditTable />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[780px]">
            <thead className="bg-canvas"><tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Time</th><th className="px-5 py-3 font-medium">Actor</th><th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Action</th><th className="px-5 py-3 font-medium">Entity</th><th className="px-5 py-3 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{l.time}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">{l.actor}</td>
                  <td className="px-5 py-3.5 text-slate-500">{l.role}</td>
                  <td className="px-5 py-3.5 text-slate-600">{l.action}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{l.entity}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<ScrollText className="w-6 h-6" />} title="No entries match" />}
      </Card>
    </div>
  )
}
