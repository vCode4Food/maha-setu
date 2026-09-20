import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, Search } from 'lucide-react'
import { Card, EmptyState, Tabs, StatusBadge, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { departmentById } from '@/data/departments'

export default function CitizenApplications() {
  const { user } = useAuth()
  const { applications } = useApp()
  const uid = user?.id ?? ''
  const mine = applications.filter((a) => a.citizenId === uid)
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const tabs = [
    { id: 'all', label: 'All', count: mine.length },
    { id: 'active', label: 'Active', count: mine.filter((a) => ['submitted', 'under_review', 'processing'].includes(a.status)).length },
    { id: 'action_required', label: 'Action needed', count: mine.filter((a) => a.status === 'action_required').length },
    { id: 'completed', label: 'Completed', count: mine.filter((a) => ['approved', 'completed'].includes(a.status)).length },
  ]

  const filtered = mine.filter((a) => {
    if (tab === 'active' && !['submitted', 'under_review', 'processing'].includes(a.status)) return false
    if (tab === 'action_required' && a.status !== 'action_required') return false
    if (tab === 'completed' && !['approved', 'completed'].includes(a.status)) return false
    if (q && !(a.id.toLowerCase().includes(q.toLowerCase()) || a.serviceName.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-slate-500 mt-1.5">One tracking timeline for every department — no separate portals.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID or service…" className={`${inputCls} pl-9`} aria-label="Search applications" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => (
          <Link key={a.id} to={`/citizen/applications/${a.id}`} className="block group">
            <Card className="p-5 group-hover:border-primary-300 group-hover:bg-primary-50/20 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-slate-900">{a.serviceName}</span>
                    <StatusBadge status={a.status} />
                    {a.priority === 'high' && <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 border border-rose-200 rounded-full px-2 py-0.5">Priority</span>}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{a.id} · {departmentById(a.departmentId)?.shortName} · Submitted {a.submittedAt}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Current stage</div>
                  <div className="text-sm font-medium text-slate-700">{a.currentStage}</div>
                </div>
              </div>
              {a.actionRequired && (
                <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">⚠ {a.actionRequired}</div>
              )}
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <Card><EmptyState icon={<FileStack className="w-6 h-6" />} title="Nothing here yet" body="Applications you submit will appear with live timelines." action={<Link to="/citizen/services" className="text-primary-700 font-medium text-sm">Find a service →</Link>} /></Card>
        )}
      </div>
    </div>
  )
}
