import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ClipboardList } from 'lucide-react'
import { Card, EmptyState, Tabs, StatusBadge, inputCls } from '@/components/ui/primitives'
import { useApp } from '@/context/AppContext'
import { useAuth } from '@/context/AuthContext'
import { departmentById } from '@/data/departments'

export default function OfficialApplications() {
  const { user } = useAuth()
  const { applications } = useApp()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')

  const queue = applications.filter((a) => a.departmentId === user?.departmentId || a.assignedOfficer === user?.name)
  const tabs = [
    { id: 'all', label: 'All', count: queue.length },
    { id: 'todo', label: 'To review', count: queue.filter((a) => ['submitted', 'under_review'].includes(a.status)).length },
    { id: 'action_required', label: 'Action needed', count: queue.filter((a) => a.status === 'action_required').length },
    { id: 'done', label: 'Closed', count: queue.filter((a) => ['approved', 'completed', 'rejected'].includes(a.status)).length },
  ]

  const filtered = queue.filter((a) => {
    if (tab === 'todo' && !['submitted', 'under_review'].includes(a.status)) return false
    if (tab === 'action_required' && a.status !== 'action_required') return false
    if (tab === 'done' && !['approved', 'completed', 'rejected'].includes(a.status)) return false
    if (q && !(a.id.toLowerCase().includes(q.toLowerCase()) || a.citizenName?.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Applications</h1>
        <p className="text-slate-500 mt-1.5">Cases routed to the Revenue desk. Vault-verified documents are pre-trusted.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID or citizen…" className={`${inputCls} pl-9`} aria-label="Search cases" />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-canvas">
              <tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-medium">Application</th>
                <th className="px-5 py-3 font-medium">Citizen</th>
                <th className="px-5 py-3 font-medium">Stage</th>
                <th className="px-5 py-3 font-medium">Expected</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-900">{a.serviceName}</div>
                    <div className="text-xs text-slate-400">{a.id} · {departmentById(a.departmentId)?.shortName}</div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600">{a.citizenName}<span className="block text-xs text-slate-400">{a.district}</span></td>
                  <td className="px-5 py-3.5 text-slate-600">{a.currentStage}</td>
                  <td className="px-5 py-3.5 text-slate-500">{a.expectedCompletion}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-5 py-3.5 text-right"><Link to={`/official/applications/${a.id}`} className="text-primary-700 font-medium hover:text-primary-900 whitespace-nowrap">Open →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<ClipboardList className="w-6 h-6" />} title="Queue is clear" body="New assignments will appear here." />}
      </Card>
    </div>
  )
}
