import { useState } from 'react'
import { Bell, CheckCheck, Search } from 'lucide-react'
import { Card, EmptyState, Tabs, inputCls } from '@/components/ui/primitives'
import { GistCard } from '@/components/ui/widgets'
import { useApp } from '@/context/AppContext'
import { useNotifications } from '@/context/NotificationContext'
import type { NotifType } from '@/types'

const TYPE_TABS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'application', label: 'Applications' }, { id: 'document', label: 'Documents' },
  { id: 'scheme', label: 'Schemes' }, { id: 'grievance', label: 'Grievances' }, { id: 'security', label: 'Security' },
  { id: 'payment', label: 'Payments' },
]

export default function CitizenNotifications() {
  const { items, markRead, markAll } = useNotifications()
  const { role } = useApp()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const mine = items.filter((n) => n.audience.includes(role))
  const filtered = mine.filter((n) => {
    if (tab !== 'all' && n.type !== (tab as NotifType)) return false
    if (q && !n.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 mt-1.5">Every update across applications, documents, schemes and consents.</p>
        </div>
        <button onClick={markAll} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium px-4 py-2.5 text-sm hover:bg-slate-50">
          <CheckCheck className="w-4 h-4" /> Mark all read
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={TYPE_TABS} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notifications…" className={`${inputCls} pl-9`} aria-label="Search notifications" />
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.map((n) => (
          <Card key={n.id} className={`p-4 flex gap-3.5 ${!n.read ? 'border-primary-200 bg-primary-50/30' : ''}`}>
            <span className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0"><Bell className="w-4 h-4" /></span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-slate-900 text-sm">{n.title}</span>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
              {n.type === 'document' && (
                <div className="mt-2.5">
                  <GistCard
                    compact
                    title={n.body}
                    data={{ who: 'You (vault owner)', get: 'Clear next step for the flagged document', need: 'Re-upload with a readable scan', apply: 'Documents → Re-upload, or open the application', deadline: 'Before verification resumes', department: 'MahaSetu Vault' }}
                  />
                </div>
              )}
            </div>
            {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-primary-700 font-medium self-center whitespace-nowrap">Mark read</button>}
          </Card>
        ))}
        {filtered.length === 0 && <Card><EmptyState icon={<Bell className="w-6 h-6" />} title="You're all caught up" /></Card>}
      </div>
    </div>
  )
}
